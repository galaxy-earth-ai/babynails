## ADDED Requirements

### Requirement: Persistent Hand Image
The system SHALL store the uploaded hand image in the session context.

#### Scenario: Swap products
- **WHEN** user uploads a hand on Product A, then navigates to Product B
- **THEN** Product B's "Virtual Try-On" section SHALL automatically use the previously uploaded hand image.
