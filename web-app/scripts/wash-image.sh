#!/bin/bash

# wash-image.sh - Automated "Product DNA" cleaning pipeline
# Usage: ./scripts/wash-image.sh <input_image_path> <output_name>

INPUT_IMAGE=$1
OUTPUT_NAME=$2

if [[ -z "$INPUT_IMAGE" || -z "$OUTPUT_NAME" ]]; then
    echo "Usage: $0 <input_image_path> <output_name>"
    exit 1
fi

if [[ ! -f "$INPUT_IMAGE" ]]; then
    echo "Error: Input image $INPUT_IMAGE not found."
    exit 1
fi

echo "🌌 Starting DNA Extraction for $INPUT_IMAGE..."

# 1. Spawn a sub-agent to generate the prompt (using the successful pattern)
# We use a temp file to pass the result back
PROMPT_FILE=$(mktemp)

openclaw sessions spawn --label "dna-extractor" --model "google-gemini-cli/gemini-3-pro-preview" \
--task "[WYSIWYG RECONSTRUCTION] 
Analyze $INPUT_IMAGE with surgical precision. 
It is a set of press-on nails. 
1. Describe every unique detail (color, 3D texture, motifs) nail by nail. 
2. Create a prompt for Flux/Gemini that strictly replicates these 10 nails on a smooth minimalist beige silk background. 
3. Use quality modifiers: 'natural soft-resin', 'semi-matte acrylic', 'soft studio lighting'. 
4. Return ONLY the final prompt string." > "$PROMPT_FILE"

# Extract the prompt from the sub-agent output (assuming the last text part is the prompt)
# In a real environment, we'd wait for the announcement, but for a script, 
# we'll use a direct tool call if possible.
# Since I can't easily script 'wait for sub-agent', I'll do it sequentially in this turn.

# Actually, I'll write a Node.js script that handles the sequential tool calls.
