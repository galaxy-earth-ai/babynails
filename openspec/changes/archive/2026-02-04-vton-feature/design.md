## Context
The goal is to implement a Virtual Try-On (VTON) feature. We need to handle image uploads and provide a realistic preview of nails on the user's hand.

## Goals / Non-Goals

**Goals:**
- Allow users to upload a photo of their hand.
- Provide a high-fidelity "simulated" preview of products on that hand.
- Reuse the same hand photo across multiple products.
- Smooth transitions between "Original" and "VTON" views.

**Non-Goals:**
- Building a full server-side GPU inference engine (we will simulate this with a mock API/Agent-side logic for now, but architect for a real endpoint).
- Advanced 3D tracking (using 2D AI image stitching).

## Decisions

- **Image Storage**: Uploaded hand photos will be stored in a `userHandImage` Context variable. For the prototype, we will use a `Blob` URL.
- **VTON Architecture**:
    1.  `VtonProvider`: Manages the state of the uploaded hand and the "Processing" status.
    2.  `VtonModal`: A dedicated full-screen overlay for the try-on experience.
    3.  `MockVtonEngine`: A frontend service that simulates AI generation with a delay and reveals a pre-rendered or dynamically generated "stitched" image.
- **Optimization**: To save bandwidth and processing, once a hand is uploaded and "scanned", we only swap the nail layer/texture.
- **UI**: Use a "Scanning" laser-line effect (Framer Motion) during the simulated processing phase.

## Risks / Trade-offs

- **[Risk] Privacy** → Mitigation: Use local Blob URLs so the image never leaves the browser unless a real API call is made. Add a privacy disclaimer.
- **[Risk] Image Quality** → Mitigation: Provide clear instructions to the user on how to photograph their hand (good lighting, neutral background).
