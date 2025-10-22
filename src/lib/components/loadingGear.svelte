<script>
    import "@fortawesome/fontawesome-free/css/all.min.css";
</script>

<div class="fade-in-1 loading-container">
    <i class="loading fa-solid fa-circle-notch"></i>
</div>

<style>
    .loading-container {
        display: flex;
        align-items: center;
        justify-content: center;

        flex-grow: 1;
    }
    .loading {
        width: fit-content;
        height: fit-content;

        font-size: 20vw;
        animation: spin 3s infinite linear;

        opacity: 1%;
    }

    @media (prefers-color-scheme: light) {
        .loading {
            opacity: 3%;
        }
    }

    @keyframes spin {
        0% {
            rotate: 0deg;
        }

        100% {
            rotate: 360deg;
        }
    }
</style>
