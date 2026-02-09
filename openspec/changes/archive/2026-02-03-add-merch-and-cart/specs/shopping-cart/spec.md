## ADDED Requirements

### Requirement: Persist Cart State
The system SHALL persist the shopping cart state in the browser's local storage.

#### Scenario: Refresh page
- **WHEN** user adds an item to the cart and refreshes the page
- **THEN** system restores the cart items from local storage.

### Requirement: View Cart Summary
The system SHALL display a cart drawer or page showing the current items, quantities, and total price.

#### Scenario: Open cart
- **WHEN** user clicks the cart icon
- **THEN** system shows the list of items in the cart with their respective subtotal and the grand total.

### Requirement: Modify Cart
The user SHALL be able to increase, decrease, or remove items from the cart.

#### Scenario: Increase quantity
- **WHEN** user clicks the "+" button on a cart item
- **THEN** system increases the quantity and updates the totals.
