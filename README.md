# SecurePass AI

SecurePass AI is a futuristic cybersecurity utility web app that analyzes password strength in real time.

It calculates:

- Entropy score using $Entropy = L \times \log_2(R)$
- Password strength score (0 to 100)
- Crack time estimates for online, offline, and GPU attack models
- Actionable suggestions and AI-style guidance

## Features

- Real-time password analysis while typing
- Strength tiers: Very Weak, Weak, Moderate, Strong, Very Strong, God Level
- Animated gradient strength meter with glow effects
- Entropy card with circular gauge and animated counters
- Crack-time dashboard for three attack scenarios
- Suggestion panel with pass/fail checklist and security warnings
- Live entropy graph that grows with each typed character
- Cyber neon UI with glassmorphism, particle background, and responsive layout

## Tech Stack

- React + TypeScript + Vite
- Tailwind CSS (v4)
- Framer Motion
- GSAP
- Recharts
- Lucide React icons

## Project Structure

src/

- components/
  - PasswordInput.tsx
  - StrengthMeter.tsx
  - EntropyCard.tsx
  - CrackTimeCard.tsx
  - SuggestionsPanel.tsx
  - EntropyGraph.tsx
- pages/
  - Home.tsx
- utils/
  - entropyCalculator.ts
  - passwordAnalyzer.ts
  - crackTimeEstimator.ts
- styles/
  - globals.css

## Getting Started

1. Install dependencies:

```bash
npm install
```

2. Start development server:

```bash
npm run dev
```

3. Build production bundle:

```bash
npm run build
```

4. Preview production build:

```bash
npm run preview
```

## Notes

- This app is for password quality analysis and educational guidance.
- It does not send passwords to a server in the current implementation.
- Future enhancements can include breach API checks, generator mode, theme toggle, and password history.
