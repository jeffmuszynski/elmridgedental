import puppeteer from 'puppeteer';
const browser = await puppeteer.launch({ headless: 'new', args: ['--no-sandbox'] });
const page = await browser.newPage();
await page.setViewport({ width: 1440, height: 900 });
await page.goto('http://localhost:3000', { waitUntil: 'networkidle2', timeout: 30000 });
await new Promise(r => setTimeout(r, 1500));
await page.screenshot({ path: 'temporary screenshots/tour-1-hero.png' });

const sections = [
  ['#services','services'],
  ['#implants','implants'],
  ['#cosmetic','cosmetic'],
  ['#team','team'],
  ['#before-after','beforeafter'],

  ['#contact','contact'],
];
for (let i = 0; i < sections.length; i++) {
  await page.evaluate(sel => document.querySelector(sel).scrollIntoView(), sections[i][0]);
  await new Promise(r => setTimeout(r, 900));
  await page.screenshot({ path: `temporary screenshots/tour-${i+2}-${sections[i][1]}.png` });
}
await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
await new Promise(r => setTimeout(r, 500));
await page.screenshot({ path: 'temporary screenshots/tour-9-footer.png' });
await browser.close();
console.log('done');
