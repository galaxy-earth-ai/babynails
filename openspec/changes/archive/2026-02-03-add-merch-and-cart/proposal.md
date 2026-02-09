## Why
BabyNails currently lacks a way for users to directly purchase physical products. Adding a merchandise page for press-on nails (穿戴甲) and a shopping cart will enable direct revenue generation and expand the brand's footprint into physical goods.

## What Changes
- New "Merchandise" page showcasing press-on nail designs.
- Shopping cart functionality to manage selected items.
- Checkout flow (placeholder or simple implementation).
- Navigation update to include the new "Shop" link.

## Capabilities

### New Capabilities
- `merchandise-gallery`: A grid view of available press-on nails with filtering/sorting.
- `shopping-cart`: A persistent cart to store items across the session.
- `product-detail`: Detailed view for each nail set with options (size, shape).

### Modified Capabilities
- `navigation`: Update the main nav to include the Shop link.

## Impact
- New routes: `/shop`, `/cart`.
- New components: `ProductCard`, `CartDrawer`, `CartItem`.
- State management: Local storage or React Context for cart state.
