# Discord Video Embed Functionality

This document describes the Discord video embed functionality added to Cobalt, which allows video content to be embedded in Discord with proper Open Graph meta tags.

## Overview

The implementation adds special embed routes that generate HTML pages with Discord-compatible Open Graph meta tags, enabling videos processed by Cobalt to be embedded and previewed directly in Discord chat.

## Features

- **Automatic Open Graph Meta Tags**: Generates Discord-compatible `og:video`, `og:image`, and related meta tags
- **Multiple URL Formats**: Supports both generic and service-specific embed URLs
- **Video Metadata Extraction**: Automatically extracts video title, description, dimensions, and thumbnails
- **Service Support**: Works with YouTube, Twitter/X, TikTok, Instagram, and other supported platforms
- **Responsive Design**: Embed pages work on both desktop and mobile devices

## URL Formats

### Generic Embed URL
```
/embed?url=VIDEO_URL
```
Examples:
- `/embed?url=https://www.youtube.com/watch?v=dQw4w9WgXcQ`
- `/embed?url=https://twitter.com/user/status/1234567890`

### Service-Specific URLs
```
/embed/{service}/{id}
```
Examples:
- `/embed/youtube/dQw4w9WgXcQ`
- `/embed/twitter/1234567890`
- `/embed/tiktok/VIDEO_ID`
- `/embed/instagram/POST_ID`

## Generated Meta Tags

The embed pages automatically generate the following Open Graph meta tags:

### Required for Discord Video Embeds
- `og:title` - Video title
- `og:description` - Video description
- `og:type` - Set to "video.other"
- `og:video:url` - Direct URL to the video file
- `og:video:type` - Video MIME type (e.g., "video/mp4")
- `og:video:width` - Video width in pixels
- `og:video:height` - Video height in pixels
- `og:image` - Video thumbnail URL
- `og:site_name` - Set to "Cobalt"

### Additional Meta Tags
- `og:url` - URL of the embed page
- `og:video:secure_url` - HTTPS version of video URL
- `og:image:secure_url` - HTTPS version of thumbnail
- `video:duration` - Video duration (when available)
- `video:actor` - Video author/creator (when available)

### Twitter Card Compatibility
- `twitter:card` - Set to "player"
- `twitter:title` - Video title
- `twitter:description` - Video description
- `twitter:image` - Video thumbnail
- `twitter:player` - Video player URL

## Implementation Details

### API Changes

#### New Endpoint: `/embed`
The API now includes a `/embed` endpoint that returns video metadata formatted for embed purposes:

```javascript
POST /embed
{
    "url": "https://www.youtube.com/watch?v=dQw4w9WgXcQ"
}
```

Response:
```javascript
{
    "status": "embed",
    "title": "Video Title",
    "description": "Video description",
    "thumbnail": "https://thumbnail-url.jpg",
    "videoUrl": "https://direct-video-url.mp4",
    "videoDimensions": { "width": 1280, "height": 720 },
    "videoType": "video/mp4",
    "duration": 180,
    "author": "Channel Name",
    "service": "youtube"
}
```

#### Enhanced Response Processing
Added `embed-response.js` module to transform standard Cobalt API responses into embed-friendly format with proper metadata extraction.

### Web Application Changes

#### New Routes
- `/embed/+page.svelte` - Generic embed page
- `/embed/[service]/[id]/+page.svelte` - Service-specific embed page
- `/api/video-info/+server.ts` - Bridge API endpoint

#### Key Features
- Server-side rendering (SSR) for proper meta tag generation
- Responsive embed preview pages
- Error handling for invalid URLs or unsupported content
- Automatic service detection and URL reconstruction

## Usage with Discord

1. **Get Video URL**: Start with any supported video URL (YouTube, Twitter, etc.)
2. **Generate Embed URL**: Convert to Cobalt embed format:
   - Generic: `/embed?url=VIDEO_URL`
   - Specific: `/embed/youtube/VIDEO_ID`
3. **Share in Discord**: Paste the embed URL into Discord
4. **Automatic Embed**: Discord will fetch the meta tags and display a video embed preview

## Testing

Visit `/embed-test` for a comprehensive testing interface with:
- Example embed URLs for different services
- Documentation of generated meta tags
- Links to test the embed functionality

## Error Handling

The implementation includes robust error handling for:
- Invalid or missing video URLs
- Unsupported video platforms
- API connection failures
- Missing video metadata

Error responses include appropriate HTTP status codes and user-friendly error messages.

## Security Considerations

- All video URLs are validated before processing
- API requests include proper rate limiting
- No sensitive data is exposed in embed pages
- HTTPS URLs are preferred for video content

## Browser Compatibility

The embed pages are designed to work with:
- Discord's web crawler for meta tag extraction
- Modern web browsers for direct viewing
- Mobile devices for responsive display

## Performance

- Server-side rendering ensures fast meta tag discovery
- Video thumbnails are properly sized for Discord
- Lazy loading for video content when viewed directly
- Efficient API calls with caching where appropriate