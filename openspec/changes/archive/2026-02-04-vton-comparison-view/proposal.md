## Why
Users often struggle to decide between two favorite styles. Providing a side-by-side comparison mode in the VTON Studio allows them to visualize both options simultaneously on their own hand, speeding up the decision-making process and increasing order value (they might buy both!).

## What Changes
- New "Compare Mode" toggle in the `VtonModal`.
- Split-screen UI showing two different nail overlays on the same user hand photo.
- Product selector within the modal to choose the "Compare Against" product.
- Responsive handling for side-by-side view on mobile (vertical split or slider).

## Capabilities

### New Capabilities
- `vton-comparison-ui`: Logic and UI components for rendering two overlays side-by-side.
- `vton-product-selection`: A mini-gallery within the VTON Studio to pick a second product for comparison.

### Modified Capabilities
- `vton-image-processing`: Extend to support rendering two separate result layers.

## Impact
- `VtonModal.tsx` updates.
- New `ComparisonSlider` component (optional, or just simple split).
- Enhanced VTON state to track `compareProductId`.
