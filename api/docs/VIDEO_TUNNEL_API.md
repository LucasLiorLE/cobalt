# Video Tunnel Link Generation API

This module provides functionality to dynamically generate tunnel links for video requests with CDN integration and time-limited security.

## Features

- ✅ **Video Validation**: Validates video names and checks existence
- ✅ **CDN Integration**: Generates temporary CDN URLs with time-based expiration
- ✅ **Tunnel Link Generation**: Formats CDN URLs into `url/cdn` tunnel pattern
- ✅ **Error Handling**: Comprehensive error handling for invalid requests
- ✅ **Security**: Time-limited URLs for access control

## API Endpoints

### GET `/videos/request`

Generates a tunnel link for a video request.

**Query Parameters:**
- `name` (required): Video name/ID to request
- `expiration` (optional): Expiration time in minutes (default: 60)

**Example Request:**
```bash
curl "http://localhost:9000/videos/request?name=demo-video&expiration=120"
```

**Success Response (200):**
```json
{
  "status": "success",
  "video": {
    "id": "demo-video",
    "title": "Demo Video",
    "duration": 120,
    "format": "mp4"
  },
  "cdn": {
    "url": "https://cdn.example.com/secure/YqIsRNo7oJqO_X8W/demo-video.mp4?exp=1751482968",
    "expiration": "2025-07-02T19:02:48.819Z",
    "expirationTimestamp": 1751482968
  },
  "tunnel": {
    "link": "https://cdn.example.com/tunnel/cdn/secure/YqIsRNo7oJqO_X8W/demo-video.mp4?exp=1751482968",
    "pattern": "url/cdn"
  }
}
```

**Error Responses:**

Video not found (400):
```json
{
  "status": "error",
  "error": {
    "code": "error.api.video.not_found",
    "context": {"videoName": "nonexistent-video"}
  }
}
```

Invalid video name (400):
```json
{
  "status": "error",
  "error": {
    "code": "error.api.video.invalid_name", 
    "context": {"videoName": "invalid!!name"}
  }
}
```

Missing video name (400):
```json
{
  "status": "error",
  "error": {
    "code": "error.api.video.missing_name"
  }
}
```

### GET `/videos/list`

Lists all available videos in the system.

**Example Request:**
```bash
curl "http://localhost:9000/videos/list"
```

**Response (200):**
```json
{
  "status": "success",
  "videos": [
    {
      "id": "demo-video",
      "title": "Demo Video", 
      "duration": 120,
      "format": "mp4"
    },
    {
      "id": "sample-clip",
      "title": "Sample Clip",
      "duration": 60,
      "format": "mp4"
    }
  ],
  "count": 2
}
```

## Core Functions

### `validateVideoName(videoName)`

Validates a video name according to these rules:
- Must be a string
- 1-50 characters long
- Only alphanumeric characters, hyphens, and underscores allowed

**Parameters:**
- `videoName` (string): The video name to validate

**Returns:**
- `boolean`: Whether the video name is valid

### `getVideoInfo(videoName)`

Retrieves video information from the database.

**Parameters:**
- `videoName` (string): The video name to look up

**Returns:**
- `object|null`: Video object if found, null otherwise

### `generateCdnUrl(videoUrl, expirationMinutes)`

Generates a temporary CDN URL with time-based expiration.

**Parameters:**
- `videoUrl` (string): Original video URL
- `expirationMinutes` (number, optional): Expiration time in minutes (default: 60)

**Returns:**
- `object`: CDN information with URL, expiration, token, etc.

### `formatTunnelLink(cdnUrl)`

Formats a CDN URL into tunnel-like format following the `url/cdn` pattern.

**Parameters:**
- `cdnUrl` (string): The CDN URL to format

**Returns:**
- `string`: Formatted tunnel URL

### `handleVideoRequest(videoName, options)`

Main handler for video tunnel requests with validation and error handling.

**Parameters:**
- `videoName` (string): The requested video name
- `options` (object, optional): Additional options (expiration, etc.)

**Returns:**
- `object`: Response object with tunnel link or error

### `listAvailableVideos()`

Lists all available videos in the system.

**Returns:**
- `object`: Response with array of videos and count

## Security Features

### Time-Limited URLs

All generated CDN URLs include an expiration timestamp for security:
- Default expiration: 60 minutes
- Configurable per request (15 minutes to 12 hours)
- Timestamp validation on access

### Video Name Validation

Strict validation prevents injection attacks:
- Only alphanumeric characters, hyphens, underscores
- Length limits (1-50 characters)
- No special characters or spaces

### CDN Token Generation

Each CDN URL includes a unique token:
- Generated using nanoid for uniqueness
- 16-character random string
- One-time use for each request

## Frontend Integration

A demo HTML interface is provided at `/web/static/video-tunnel-demo.html` that demonstrates:

- Video list retrieval
- Tunnel link generation
- Error handling
- Interactive testing of all endpoints

**Features:**
- Real-time API testing
- JSON response display
- Error case demonstration
- Click-to-use video selection

## Configuration

### Environment Variables

- `CDN_BASE_URL`: Base URL for CDN (default: "https://cdn.example.com")
- `API_URL`: Base API URL for the service

### Mock Database

Currently uses an in-memory Map for demonstration. In production, replace with:
- Database integration (PostgreSQL, MySQL, etc.)
- Video metadata storage
- User access controls
- Content management system

## Testing

Run the test suite:

```bash
cd api
node test-video-tunnel.js
```

Tests cover:
- Video listing functionality
- Name validation (valid and invalid cases)
- Video existence checking
- CDN URL generation
- Tunnel link formatting
- Complete request handling
- Error scenarios

## Extension Points

### Adding New Videos

Currently videos are stored in a mock database. To add videos:

1. **Development**: Edit `mockVideoDatabase` in `src/video/tunnel.js`
2. **Production**: Integrate with your video management system

### CDN Integration

The CDN URL generation is currently mock. For production:

1. Integrate with your CDN provider (AWS CloudFront, Cloudflare, etc.)
2. Implement proper signed URL generation
3. Add authentication and authorization
4. Configure real CDN endpoints

### Database Integration

Replace the mock database with real storage:

1. Add database models for videos
2. Implement CRUD operations
3. Add user access controls
4. Implement video metadata management

### Advanced Security

For production deployment:

1. Add API authentication (JWT, API keys)
2. Implement rate limiting
3. Add request logging and monitoring
4. Implement CORS properly for your domain
5. Add HTTPS enforcement

## Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Frontend      │───▶│   API Endpoint  │───▶│ Video Database  │
│                 │    │                 │    │                 │
└─────────────────┘    └─────────────────┘    └─────────────────┘
                               │
                               ▼
                       ┌─────────────────┐    ┌─────────────────┐
                       │ CDN Integration │───▶│ Tunnel Formatter│
                       │                 │    │                 │
                       └─────────────────┘    └─────────────────┘
                               │                       │
                               ▼                       ▼
                       ┌─────────────────┐    ┌─────────────────┐
                       │ Temporary URLs  │    │ Tunnel Links    │
                       │ (Time-limited)  │    │ (url/cdn)       │
                       └─────────────────┘    └─────────────────┘
```

## Error Codes

- `error.api.video.missing_name`: Video name parameter is missing
- `error.api.video.invalid_name`: Video name doesn't meet validation criteria
- `error.api.video.not_found`: Requested video doesn't exist in database
- `error.api.video.generation_failed`: CDN URL or tunnel link generation failed

## Performance Considerations

- Video database queries should be optimized for production use
- CDN URL generation should be cached when appropriate
- Consider implementing request queuing for high traffic
- Monitor tunnel link usage and cleanup expired entries

## Future Enhancements

1. **User Authentication**: Add user-based access controls
2. **Video Analytics**: Track tunnel link usage and analytics
3. **Batch Operations**: Support multiple video requests
4. **Webhook Integration**: Notify on video access/expiration
5. **Admin Interface**: Web-based video management
6. **API Versioning**: Support multiple API versions
7. **Caching Layer**: Redis-based caching for performance
8. **Monitoring**: Health checks and performance metrics