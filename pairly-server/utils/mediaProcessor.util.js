const sharp = require('sharp');
const ffmpeg = require('fluent-ffmpeg');
const { PassThrough } = require('node:stream');

/**
 * Converts image buffer to optimized WebP.
 * Profile → smaller avatar size, higher quality.
 * Chat → larger display size, balanced compression.
 */
async function optimizeImageToWebp(imageBuffer, type = "chat") {

    const config = {
        profile: {
            width: 512,     // Perfect for avatars
            quality: 80
        },
        chat: {
            width: 1280,    // Enough for chat images
            quality: 65
        }
    };

    const { width, quality } = config[type] || config.chat;

    const optimizedImageBuffer = await sharp(imageBuffer)
        .rotate() // auto-fix mobile orientation
        .resize({
            width,
            withoutEnlargement: true,
            fit: "inside"
        })
        .webp({
            quality,
            effort: 4   // better compression balance
        })
        .toBuffer();

    return optimizedImageBuffer;
}

/**
 * Optimizes audio buffer for chat system.
 * Voice → OGG (Opus, low bitrate, mono).
 * Music → MP3 (higher bitrate, stereo).
 */
async function optimizeVoiceOrMusicToOggAndMp3(audioBuffer, type = "voice") {

    const config = {
        voice: {
            format: "ogg",
            bitrate: "32k",
            channels: 1,
            audioCodec: "libopus",
            audioFrequency: 16000,
            extraOptions: ["-application", "voip"]
        },
        music: {
            format: "mp3",
            bitrate: "128k",
            channels: 2,
            audioCodec: "libmp3lame",
            audioFrequency: 44100,
            extraOptions: [] // no opus flags here
        }
    };

    const settings = config[type] || config.voice;

    return new Promise((resolve, reject) => {

        const inputStream = new PassThrough();
        inputStream.end(audioBuffer);

        const outputStream = new PassThrough();
        const chunks = [];

        outputStream.on("data", chunk => chunks.push(chunk));
        outputStream.on("end", () => resolve(Buffer.concat(chunks)));
        outputStream.on("error", reject);

        let command = ffmpeg(inputStream)
            .format(settings.format)
            .audioCodec(settings.audioCodec)
            .audioBitrate(settings.bitrate)
            .audioChannels(settings.channels)
            .audioFrequency(settings.audioFrequency)
            .on("error", reject);

        if (settings.extraOptions.length) {
            command = command.outputOptions(settings.extraOptions);
        }

        command.pipe(outputStream, { end: true });
    });
}

// compress and convert to mp4
async function optimizeVideoToMp4(videoBuffer) {

}

module.exports = {
    optimizeImageToWebp,
    optimizeVoiceOrMusicToOggAndMp3,
    optimizeVideoToMp4,
};