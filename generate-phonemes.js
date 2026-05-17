#!/usr/bin/env node
// generate-phonemes.js
//
// Generates two sets of MP3 files using Google Cloud TTS (en-US-Wavenet-F):
//
//   public/audio/phonemes/<id>.mp3  — pure phoneme sound via SSML IPA tags
//   public/audio/words/<id>.mp3     — example word in natural voice
//   public/audio/success.mp3        — celebration chime
//
// The app plays:  [phoneme MP3]  →  600 ms pause  →  [word MP3]
// This gives the child a clear "mmmm" [pause] "map" experience.
//
// Usage:
//   GOOGLE_TTS_API_KEY=<your_key> node generate-phonemes.js
//
// Re-run any time to refresh files. Existing files are overwritten.

import { writeFile, mkdir } from "fs/promises";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));

const API_KEY = process.env.GOOGLE_TTS_API_KEY;
if (!API_KEY) {
  console.error("Error: GOOGLE_TTS_API_KEY environment variable is not set.");
  console.error("Usage: GOOGLE_TTS_API_KEY=your_key node generate-phonemes.js");
  process.exit(1);
}

// ── IPA phoneme map ───────────────────────────────────────────────────────────
// Each entry is the IPA symbol(s) passed to the SSML <phoneme> tag.
// Strategy:
//   Sustained sounds (nasals, liquids, fricatives): IPA + length mark ː
//   Stops & affricates (can't be held without a vowel): IPA + minimal schwa ə
//   Vowels: pure vowel IPA
//   Blends: IPA combination + schwa
const phonemeIPA = {
  // Short vowels — pure vowel IPA
  a:  "æ",          // cat
  e:  "ɛ",          // bed
  i:  "ɪ",          // bit
  o:  "ɑ",          // hot (American English /ɑ/)
  u:  "ʌ",          // cup

  // Nasals — sustained with length mark
  m:  "mː",
  n:  "nː",
  ng: "ŋː",

  // Liquids — sustained
  l:  "lː",
  r:  "ɹː",         // American English r

  // Fricatives — sustained
  f:  "fː",
  s:  "sː",
  v:  "vː",
  z:  "zː",
  h:  "hː",
  sh: "ʃː",
  th: "ðː",         // voiced th (this, that) — matches example word "this"
  ph: "fː",         // same sound as f

  // Stops — schwa suffix makes the burst audible
  b:  "bə",
  c:  "kə",
  d:  "də",
  g:  "gə",
  j:  "dʒə",
  k:  "kə",
  p:  "pə",
  t:  "tə",
  w:  "wə",
  y:  "jə",
  x:  "ksə",        // /ks/ sound as in fox
  qu: "kwə",
  ch: "tʃə",        // affricate — schwa needed
  wh: "wə",         // same as w in American English
  ck: "kə",         // same as k

  // Consonant blends — schwa to complete the cluster
  bl: "blə",
  cl: "klə",
  fl: "flə",
  pl: "plə",
  sl: "slə",
  br: "bɹə",
  cr: "kɹə",
  dr: "dɹə",
  fr: "fɹə",
  gr: "gɹə",
  pr: "pɹə",
  tr: "tɹə",

  // Vowel teams — long vowel IPA
  ai: "eɪ",
  ay: "eɪ",
  ea: "iː",
  ee: "iː",
  oa: "oʊ",
  ow: "oʊ",
};

// Example words from src/data/phonemes.ts (must stay in sync)
const phonemeWords = {
  m: "map",   s: "sun",  a: "ant",   t: "top",   p: "pet",
  i: "ink",   n: "net",  o: "ox",    b: "bat",   c: "cat",
  d: "dog",   e: "egg",  f: "fan",   g: "gap",   h: "hat",
  j: "jam",   k: "kit",  l: "leg",   r: "red",   u: "up",
  v: "van",   w: "wet",  x: "fox",   y: "yak",   z: "zip",
  qu: "queen",
  bl: "blue",  cl: "clap", fl: "flag", pl: "play", sl: "sled",
  br: "brag",  cr: "crab", dr: "drum", fr: "frog", gr: "grip",
  pr: "pram",  tr: "trip",
  sh: "ship",  ch: "chip", th: "this", wh: "when", ph: "phone",
  ck: "duck",  ng: "ring",
  ai: "rain",  ay: "day",  ea: "eat",  ee: "feet", oa: "boat",
  ow: "snow",
};

// ── Google TTS REST API ───────────────────────────────────────────────────────
async function synthesizeSSML(ssml, speakingRate = 0.72, pitch = 2.0) {
  return callTTS({ ssml }, speakingRate, pitch);
}

async function synthesizeText(text, speakingRate = 0.88, pitch = 1.5) {
  return callTTS({ text }, speakingRate, pitch);
}

async function callTTS(input, speakingRate, pitch) {
  const res = await fetch(
    `https://texttospeech.googleapis.com/v1/text:synthesize?key=${API_KEY}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        input,
        voice: { languageCode: "en-US", name: "en-US-Wavenet-F" },
        audioConfig: { audioEncoding: "MP3", speakingRate, pitch },
      }),
    }
  );

  if (!res.ok) {
    const body = await res.text();
    throw new Error(`HTTP ${res.status}: ${body}`);
  }

  const { audioContent } = await res.json();
  if (!audioContent) throw new Error("No audioContent in response");
  return Buffer.from(audioContent, "base64");
}

const delay = (ms) => new Promise((r) => setTimeout(r, ms));

// Use the example word as SSML display text, NOT the phoneme id.
// If Google TTS fails to apply the IPA and falls back to reading the display text,
// "phone" is a safe fallback for ph — but "pee-aitch" (from display="ph") is not.
function buildSSML(id, ipa) {
  const display = phonemeWords[id] ?? id;
  return `<speak><prosody rate="slow"><phoneme alphabet="ipa" ph="${ipa}">${display}</phoneme></prosody></speak>`;
}

// ── Main ─────────────────────────────────────────────────────────────────────
async function main() {
  const phonemesDir = join(__dirname, "public/audio/phonemes");
  const wordsDir    = join(__dirname, "public/audio/words");
  const audioDir    = join(__dirname, "public/audio");

  await mkdir(phonemesDir, { recursive: true });
  await mkdir(wordsDir,    { recursive: true });

  // --only=ph,ck,ng,wh,th  regenerates a specific subset
  const onlyArg = process.argv.find((a) => a.startsWith("--only="));
  const onlySet = onlyArg ? new Set(onlyArg.replace("--only=", "").split(",")) : null;

  const allIds = Object.keys(phonemeIPA);
  const ids    = onlySet ? allIds.filter((id) => onlySet.has(id)) : allIds;

  const total = ids.length * 2 + (onlySet ? 0 : 1); // success chime only on full run
  let done = 0;
  let failed = 0;

  if (onlySet) {
    console.log(`\nRegenerating ${ids.length} phoneme sound(s): ${ids.join(", ")}\n`);
  } else {
    console.log(`\nGenerating ${ids.length} phoneme sounds + ${ids.length} example words + success chime…\n`);
  }

  // ── Pass 1: phoneme sounds (SSML IPA) ──────────────────────────────────────
  console.log("── Pass 1: phoneme sounds (SSML IPA) ──");
  for (const id of ids) {
    const ipa  = phonemeIPA[id];
    const ssml = buildSSML(id, ipa);
    const num  = String(++done + failed).padStart(2);
    process.stdout.write(`  [${num}/${total}] ${id.padEnd(4)}  ph="${ipa.padEnd(5)}"  … `);
    try {
      const buf = await synthesizeSSML(ssml);
      await writeFile(join(phonemesDir, `${id}.mp3`), buf);
      console.log("✓");
    } catch (err) {
      console.log(`✗  ${err.message}`);
      failed++;
    }
    await delay(200);
  }

  // ── Pass 2: example words (natural voice — skipped on --only runs) ──────────
  if (!onlySet) {
  console.log("\n── Pass 2: example words (natural voice) ──");
  for (const id of ids) {
    const word = phonemeWords[id];
    if (!word) { console.log(`  skipping ${id} — no word defined`); continue; }
    const num = String(++done + failed).padStart(2);
    process.stdout.write(`  [${num}/${total}] ${id.padEnd(4)}  "${word.padEnd(6)}"  … `);
    try {
      const buf = await synthesizeText(word);
      await writeFile(join(wordsDir, `${id}.mp3`), buf);
      console.log("✓");
    } catch (err) {
      console.log(`✗  ${err.message}`);
      failed++;
    }
    await delay(200);
  }
  } // end if (!onlySet)

  // ── Success chime (full run only) ─────────────────────────────────────────
  if (onlySet) {
    console.log(`\n─────────────────────────────────────────`);
    console.log(`  Done — ${ids.length - failed} regenerated, ${failed} failed`);
    console.log(`  Phonemes → public/audio/phonemes/\n`);
    return;
  }
  console.log("\n── Success chime ──");
  process.stdout.write(`  "Amazing! You did it!"  … `);
  try {
    const buf = await synthesizeText("Amazing! You did it!", 0.9, 4.0);
    await writeFile(join(audioDir, "success.mp3"), buf);
    console.log("✓");
  } catch (err) {
    console.log(`✗  ${err.message}`);
    failed++;
  }

  console.log(`\n─────────────────────────────────────────`);
  console.log(`  Done — ${total - failed} generated, ${failed} failed`);
  if (failed > 0) console.log("  Re-run to retry failed files.");
  console.log(`  Phonemes → public/audio/phonemes/`);
  console.log(`  Words    → public/audio/words/\n`);
}

main().catch((err) => {
  console.error("\nFatal:", err.message);
  process.exit(1);
});
