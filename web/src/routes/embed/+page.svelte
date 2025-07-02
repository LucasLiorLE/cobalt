<script lang="ts">
    import type { PageData } from './$types';
    
    export let data: PageData;
    
    $: ({ videoData, originalUrl } = data);
    
    // Extract video metadata for display
    $: title = videoData?.title || 'Video';
    $: description = videoData?.description || 'Video content from Cobalt';
    $: thumbnailUrl = videoData?.thumbnail || '';
    $: videoUrl = videoData?.videoUrl || '';
    $: videoDimensions = videoData?.dimensions || { width: 1280, height: 720 };
    $: videoType = videoData?.type || 'video/mp4';
</script>

<svelte:head>
    <!-- Essential Open Graph meta tags for Discord video embeds -->
    <title>{title}</title>
    <meta property="og:title" content={title} />
    <meta property="og:description" content={description} />
    <meta property="og:type" content="video.other" />
    <meta property="og:site_name" content="Cobalt" />
    
    <!-- Video-specific Open Graph tags -->
    {#if videoUrl}
        <meta property="og:video" content={videoUrl} />
        <meta property="og:video:url" content={videoUrl} />
        <meta property="og:video:type" content={videoType} />
        <meta property="og:video:width" content={videoDimensions.width.toString()} />
        <meta property="og:video:height" content={videoDimensions.height.toString()} />
    {/if}
    
    <!-- Thumbnail image -->
    {#if thumbnailUrl}
        <meta property="og:image" content={thumbnailUrl} />
        <meta property="og:image:width" content={videoDimensions.width.toString()} />
        <meta property="og:image:height" content={videoDimensions.height.toString()} />
    {/if}
    
    <!-- Twitter Card meta tags for better compatibility -->
    <meta name="twitter:card" content="player" />
    <meta name="twitter:title" content={title} />
    <meta name="twitter:description" content={description} />
    {#if thumbnailUrl}
        <meta name="twitter:image" content={thumbnailUrl} />
    {/if}
    {#if videoUrl}
        <meta name="twitter:player" content={videoUrl} />
        <meta name="twitter:player:width" content={videoDimensions.width.toString()} />
        <meta name="twitter:player:height" content={videoDimensions.height.toString()} />
    {/if}
</svelte:head>

<div class="embed-container">
    <div class="video-info">
        <h1>{title}</h1>
        <p>{description}</p>
        
        {#if videoUrl}
            <video controls width={videoDimensions.width} height={videoDimensions.height}>
                <source src={videoUrl} type={videoType} />
                Your browser does not support the video tag.
            </video>
        {:else if thumbnailUrl}
            <img src={thumbnailUrl} alt={title} />
        {/if}
        
        <div class="meta-info">
            <p><strong>Original URL:</strong> <a href={originalUrl} target="_blank" rel="noopener">{originalUrl}</a></p>
            <p><strong>Processed by:</strong> <a href="/" target="_blank" rel="noopener">Cobalt</a></p>
        </div>
    </div>
</div>

<style>
    .embed-container {
        max-width: 800px;
        margin: 0 auto;
        padding: 20px;
        text-align: center;
    }
    
    .video-info h1 {
        margin-bottom: 10px;
        color: var(--font);
    }
    
    .video-info p {
        margin-bottom: 20px;
        color: var(--gray);
    }
    
    video, img {
        max-width: 100%;
        height: auto;
        border-radius: 8px;
        margin-bottom: 20px;
    }
    
    .meta-info {
        font-size: 0.9em;
        color: var(--gray);
        border-top: 1px solid var(--border);
        padding-top: 20px;
        margin-top: 20px;
    }
    
    .meta-info a {
        color: var(--primary);
        text-decoration: none;
    }
    
    .meta-info a:hover {
        text-decoration: underline;
    }
</style>