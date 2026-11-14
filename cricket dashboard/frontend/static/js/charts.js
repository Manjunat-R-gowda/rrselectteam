/**
 * SupeRR Selector Season 2 — Interactive Charts Module (Chart.js)
 * Visualizes:
 * 1. Batters Scatter/Quadrant: Pressure Strike Rate vs. Boundary %
 * 2. Bowlers Scatter/Quadrant: Pressure Economy vs. Dot Ball %
 * 3. Player Deep Dive Radar: Clutch Skill Distribution
 */

const ChartManager = {
  batterChart: null,
  bowlerChart: null,
  playerRadarChart: null,

  init(battersData, bowlersData, playerData) {
    this.renderBattersChart(battersData);
    this.renderBowlersChart(bowlersData);
    if (playerData) {
      this.renderPlayerRadarChart(playerData);
    }
  },

  renderBattersChart(batters) {
    const ctx = document.getElementById('batters-scatter-chart');
    if (!ctx) return;

    if (this.batterChart) {
      this.batterChart.destroy();
    }

    const dataPoints = batters.map(b => ({
      x: b.sr !== undefined ? b.sr : b.sr_pressure,
      y: parseFloat(b.boundary_pct || b.boundary_pct_pressure),
      r: (b.reliability - 80) * 1.2,
      name: b.name,
      team: b.team,
      score: b.reliability
    }));

    this.batterChart = new Chart(ctx, {
      type: 'bubble',
      data: {
        datasets: [{
          label: 'Top Pressure Batters',
          data: dataPoints,
          backgroundColor: 'rgba(16, 185, 129, 0.45)',
          borderColor: '#10B981',
          borderWidth: 2,
          hoverBackgroundColor: '#10B981',
          hoverBorderColor: '#FFFFFF',
          hoverBorderWidth: 3
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false },
          tooltip: {
            backgroundColor: '#0B132B',
            titleColor: '#FFFFFF',
            bodyColor: '#E2E8F0',
            borderColor: '#10B981',
            borderWidth: 1,
            padding: 10,
            callbacks: {
              label: function(context) {
                const p = context.raw;
                return [
                  `Player: ${p.name}`,
                  `Pressure SR: ${p.x}`,
                  `Boundary %: ${p.y}%`,
                  `Reliability: ${p.score}`
                ];
              }
            }
          }
        },
        scales: {
          x: {
            title: {
              display: true,
              text: 'Pressure Strike Rate (SR)',
              color: '#94A3B8',
              font: { weight: '600', size: 12 }
            },
            grid: { color: 'rgba(255, 255, 255, 0.05)' },
            ticks: { color: '#94A3B8' }
          },
          y: {
            title: {
              display: true,
              text: 'Pressure Boundary Percentage (%)',
              color: '#94A3B8',
              font: { weight: '600', size: 12 }
            },
            grid: { color: 'rgba(255, 255, 255, 0.05)' },
            ticks: { color: '#94A3B8' }
          }
        }
      }
    });
  },

  renderBowlersChart(bowlers) {
    const ctx = document.getElementById('bowlers-scatter-chart');
    if (!ctx) return;

    if (this.bowlerChart) {
      this.bowlerChart.destroy();
    }

    const dataPoints = bowlers.map(b => ({
      x: b.econ !== undefined ? b.econ : b.econ_pressure,
      y: parseFloat(b.dot_pct || b.dot_pct_pressure),
      r: (b.reliability - 80) * 1.2,
      name: b.name,
      team: b.team,
      score: b.reliability
    }));

    this.bowlerChart = new Chart(ctx, {
      type: 'bubble',
      data: {
        datasets: [{
          label: 'Top Pressure Bowlers',
          data: dataPoints,
          backgroundColor: 'rgba(56, 189, 248, 0.45)',
          borderColor: '#38BDF8',
          borderWidth: 2,
          hoverBackgroundColor: '#38BDF8',
          hoverBorderColor: '#FFFFFF',
          hoverBorderWidth: 3
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false },
          tooltip: {
            backgroundColor: '#0B132B',
            titleColor: '#FFFFFF',
            bodyColor: '#E2E8F0',
            borderColor: '#38BDF8',
            borderWidth: 1,
            padding: 10,
            callbacks: {
              label: function(context) {
                const p = context.raw;
                return [
                  `Player: ${p.name}`,
                  `Pressure Econ: ${p.x}`,
                  `Dot Ball %: ${p.y}%`,
                  `Reliability: ${p.score}`
                ];
              }
            }
          }
        },
        scales: {
          x: {
            reverse: true,
            title: {
              display: true,
              text: 'Pressure Economy Rate (Lower = Better)',
              color: '#94A3B8',
              font: { weight: '600', size: 12 }
            },
            grid: { color: 'rgba(255, 255, 255, 0.05)' },
            ticks: { color: '#94A3B8' }
          },
          y: {
            title: {
              display: true,
              text: 'Dot Ball Percentage (%)',
              color: '#94A3B8',
              font: { weight: '600', size: 12 }
            },
            grid: { color: 'rgba(255, 255, 255, 0.05)' },
            ticks: { color: '#94A3B8' }
          }
        }
      }
    });
  },

  renderPlayerRadarChart(playerData) {
    const ctx = document.getElementById('player-radar-chart');
    if (!ctx) return;

    if (this.playerRadarChart) {
      this.playerRadarChart.destroy();
    }

    const isBatter = playerData.category !== 'bowler';
    const labels = isBatter ? [
      'Death Finishing (18-20)',
      'Boundary Hitting Rate',
      'Strike Rotation (Low Dots)',
      'High RRR Acceleration',
      'Collapse Resistance'
    ] : [
      'Death Yorker Accuracy',
      'Dot Ball Ratio',
      'Wicket-Taking Instinct',
      'Low Economy Defense',
      'Clutch Boundary Containment'
    ];

    const normalScores = isBatter ? [72, 68, 80, 70, 75] : [70, 68, 74, 72, 70];
    const pressureScores = isBatter ? [94, 91, 88, 96, 85] : [96, 92, 94, 95, 91];

    this.playerRadarChart = new Chart(ctx, {
      type: 'radar',
      data: {
        labels: labels,
        datasets: [
          {
            label: 'Normal Situation Profile',
            data: normalScores,
            fill: true,
            backgroundColor: 'rgba(148, 163, 184, 0.2)',
            borderColor: '#94A3B8',
            pointBackgroundColor: '#94A3B8',
            pointBorderColor: '#fff',
            pointHoverBackgroundColor: '#fff',
            pointHoverBorderColor: '#94A3B8'
          },
          {
            label: 'High Pressure Profile',
            data: pressureScores,
            fill: true,
            backgroundColor: isBatter ? 'rgba(16, 185, 129, 0.25)' : 'rgba(56, 189, 248, 0.25)',
            borderColor: isBatter ? '#10B981' : '#38BDF8',
            pointBackgroundColor: isBatter ? '#10B981' : '#38BDF8',
            pointBorderColor: '#fff',
            pointHoverBackgroundColor: '#fff',
            pointHoverBorderColor: isBatter ? '#10B981' : '#38BDF8'
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'top',
            labels: { color: '#E2E8F0', font: { size: 11 } }
          }
        },
        scales: {
          r: {
            angleLines: { color: 'rgba(255, 255, 255, 0.1)' },
            grid: { color: 'rgba(255, 255, 255, 0.08)' },
            pointLabels: { color: '#94A3B8', font: { size: 11, weight: '500' } },
            ticks: { display: false, min: 0, max: 100 }
          }
        }
      }
    });
  }
};
