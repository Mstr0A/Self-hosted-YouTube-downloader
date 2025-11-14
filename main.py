import os
import yt_dlp
import shutil
import pathlib
import tempfile
from typing import Any
from flask import Flask, render_template, request, send_file, after_this_request

app = Flask(__name__)

if os.name == "nt":
    # windows users need to add the binaries manually
    ffmpeg_path = pathlib.Path.cwd() / "ffmpeg"
else:
    # linux users can just use their package manager
    ffmpeg_path = pathlib.Path("/usr/bin")


@app.route("/")
def root():
    return render_template("index.html")


@app.route("/api/video-info", methods=["POST"])
def info():
    data: dict[str, Any] = request.json
    url = data.get("url")

    return yt_dlp.YoutubeDL(
        {
            "quiet": True,
            "noplaylist": True,
            "remote_components": ["ejs:github"],
            "ffmpeg_location": ffmpeg_path,
        }
    ).extract_info(url, False)


def download_video(
    url_list: list[str],
    format_type: str,
    quality: str,
):
    # Create temporary directory
    temp_dir = tempfile.mkdtemp()

    try:
        if format_type == "audio":
            opts = {
                "format": "bestaudio/best",
                "quiet": True,
                "outtmpl": os.path.join(temp_dir, "%(title)s.%(ext)s"),
                "noplaylist": True,
                "ffmpeg_location": ffmpeg_path,
                "remote_components": ["ejs:github"],
                "postprocessors": [
                    {
                        "key": "FFmpegExtractAudio",
                        "preferredcodec": "mp3",
                        "preferredquality": "192",
                    }
                ],
            }
        else:  # video
            opts = {
                "format": quality,
                "quiet": True,
                "outtmpl": os.path.join(temp_dir, "%(title)s.%(ext)s"),
                "noplaylist": True,
                "ffmpeg_location": ffmpeg_path,
                "remote_components": ["ejs:github"],
            }

        with yt_dlp.YoutubeDL(opts) as ydl:
            info = ydl.extract_info(url_list[0], download=True)
            filename = ydl.prepare_filename(info)

            # For audio, the file gets converted to .mp3
            if format_type == "audio":
                filename = os.path.splitext(filename)[0] + ".mp3"

        return filename, temp_dir

    except Exception as e:
        # Cleanup on error
        shutil.rmtree(temp_dir, ignore_errors=True)
        raise e


@app.route("/api/download", methods=["POST"])
def download():
    url = request.json.get("url")
    format_type = request.json.get("format")
    quality = request.json.get("quality", "best")

    # Download to temp directory
    filename, temp_dir = download_video(
        url_list=[url], format_type=format_type, quality=quality
    )

    # Cleanup after sending the file
    @after_this_request
    def cleanup(response):
        try:
            shutil.rmtree(temp_dir, ignore_errors=True)
        except Exception as e:
            print(f"Cleanup error: {e}")
        return response

    return send_file(
        filename, as_attachment=True, download_name=os.path.basename(filename)
    )


if __name__ == "__main__":
    app.run("0.0.0.0", 5005, debug=True)
