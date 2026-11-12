const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');

const BASE_URL = process.env.BASE_URL || 'http://127.0.0.1:8000';
const TRAINING_FILE = path.join(__dirname, 'training.txt');
const RECORDINGS_DIR = path.join(__dirname, 'recordings');

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

async function runDemo() {
  if (!fs.existsSync(RECORDINGS_DIR)) {
    fs.mkdirSync(RECORDINGS_DIR, { recursive: true });
  }

  console.log(`[TokenForge Demo] Launching browser and navigating to ${BASE_URL}...`);
  const browser = await chromium.launch({
    headless: false,
    channel: 'chrome'
  });

  const context = await browser.newContext({
    recordVideo: {
      dir: RECORDINGS_DIR,
      size: { width: 1280, height: 720 }
    },
    viewport: { width: 1280, height: 720 }
  });

  const page = await context.newPage();
  const nav = page.locator('nav');
  const main = page.locator('main');

  try {
    // 1. Visit Dashboard
    await page.goto(BASE_URL, { waitUntil: 'networkidle' });
    console.log('[1/7] Landed on Dashboard');
    await delay(2000);

    // 2. Navigate to Train Tokenizer & Upload training.txt
    console.log('[2/7] Uploading training dataset and training BPE...');
    await nav.getByRole('button', { name: 'Train Tokenizer' }).click();
    await delay(1000);

    const fileInput = page.locator('input[type="file"]');
    await fileInput.setInputFiles(TRAINING_FILE);
    await page.waitForSelector('text=Active Dataset:');
    await delay(1500);

    // Set Max Merges and Trigger Training
    const maxMergesInput = main.locator('input[type="number"]').first();
    await maxMergesInput.fill('15');
    await delay(500);

    await main.getByRole('button', { name: /Start BPE Training/i }).click();
    await page.waitForSelector('text=Training Completed Successfully', { timeout: 15000 });
    console.log('      BPE training complete');
    await delay(2500);

    // 3. Tokenize Text
    console.log('[3/7] Testing Tokenizer...');
    await nav.getByRole('button', { name: 'Tokenize Text' }).click();
    await delay(1000);

    const textarea = main.locator('textarea');
    await textarea.fill('Byte pair encoding builds a vocabulary by learning frequent combinations.');
    await delay(800);
    await main.getByRole('button', { name: 'Tokenize Text' }).click();
    await page.waitForSelector('text=Subword Tokens');
    await delay(2500);

    // Quick Sample
    await main.getByRole('button', { name: 'machine learning' }).click();
    await delay(500);
    await main.getByRole('button', { name: 'Tokenize Text' }).click();
    await delay(2000);

    // 4. Training Explorer
    console.log('[4/7] Exploring Training Merges...');
    await nav.getByRole('button', { name: 'Training Explorer' }).click();
    await delay(1500);
    const playBtn = main.getByRole('button', { name: 'Play' });
    if (await playBtn.isVisible()) {
      await playBtn.click();
      await delay(3500);
      const pauseBtn = main.getByRole('button', { name: 'Pause' });
      if (await pauseBtn.isVisible()) await pauseBtn.click();
    }
    await delay(1500);

    // 5. Encoding Explorer
    console.log('[5/7] Exploring Encoding Step Progression...');
    await nav.getByRole('button', { name: 'Encoding Explorer' }).click();
    await delay(2000);

    // 6. Vocabulary & Merge Rules
    console.log('[6/7] Inspecting Vocabulary and Merge Rules...');
    await nav.getByRole('button', { name: 'Vocabulary' }).click();
    await delay(2000);

    await nav.getByRole('button', { name: 'Merge Rules' }).click();
    await delay(2000);

    // 7. Settings Palette View & Back to Dashboard
    console.log('[7/7] Inspecting Forest Green + Beige Palette & Final Dashboard...');
    await nav.getByRole('button', { name: 'Settings' }).click();
    await delay(2500);

    await nav.getByRole('button', { name: 'Dashboard' }).click();
    await delay(2500);

    console.log('[TokenForge Demo] Completed successfully.');
  } finally {
    // Save recording
    const video = page.video();
    await page.close();
    await context.close();
    await browser.close();

    if (video) {
      const videoPath = await video.path();
      const finalDest = path.join(RECORDINGS_DIR, `tokenforge-demo-${Date.now()}.webm`);
      fs.renameSync(videoPath, finalDest);
      console.log(`[TokenForge Demo] Recording saved: ${finalDest}`);
    }
  }
}

runDemo().catch((err) => {
  console.error('[TokenForge Demo Error]:', err);
  process.exit(1);
});
