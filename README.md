# Self-hosted-YouTube-downloader

[![Python](https://img.shields.io/badge/python-3.13.9-blue)](https://www.python.org/)
[![Flask](https://img.shields.io/badge/flask-✓-green)](https://flask.palletsprojects.com/)
[![yt-dlp](https://img.shields.io/badge/yt--dlp-✓-orange)](https://github.com/yt-dlp/yt-dlp)

A simple, self-hostable YouTube downloader built with Flask and Python. Run your
own instance to download videos or audio directly from a clean web interface—no
ads, no limits.

## Features

- Download YouTube **videos** in **MP4**
- Download YouTube **audio** in **MP3**
- Select video quality
- Completely self-hosted
- Lightweight and easy to set up

## Requirements

- Python 3.13.9
- [yt-dlp](https://github.com/yt-dlp/yt-dlp)
- Flask
- FFmpeg

**FFmpeg setup:**

- **Windows:** Download FFmpeg binaries and place them in a folder named
  `ffmpeg` in the project root.
- **Linux:** Ensure FFmpeg is installed via your package manager and accessible
  in `/usr/bin`.

## Installation

Clone the repository:

```bash
git clone https://github.com/Mstr0A/Self-hosted-YouTube-downloader.git
cd Self-hosted-YouTube-downloader
```

Install dependencies:

```bash
pip install -r requirements.txt
```

**Optional (recommended):** Install
[UV (Astral UV)](https://pypi.org/project/uv/) for a simpler, faster way to run
the app:

```bash
pip install uv
```

## Running the App

**Recommended (using UV):**

```bash
uv run main.py
```

**Alternative (standard Python):**

```bash
python main.py
```

- Runs on `0.0.0.0:5005` by default
- Starts in **debug mode**

## Usage

1. Open your browser and navigate to `http://127.0.0.1:5005` (or your server IP
   if self-hosted).
2. Enter the YouTube video URL.
3. Select download type (**Video** or **Audio**) and quality.
4. Click **Download** and wait for the file to be ready.

![The UI](/images/UI.png)

## Warnings & Disclaimers

- This project is for **personal use only**.
- Be aware of **YouTube's Terms of Service**. Downloading copyrighted content
  without permission may violate local laws.

## License

No license. Use at your own risk.
