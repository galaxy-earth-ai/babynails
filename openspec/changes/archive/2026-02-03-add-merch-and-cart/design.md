## Context
BabyNails is a Next.js App Router project using Tailwind CSS. We are adding e-commerce capabilities. The current site focuses on services and branding, and this change extends it to physical product sales.

## Goals / Non-Goals

**Goals:**
- Implement a high-aesthetic product gallery for press-on nails (Merchandise).
- Implement a persistent, client-side shopping cart.
- Ensure the shop UI aligns with the "BabyNails" Soft/Pastel Luxury aesthetic.
- Navigation integration for the new shop.

**Non-Goals:**
- Server-side database integration (using local storage for now).
- Real payment gateway integration (Stripe/PayPal) - will use a "Contact to Buy" or simulated checkout for this phase.
- User accounts or login systems.

## Decisions

- **Framework**: Next.js App Router. New routes at `/shop` and `/cart`.
- **State Management**: React Context (`CartContext`) for managing cart items, counts, and totals.
- **Persistence**: `localStorage` hook to sync the cart state.
- **Styling**: Tailwind CSS + Framer Motion for product reveal animations and a sliding cart drawer.
- **Iconography**: Lucide React for cart and shopping icons.
- **Product Data**: Static array in `src/lib/products.ts`.

## Risks / Trade-offs

- **[Risk] State Loss** → Mitigation: Use `useEffect` and `localStorage` to ensure the cart survives page refreshes.
- **[Risk] Mobile UX** → Mitigation: Use a drawer-based cart for mobile to save screen real estate.
