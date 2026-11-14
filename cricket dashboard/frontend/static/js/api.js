/**
 * SupeRR Selector Season 2 — API Client Service
 * Connects Frontend to Flask Backend with tournament filter support.
 */

const API_BASE_URL = window.location.origin.includes('5000') 
  ? '' 
  : 'http://127.0.0.1:5000';

const ApiService = {
  async checkHealth() {
    try {
      const res = await fetch(`${API_BASE_URL}/api/health`);
      if (res.ok) return await res.json();
    } catch (e) {
      console.warn("Backend API not reachable. Using fallback mode.");
    }
    return { status: "offline", mode: "fallback" };
  },

  async getDashboardStats(competition = 'ALL') {
    try {
      const res = await fetch(`${API_BASE_URL}/api/dashboard/stats?competition=${encodeURIComponent(competition)}`);
      if (res.ok) return await res.json();
    } catch (e) {
      console.warn("Using sample dashboard stats.");
    }

    const isIpl = competition === 'IPL';
    const isT20i = competition === 'T20I';

    return {
      tournament_filter: competition,
      total_matches: isIpl ? 371 : (isT20i ? 512 : 883),
      total_players: isIpl ? 420 : (isT20i ? 790 : 1210),
      pressure_balls: isIpl ? 4620 : (isT20i ? 6296 : 10916),
      scoring_model: "MPI-BRS / PRS (Bayesian)",
      top_batter: {
        player_name: "Suryakumar Yadav",
        team_name: isIpl ? "Mumbai Indians" : (isT20i ? "India" : "Mumbai Indians / IND"),
        reliability_score: 99.4,
        tier: "Tier 1 Elite",
        pressure_sr: 198.4,
        runs_under_pressure: isIpl ? 480 : (isT20i ? 390 : 684),
        boundary_pct: "26.8%"
      },
      top_bowler: {
        player_name: isT20i ? "Rashid Khan" : "Jasprit Bumrah",
        team_name: isT20i ? "Afghanistan" : (isIpl ? "Mumbai Indians" : "Mumbai Indians / IND"),
        reliability_score: 99.4,
        tier: "Tier 1 Clutch",
        pressure_econ: isT20i ? 6.88 : 6.42,
        death_wickets: isT20i ? 34 : 38,
        dot_ball_pct: isT20i ? "44.1%" : "48.2%"
      }
    };
  },

  async getTopBatters(competition = 'ALL', minBalls = 75) {
    try {
      const res = await fetch(`${API_BASE_URL}/api/rankings/batters?competition=${encodeURIComponent(competition)}&min_balls=${minBalls}`);
      if (res.ok) return await res.json();
    } catch (e) {
      console.warn("Using sample filtered batters.");
    }

    const allBatters = [
      { rank: 1, name: "Suryakumar Yadav", team: "Mumbai Indians / IND", tournaments: ["IPL", "T20I"], reliability: 99.4, runs: 684, sr: 198.4, boundary_pct: "26.8%", balls: 345 },
      { rank: 2, name: "Heinrich Klaasen", team: "Sunrisers Hyderabad / SA", tournaments: ["IPL", "T20I"], reliability: 99.4, runs: 612, sr: 191.2, boundary_pct: "24.5%", balls: 320 },
      { rank: 3, name: "Rinku Singh", team: "Kolkata Knight Riders / IND", tournaments: ["IPL", "T20I"], reliability: 99.4, runs: 542, sr: 184.6, boundary_pct: "23.1%", balls: 294 },
      { rank: 4, name: "Nicholas Pooran", team: "LSG / West Indies", tournaments: ["IPL", "T20I"], reliability: 92.7, runs: 578, sr: 179.3, boundary_pct: "22.8%", balls: 322 },
      { rank: 5, name: "Shimron Hetmyer", team: "Rajasthan Royals / WI", tournaments: ["IPL", "T20I"], reliability: 91.5, runs: 489, sr: 176.5, boundary_pct: "21.9%", balls: 277 },
      { rank: 6, name: "Tim David", team: "Mumbai Indians / AUS", tournaments: ["IPL", "T20I"], reliability: 90.2, runs: 465, sr: 174.8, boundary_pct: "21.0%", balls: 266 },
      { rank: 7, name: "Glenn Maxwell", team: "RCB / Australia", tournaments: ["IPL", "T20I"], reliability: 89.6, runs: 510, sr: 172.3, boundary_pct: "20.5%", balls: 296 },
      { rank: 8, name: "Andre Russell", team: "Kolkata Knight Riders / WI", tournaments: ["IPL", "T20I"], reliability: 88.9, runs: 495, sr: 178.9, boundary_pct: "23.4%", balls: 277 },
      { rank: 9, name: "MS Dhoni", team: "Chennai Super Kings / IND", tournaments: ["IPL"], reliability: 87.5, runs: 395, sr: 182.0, boundary_pct: "22.0%", balls: 217 },
      { rank: 10, name: "Dinesh Karthik", team: "Royal Challengers / IND", tournaments: ["IPL"], reliability: 88.1, runs: 432, sr: 171.4, boundary_pct: "20.1%", balls: 252 },
      { rank: 11, name: "Virat Kohli", team: "RCB / India", tournaments: ["IPL", "T20I"], reliability: 92.4, runs: 520, sr: 162.9, boundary_pct: "20.4%", balls: 319 },
      { rank: 12, name: "Jos Buttler", team: "Rajasthan Royals / ENG", tournaments: ["IPL", "T20I"], reliability: 90.8, runs: 512, sr: 167.5, boundary_pct: "21.2%", balls: 305 }
    ];

    let filtered = allBatters;
    if (competition !== 'ALL') {
      filtered = filtered.filter(b => b.tournaments.includes(competition));
    }
    filtered = filtered.filter(b => b.balls >= minBalls);
    filtered.sort((a, b) => b.reliability - a.reliability);

    return filtered.slice(0, 10).map((item, index) => ({ ...item, rank: index + 1 }));
  },

  async getTopBowlers(competition = 'ALL', minOvers = 25) {
    try {
      const res = await fetch(`${API_BASE_URL}/api/rankings/bowlers?competition=${encodeURIComponent(competition)}&min_overs=${minOvers}`);
      if (res.ok) return await res.json();
    } catch (e) {
      console.warn("Using sample filtered bowlers.");
    }

    const allBowlers = [
      { rank: 1, name: "Jasprit Bumrah", team: "Mumbai Indians / IND", tournaments: ["IPL", "T20I"], reliability: 99.4, wickets: 38, econ: 6.42, dot_pct: "48.2%", overs: 64.2 },
      { rank: 2, name: "Rashid Khan", team: "Gujarat Titans / AFG", tournaments: ["IPL", "T20I"], reliability: 99.4, wickets: 34, econ: 6.88, dot_pct: "44.1%", overs: 72.0 },
      { rank: 3, name: "Arshdeep Singh", team: "Punjab Kings / IND", tournaments: ["IPL", "T20I"], reliability: 99.4, wickets: 31, econ: 7.45, dot_pct: "41.8%", overs: 58.4 },
      { rank: 4, name: "Anrich Nortje", team: "Delhi Capitals / SA", tournaments: ["IPL", "T20I"], reliability: 91.9, wickets: 28, econ: 7.60, dot_pct: "40.5%", overs: 51.0 },
      { rank: 5, name: "Mohit Sharma", team: "Gujarat Titans / IND", tournaments: ["IPL"], reliability: 91.1, wickets: 33, econ: 7.85, dot_pct: "39.2%", overs: 60.1 },
      { rank: 6, name: "Harshal Patel", team: "Punjab Kings / IND", tournaments: ["IPL"], reliability: 89.8, wickets: 35, econ: 8.20, dot_pct: "38.5%", overs: 65.0 },
      { rank: 7, name: "Matheesha Pathirana", team: "Chennai Super Kings / SL", tournaments: ["IPL", "T20I"], reliability: 89.2, wickets: 27, econ: 7.35, dot_pct: "42.0%", overs: 48.0 },
      { rank: 8, name: "Kagiso Rabada", team: "Punjab Kings / SA", tournaments: ["IPL", "T20I"], reliability: 88.4, wickets: 26, econ: 7.95, dot_pct: "39.8%", overs: 52.3 },
      { rank: 9, name: "Trent Boult", team: "Rajasthan Royals / NZ", tournaments: ["IPL", "T20I"], reliability: 87.9, wickets: 25, econ: 7.50, dot_pct: "43.2%", overs: 50.0 },
      { rank: 10, name: "Yuzvendra Chahal", team: "Rajasthan Royals / IND", tournaments: ["IPL", "T20I"], reliability: 87.2, wickets: 29, econ: 8.10, dot_pct: "37.5%", overs: 55.0 }
    ];

    let filtered = allBowlers;
    if (competition !== 'ALL') {
      filtered = filtered.filter(b => b.tournaments.includes(competition));
    }
    filtered = filtered.filter(b => b.overs >= minOvers);
    filtered.sort((a, b) => b.reliability - a.reliability);

    return filtered.slice(0, 10).map((item, index) => ({ ...item, rank: index + 1 }));
  },

  async getPlayerProfile(playerName) {
    try {
      const res = await fetch(`${API_BASE_URL}/api/player/${encodeURIComponent(playerName)}`);
      if (res.ok) return await res.json();
    } catch (e) {
      console.warn("Using fallback player profile.");
    }

    return {
      name: playerName || "Virat Kohli",
      team: "Royal Challengers Bengaluru / India",
      role: "Top-Order Anchor",
      overall_reliability: 92.4,
      tier: "Tier 1 Clutch",
      normal: {
        strike_rate: 137.4,
        boundary_pct: "15.2%",
        average: 42.1,
        balls_faced: 1120
      },
      pressure: {
        strike_rate: 162.9,
        boundary_pct: "20.4%",
        average: 54.6,
        balls_faced: 480
      },
      delta: {
        sr_boost: "+18.5%",
        boundary_boost: "+5.2%"
      },
      strengths: [
        "Supreme running between wickets under fatigue",
        "Minimal dot balls during high RRR chases (< 25% dots)",
        "Exceptional wrist placement in death overs"
      ],
      weaknesses: [
        "Slow acceleration against express wrist-spin in early middle overs",
        "Higher dismissal probability when initial required rate > 12.5"
      ]
    };
  }
};
