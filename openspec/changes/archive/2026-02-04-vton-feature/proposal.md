## Why
Users are often hesitant to purchase press-on nails because they cannot visualize how the color or shape will look on their specific hands. Providing a Virtual Try-On (VTON) feature allows users to upload a photo of their hand and see a realistic overlay of the product, significantly increasing confidence and conversion rates.

## What Changes
- New `VtonOverlay` component to handle hand image uploads and AI-generated overlays.
- Integration on the Product Detail Page (`/shop/[slug]`) to trigger "Try On".
- A "VTON Studio" mode where users can swap between different nail sets on the same uploaded hand photo without re-uploading (Resource Reuse).
- Loading states with "AI Scanning..." animations for a premium feel.

## Capabilities

### New Capabilities
- `vton-image-processing`: Logic to handle image upload, client-side preview, and simulated AI overlay generation.
- `vton-state-management`: Persistence of the uploaded hand photo across different product pages.

### Modified Capabilities
- `product-detail`: Add the "Virtual Try-On" entry point and UI integration.

## Impact
- New components: `VtonUploader`, `VtonPreview`, `ProcessingAnimation`.
- State: Global state (Context) to store the `userHandImage`.
- UI: Product detail page layout updates to accommodate the Vton modal/drawer.
