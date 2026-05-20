# atlas-air
Vibe code exploration for a flight crew company product

Build an interactive iPad UI prototype for "Crew Central" — a unified digital 
portal for flight crew at Atlas Air.

CONCEPT: "Ready Before You Are"
The product shifts mode based on where the crew member is in their day. 
It anticipates, personalises, and adapts — without being asked.

VISUAL DIRECTION
- Dark UI — deep navy (#0A0F1E) base, near-black backgrounds
- Single amber accent (#E8A020) for primary actions and highlights
- Cyan (#00C2D1) for AI-related elements only
- Typography: large serif for headlines, clean sans-serif for UI data
- No gradients, no decorative elements, no drop shadows
- Every element earns its place

THREE MODES TO SHOW
1. Plan mode — pre-shift, hotel or crew room. Home screen assembled 
   before the crew member asks. Shows next flight, gate, weather, 
   crew briefing. Role-aware: "Captain, AA 204 · JFK → LAX"

2. Flight mode — active duty. Wake-Up screen. Full screen takeover. 
   Time large at top. Single amber CTA. Nothing else. 
   After confirmation — schedule, gate, crew surfaced immediately.

3. Rest mode — post-flight. Quiet, reduced UI. Next duty cycle 
   previewed. Rest window calculated automatically.

AI CO-PILOT LAYER
- A cyan-edged card that surfaces contextually — not triggered by the user
- Shows one insight: gate change, briefing update, or pattern-based suggestion
- Two pre-surfaced action pills below it
- Label: "Surfaced before you asked"

INTERACTIONS TO BUILD
- Mode switcher — Plan / Flight / Rest toggle at the top
- Wake-Up tap — confirm button triggers transition to schedule view
- AI card — appears after 2 seconds in Flight mode, dismissable
- Role switcher — Captain / Cabin Crew / New Joiner, home screen 
  adapts visibly for each

DEVICE FRAME
- iPad Pro form factor, portrait orientation
- Minimal device frame — focus is the screen, not the hardware

FEEL
Calm. Trusted. Immediate. 
This is a work tool for people who cannot afford friction. 
Every interaction should feel like it was designed for 3am.
