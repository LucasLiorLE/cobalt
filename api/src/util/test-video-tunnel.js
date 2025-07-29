#!/usr/bin/env node

/**
 * Simple test script for the video tunnel functionality
 */

import { handleVideoRequest, listAvailableVideos, validateVideoName, getVideoInfo, generateCdnUrl, formatTunnelLink } from '../video/tunnel.js';

console.log('🧪 Testing Video Tunnel Functionality...\n');

// Test 1: List available videos
console.log('1. Testing listAvailableVideos()');
const listResult = listAvailableVideos();
console.log('✅ Status:', listResult.status);
console.log('✅ Video count:', listResult.body.count);
console.log('✅ Videos:', listResult.body.videos.map(v => v.id).join(', '));
console.log();

// Test 2: Validate video names
console.log('2. Testing validateVideoName()');
const validNames = ['demo-video', 'test_video', 'video123', 'a'];
const invalidNames = ['', 'invalid!!name', 'a'.repeat(51), '   ', 'video with spaces'];

validNames.forEach(name => {
    const isValid = validateVideoName(name);
    console.log(`✅ "${name}": ${isValid ? 'VALID' : 'INVALID'} ${isValid ? '✓' : '✗'}`);
});

invalidNames.forEach(name => {
    const isValid = validateVideoName(name);
    console.log(`✅ "${name}": ${isValid ? 'VALID' : 'INVALID'} ${isValid ? '✗' : '✓'}`);
});
console.log();

// Test 3: Get video info
console.log('3. Testing getVideoInfo()');
console.log('✅ demo-video exists:', !!getVideoInfo('demo-video'));
console.log('✅ nonexistent-video exists:', !!getVideoInfo('nonexistent-video'));
console.log();

// Test 4: Generate CDN URL
console.log('4. Testing generateCdnUrl()');
const cdnInfo = generateCdnUrl('https://example.com/videos/test.mp4', 30);
console.log('✅ CDN URL generated:', cdnInfo.url);
console.log('✅ Expires at:', cdnInfo.expiration);
console.log('✅ Token length:', cdnInfo.token.length);
console.log();

// Test 5: Format tunnel link
console.log('5. Testing formatTunnelLink()');
const tunnelLink = formatTunnelLink(cdnInfo.url);
console.log('✅ Tunnel link:', tunnelLink);
console.log('✅ Contains /tunnel/cdn:', tunnelLink.includes('/tunnel/cdn'));
console.log();

// Test 6: Handle video request (success case)
console.log('6. Testing handleVideoRequest() - success case');
const successResult = handleVideoRequest('demo-video', { expiration: 120 });
console.log('✅ Status:', successResult.status);
console.log('✅ Video ID:', successResult.body.video?.id);
console.log('✅ CDN URL exists:', !!successResult.body.cdn?.url);
console.log('✅ Tunnel link exists:', !!successResult.body.tunnel?.link);
console.log('✅ Pattern:', successResult.body.tunnel?.pattern);
console.log();

// Test 7: Handle video request (error cases)
console.log('7. Testing handleVideoRequest() - error cases');

const notFoundResult = handleVideoRequest('nonexistent-video');
console.log('✅ Not found status:', notFoundResult.status);
console.log('✅ Not found code:', notFoundResult.body.error?.code);

const invalidNameResult = handleVideoRequest('invalid!!name');
console.log('✅ Invalid name status:', invalidNameResult.status);
console.log('✅ Invalid name code:', invalidNameResult.body.error?.code);
console.log();

console.log('🎉 All tests completed!');