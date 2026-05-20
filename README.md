# atlas-air
Vibe code exploration for a flight crew company product

Build an interactive iPad UI prototype for "Crew Central" — a unified digital portal for flight crew at Atlas Air.

CONCEPT
"Ready Before You Are" — the UI shifts mode based on where the crew member is in their day. It anticipates and adapts without being asked.

THREE MODES
Build a mode switcher with three states. Each mode shows a distinct screen layout.

1. PLAN — pre-shift home screen
   Next flight card (flight number, gate, departure time)
   Destination weather (icon + temp)
   Crew roster (3–4 names, role badges)

2. FLIGHT — active duty screen
   Time displayed large, full width
   Single confirmation button — "I'm ready"
   On tap: transitions to schedule view with gate + crew

3. REST — post-flight screen
   Quiet, low-contrast UI
   Rest window shown (e.g. "8h 40m available")
   Next duty previewed in small type below

AI LAYER
One contextual card, always visible in Plan mode.
Two suggested actions below it. Dismissable.
Content is hardcoded — no real AI needed.

ROLE SWITCHER
Toggle between: Captain / First Officer / Cabin Crew
Changes the name, role badge, and roster view accordingly.

─────────────────────────────────────────
TECHNICAL CONSTRAINTS
- Target viewport: 834 × 1194px (iPad Pro portrait), centered in browser
- All data is mocked — no real APIs, no backend
- AI card content is hardcoded, not generated
- Use realistic placeholder content: Atlas Air flight numbers, real IATA codes
- All interactions handled in the browser, no build step required
