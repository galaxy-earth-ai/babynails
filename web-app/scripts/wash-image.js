
const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

/**
 * Product DNA Washer - Standard Workflow
 * Goal: WYSIWYG Subject Isolation (Nails Only)
 */
async function washImage(inputPath, outputFilename) {
    console.log(`🌌 Starting Product DNA Washing: ${inputPath}`);
    
    // Core prompt strategy defined during testing
    const prompt = `
        Subject Isolation Architecture: Identify ONLY the loose press-on nails from the provided image. 
        MASK OUT and DISCARD all packaging, display boxes, cardboard, paper, cards, text, logos, and background clutter. 
        RE-RENDER only the identified press-on nails as independent 3D objects. 
        Preserve their exact physical DNA: colors, 3D textures (bubbles, flowers, gems), and motifs with 100% accuracy. 
        ARRANGE the clean nails neatly on a plain, smooth minimalist beige silk backdrop. 
        Quality: natural soft-resin finish, semi-matte acrylic, soft studio lighting, 2K resolution.
        ZERO trace of original packaging or text allowed.
    `.replace(/\s+/g, ' ').trim();

    const command = `export GEMINI_API_KEY=${process.env.GEMINI_API_KEY} && python3 /home/galaxy/.openclaw/workspace/skills/nano-banana-pro/scripts/generate_image.py --prompt "${prompt}" --filename "${outputFilename}" --input-image "${inputPath}" --resolution 2K`;

    try {
        console.log("🚀 Executing Nano Banana Pro for strict replication...");
        execSync(command, { stdio: 'inherit' });
        console.log(`✅ Success: ${outputFilename}`);
    } catch (error) {
        console.error("❌ Error during rendering:", error.message);
    }
}

// Logic triggered by 'pdd wash [path]'
const args = process.argv.slice(2);
if (args[0] === 'wash' && args[1]) {
    const input = args[1];
    const output = `washed-${path.basename(input, path.extname(input))}-${Date.now()}.png`;
    washImage(input, output);
}
