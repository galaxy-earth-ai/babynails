## Context

The website is being pivoted from a generic "Artisan" project to a specific "Nail Salon" project. The design should feel luxurious, professional, and artistic.

## Goals / Non-Goals

**Goals:**
- Design a custom SVG logo representing the "Lumina Nails" brand.
- Create a soft, elegant UI using Tailwind CSS.
- Ensure the mobile view is optimized for quick service browsing.

**Non-Goals:**
- Functional booking backend (UI only for now).
- E-commerce integration.

## Decisions

- **Brand Name**: "LUMINA NAILS & ART".
- **Color Palette**: 
  - Primary: `#FDFBF7` (Cream Background)
  - Accent: `#B76E79` (Rose Gold)
  - Text: `#2D2D2D` (Soft Charcoal)
- **Typography**: `Playfair Display` (Serif) for headings to give a high-end fashion feel; `Inter` (Sans) for body text readability.
- **Logo Design**: A minimalist SVG logo featuring an abstract nail shape or a delicate line-art flower combined with modern typography.
- **Components**:
  - `Hero`: High-quality imagery (placeholder) + Logo + CTA.
  - `ServicesGrid`: Cards showing prices and descriptions.
  - `PortfolioGrid`: Masonry layout for design photos.

## Risks / Trade-offs

- [Risk] Light themes can sometimes feel "flat". → [Mitigation] Use subtle shadows, gradients, and Framer Motion transitions to add depth.
- [Risk] Image assets define the vibe. → [Mitigation] Use high-quality Unsplash placeholders that match the artistic nail theme.