/**
 * SupeRR Selector Season 2 — Main Frontend Controller
 * Handles UI interactions, page navigation, table rendering, filters, search, and charts.
 */

document.addEventListener('DOMContentLoaded', () => {
  initApp();
});

const AppState = {
  activePage: 'home',
  globalCompetition: 'ALL',
  batterCompetition: 'ALL',
  batterMinBalls: 75,
  bowlerCompetition: 'ALL',
  bowlerMinOvers: 25,
  selectedPlayer: 'Virat Kohli',
  currentBatters: [],
  currentBowlers: []
};

async function initApp() {
  setupNavigation();
  setupFilterListeners();
  setupSearchListener();
  setupPressureCalculator();

  await loadDashboardStats('ALL');
  await loadBattersTable();
  await loadBowlersTable();
  await loadPlayerProfile(AppState.selectedPlayer);
}

function setupNavigation() {
  window.navigateTo = function(pageId) {
    AppState.activePage = pageId;

    document.querySelectorAll('.page-view').forEach(page => {
      page.classList.add('hidden');
      page.classList.remove('page-fade-in');
    });

    const targetPage = document.getElementById(`page-${pageId}`);
    if (targetPage) {
      targetPage.classList.remove('hidden');
      targetPage.classList.add('page-fade-in');
    }

    document.querySelectorAll('.nav-tab').forEach(btn => {
      btn.classList.remove('text-cricket-emerald', 'bg-cricket-emerald/20', 'border', 'border-cricket-emerald/30');
      btn.classList.add('text-slate-400');
    });

    const activeTab = document.getElementById(`tab-${pageId}`);
    if (activeTab) {
      activeTab.classList.remove('text-slate-400');
      activeTab.classList.add('text-cricket-emerald', 'bg-cricket-emerald/20', 'border', 'border-cricket-emerald/30');
    }

    if (pageId === 'batters' && AppState.currentBatters.length > 0 && typeof ChartManager !== 'undefined') {
      setTimeout(() => ChartManager.renderBattersChart(AppState.currentBatters), 50);
    } else if (pageId === 'bowlers' && AppState.currentBowlers.length > 0 && typeof ChartManager !== 'undefined') {
      setTimeout(() => ChartManager.renderBowlersChart(AppState.currentBowlers), 50);
    }

    window.scrollTo({ top: 0, behavior: 'smooth' });
  };
}

async function loadDashboardStats(competition = 'ALL') {
  const stats = await ApiService.getDashboardStats(competition);
  
  const matchesEl = document.getElementById('stat-total-matches');
  if (matchesEl) matchesEl.textContent = `${stats.total_matches}+`;

  const playersEl = document.getElementById('stat-total-players');
  if (playersEl) playersEl.textContent = `${stats.total_players}+`;

  const pressureEl = document.getElementById('stat-pressure-balls');
  if (pressureEl) pressureEl.textContent = `${stats.pressure_balls}+`;

  const topBat = stats.top_batter;
  if (topBat) {
    const nameEl = document.getElementById('spotlight-batter-name');
    if (nameEl) nameEl.textContent = topBat.player_name;
    const teamEl = document.getElementById('spotlight-batter-team');
    if (teamEl) teamEl.textContent = topBat.team_name;
    const scoreEl = document.getElementById('spotlight-batter-score');
    if (scoreEl) scoreEl.textContent = topBat.reliability_score;
    const srEl = document.getElementById('spotlight-batter-sr');
    if (srEl) srEl.textContent = topBat.pressure_sr;
    const runsEl = document.getElementById('spotlight-batter-runs');
    if (runsEl) runsEl.textContent = topBat.runs_under_pressure;
    const boundEl = document.getElementById('spotlight-batter-boundary');
    if (boundEl) boundEl.textContent = topBat.boundary_pct;
  }

  const topBowl = stats.top_bowler;
  if (topBowl) {
    const nameEl = document.getElementById('spotlight-bowler-name');
    if (nameEl) nameEl.textContent = topBowl.player_name;
    const teamEl = document.getElementById('spotlight-bowler-team');
    if (teamEl) teamEl.textContent = topBowl.team_name;
    const scoreEl = document.getElementById('spotlight-bowler-score');
    if (scoreEl) scoreEl.textContent = topBowl.reliability_score;
    const econEl = document.getElementById('spotlight-bowler-econ');
    if (econEl) econEl.textContent = topBowl.pressure_econ;
    const wktsEl = document.getElementById('spotlight-bowler-wkts');
    if (wktsEl) wktsEl.textContent = topBowl.death_wickets;
    const dotsEl = document.getElementById('spotlight-bowler-dots');
    if (dotsEl) dotsEl.textContent = topBowl.dot_ball_pct;
  }
}

async function loadBattersTable() {
  const tbody = document.getElementById('batters-table-body');
  if (!tbody) return;

  tbody.innerHTML = `<tr><td colspan="9" class="py-8 text-center text-slate-400"><div class="spinner mx-auto mb-2"></div>Loading top batters...</td></tr>`;

  const batters = await ApiService.getTopBatters(AppState.batterCompetition, AppState.batterMinBalls);
  AppState.currentBatters = batters;

  tbody.innerHTML = '';
  if (batters.length === 0) {
    tbody.innerHTML = `<tr><td colspan="9" class="py-8 text-center text-slate-400">No batters match the selected filter criteria.</td></tr>`;
    return;
  }

  batters.forEach(b => {
    const rankClass = b.rank === 1 ? 'bg-amber-500/20 text-amber-400 border-amber-500/40' :
                      b.rank === 2 ? 'bg-slate-300/20 text-slate-200 border-slate-300/40' :
                      b.rank === 3 ? 'bg-amber-700/20 text-amber-600 border-amber-700/40' :
                      'text-slate-400';

    const runs = b.runs !== undefined ? b.runs : b.runs_pressure;
    const sr = b.sr !== undefined ? b.sr : b.sr_pressure;
    const boundary = b.boundary_pct || `${b.boundary_pct_pressure}%`;
    const balls = b.balls !== undefined ? b.balls : b.balls_pressure;

    const row = document.createElement('tr');
    row.className = 'table-row-hover transition-colors border-b border-slate-800/60';
    row.innerHTML = `
      <td class="py-3.5 px-4 text-center">
        <span class="w-6 h-6 rounded-full inline-flex items-center justify-center font-bold text-xs border ${rankClass}">${b.rank}</span>
      </td>
      <td class="py-3.5 px-4">
        <div class="font-bold text-white">${b.name}</div>
        <div class="text-[11px] text-slate-400">${b.role || 'Batter'}</div>
      </td>
      <td class="py-3.5 px-4 text-slate-300">${b.team}</td>
      <td class="py-3.5 px-4 text-center">
        <span class="inline-block px-2.5 py-0.5 rounded-full font-bold font-mono text-xs score-pill-elite">${b.reliability}</span>
      </td>
      <td class="py-3.5 px-4 text-right font-mono text-white font-bold">${runs}</td>
      <td class="py-3.5 px-4 text-right font-mono text-cricket-emerald font-bold">${sr}</td>
      <td class="py-3.5 px-4 text-right font-mono text-slate-300">${boundary}</td>
      <td class="py-3.5 px-4 text-right font-mono text-slate-400">${balls}</td>
      <td class="py-3.5 px-4 text-center">
        <button onclick="inspectPlayer('${b.name}')" class="bg-navy-800 hover:bg-cricket-emerald hover:text-black text-slate-200 text-xs px-2.5 py-1 rounded transition-all font-medium">
          Analyze
        </button>
      </td>
    `;
    tbody.appendChild(row);
  });

  if (typeof ChartManager !== 'undefined') {
    ChartManager.renderBattersChart(batters);
  }
}

async function loadBowlersTable() {
  const tbody = document.getElementById('bowlers-table-body');
  if (!tbody) return;

  tbody.innerHTML = `<tr><td colspan="9" class="py-8 text-center text-slate-400"><div class="spinner mx-auto mb-2"></div>Loading top bowlers...</td></tr>`;

  const bowlers = await ApiService.getTopBowlers(AppState.bowlerCompetition, AppState.bowlerMinOvers);
  AppState.currentBowlers = bowlers;

  tbody.innerHTML = '';
  if (bowlers.length === 0) {
    tbody.innerHTML = `<tr><td colspan="9" class="py-8 text-center text-slate-400">No bowlers match the selected filter criteria.</td></tr>`;
    return;
  }

  bowlers.forEach(b => {
    const rankClass = b.rank === 1 ? 'bg-amber-500/20 text-amber-400 border-amber-500/40' :
                      b.rank === 2 ? 'bg-slate-300/20 text-slate-200 border-slate-300/40' :
                      b.rank === 3 ? 'bg-amber-700/20 text-amber-600 border-amber-700/40' :
                      'text-slate-400';

    const wkts = b.wickets !== undefined ? b.wickets : b.wickets_pressure;
    const econ = b.econ !== undefined ? b.econ : b.econ_pressure;
    const dots = b.dot_pct || `${b.dot_pct_pressure}%`;
    const overs = b.overs !== undefined ? b.overs : b.overs_pressure;

    const row = document.createElement('tr');
    row.className = 'table-row-hover transition-colors border-b border-slate-800/60';
    row.innerHTML = `
      <td class="py-3.5 px-4 text-center">
        <span class="w-6 h-6 rounded-full inline-flex items-center justify-center font-bold text-xs border ${rankClass}">${b.rank}</span>
      </td>
      <td class="py-3.5 px-4">
        <div class="font-bold text-white">${b.name}</div>
        <div class="text-[11px] text-slate-400">${b.role || 'Bowler'}</div>
      </td>
      <td class="py-3.5 px-4 text-slate-300">${b.team}</td>
      <td class="py-3.5 px-4 text-center">
        <span class="inline-block px-2.5 py-0.5 rounded-full font-bold font-mono text-xs score-pill-high">${b.reliability}</span>
      </td>
      <td class="py-3.5 px-4 text-right font-mono text-white font-bold">${wkts}</td>
      <td class="py-3.5 px-4 text-right font-mono text-accent-cyan font-bold">${econ}</td>
      <td class="py-3.5 px-4 text-right font-mono text-slate-300">${dots}</td>
      <td class="py-3.5 px-4 text-right font-mono text-slate-400">${overs}</td>
      <td class="py-3.5 px-4 text-center">
        <button onclick="inspectPlayer('${b.name}')" class="bg-navy-800 hover:bg-accent-cyan hover:text-black text-slate-200 text-xs px-2.5 py-1 rounded transition-all font-medium">
          Analyze
        </button>
      </td>
    `;
    tbody.appendChild(row);
  });

  if (typeof ChartManager !== 'undefined') {
    ChartManager.renderBowlersChart(bowlers);
  }
}

window.inspectPlayer = async function(playerName) {
  AppState.selectedPlayer = playerName;
  navigateTo('player');
  await loadPlayerProfile(playerName);
};

async function loadPlayerProfile(playerName) {
  const data = await ApiService.getPlayerProfile(playerName);
  
  const nameEl = document.getElementById('player-profile-name');
  if (nameEl) nameEl.textContent = data.name;

  const teamEl = document.getElementById('player-profile-team');
  if (teamEl) teamEl.textContent = `${data.team} • ${data.role}`;

  const scoreEl = document.getElementById('player-profile-score');
  if (scoreEl) scoreEl.textContent = data.overall_reliability;

  if (data.normal) {
    document.getElementById('player-norm-sr').textContent = data.normal.strike_rate;
    document.getElementById('player-norm-bound').textContent = data.normal.boundary_pct;
    document.getElementById('player-norm-avg').textContent = data.normal.average;
  }

  if (data.pressure) {
    document.getElementById('player-pres-sr').textContent = data.pressure.strike_rate;
    document.getElementById('player-pres-bound').textContent = data.pressure.boundary_pct;
    document.getElementById('player-pres-avg').textContent = data.pressure.average;
  }

  const strengthsContainer = document.getElementById('player-strengths-list');
  if (strengthsContainer && data.strengths) {
    strengthsContainer.innerHTML = data.strengths.map(s => `
      <li class="flex items-start space-x-1.5">
        <span class="text-cricket-emerald font-bold">✓</span>
        <span>${s}</span>
      </li>
    `).join('');
  }

  const weaknessesContainer = document.getElementById('player-weaknesses-list');
  if (weaknessesContainer && data.weaknesses) {
    weaknessesContainer.innerHTML = data.weaknesses.map(w => `
      <li class="flex items-start space-x-1.5">
        <span class="text-accent-coral font-bold">✕</span>
        <span>${w}</span>
      </li>
    `).join('');
  }

  if (typeof ChartManager !== 'undefined') {
    ChartManager.renderPlayerRadarChart(data);
  }
}

function setupFilterListeners() {
  const globalFilter = document.getElementById('global-tournament-filter');
  if (globalFilter) {
    globalFilter.addEventListener('change', async (e) => {
      const selected = e.target.value;
      AppState.globalCompetition = selected;
      AppState.batterCompetition = selected;
      AppState.bowlerCompetition = selected;

      const batSelect = document.getElementById('filter-batter-competition');
      if (batSelect) batSelect.value = selected;
      const bowlSelect = document.getElementById('filter-bowler-competition');
      if (bowlSelect) bowlSelect.value = selected;

      await loadDashboardStats(selected);
      await loadBattersTable();
      await loadBowlersTable();
    });
  }

  const batCompSelect = document.getElementById('filter-batter-competition');
  if (batCompSelect) {
    batCompSelect.addEventListener('change', (e) => {
      AppState.batterCompetition = e.target.value;
      if (globalFilter) globalFilter.value = e.target.value;
      loadBattersTable();
    });
  }

  const batBallsSelect = document.getElementById('filter-batter-balls');
  if (batBallsSelect) {
    batBallsSelect.addEventListener('change', (e) => {
      AppState.batterMinBalls = parseInt(e.target.value);
      loadBattersTable();
    });
  }

  const bowlCompSelect = document.getElementById('filter-bowler-competition');
  if (bowlCompSelect) {
    bowlCompSelect.addEventListener('change', (e) => {
      AppState.bowlerCompetition = e.target.value;
      if (globalFilter) globalFilter.value = e.target.value;
      loadBowlersTable();
    });
  }

  const bowlOversSelect = document.getElementById('filter-bowler-overs');
  if (bowlOversSelect) {
    bowlOversSelect.addEventListener('change', (e) => {
      AppState.bowlerMinOvers = parseInt(e.target.value);
      loadBowlersTable();
    });
  }
}

function setupSearchListener() {
  const searchInput = document.getElementById('player-search-input');
  if (searchInput) {
    searchInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' && searchInput.value.trim() !== '') {
        loadPlayerProfile(searchInput.value.trim());
      }
    });
  }
}

function setupPressureCalculator() {
  window.updatePressureCalc = function() {
    const rrr = parseFloat(document.getElementById('calc-rrr').value);
    const balls = parseInt(document.getElementById('calc-balls').value);
    const wickets = parseInt(document.getElementById('calc-wickets').value);

    document.getElementById('val-rrr').textContent = rrr.toFixed(1);
    document.getElementById('val-balls').textContent = balls;
    document.getElementById('val-wickets').textContent = wickets;

    let score = (rrr * 3.5) + ((60 - balls) * 0.5) + ((10 - wickets) * 4);
    score = Math.min(99.9, Math.max(10, score));

    const badge = document.getElementById('pressure-score-badge');
    const label = document.getElementById('pressure-score-label');

    badge.textContent = score.toFixed(1);

    if (score >= 80) {
      badge.className = "text-5xl font-extrabold text-cricket-emerald font-mono";
      label.textContent = "CRITICAL HIGH PRESSURE";
      label.className = "text-xs font-bold uppercase tracking-wider bg-cricket-emerald/20 text-cricket-emerald px-3 py-1 rounded-full border border-cricket-emerald/30";
    } else if (score >= 60) {
      badge.className = "text-5xl font-extrabold text-accent-cyan font-mono";
      label.textContent = "MODERATE PRESSURE";
      label.className = "text-xs font-bold uppercase tracking-wider bg-accent-cyan/20 text-accent-cyan px-3 py-1 rounded-full border border-accent-cyan/30";
    } else {
      badge.className = "text-5xl font-extrabold text-slate-400 font-mono";
      label.textContent = "NORMAL GAME SITUATION";
      label.className = "text-xs font-bold uppercase tracking-wider bg-slate-700/50 text-slate-400 px-3 py-1 rounded-full border border-slate-600";
    }
  };
}
