#!/usr/bin/env node
// generate-phonemes.js
//
// Generates MP3 audio files for every phoneme using Google Cloud TTS.
// The @google-cloud/text-to-speech package authenticates via service accounts;
// for API-key auth we call the REST endpoint directly using Node's native fetch.
//
// Usage:
//   GOOGLE_TTS_API_KEY=<your_key> node generate-phonemes.js
//
// Output:
//   public/audio/phonemes/<id>.mp3   — one file per phoneme
//   public/audio/success.mp3         — celebration chime
//
// After running, drop these files into git. The app will prefer MP3s over
// the Web Speech API fallback automatically (no code change needed).

import { writeFile, mkdir } from "fs/promises";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));

// ── Validate API key ────────────────────────────────────────────────────────
const API_KEY = process.env.GOOGLE_TTS_API_KEY;
if (!API_KEY) {
  console.error("Error: GOOGLE_TTS_API_KEY environment variable is not set.");
  console.error("Usage: GOOGLE_TTS_API_KEY=your_key node generate-phonemes.js");
  process.exit(1);
}

// ── Phoneme → TTS text map (mirrors src/hooks/useAudio.ts exactly) ──────────
const phonemeToText = {
  // Short vowels
  a: "aah",  e: "eh",   i: "ih",   o: "aww",  u: "uh",
  // Fricatives / nasals / liquids — elongated
  f: "fff",  l: "lll",  m: "mmm",  n: "nnn",  r: "rrr",
  s: "sss",  v: "vvv",  z: "zzz",  h: "huh",
  // Stops — minimal schwa
  b: "buh",  c: "kuh",  d: "duh",  g: "guh",  j: "juh",
  k: "kuh",  p: "puh",  t: "tuh",  w: "wuh",  y: "yuh",
  x: "ks",   qu: "kwuh",
  // Digraphs
  sh: "shh",  ch: "chuh",  th: "thuh",  wh: "wuh",
  ph: "fff",  ck: "kuh",   ng: "nng",
  // Consonant blends
  bl: "bluh", cl: "cluh", fl: "fluh", pl: "pluh", sl: "sluh",
  br: "bruh", cr: "cruh", dr: "druh", fr: "fruh", gr: "gruh",
  pr: "pruh", tr: "truh",
  // Vowel teams
  ai: "ayy",  ay: "ayy",  ea: "ee",   ee: "ee",
  oa: "oh",   ow: "oh",
};

// ── TTS REST API call ────────────────────────────────────────────────────────
async function synthesize(text, speakingRate = 0.82, pitch = 2.0) {
  const res = await fetch(
    `https://texttospeech.googleapis.com/v1/text:synthesize?key=${API_KEY}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        input: { text },
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

// ── Main ─────────────────────────────────────────────────────────────────────
async function main() {
  const phonemesDir = join(__dirname, "public/audio/phonemes");
  const audioDir    = join(__dirname, "public/audio");

  await mkdir(phonemesDir, { recursive: true });

  const entries = Object.entries(phonemeToText);
  console.log(`\nGenerating ${entries.length} phoneme files…\n`);

  let ok = 0;
  let fail = 0;

  for (const [id, text] of entries) {
    process.stdout.write(`  [${String(ok + fail + 1).padStart(2)}/${entries.length}] ${id.padEnd(4)} (${text.padEnd(6)}) … `);
    try {
      const buf = await synthesize(text);
      await writeFile(join(phonemesDir, `${id}.mp3`), buf);
      console.log("✓");
      ok++;
    } catch (err) {
      console.log(`✗  ${err.message}`);
      fail++;
    }
    await delay(200);
  }

  // Success chime — upbeat pitch and slightly faster
  process.stdout.write(`\n  success chime … `);
  try {
    const buf = await synthesize("Amazing! You did it!", 0.9, 4.0);
    await writeFile(join(audioDir, "success.mp3"), buf);
    console.log("✓");
    ok++;
  } catch (err) {
    console.log(`✗  ${err.message}`);
    fail++;
  }

  console.log(`\n─────────────────────────────`);
  console.log(`  Done: ${ok} generated, ${fail} failed`);
  if (fail > 0) console.log("  Re-run the script to retry failed files.");
  console.log(`  Output: public/audio/\n`);
}

main().catch((err) => {
  console.error("\nFatal:", err.message);
  process.exit(1);
});
