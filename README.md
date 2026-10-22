# Digital Intelligence (v2) — Strategic AI Experience Gateway

[![React](https://img.shields.io/badge/React-18.2.0-blue?logo=react)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue?logo=typescript)](https://www.typescriptlang.org/)
[![Google Gemini API](https://img.shields.io/badge/Google_Gemini-GenAI_SDK-orange?logo=google)](https://ai.google.dev/)
[![Three.js](https://img.shields.io/badge/Three.js-3D_Visualizations-black?logo=three.js)](https://threejs.org/)
[![D3.js](https://img.shields.io/badge/D3.js-Geospatial_Globe-orange?logo=d3.js)](https://d3js.org/)
[![TailwindCSS](https://img.shields.io/badge/TailwindCSS-v3_CDN-38bdf8?logo=tailwindcss)](https://tailwindcss.com/)

A state-of-the-art interactive digital intelligence platform and executive dashboard built with **React**, **TypeScript**, **Three.js**, **D3.js**, and **Google Gemini Multimodal AI**. It combines immersive 3D spatial visualizations, real-time global intelligence telemetry, and multi-modal generative AI capabilities (conversational streaming, generative imagery, and real-time bidirectional voice using Gemini Live).

---

## 🌟 Key Features

### 1. 🌐 Interactive 3D Geospatial Intelligence Globe
- Dynamic, canvas-accelerated interactive globe built with **D3.js** and **TopoJSON**.
- Real-time rotating projection with customizable coordinates, telemetry markers, and reactive camera rotation.
- Visual indicators for global digital intelligence nodes and regional alignment data.

### 2. 🌌 Procedural 3D Abstract Layers (Three.js)
- Multi-dimensional procedural data visualization powered by **Three.js**.
- Interactive particle geometries, neural lattices, and scroll-linked spatial camera transforms.
- Smooth transitions between macro-level architecture views and microscopic data nodes.

### 3. 🎙️ Gemini Live Multimodal Voice Interaction
- Real-time bidirectional voice conversations with Google Gemini using the `@google/genai` Live API.
- Low-latency client-side audio streaming via Web Audio API with PCM float32 encoding and base64 chunk decoding.
- Audio activity indicators, waveform feedback, and automated voice configuration (`Zephyr` voice preset).

### 4. 💬 Streaming AI Chat & Multimodal Reasoning
- Conversational interface supporting markdown rendering (`react-markdown`) with syntax highlighting.
- Vision/image upload inspection: attach screenshots, diagrams, and media for contextual analysis.
- Instant token streaming with cancellation and state preservation.

### 5. 🎨 Generative Vision Synthesis (`ImageView`)
- Integrated creative generation powered by Google's generative image models.
- Aspect ratio controls, sample prompts, and real-time generation previews.

### 6. 📊 Strategic Alignment & Executive Insights
- **Business Ecosystem Matrix**: Comprehensive visualization of business capabilities, friction vectors, and technological investments.
- **Strategic Alignment Modals**: Executive alerts covering architectural drift, execution constraints, and automated strategic mitigation paths.
- **Real-time Insights Counter & Telemetry**: Dynamic KPI counters and automated insight generators powered by Gemini reasoning.

---

## 🛠️ Technology Stack

| Domain | Technology / Library | Version | Description |
|---|---|---|---|
| **Core Framework** | React | `^18.2.0` | Modern component architecture with hooks |
| **Language** | TypeScript | `^5.x` | Strict static typing and modern syntax |
| **Build Tooling** | Create React App / `react-scripts` | `^5.0.1` | Webpack 5 development and production bundle pipelines |
| **3D Graphics** | Three.js | `^0.182.0` | Interactive 3D scenes, shaders, and geometry rendering |
| **Geospatial / Data** | D3.js & TopoJSON | `^7.9.0` / `^3.1.0` | Geospatial projections, geo-path math, and globe mechanics |
| **AI SDK** | `@google/genai` | `^1.38.0` | Google Gemini 2.0 / 1.5 SDK (Chat, Live API, Imagen, Text) |
| **Markdown** | `react-markdown` | `^9.0.0` | Rich text and code formatting in assistant responses |
| **Iconography** | Lucide React | `^0.563.0` | Clean, modern feather-style iconography |
| **Styling & Theme** | Tailwind CSS & Google Fonts | Orbitron & Inter | Cyberpunk / Glassmorphic dark nebula aesthetic |

---

## 🚀 Getting Started

### Prerequisites

Ensure you have **Node.js** (v18.x or v20.x LTS recommended) and **npm** installed on your system:
```bash
node -v   # Should be >= 18.0.0
npm -v    # Should be >= 9.0.0
```

### Installation

1. **Clone or navigate to the repository directory:**
   ```bash
   git clone https://github.com/<your-username>/<your-repo-name>.git
   cd digital_intelligence_v2-main
   ```

2. **Install all dependencies:**
   ```bash
   npm install --legacy-peer-deps
   ```

3. **Configure Environment Variables (Optional):**
   Create a `.env` file in the root directory to supply your Gemini API key:
   ```env
   VITE_API_KEY=your_gemini_api_key_here
   # Or for Create React App:
   REACT_APP_GEMINI_API_KEY=your_gemini_api_key_here
   ```
   *(A fallback demo key is bundled in `src/geminiService.ts` for rapid evaluation).*

4. **Launch the development server:**
   ```bash
   npm start
   ```
   Open [http://localhost:3000](http://localhost:3000) in your browser to view the application.

5. **Build for Production:**
   ```bash
   npm run build
   ```
   This generates an optimized production bundle in the `build/` folder.

---

## 📂 Project Structure

```text
├── public/
│   ├── index.html           # HTML5 gateway entry with Tailwind CDN, Google Fonts, and animations
│   ├── favicon.ico
│   └── manifest.json
├── src/
│   ├── components/
│   │   ├── AbstractLayers.tsx    # Three.js 3D layered neural mesh & visualization
│   │   ├── BusinessEcosystem.tsx # Business capability matrix and investment map
│   │   ├── ChatView.tsx          # Gemini Chat with markdown and multimodal upload
│   │   ├── Globe.tsx             # D3.js interactive 3D rotating globe
│   │   ├── ImageView.tsx         # Generative AI image synthesis portal
│   │   ├── InsightsCounter.tsx   # Live insight counters and animated metrics
│   │   ├── LandingView.tsx       # Landing hero section with globe integration
│   │   ├── LiveView.tsx          # Real-time Web Audio PCM voice interaction (Gemini Live)
│   │   ├── Sidebar.tsx           # Futuristic navigational sidebar
│   │   ├── TrendsView.tsx        # Strategic industry trends and insights
│   │   └── UIOverlay.tsx         # Heads-up display, floating navigation, and search
│   ├── audioUtils.ts        # Float32 PCM audio conversion & decoding for Gemini Live
│   ├── constants.ts         # Gemini model IDs and default configs
│   ├── geminiService.ts     # Central Google GenAI SDK integration client
│   ├── types.ts             # TypeScript definitions and data interfaces
│   ├── App.tsx              # Core app container, scroll triggers, and modal manager
│   └── index.tsx            # React root mount point
├── package.json             # Project dependencies and npm scripts
├── tsconfig.json            # TypeScript compiler configuration
└── README.md                # Project documentation
```

---

## 📜 Available Scripts

- `npm start`: Starts the local development server at `http://localhost:3000` with hot-reloading.
- `npm run build`: Compiles production-ready minified bundles into the `build/` directory.
- `npm test`: Executes the test runner in interactive watch mode.
- `npm run eject`: Ejects from Create React App configuration (one-way operation).

---

## 📄 License

This project is licensed under the MIT License — see the repository license details for more information.
