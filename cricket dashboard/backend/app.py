"""
SupeRR Selector Season 2 — Flask Backend REST API
Serves both the cricket analytics API endpoints and the frontend templates.
"""

import os
from flask import Flask, jsonify, request, render_template
from flask_cors import CORS
from data_loader import data_loader
from analytics import calculate_match_pressure_index

CURRENT_DIR = os.path.dirname(os.path.abspath(__file__))
PROJECT_ROOT = os.path.dirname(CURRENT_DIR)
TEMPLATE_DIR = os.path.join(PROJECT_ROOT, "frontend", "templates")
STATIC_DIR = os.path.join(PROJECT_ROOT, "frontend", "static")

app = Flask(
    __name__,
    template_folder=TEMPLATE_DIR,
    static_folder=STATIC_DIR,
    static_url_path="/static"
)

CORS(app)

@app.route("/")
def index():
    return render_template("index.html")

@app.route("/api/health", methods=["GET"])
def health_check():
    return jsonify({
        "status": "online",
        "competition": "SupeRR Selector Season 2",
        "dataset_matches": data_loader.dashboard_stats.get("total_matches", 883),
        "dataset_players": data_loader.dashboard_stats.get("total_players", 1210),
        "pressure_balls": data_loader.dashboard_stats.get("pressure_balls", 10916),
        "engine": "MPI-BRS / PRS (Bayesian Shrinkage Model)"
    })

@app.route("/api/dashboard/stats", methods=["GET"])
def get_dashboard_stats():
    comp = request.args.get("competition", "ALL").upper()
    stats = data_loader.get_dashboard_stats(tournament=comp)
    return jsonify(stats)

@app.route("/api/rankings/batters", methods=["GET"])
def get_batters_rankings():
    comp = request.args.get("competition", "ALL").upper()
    try:
        min_balls = int(request.args.get("min_balls", 75))
    except ValueError:
        min_balls = 75

    batters = data_loader.get_top_batters(tournament=comp, min_balls=min_balls)
    return jsonify(batters)

@app.route("/api/rankings/bowlers", methods=["GET"])
def get_bowlers_rankings():
    comp = request.args.get("competition", "ALL").upper()
    try:
        min_overs = int(request.args.get("min_overs", 25))
    except ValueError:
        min_overs = 25

    bowlers = data_loader.get_top_bowlers(tournament=comp, min_overs=min_overs)
    return jsonify(bowlers)

@app.route("/api/players/search", methods=["GET"])
def search_players():
    q = request.args.get("q", "")
    results = data_loader.search_players(q)
    return jsonify(results)

@app.route("/api/player/<player_name>", methods=["GET"])
def get_player_profile(player_name):
    profile = data_loader.get_player_profile(player_name)
    return jsonify(profile)

@app.route("/api/pressure/calculate", methods=["POST"])
def calculate_pressure():
    payload = request.get_json() or {}
    rrr = float(payload.get("rrr", 10.0))
    balls = int(payload.get("balls_remaining", 24))
    wickets = int(payload.get("wickets_remaining", 4))
    innings = int(payload.get("innings", 2))
    is_knockout = bool(payload.get("is_knockout", False))

    score = calculate_match_pressure_index(
        rrr=rrr,
        balls_remaining=balls,
        wickets_remaining=wickets,
        innings=innings,
        is_knockout=is_knockout
    )

    label = "CRITICAL HIGH PRESSURE" if score >= 80 else ("MODERATE PRESSURE" if score >= 60 else "NORMAL GAME SITUATION")
    return jsonify({
        "pressure_index": score,
        "classification": label,
        "delivery_weight": round(1.0 + (score / 100.0), 2)
    })

if __name__ == "__main__":
    port = int(os.environ.get("PORT", 5000))
    print(f" * SupeRR Selector S2 server starting at http://127.0.0.1:{port}")
    app.run(host="127.0.0.1", port=port, debug=False)

