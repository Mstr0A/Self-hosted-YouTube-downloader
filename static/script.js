const urlInput = document.getElementById("videoUrl");
const titleText = document.getElementById("titleText");
const formatSelect = document.getElementById("format");
const qualitySelect = document.getElementById("quality");
const actionBtn = document.getElementById("actionBtn");
const thumbnailContainer = document.getElementById("thumbnailContainer");
const thumbnail = document.getElementById("thumbnail");
const urlError = document.getElementById("urlError");
const form = document.getElementById("downloadForm");
const urlRegex =
    /^(https?:\/\/)?(www\.)?(youtube\.com\/watch\?v=|youtu\.be\/)([A-Za-z0-9_-]{11})(.*)?$/;

let videoDataLoaded = false;
let videoData = null;

// Toggle quality dropdown based on format
formatSelect.addEventListener("change", function () {
    if (this.value === "audio") {
        qualitySelect.disabled = true;
        qualitySelect.value = "";
    } else {
        qualitySelect.disabled = false;
    }
});

// Handle form submission
form.addEventListener("submit", async function (e) {
    e.preventDefault();

    const url = urlInput.value.trim();

    if (!url || !urlRegex.test(url)) {
        urlError.textContent = "Please enter a valid YouTube URL";
        urlError.classList.add("show");
        return;
    }

    // First stage: Load video data
    if (!videoDataLoaded) {
        actionBtn.disabled = true;
        actionBtn.textContent = "Loading...";
        urlError.classList.remove("show");

        try {
            // TODO: Replace with your actual API endpoint
            const response = await fetch("/api/video-info", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ url: url }),
            });

            if (!response.ok) {
                throw new Error("Failed to load video info");
            }

            videoData = await response.json();

            // Show thumbnail
            thumbnail.src = videoData.thumbnail ||
                `https://img.youtube.com/vi/${
                    extractVideoId(url)
                }/maxresdefault.jpg`;
            thumbnailContainer.classList.add("has-image");
            titleText.textContent = videoData.title;

            // Enable format and quality selects
            formatSelect.disabled = false;
            qualitySelect.disabled = false;

            // Change button to Download
            actionBtn.textContent = "Download";
            actionBtn.disabled = false;
            videoDataLoaded = true;

            // Disable URL input to prevent changes
            urlInput.disabled = true;
        } catch (error) {
            console.error("Error loading video info:", error);
            urlError.textContent =
                "Failed to load video. Please check the URL.";
            urlError.classList.add("show");
            actionBtn.textContent = "Next";
            actionBtn.disabled = false;
            titleText.textContent = "YouTube Downloader";
        }
    } // Second stage: Download
    else {
        const format = formatSelect.value;
        const quality = format === "video" ? qualitySelect.value : null;

        if (!format) {
            urlError.textContent = "Please select a format";
            urlError.classList.add("show");
            return;
        }

        if (format === "video" && !quality) {
            urlError.textContent = "Please select a quality";
            urlError.classList.add("show");
            return;
        }

        actionBtn.disabled = true;
        actionBtn.textContent = "Downloading...";
        urlError.classList.remove("show");

        try {
            // TODO: Replace with your actual API endpoint
            const response = await fetch("/api/download", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    url: url,
                    format: format,
                    quality: quality,
                }),
            });

            if (!response.ok) {
                throw new Error("Download failed");
            }

            // Handle the download
            const blob = await response.blob();
            const downloadUrl = window.URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = downloadUrl;
            a.download = titleText.textContent;
            document.body.appendChild(a);
            a.click();
            window.URL.revokeObjectURL(downloadUrl);
            a.remove();

            actionBtn.textContent = "Download Complete!";
            setTimeout(() => {
                // Reset form
                form.reset();
                clearThumbnail();
                formatSelect.disabled = true;
                qualitySelect.disabled = true;
                urlInput.disabled = false;
                actionBtn.textContent = "Next";
                actionBtn.disabled = false;
                videoDataLoaded = false;
                videoData = null;
                titleText.textContent = "YouTube Downloader";
            }, 2000);
        } catch (error) {
            console.error("Download error:", error);
            urlError.textContent = "Download failed. Please try again.";
            urlError.classList.add("show");
            actionBtn.textContent = "Download";
            actionBtn.disabled = false;
            titleText.textContent = "YouTube Downloader";
        }
    }
});

function extractVideoId(url) {
    const match = url.match(urlRegex);
    return match ? match[4] : null;
}

function clearThumbnail() {
    thumbnail.src = "";
    thumbnailContainer.classList.remove("has-image");
}
