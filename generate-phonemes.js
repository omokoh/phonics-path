#!/usr/bin/env node
// generate-phonemes.js
//
// Generates TTS MP3 files using Google Cloud TTS (en-US-Wavenet-F).
// Human-recorded Read Naturally files cover most phonemes — this script
// handles blends (bl, cl, fl, …) and regenerates success phrases.
//
//   public/audio/phonemes/<id>.mp3  — phoneme sound (TTS, for blends only)
//   public/audio/success/<n>.mp3    — celebration phrases
//
// Usage:
//   GOOGLE_TTS_API_KEY=<your_key> node generate-phonemes.js
//   GOOGLE_TTS_API_KEY=<your_key> node generate-phonemes.js --only=bl,cl,fl
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

// ── Phoneme sound text ────────────────────────────────────────────────────────
// Plain-text strings that Wavenet-F pronounces as the target phoneme sound.
//
// Why plain text instead of IPA SSML?
// IPA phoneme tags fail silently for stops and blends. When they fail,
// Google reads the SSML display text as letter names ("bee", "dee", "ell").
// Plain text like "buh" or "bluh" can NEVER be read as letter names —
// the TTS engine always pronounces them as the intended phoneme sound.
//
// Exceptions in phonemeSSML below:
//   ng       — no plain-text form; IPA nasal-velar
//   f, v, s, z — plain repeated chars read as letter names by Wavenet-F;
//               IPA length mark (ː) forces a sustained sound
const phonemeText = {
  // ── Short vowels ─────────────────────────────────────────────────────────
  a:  "aah",          // /æ/ — not "ayy" (long A), not "ah" (open A)
  e:  "eh",           // /ɛ/
  i:  "ih",           // /ɪ/
  o:  "aw",           // /ɒ/
  u:  "uh",           // /ʌ/

  // ── Nasals (sustained) ────────────────────────────────────────────────────
  m:  "mmm",
  n:  "nnn",
  // ng: IPA SSML (phonemeSSML below)

  // ── Liquids (sustained) ───────────────────────────────────────────────────
  // l → SSML prosody (phonemeSSML below) — "lll"/"llll" read as letter names
  r:  "rrr",

  // ── Fricatives ────────────────────────────────────────────────────────────
  // f, v, s, z → IPA SSML (phonemeSSML below) — plain chars mis-read as letter names
  h:  "huh",          // single breath burst; "hhh" was read as "aitch aitch aitch"
  sh: "shh",          // /ʃ/ — simpler than "shhhh", more reliably voiced
  ph: "fff",          // same sound as /f/ — kept as plain text (not a standalone letter)
  th_soft: "thuh",    // unvoiced /θ/ — as in "thin"
  th_hard: "thuh",    // voiced /ð/ — as in "this"
  wh: "wuh",          // /w/ — same as w

  // ── Stops & affricates (schwa suffix makes the burst audible) ────────────
  b:  "buh",
  c:  "kuh",
  d:  "duh",
  g:  "guh",
  j:  "juh",          // /dʒ/
  k:  "kuh",
  p:  "puh",
  t:  "tuh",
  w:  "wuh",
  y:  "yuh",          // /j/
  x:  "ks",           // /ks/ — TTS reads as two phonemes, not "ex"
  qu: "kwuh",         // /kw/
  ch: "chuh",         // /tʃ/ — "chuh" reads as the digraph + schwa
  ck: "kuh",          // same as k

  // ── Consonant blends (cluster + schwa) ───────────────────────────────────
  bl: "bluh",   cl: "cluh",   fl: "fluh",   pl: "pluh",   sl: "sluh",
  br: "bruh",   cr: "cruh",   dr: "druh",   fr: "fruh",   gr: "gruh",
  pr: "pruh",   tr: "truh",

  // ── Vowel teams (long vowel sounds) ──────────────────────────────────────
  ai: "ayy",    ay: "ayy",
  ea: "ee",     ee: "ee",
  oa: "oh",     ow: "oh",
};

// IPA SSML for phonemes where plain text is unreliable in Wavenet-F.
// Display text is a real word so if IPA fails the fallback is a word, not a letter name.
const phonemeSSML = {
  ng: `<speak><prosody rate="slow"><phoneme alphabet="ipa" ph="ŋ">ring</phoneme></prosody></speak>`,
  l:  `<speak><prosody rate="x-slow" pitch="+2st">la</prosody></speak>`,
  f:  `<speak><prosody rate="slow"><phoneme alphabet="ipa" ph="fː">fan</phoneme></prosody></speak>`,
  v:  `<speak><prosody rate="slow"><phoneme alphabet="ipa" ph="vː">van</phoneme></prosody></speak>`,
  s:  `<speak><prosody rate="slow"><phoneme alphabet="ipa" ph="sː">sun</phoneme></prosody></speak>`,
  z:  `<speak><prosody rate="slow"><phoneme alphabet="ipa" ph="zː">zip</phoneme></prosody></speak>`,
};

// All phoneme IDs in teaching order
const ALL_IDS = [
  "m","s","a","t","p","i","n","o","b","c",
  "d","e","f","g","h","j","k","l","r","u",
  "v","w","x","y","z","qu",
  "bl","cl","fl","pl","sl","br","cr","dr","fr","gr","pr","tr",
  "sh","ch","th_soft","th_hard","wh","ph","ck","ng",
  "ai","ay","ea","ee","oa","ow",
];

// ── Google TTS REST API ───────────────────────────────────────────────────────
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

// Phoneme sound: slow (0.72×), higher pitch (2.0) for child-friendly clarity
function synthesizePhoneme(id) {
  if (phonemeSSML[id]) {
    return callTTS({ ssml: phonemeSSML[id] }, 0.72, 2.0);
  }
  const text = phonemeText[id];
  if (!text) throw new Error(`No text mapping for phoneme: ${id}`);
  return callTTS({ text }, 0.72, 2.0);
}

const delay = (ms) => new Promise((r) => setTimeout(r, ms));

// ── Success celebration phrases ───────────────────────────────────────────────
// Saved to public/audio/success/success_N.mp3
// Child-friendly: high pitch (4.0), natural pace (1.0)
const successPhrases = [
  { file: "success_1.mp3",  text: "Amazing! You did it!"        },
  { file: "success_2.mp3",  text: "Fantastic! Keep going!"      },
  { file: "success_3.mp3",  text: "Yes! You got it!"            },
  { file: "success_4.mp3",  text: "Woohoo! Great job!"          },
  { file: "success_5.mp3",  text: "Super! You're a star!"       },
  { file: "success_6.mp3",  text: "Brilliant! Well done!"       },
  { file: "success_7.mp3",  text: "Awesome! You're so smart!"   },
  { file: "success_8.mp3",  text: "Perfect! You nailed it!"     },
  { file: "success_9.mp3",  text: "Incredible! Keep it up!"     },
  { file: "success_10.mp3", text: "Great work! You're amazing!" },
];

// ── Level 8 blending prompt ───────────────────────────────────────────────────
// Individual phoneme sounds come from existing public/audio/phonemes/ files.
// Only the prompt needs to be generated.
// Stored at public/audio/prompts/blending-prompt.mp3
const BLENDING_PROMPT = "What word do those sounds make?";

// ── Level 7 rhyme words ───────────────────────────────────────────────────────
// All unique words used in src/data/rhymes.ts (targets, rhymes, and distractors).
// Spoken clearly at child-friendly pitch for /audio/rhymes/{word}.mp3.
const RHYME_WORDS = [
  "bag","ball","bed","bee","big","bite","bone","book","bug","cake",
  "can","cap","cat","chip","chop","clap","cone","cook","cup","day",
  "deep","dog","fan","flag","flat","frog","hat","hill","hop","kite",
  "log","make","map","moon","mud","mug","net","nose","pen","pig",
  "play","rain","red","ring","rose","run","ship","shop","sing","sit",
  "sleep","sun","tall","top","train","tree","tune","wet",
];

// ── Main ─────────────────────────────────────────────────────────────────────
async function main() {
  const phonemesDir = join(__dirname, "public/audio/phonemes");
  const successDir  = join(__dirname, "public/audio/success");
  const rhymesDir   = join(__dirname, "public/audio/rhymes");

  await mkdir(phonemesDir, { recursive: true });
  await mkdir(successDir,  { recursive: true });
  await mkdir(rhymesDir,   { recursive: true });

  const isRhymes   = process.argv.includes("--rhymes");
  const isBlending = process.argv.includes("--blending");

  // --only=bl,cl,fl   regenerates a specific subset of phonemes
  const onlyArg = process.argv.find((a) => a.startsWith("--only="));
  const onlySet = onlyArg ? new Set(onlyArg.replace("--only=", "").split(",")) : null;
  const ids     = onlySet ? ALL_IDS.filter((id) => onlySet.has(id)) : ALL_IDS;

  const isPartial = !!onlySet;
  let ok = 0, fail = 0;

  if (isBlending) {
    // ── Pass 4: Level 8 prompt only ───────────────────────────────────────
    // Phoneme sounds reuse existing public/audio/phonemes/ files.
    const promptsDir = join(__dirname, "public/audio/prompts");
    await mkdir(promptsDir, { recursive: true });

    console.log(`\nGenerating blending prompt…\n`);
    console.log("── Pass 4: blending prompt ──");
    process.stdout.write(`  "What word do those sounds make?"  → `);
    try {
      const buf = await callTTS({ text: BLENDING_PROMPT }, 0.85, 2.0);
      await writeFile(join(promptsDir, "blending-prompt.mp3"), buf);
      console.log("✓");
      ok++;
    } catch (err) {
      console.log(`✗  ${err.message}`);
      fail++;
    }

    console.log(`\n──────────────────────────────`);
    console.log(`  ${ok} generated, ${fail} failed`);
    if (fail) console.log("  Re-run to retry failed files.");
    console.log(`  public/audio/prompts/blending-prompt.mp3\n`);
    return;
  }

  if (isRhymes) {
    // ── Pass 3: Level 7 rhyme word audio ───────────────────────────────────
    console.log(`\nGenerating ${RHYME_WORDS.length} rhyme word audio files…\n`);
    console.log("── Pass 3: rhyme words ──");
    for (const word of RHYME_WORDS) {
      process.stdout.write(`  ${word.padEnd(10)}  → `);
      try {
        const buf = await callTTS({ text: word }, 0.85, 2.0);
        await writeFile(join(rhymesDir, `${word}.mp3`), buf);
        console.log("✓");
        ok++;
      } catch (err) {
        console.log(`✗  ${err.message}`);
        fail++;
      }
      await delay(200);
    }
    console.log(`\n──────────────────────────────`);
    console.log(`  ${ok} generated, ${fail} failed`);
    if (fail) console.log("  Re-run to retry failed files.");
    console.log(`  public/audio/rhymes/\n`);
    return;
  }

  console.log(isPartial
    ? `\nRegenerating ${ids.length} phoneme(s): ${ids.join(", ")}\n`
    : `\nGenerating ${ids.length} phoneme sounds + success phrases…\n`
  );

  // ── Pass 1: phoneme sounds ────────────────────────────────────────────────
  console.log("── Pass 1: phoneme sounds ──");
  for (const id of ids) {
    const desc = phonemeSSML[id] ? `[IPA]   ` : `"${phonemeText[id]}"`;
    process.stdout.write(`  ${id.padEnd(8)}  ${desc.padEnd(10)}  → `);
    try {
      const buf = await synthesizePhoneme(id);
      await writeFile(join(phonemesDir, `${id}.mp3`), buf);
      console.log("✓");
      ok++;
    } catch (err) {
      console.log(`✗  ${err.message}`);
      fail++;
    }
    await delay(200);
  }

  if (isPartial) {
    console.log(`\n──────────────────────────────`);
    console.log(`  ${ok} regenerated, ${fail} failed\n`);
    return;
  }

  // ── Pass 2: success celebration phrases ──────────────────────────────────
  console.log("\n── Pass 2: success phrases ──");
  for (const phrase of successPhrases) {
    process.stdout.write(`  "${phrase.text.padEnd(30)}"  → `);
    try {
      const buf = await callTTS({ text: phrase.text }, 1.0, 4.0);
      await writeFile(join(successDir, phrase.file), buf);
      console.log("✓");
      ok++;
    } catch (err) {
      console.log(`✗  ${err.message}`);
      fail++;
    }
    await delay(200);
  }

  console.log(`\n──────────────────────────────`);
  console.log(`  ${ok} generated, ${fail} failed`);
  if (fail) console.log("  Re-run to retry failed files.");
  console.log(`  public/audio/phonemes/ + public/audio/success/\n`);
}

main().catch((err) => { console.error("\nFatal:", err.message); process.exit(1); });
