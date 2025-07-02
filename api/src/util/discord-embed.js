import mime from "mime";

/**
 * Detects if the request is from Discord or other social media crawlers
 * @param {string} userAgent - The User-Agent header from the request
 * @returns {boolean} True if the request is from a bot/crawler
 */
export function isDiscordBot(userAgent) {
    if (!userAgent) return false;
    
    const botPatterns = [
        'discordbot',
        'twitterbot',
        'facebookexternalhit',
        'whatsapp',
        'telegrambot',
        'slackbot',
        'linkedinbot',
        'redditbot'
    ];
    
    const lowerAgent = userAgent.toLowerCase();
    return botPatterns.some(pattern => lowerAgent.includes(pattern));
}

/**
 * Generates HTML with Open Graph meta tags for video embedding
 * @param {Object} streamInfo - Stream information object
 * @param {string} tunnelUrl - The full tunnel URL
 * @returns {string} HTML string with meta tags
 */
export function generateDiscordEmbed(streamInfo, tunnelUrl) {
    const metadata = streamInfo.metadata || {};
    const filename = streamInfo.filename || 'video';
    const service = streamInfo.service || 'cobalt';
    
    // Extract title and artist from metadata
    const title = metadata.title || filename;
    const artist = metadata.artist || service;
    const description = `${title}${artist && artist !== title ? ` by ${artist}` : ''}`;
    
    // Determine video type from filename or default to mp4
    const mimeType = mime.getType(filename) || 'video/mp4';
    
    // Build the video URL without Discord bot detection to avoid infinite loop
    const videoUrl = new URL(tunnelUrl);
    videoUrl.searchParams.set('no_embed', '1');
    
    // Extract video dimensions if available
    let videoWidth = '';
    let videoHeight = '';
    if (metadata.resolution) {
        const dimensions = metadata.resolution.split('x');
        if (dimensions.length === 2) {
            videoWidth = dimensions[0];
            videoHeight = dimensions[1];
        }
    }
    
    // Extract thumbnail/cover image if available
    const thumbnailUrl = streamInfo.cover || '';
    
    const html = `<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    
    <!-- Open Graph meta tags for video embedding -->
    <meta property="og:type" content="video.other">
    <meta property="og:title" content="${escapeHtml(title)}">
    <meta property="og:description" content="${escapeHtml(description)}">
    <meta property="og:video" content="${escapeHtml(videoUrl.toString())}">
    <meta property="og:video:url" content="${escapeHtml(videoUrl.toString())}">
    <meta property="og:video:type" content="${escapeHtml(mimeType)}">
    <meta property="og:video:secure_url" content="${escapeHtml(videoUrl.toString())}">
    ${videoWidth ? `<meta property="og:video:width" content="${escapeHtml(videoWidth)}">` : ''}
    ${videoHeight ? `<meta property="og:video:height" content="${escapeHtml(videoHeight)}">` : ''}
    ${thumbnailUrl ? `<meta property="og:image" content="${escapeHtml(thumbnailUrl)}">` : ''}
    
    <!-- Twitter Card meta tags -->
    <meta name="twitter:card" content="player">
    <meta name="twitter:title" content="${escapeHtml(title)}">
    <meta name="twitter:description" content="${escapeHtml(description)}">
    <meta name="twitter:player" content="${escapeHtml(videoUrl.toString())}">
    <meta name="twitter:player:stream" content="${escapeHtml(videoUrl.toString())}">
    <meta name="twitter:player:stream:content_type" content="${escapeHtml(mimeType)}">
    ${videoWidth ? `<meta name="twitter:player:width" content="${escapeHtml(videoWidth)}">` : ''}
    ${videoHeight ? `<meta name="twitter:player:height" content="${escapeHtml(videoHeight)}">` : ''}
    ${thumbnailUrl ? `<meta name="twitter:image" content="${escapeHtml(thumbnailUrl)}">` : ''}
    
    <!-- Additional meta tags -->
    <meta name="robots" content="noindex">
    
    <title>${escapeHtml(title)}</title>
</head>
<body>
    <div style="text-align: center; padding: 20px; font-family: Arial, sans-serif;">
        <h1>${escapeHtml(title)}</h1>
        <p>${escapeHtml(description)}</p>
        ${thumbnailUrl ? `<img src="${escapeHtml(thumbnailUrl)}" alt="Video thumbnail" style="max-width: 100%; height: auto; margin: 20px 0;">` : ''}
        <p><a href="${escapeHtml(videoUrl.toString())}" target="_blank">View Video</a></p>
    </div>
</body>
</html>`;

    return html;
}

/**
 * Escapes HTML characters to prevent XSS
 * @param {string} text - Text to escape
 * @returns {string} Escaped HTML
 */
function escapeHtml(text) {
    if (!text) return '';
    return String(text)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');
}