const sharp = require('sharp');

// compress and convert to webp
async function optimizeImageToWebp(imageBuffer) {
    const optimizedImageBuffer = await sharp(imageBuffer)
        .resize({ width: 1080, withoutEnlargement: true, fit: 'inside' })
        .webp({ quality: 75 })
        .toBuffer()
    return optimizedImageBuffer;
};

// compress and convert to ogg
async function optimizeVoiceToOgg(audioBuffer) { };

// compress and convert to mp3
async function optimizeAudioToMp3(audioBuffer) { }

// compress document if possible
async function optimizeDocument(documentBuffer) { }

module.exports = {
    optimizeImageToWebp,
    optimizeVoiceToOgg,
    optimizeAudioToMp3,
    optimizeDocument
};