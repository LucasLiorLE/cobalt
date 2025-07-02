<script lang="ts">
    // Layout for embed pages - minimal styling for embed previews
</script>

<main>
    <slot />
</main>

<style>
    main {
        width: 100%;
        height: 100vh;
        display: flex;
        align-items: center;
        justify-content: center;
        background: var(--background);
        color: var(--font);
    }
</style>