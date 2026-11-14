# SupeRR Selector Season 2 — Cricket Analytics Platform

> **Project Title:** Identify the Most Reliable Players Under Pressure  
> **Competition:** SupeRR Selector Season 2  
> **Stack:** Python (Flask, Pandas, NumPy) + Responsive Web Dashboard (HTML5, Tailwind CSS, Chart.js)

---

## Complete Project Folder Structure

```text
cricket dashboard/
├── backend/
│   ├── app.py                            # Flask server and REST API endpoints
│   ├── analytics.py                      # BRS, PRS, and Match Pressure Index formulas
│   ├── data_loader.py                    # Data ingestion, tagging, and Bayesian shrinkage
│   └── requirements.txt                  # Python dependencies (flask, flask-cors, pandas, numpy)
├── data/
│   ├── raw/                              # Original competition datasets
│   │   ├── teams.csv                     # 354 team entries
│   │   ├── matches.csv                   # 883 matches (IPL 2022-2024 & T20Is)
│   │   ├── playing_eleven.csv            # 28,382 match appearance records
│   │   └── competition_team_player_mapping.csv # 6,413 player tournament mappings
│   └── processed/                        # Pre-aggregated datasets for sub-millisecond responses
│       ├── dashboard_stats.json          # KPI summary data
│       ├── batters_reliability.json      # Ranked batters under pressure
│       └── bowlers_reliability.json      # Ranked bowlers under pressure
├── frontend/
│   ├── static/
│   │   ├── css/
│   │   │   └── style.css                 # Dark theme styling, glassmorphism, animations
│   │   └── js/
│   │       ├── api.js                    # REST API client service with offline fallback
│   │       ├── charts.js                 # Chart.js scatter quadrants & clutch radar
│   │       └── main.js                   # Application controller, routing, and filters
│   └── templates/
│       └── index.html                    # Production single-page dashboard
├── run.py                                # Python launcher script
├── start.bat                             # One-click Windows runner
├── wsgi.py                               # WSGI production entrypoint
├── Procfile                              # Cloud deployment configuration (Render / Railway / Heroku)
├── README.md                             # Documentation & setup guide
├── DESIGN_SYSTEM.md                      # UI/UX design specification
└── design_preview.html                   # Standalone visual preview
```

---

## How to Run the Project

### Option A: One-Click Runner (Windows)
Double-click `start.bat` in the project root folder.

### Option B: From VS Code / Terminal
```powershell
python run.py
```
Then navigate to: `http://127.0.0.1:5000`
