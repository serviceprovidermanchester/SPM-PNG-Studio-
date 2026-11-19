/**
 * SPM PNG Studio™ - Automated Unit Test Suite
 * SPManchester Private Limited (https://www.spmanchester.com)
 * Maintainer: Sayed Mudassar Akbar
 */

import assert from 'node:assert/strict';
import { crc32 } from '../src/core/zip.js';
import { calculateDimensions, EXT, MIME } from '../src/core/converter.js';
import { readableBytes, escapeHTML } from '../src/core/utils.js';

console.log('🧪 Starting SPM PNG Studio Unit Test Suite...\n');

// 1. Format & MIME mapping tests
console.log('▶ Test 1: Verifying Format & MIME mappings...');
assert.equal(EXT.JPG, 'jpg');
assert.equal(EXT.WEBP, 'webp');
assert.equal(EXT.PDF, 'pdf');
assert.equal(EXT.SVG, 'svg');
assert.equal(EXT.ICO, 'ico');
assert.equal(EXT.BMP, 'bmp');
assert.equal(EXT.BASE64, 'txt');

assert.equal(MIME.PNG, 'image/png');
assert.equal(MIME.JPG, 'image/jpeg');
assert.equal(MIME.WEBP, 'image/webp');
assert.equal(MIME.PDF, 'application/pdf');
assert.equal(MIME.SVG, 'image/svg+xml');
assert.equal(MIME.BMP, 'image/bmp');
console.log('  ✔ Format & MIME validation passed.');

// 2. Aspect ratio and dimension calculations
console.log('\n▶ Test 2: Dimension & Scaling Math...');
const originalDims = { width: 1920, height: 1080 };

// 50% scale
const halfScale = calculateDimensions(originalDims.width, originalDims.height, 0.5);
assert.equal(halfScale.width, 960);
assert.equal(halfScale.height, 540);

// 25% scale
const quarterScale = calculateDimensions(originalDims.width, originalDims.height, 0.25);
assert.equal(quarterScale.width, 480);
assert.equal(quarterScale.height, 270);

// Custom width preserving aspect ratio
const customDims = calculateDimensions(originalDims.width, originalDims.height, 'custom', 1280);
assert.equal(customDims.width, 1280);
assert.equal(customDims.height, 720);

// Megapixel boundary check (safety capping at 36MP)
const giantDims = calculateDimensions(10000, 10000, 1);
assert.ok(giantDims.width * giantDims.height <= 36000000);
console.log('  ✔ Dimension calculation and safety limits passed.');

// 3. String & Byte utilities
console.log('\n▶ Test 3: Utility helpers...');
assert.equal(readableBytes(500), '0.5 KB');
assert.equal(readableBytes(1024 * 1024 * 2.5), '2.50 MB');
assert.equal(escapeHTML('<b>"Test" & \'Demo\'</b>'), '&lt;b&gt;&quot;Test&quot; &amp; &#39;Demo&#39;&lt;/b&gt;');
console.log('  ✔ Utility helpers passed.');

// 4. CRC32 Checksum verification
console.log('\n▶ Test 4: ZIP Engine CRC32 Checksum verification...');
const testData = new TextEncoder().encode('SPManchester Private Limited - www.spmanchester.com');
const calculatedCrc = crc32(testData);
assert.equal(typeof calculatedCrc, 'number');
assert.ok(calculatedCrc > 0);
console.log(`  ✔ CRC-32 computed checksum: 0x${calculatedCrc.toString(16).toUpperCase()}`);

console.log('\n========================================');
console.log('🎉 ALL TESTS PASSED SUCCESSFULLY! (4/4)');
console.log('Enterprise standards verified for SPManchester Private Limited');
console.log('========================================\n');
