const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const imagesDir = path.join(__dirname, 'public', 'images');
const outputDir = path.join(__dirname, 'public', 'images', 'optimized');

// Create output directory if it doesn't exist
if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
}

// Images to compress
const imagesToCompress = [
    'banner1.png',
    'banner1-mobile.png',
    'banner1-mobile2.png',
    'banner2.png',
    'banner2mobile.png',
    'hero-fallback.jpg',
    'placeholder.jpg',
];

async function compressImages() {
    console.log('🖼️  Starting image compression...\n');

    for (const filename of imagesToCompress) {
        const inputPath = path.join(imagesDir, filename);

        if (!fs.existsSync(inputPath)) {
            console.log(`⚠️  Skipping ${filename} (not found)`);
            continue;
        }

        const outputFilename = filename.replace(/\.(png|jpg|jpeg)$/i, '.webp');
        const outputPath = path.join(outputDir, outputFilename);

        try {
            const inputStats = fs.statSync(inputPath);
            const inputSizeMB = (inputStats.size / 1024 / 1024).toFixed(2);

            await sharp(inputPath)
                .webp({ quality: 85, effort: 6 })
                .toFile(outputPath);

            const outputStats = fs.statSync(outputPath);
            const outputSizeMB = (outputStats.size / 1024 / 1024).toFixed(2);
            const reduction = ((1 - outputStats.size / inputStats.size) * 100).toFixed(1);

            console.log(`✅ ${filename}`);
            console.log(`   ${inputSizeMB} MB → ${outputSizeMB} MB (${reduction}% reduction)`);
            console.log(`   Saved to: optimized/${outputFilename}\n`);
        } catch (error) {
            console.error(`❌ Error compressing ${filename}:`, error.message);
        }
    }

    console.log('✨ Compression complete!');
    console.log('\n📊 Summary:');
    console.log('   Optimized images are in: public/images/optimized/');
    console.log('   Next steps:');
    console.log('   1. Review the optimized images');
    console.log('   2. Replace original images with optimized versions');
    console.log('   3. Update image references to use .webp extension');
}

compressImages().catch(console.error);
