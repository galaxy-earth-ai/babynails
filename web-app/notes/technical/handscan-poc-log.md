# HandScan AI Proof-of-Concept Log

## Sprint 1: Initial Research and Implementation

### Goal
Research and implement initial image-to-measurement logic using Gemini Vision. Focus on mapping the 3D curvature (C-curve) and width of the nail bed from a smartphone image with a reference object.

### Reference Object
Standard credit card or ID (85.6mm x 53.98mm) will be used as the primary reference object to establish scale.

### Technical Strategy
1.  **Reference Object Detection:** Identify the reference object and calculate the pixel-to-millimeter ratio.
2.  **Hand/Nail Segmentation:** Detect the hand and individual fingernails.
3.  **Keypoint Identification:** Locate the sides of the nail bed (lateral folds) and the tip.
4.  **Width Measurement:** Calculate the Euclidean distance between lateral folds.
5.  **C-Curve Estimation:** Map the curvature. Since 2D images lack depth, C-curve estimation will likely require a side-angle view or a multi-view approach, or a projection model based on the visible nail width vs. nail surface area.

### Gemini Vision Prompting Strategy
Using Gemini's ability to output structured data (JSON) and identify bounding boxes/coordinates.

#### Sample Prompt for Gemini
"Analyze the attached image. There is a hand and a credit card. 
1. Identify the credit card and provide its bounding box.
2. For the index fingernail, identify the left lateral fold, right lateral fold, and the highest point of the nail tip. Provide coordinates for these three points.
3. Output the results in JSON format."

### Initial Findings
- Gemini Vision is capable of returning coordinate data.
- Pixel-to-metric conversion is straightforward once the reference object scale is established.
- 3D curvature (C-curve) estimation from a single 2D top-down image is a known challenge. Possible solutions:
    - User takes two photos: one top-down, one from the tip (horizontal).
    - Mathematical approximation based on "perceived width" vs "surface width" (if identifiable).

### POC Implementation (Route)
Implemented initial API route at `src/app/api/handscan/route.ts` to simulate the Gemini-driven measurement logic.

### 3D C-Curve Mapping Strategy
The 3D curvature of a nail (C-curve) is typically measured as the ratio of the arc length of the nail surface to the straight-line width of the nail bed.

**Formula:** `C-Curve (%) = (Arc Length - Width) / Width * 100`

For Sprint 1, we are using a **Projection Mapping** approach:
1.  Assume a semi-elliptical cross-section for the nail.
2.  Use the perceived width from a top-down view.
3.  Combine with a secondary "profile" or "tip-on" image to calculate height/depth.
4.  If only a single image is available, Gemini will be tasked with estimating the "shadowing" or "highlight roll-off" on the nail edges to infer depth.

### Next Steps for Sprint 1
- Refine Gemini prompt to specifically ask for "normalized coordinates" [0-1000].
- Implement a client-side "Reference Object Overlay" to guide users (Credit Card placement).
- Research depth-estimation models that can run alongside Gemini.

