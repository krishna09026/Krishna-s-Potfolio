<<<<<<< HEAD
# Krishna Parmar Soni — Portfolio

A responsive portfolio built with plain HTML, CSS and JavaScript.

## Included
- Modern dark/cyan design inspired by the original portfolio
- Responsive navigation
- About, journey, projects, skills and contact sections
- Interactive AI Career Analyst section
- Local answer analysis that works on static hosting
- Optional `/api/analyze` hook for a real LLM backend

## Run locally
Open `index.html` directly, or use VS Code Live Server.

## Real AI integration
The frontend sends a POST request to `/api/analyze` when that endpoint exists. Keep any AI provider API key on the server — never place a secret API key in `script.js` or browser code.

Expected request:
```json
{"question":"...","answer":"..."}
```
Expected response:
```json
{"focus":"...","feedback":"..."}
```
=======
# Krishna-s-Potfolio
>>>>>>> 6f0fdf5953a7165e894459b9271a63abb0b1c030
