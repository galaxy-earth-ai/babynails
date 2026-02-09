# Project Roadmap: BabyNails AI Studio v1.0

**Author:** Kai (Project Manager)
**Date:** 2026-02-04
**Reference:** Market Requirements Document (Aria, v1.0)
**Goal:** Launch a disruptive, AI-driven custom press-on nail platform by Q4 2026.

---

## 1. Execution Strategy
Our strategy is to validate the digital experience first (Phase 1), solve the physical production complexity second (Phase 2), and finally integrate the proprietary scanning technology for the full consumer launch (Phase 3).

## 2. Phased Execution Plan

### Phase 1: The Digital Studio (Q1 - Q2 2026)
**Focus:** Visual Validation & Demand Generation.
*Prove that users want these designs on their hands before we manufacture a single nail.*

*   **Virtual Try-On (VTON) Prototype:**
    *   [x] Initial AI Stitched VTON Pipeline (Gemini Vision + Node.js)
    *   [ ] Real-time WebAR overlay for hands (MediaPipe + Three.js)
    *   [ ] Lighting estimation and skin tone adjustment.
*   **Style Library "The 2026 Collection":**
    *   [x] Trend Drop v1 specs: "Cloud Dancer", "Mocha Era", "Fog Blue Aura", "Burgundy Velvet"
    *   [ ] Generate high-res diffuse/normal maps for the 2026 collection.
    *   [ ] Implement "Aura/Halo" procedural generation.
*   **Web MVP (Waitlist & Pre-orders):**
    *   [x] Basic Next.js infrastructure and DB connection.
    *   [ ] Landing page showcasing "Refined Maximalism".
    *   [ ] Waitlist/Pre-order capture mechanism.

### Phase 2: The Physical Bridge (Q2 - Q3 2026)
**Focus:** Manufacturing Feasibility & Prototyping.
*Bridge the gap between digital pixels and physical resin.*

*   **Manufacturing Prototype:**
    *   [ ] Industrial UV printing partner selection.
    *   [ ] Material durability testing (scratch resistance).
*   **Printing Integration:**
    *   [ ] Develop the "Clean-Print" pipeline (Digital Asset -> G-code/Print Mask).
    *   [ ] Solve 3D "Micro-Charm" printing via layered UV varnish.
*   **Alpha Batch Testing:**
    *   [ ] Produce 50 seed kits for testing.

### Phase 3: The App (Q3 - Q4 2026)
**Focus:** The "Perfect Fit" & Market Launch.
*Solve the industry's biggest pain point: Sizing.*

*   **Mobile Scanning App (iOS/Android):**
    *   [x] **HandScan AI PoC**: Initial scale calibration and width measurement (Gemini-driven).
    *   [ ] **C-Curve Regression Model**: Precise curvature extraction from side-profile/multi-view.
    *   [ ] **Size Mapping Algorithm**: Translation to manufacturing specs.
*   **Virtual Mirror Integration:**
    *   [ ] Full app integration of High-Fidelity VTON.
*   **Beta Launch:**
    *   [ ] End-to-end test (Scan -> Order -> Print -> Deliver).

---

## 3. Key Milestones (2026 Launch)

| Date | Milestone | Deliverable |
| :--- | :--- | :--- |
| **Mar 15** | **Digital Alpha** | Web VTON live with 5 core designs ("Cloud Dancer", "Mocha"). |
| **May 01** | **The Print Test** | First physical prototype that matches the digital render >95%. |
| **Jul 01** | **Scan Core v1** | HandScan algorithm achieving <0.5mm accuracy variance. |
| **Sep 15** | **Beta App Release** | TestFlight release to 500 users. |
| **Nov 01** | **Public Launch** | "The 2026 Holiday Drop" (Full store open). |

---

## 4. Risk Assessment

### Technical Risks
*   **Scan Accuracy:** If HandScan AI fails to capture curvature accurately (flat vs. curved nail beds), the "Perfect Fit" USP is invalidated.
    *   *Mitigation:* Fallback plan to offer "Sample Sizing Kits" (physical) if scanning is <90% reliable initially.
*   **Print Fidelity:** High-res printing on small, curved surfaces is notoriously difficult (distortion at edges).
    *   *Mitigation:* Partner with specialized pad-printing or 5-axis inkjet vendors early in Phase 2.

### Market Risks
*   **Trend Velocity:** The 2026 "Refined Maximalism" trend may shift before launch.
    *   *Mitigation:* Build the Style Library as a modular asset system, allowing 24-hour turnaround on new design uploads.
*   **Competitor Response:** Ersa or Luna Lab may adopt generic scanning tools.
    *   *Mitigation:* Focus brand narrative on the *integration* of art + fit, not just the tech.

---
**Status:** Ready for Review
