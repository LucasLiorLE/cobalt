<script lang="ts">
    import type { PageData } from './$types';
    
    export let data: PageData;
    
    $: ({ videoData, originalUrl, service, id } = data);
    
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
    <meta property="og:url" content="/embed/{service}/{id}" />
    
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
    <div class="video-info">
        <div class="header">
            <h1>{title}</h1>
            {#if author}
                <p class="author">by {author}</p>
            {/if}
        </div>
        
        <p class="description">{description}</p>
        
        {#if videoUrl}
            <div class="video-wrapper">
                <video 
                    controls 
                    preload="metadata"
                    width={videoDimensions.width} 
                    height={videoDimensions.height}
                    poster={thumbnailUrl}
                >
                    <source src={videoUrl} type={videoType} />
                    Your browser does not support the video tag.
                </video>
            </div>
        {:else if thumbnailUrl}
            <div class="thumbnail-wrapper">
                <img src={thumbnailUrl} alt={title} />
                <div class="play-overlay">
                    <svg width="64" height="64" viewBox="0 0 24 24" fill="white">
                        <path d="M8 5v14l11-7z"/>
                    </svg>
                </div>
            </div>
        {/if}
        
        <div class="meta-info">
            <div class="service-badge">{service.toUpperCase()}</div>
            {#if duration}
                <div class="duration">{duration}s</div>
            {/if}
        </div>
        
        <div class="footer">
            <p><strong>Original:</strong> <a href={originalUrl} target="_blank" rel="noopener">{originalUrl}</a></p>
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
    
    .video-wrapper, .thumbnail-wrapper {
        position: relative;
        margin-bottom: 20px;
        border-radius: 12px;
        overflow: hidden;
        background: #111;
    }
    
    video, img {
        width: 100%;
        height: auto;
        display: block;
    }
    
    .thumbnail-wrapper {
        position: relative;
        cursor: pointer;
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
    
    .meta-info {
        display: flex;
        gap: 10px;
        margin-bottom: 20px;
        align-items: center;
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
    
    .footer a {
        color: var(--primary, #007bff);
        text-decoration: none;
        word-break: break-all;
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
        
        .meta-info {
            flex-wrap: wrap;
        }
    }
</style>