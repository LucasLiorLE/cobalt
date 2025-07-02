import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export const POST: RequestHandler = async ({ request, fetch }) => {
    try {
        const { url } = await request.json();
        
        if (!url) {
            return json({ error: 'URL is required' }, { status: 400 });
        }

        // Call the main Cobalt API embed endpoint
        // In production, this would be the actual API URL from environment
        const apiUrl = process.env.API_URL || 'http://localhost:9000';
        
        const apiResponse = await fetch(`${apiUrl}/embed`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify({
                url: url,
                filenameStyle: 'classic',
                downloadMode: 'auto',
                videoQuality: '720',
                audioFormat: 'mp3',
                audioBitrate: '128',
                dubLang: false,
                disableMetadata: false
            })
        });

        if (!apiResponse.ok) {
            const errorText = await apiResponse.text();
            console.error('API Error:', errorText);
            return json({ error: 'Failed to process video URL' }, { status: apiResponse.status });
        }

        const result = await apiResponse.json();
        
        // If the API returned embed data directly, use it
        if (result.status === 'embed') {
            return json({
                title: result.title || 'Video Content',
                description: result.description || 'Video processed by Cobalt',
                thumbnail: result.thumbnail,
                videoUrl: result.videoUrl,
                dimensions: result.videoDimensions || { width: 1280, height: 720 },
                type: result.videoType || 'video/mp4',
                duration: result.duration,
                author: result.author,
                service: result.service
            });
        }
        
        // Transform the API response to embed-friendly format
        let embedData = {
            title: 'Video Content',
            description: 'Video processed by Cobalt',
            thumbnail: null,
            videoUrl: null,
            dimensions: { width: 1280, height: 720 },
            type: 'video/mp4'
        };

        if (result.status === 'redirect' || result.status === 'tunnel') {
            // Direct video URL
            embedData.videoUrl = result.url;
            embedData.title = result.filename ? result.filename.replace(/\.[^/.]+$/, '') : 'Video Content';
        } else if (result.status === 'picker') {
            // Multiple videos - take the first one
            if (result.picker && result.picker.length > 0) {
                const firstVideo = result.picker[0];
                embedData.videoUrl = firstVideo.url;
                embedData.thumbnail = firstVideo.thumb;
                embedData.title = firstVideo.service || 'Video Content';
            }
        } else if (result.status === 'local-processing') {
            // Video needs processing - use tunnel URLs
            if (result.tunnel && result.tunnel.video) {
                embedData.videoUrl = result.tunnel.video;
            }
            if (result.output && result.output.filename) {
                embedData.title = result.output.filename.replace(/\.[^/.]+$/, '');
            }
        }

        // Try to extract additional metadata from the original URL
        if (url.includes('youtube.com') || url.includes('youtu.be')) {
            embedData.description = 'YouTube video processed by Cobalt';
        } else if (url.includes('twitter.com') || url.includes('x.com')) {
            embedData.description = 'Twitter video processed by Cobalt';
        } else if (url.includes('tiktok.com')) {
            embedData.description = 'TikTok video processed by Cobalt';
        } else if (url.includes('instagram.com')) {
            embedData.description = 'Instagram video processed by Cobalt';
        }

        return json(embedData);
        
    } catch (error) {
        console.error('Error in video-info API:', error);
        return json({ error: 'Internal server error' }, { status: 500 });
    }
};