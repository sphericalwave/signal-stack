# Paste this into Claude Code to start the project

---

I'm building a crypto investing signal dashboard called **SignalStack**. I have a detailed
spec in `CLAUDE_CODE_BRIEF.md` — please read that file first before doing anything.

Here's what I'd like you to do in this first session:

1. Read `CLAUDE_CODE_BRIEF.md` fully
2. Scaffold the Vite + React + Tailwind + React Router project
3. Create `src/data/mockData.js` with realistic mock data for all indicators
   (at least 200 data points per time series so charts look good)
4. Build `src/components/ZScoreTable.jsx` — this is the most important component,
   spec is in the brief
5. Build `src/hooks/useZScore.js`
6. Build `src/components/Nav.jsx` with links to all 5 pages
7. Build `src/pages/Dashboard.jsx` with:
   - 4 composite signal cards at the top
   - The ZScoreTable showing all 15 indicators
   - A placeholder section for charts (we'll add Recharts next session)
8. Set up React Router in `App.jsx` with stub pages for OnChain, Macro, News, Altcoins
9. Add the GitHub Actions deploy workflow at `.github/workflows/deploy.yml`
10. Set up `vite.config.js` with `base: '/signal-stack/'`

Aesthetic: dark theme, terminal-inspired, monospaced font for numbers (use
JetBrains Mono from Google Fonts), DM Sans for UI text. Green for bullish,
coral/red for bearish, amber for neutral. Dense information layout.

After this session I'll run `npm run dev` to review, then we'll add the
Recharts charts in the next session.

---

**In future sessions, reference CLAUDE_CODE_BRIEF.md for the full spec.**
The brief also has the suggested build order (bottom of file) to guide
what to tackle each session.
