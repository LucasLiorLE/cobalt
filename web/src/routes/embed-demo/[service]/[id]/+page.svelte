<script lang="ts">
    import type { PageData } from './$types';
    
    export let data: PageData;
    
    $: ({ videoData, service, id, originalUrl } = data);
    
    // Extract video metadata for display
    $: title = videoData?.title || `${service.toUpperCase()} Video ${id}`;
    $: description = videoData?.description || `Video content from ${service.toUpperCase()} processed by Cobalt`;
    $: thumbnailUrl = videoData?.thumbnail || '';
    $: videoUrl = videoData?.videoUrl || '';
    $: videoDimensions = videoData?.dimensions || { width: 1280, height: 720 };
    $: videoType = videoData?.type || 'video/mp4';
    $: author = videoData?.author || '';
    $: duration = videoData?.duration || '';
</script>

<svelte:head>
    <!-- Essential Open Graph meta tags for Discord video embeds -->
    <title>{title}</title>
    <meta property="og:title" content={title} />
    <meta property="og:description" content={description} />
    <meta property="og:type" content="video.other" />
    <meta property="og:site_name" content="Cobalt" />
    <meta property="og:url" content="/embed-demo/{service}/{id}" />
    
    <!-- Video-specific Open Graph tags -->
    {#if videoUrl}
        <meta property="og:video" content={videoUrl} />
        <meta property="og:video:url" content={videoUrl} />
        <meta property="og:video:secure_url" content={videoUrl} />
        <meta property="og:video:type" content={videoType} />
        <meta property="og:video:width" content={videoDimensions.width.toString()} />
        <meta property="og:video:height" content={videoDimensions.height.toString()} />
    {/if}
    
    <!-- Thumbnail image -->
    {#if thumbnailUrl}
        <meta property="og:image" content={thumbnailUrl} />
        <meta property="og:image:url" content={thumbnailUrl} />
        <meta property="og:image:secure_url" content={thumbnailUrl} />
        <meta property="og:image:width" content={videoDimensions.width.toString()} />
        <meta property="og:image:height" content={videoDimensions.height.toString()} />
        <meta property="og:image:type" content="image/jpeg" />
    {/if}
    
    <!-- Additional metadata -->
    {#if author}
        <meta property="video:actor" content={author} />
        <meta property="article:author" content={author} />
    {/if}
    
    {#if duration}
        <meta property="video:duration" content={duration.toString()} />
    {/if}
    
    <!-- Twitter Card meta tags for better compatibility -->
    <meta name="twitter:card" content="player" />
    <meta name="twitter:site" content="@cobalt_tools" />
    <meta name="twitter:title" content={title} />
    <meta name="twitter:description" content={description} />
    {#if thumbnailUrl}
        <meta name="twitter:image" content={thumbnailUrl} />
        <meta name="twitter:image:alt" content={title} />
    {/if}
    {#if videoUrl}
        <meta name="twitter:player" content={videoUrl} />
        <meta name="twitter:player:width" content={videoDimensions.width.toString()} />
        <meta name="twitter:player:height" content={videoDimensions.height.toString()} />
        <meta name="twitter:player:stream" content={videoUrl} />
        <meta name="twitter:player:stream:content_type" content={videoType} />
    {/if}
    
    <!-- Additional Discord-specific optimizations -->
    <meta name="theme-color" content="#000000" />
    <meta name="msapplication-TileColor" content="#000000" />
</svelte:head>

<div class="embed-container">
    <div class="demo-banner">
        <h2>🎥 Discord Embed Demo</h2>
        <p>This is a demonstration of Cobalt's Discord video embed functionality.</p>
    </div>
    
    <div class="video-info">
        <div class="header">
            <h1>{title}</h1>
            {#if author}
                <p class="author">by {author}</p>
            {/if}
        </div>
        
        <p class="description">{description}</p>
        
        {#if thumbnailUrl}
            <div class="thumbnail-wrapper">
                <img src={thumbnailUrl} alt={title} />
                <div class="play-overlay">
                    <svg width="64" height="64" viewBox="0 0 24 24" fill="white">
                        <path d="M8 5v14l11-7z"/>
                    </svg>
                </div>
                <div class="demo-note">
                    This is a demo thumbnail. In a real embed, this would link to the actual video.
                </div>
            </div>
        {/if}
        
        <div class="meta-info">
            <div class="service-badge">{service.toUpperCase()}</div>
            {#if duration}
                <div class="duration">{duration}s</div>
            {/if}
            <div class="demo-badge">DEMO</div>
        </div>
        
        <div class="embed-info">
            <h3>Generated Meta Tags</h3>
            <div class="meta-tags">
                <div class="tag">
                    <code>og:title</code>
                    <span>{title}</span>
                </div>
                <div class="tag">
                    <code>og:description</code>
                    <span>{description}</span>
                </div>
                <div class="tag">
                    <code>og:video:url</code>
                    <span>{videoUrl}</span>
                </div>
                <div class="tag">
                    <code>og:video:type</code>
                    <span>{videoType}</span>
                </div>
                <div class="tag">
                    <code>og:video:width</code>
                    <span>{videoDimensions.width}</span>
                </div>
                <div class="tag">
                    <code>og:video:height</code>
                    <span>{videoDimensions.height}</span>
                </div>
                {#if thumbnailUrl}
                    <div class="tag">
                        <code>og:image</code>
                        <span>{thumbnailUrl}</span>
                    </div>
                {/if}
            </div>
        </div>
        
        <div class="footer">
            <p><strong>Demo URL:</strong> <code>/embed-demo/{service}/{id}</code></p>
            <p><strong>Real Usage:</strong> Replace <code>embed-demo</code> with <code>embed</code> for production</p>
            <p><strong>Powered by:</strong> <a href="/" target="_blank" rel="noopener">Cobalt</a></p>
        </div>
    </div>
</div>

<style>
    .embed-container {
        max-width: 800px;
        margin: 0 auto;
        padding: 20px;
        background: var(--background, #000);
        color: var(--font, #fff);
        font-family: 'Inter', system-ui, sans-serif;
    }
    
    .demo-banner {
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        color: white;
        padding: 20px;
        border-radius: 12px;
        text-align: center;
        margin-bottom: 30px;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
    }
    
    .demo-banner h2 {
        margin: 0 0 10px 0;
        font-size: 1.5em;
    }
    
    .demo-banner p {
        margin: 0;
        opacity: 0.9;
    }
    
    .header {
        margin-bottom: 15px;
    }
    
    .video-info h1 {
        margin: 0 0 5px 0;
        font-size: 1.5em;
        font-weight: 600;
        color: var(--font, #fff);
        line-height: 1.3;
    }
    
    .author {
        margin: 0 0 10px 0;
        color: var(--gray, #888);
        font-size: 0.9em;
        font-weight: 500;
    }
    
    .description {
        margin-bottom: 20px;
        color: var(--gray, #ccc);
        line-height: 1.4;
    }
    
    .thumbnail-wrapper {
        position: relative;
        margin-bottom: 20px;
        border-radius: 12px;
        overflow: hidden;
        background: #111;
        cursor: pointer;
    }
    
    img {
        width: 100%;
        height: auto;
        display: block;
    }
    
    .play-overlay {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background: rgba(0, 0, 0, 0.7);
        border-radius: 50%;
        padding: 20px;
        transition: all 0.3s ease;
    }
    
    .thumbnail-wrapper:hover .play-overlay {
        background: rgba(0, 0, 0, 0.9);
        transform: translate(-50%, -50%) scale(1.1);
    }
    
    .demo-note {
        position: absolute;
        bottom: 10px;
        left: 10px;
        right: 10px;
        background: rgba(0, 0, 0, 0.8);
        color: white;
        padding: 8px 12px;
        border-radius: 6px;
        font-size: 0.8em;
        text-align: center;
    }
    
    .meta-info {
        display: flex;
        gap: 10px;
        margin-bottom: 30px;
        align-items: center;
        flex-wrap: wrap;
    }
    
    .service-badge {
        background: var(--primary, #007bff);
        color: white;
        padding: 4px 12px;
        border-radius: 20px;
        font-size: 0.8em;
        font-weight: 600;
        text-transform: uppercase;
    }
    
    .duration {
        background: var(--gray, #444);
        color: white;
        padding: 4px 8px;
        border-radius: 6px;
        font-size: 0.8em;
        font-family: monospace;
    }
    
    .demo-badge {
        background: linear-gradient(135deg, #ff6b6b, #ee5a52);
        color: white;
        padding: 4px 12px;
        border-radius: 20px;
        font-size: 0.8em;
        font-weight: 600;
        animation: pulse 2s infinite;
    }
    
    @keyframes pulse {
        0%, 100% { opacity: 1; }
        50% { opacity: 0.7; }
    }
    
    .embed-info {
        background: var(--background-2, #111);
        border: 1px solid var(--border, #333);
        border-radius: 12px;
        padding: 20px;
        margin-bottom: 20px;
    }
    
    .embed-info h3 {
        margin: 0 0 15px 0;
        color: var(--font, #fff);
        font-size: 1.1em;
    }
    
    .meta-tags {
        display: grid;
        gap: 8px;
    }
    
    .tag {
        display: grid;
        grid-template-columns: 150px 1fr;
        gap: 10px;
        align-items: start;
        padding: 8px 0;
        border-bottom: 1px solid var(--border, #333);
    }
    
    .tag:last-child {
        border-bottom: none;
    }
    
    .tag code {
        background: var(--background, #000);
        color: var(--primary, #007bff);
        padding: 2px 6px;
        border-radius: 4px;
        font-size: 0.8em;
        font-weight: 600;
    }
    
    .tag span {
        color: var(--gray, #ccc);
        font-size: 0.9em;
        word-break: break-all;
    }
    
    .footer {
        font-size: 0.85em;
        color: var(--gray, #888);
        border-top: 1px solid var(--border, #333);
        padding-top: 15px;
        margin-top: 15px;
    }
    
    .footer p {
        margin: 8px 0;
    }
    
    .footer code {
        background: var(--background-2, #111);
        padding: 2px 6px;
        border-radius: 4px;
        font-family: monospace;
        color: var(--primary, #007bff);
    }
    
    .footer a {
        color: var(--primary, #007bff);
        text-decoration: none;
    }
    
    .footer a:hover {
        text-decoration: underline;
    }
    
    @media (max-width: 768px) {
        .embed-container {
            padding: 15px;
        }
        
        .video-info h1 {
            font-size: 1.3em;
        }
        
        .tag {
            grid-template-columns: 1fr;
            gap: 5px;
        }
        
        .meta-info {
            flex-wrap: wrap;
        }
    }
</style>