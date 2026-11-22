/**
 * The Roots to Roux App Store QR on the family page — offline check.
 *
 * Run: npm test   (node --test tests/)
 *
 * Proves:
 *   1. app-store-qr.png decodes to exactly the App Store listing, opened
 *      2026-11-22 (HTTP 200, "Roots to Roux App - App Store").
 *   2. index.html shows it in the Roots to Roux card beside a badge and the
 *      plain store link, with "Scan to get the app on iPhone" beside it.
 *   3. No QR exists for Google Play: no public Play listing is live.
 *
 * Made with qrcode (MIT, npmjs.com/package/qrcode); decoded with jsQR
 * (Apache-2.0) and pngjs (MIT).
 */
import assert from 'node:assert/strict'
import { readFileSync, existsSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'
import jsQR from 'jsqr'
import { PNG } from 'pngjs'

const APP_STORE = 'https://apps.apple.com/us/app/roots-to-roux/id6800447682'
const root = join(dirname(fileURLToPath(import.meta.url)), '..')

const png = PNG.sync.read(readFileSync(join(root, 'app-store-qr.png')))
const decoded = jsQR(new Uint8ClampedArray(png.data), png.width, png.height)
assert.equal(decoded?.data, APP_STORE, 'the QR must decode to the App Store listing')

const html = readFileSync(join(root, 'index.html'), 'utf8')
assert.ok(html.includes('src="app-store-qr.png"'), 'index.html must show the QR')
assert.ok(html.includes('Scan to get the app on iPhone'), 'the QR needs its label')
assert.ok(html.includes('class="store-badge"'), 'the QR needs its badge')
assert.ok(
  html.includes(`href="${APP_STORE}">Open the App Store listing`),
  'the QR needs its plain store link',
)

// No QR for a store whose listing is not live.
assert.equal(existsSync(join(root, 'play-store-qr.png')), false)
assert.equal(/src="[^"]*play[^"]*qr/i.test(html), false, 'no Google Play QR allowed')
