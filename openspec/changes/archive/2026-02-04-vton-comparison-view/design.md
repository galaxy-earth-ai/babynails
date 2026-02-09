## Context
The current VTON feature shows one product at a time. We need a way to show two.

## Goals / Non-Goals

**Goals:**
- Implement a "Split Screen" view in the VTON Studio.
- Allow the user to pick any other product from the catalog to compare.
- Maintain smooth transitions between Single and Compare modes.

**Non-Goals:**
- Synchronized multi-hand tracking (using the same hand photo).

## Decisions

- **UI Layout**: Use a 50/50 split-screen view when "Compare Mode" is active. Each half shows the same base hand image but with different nail overlays.
- **Comparison Slider**: Implement a "Drag Slider" (using `framer-motion`) that allows the user to slide a vertical line to reveal more of Product A or Product B. This is more "Artistic" and interactive than a simple split.
- **Selector**: A horizontal scrolling list of product thumbnails at the bottom of the modal to select the comparison target.

## Risks / Trade-offs

- **[Risk] Screen Real Estate** → Mitigation: Hide extra labels and context when Compare Mode is active to focus on the images.
