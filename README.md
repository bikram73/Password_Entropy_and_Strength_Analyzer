# 🔐🗝️ Password Entropy and Strength Analyzer (SecurePass AI)

> 🔐 Futuristic password entropy and strength analyzer with real-time scoring, animated cyber visuals, and smart security guidance.

## ✨ Overview

SecurePass AI is a cybersecurity utility web app built to help users understand how strong a password really is.

It analyzes password quality in real time and shows:

- 🔢 Entropy score
- 🧠 Strength rating from Very Weak to Good Level
- ⏱️ Estimated crack time for online, offline, and GPU attacks
- ✅ Improvement suggestions based on weaknesses
- 📈 Live entropy growth graph while typing

The interface uses a cyber dashboard style with glassmorphism, neon glow effects, motion-based transitions, and a responsive layout for mobile, tablet, desktop, and ultra-wide screens.

## 🧩 Key Features

- ⚡ Real-time password analysis as the user types
- 🌈 Animated strength meter with dynamic color states
- 🎯 Entropy gauge with live counters
- ⏳ Crack-time estimation cards
- 🤖 AI-style suggestion engine
- 🌌 Floating particles, grid animation, and binary-rain background effects
- ✍️ Rotating hero message with typing animation
- 📱 Responsive dashboard sections for all device sizes

## 🛠️ Tech Stack

- ⚛️ React 19
- 🟦 TypeScript
- ⚡ Vite
- 🎨 Tailwind CSS v4
- 🎞️ Framer Motion
- ✨ GSAP
- 📊 Recharts
- 🔎 Lucide React Icons

## 📁 Project Structure

```text
src/
├── components/
│   ├── CrackTimeCard.tsx
│   ├── EntropyCard.tsx
│   ├── EntropyGraph.tsx
│   ├── PasswordInput.tsx
│   ├── StrengthMeter.tsx
│   └── SuggestionsPanel.tsx
├── pages/
│   └── Home.tsx
├── styles/
│   └── globals.css
├── utils/
│   ├── crackTimeEstimator.ts
│   ├── entropyCalculator.ts
│   └── passwordAnalyzer.ts
├── App.tsx
└── main.tsx
```

## 🚀 Getting Started

### 1) Install dependencies

```bash
npm install
```

### 2) Run the development server

```bash
npm run dev
```

### 3) Build for production

```bash
npm run build
```

### 4) Preview the production build

```bash
npm run preview
```

## 🔍 What It Checks

SecurePass AI evaluates:

- 🔤 Password length
- 🔠 Uppercase letters
- 🔡 Lowercase letters
- 🔢 Numbers
- ✨ Special characters
- 🔁 Repeated patterns
- 🧠 Common passwords
- 📚 Dictionary words
- ➡️ Sequential characters
- 📐 Entropy calculation

## 🧮 Scoring Model

The score is based on a rule system that rewards:

- Longer passwords
- Mixed character sets
- Higher entropy

And deducts points for:

- Common passwords
- Repeated characters
- Sequential patterns

## ⚙️ Entropy Formula

The app uses an approximation based on character pool size:

```text
Entropy = L × log2(R)
```

Where:

- `L` = password length
- `R` = character pool size

## ⏳ Crack Time Model

SecurePass AI estimates the time to crack a password in three scenarios:

- 🌐 Online attack
- 🛡️ Offline brute-force attack
- 🖥️ High-speed GPU attack

## 🎨 UI Highlights

- 🌑 Dark cyber-neon theme
- 🪟 Glassmorphism cards
- 💫 Glowing borders and shadows
- 📊 Animated progress bars
- 🛰️ Floating background particles
- ⌨️ Typing effect in the hero section
- 📱 Mobile-friendly stacked layout

## 🌐 Deploy to Netlify

This project is ready for Netlify deployment.

1. Push the repository to GitHub.
2. In Netlify, create a new site from Git.
3. Select this repository.
4. Netlify will use the included `netlify.toml` file.

Deployment settings:

- Build command: `npm run build`
- Publish directory: `dist`

The redirect rule ensures the single-page app works on refresh and direct links.

## 📌 Notes

- This app is for educational and defensive password analysis.
- No password is sent to a backend in the current version.
- Future upgrades can include password generation, breach checks, history storage, and theme toggles.

## 🤝 License

No license has been added yet. Add one if you want to open-source the project.
