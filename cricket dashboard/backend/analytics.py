"""
SupeRR Selector Season 2 — Analytics & Scoring Engine
Contains mathematical formulations for:
1. Match Pressure Index (MPI)
2. Batter Reliability Score (BRS)
3. Bowler Reliability Score (PRS)
4. Bayesian Sample-Size Shrinkage Factor
"""

import math

def calculate_match_pressure_index(rrr, balls_remaining, wickets_remaining, innings=2, is_knockout=False):
    if innings == 1:
        death_factor = max(0, (30 - balls_remaining) / 30) * 40
        wickets_lost = 10 - wickets_remaining
        collapse_factor = max(0, (wickets_lost - 4) / 6) * 40
        raw_score = 20 + death_factor + collapse_factor
    else:
        rrr_weight = (rrr / 12.0) * 45
        balls_weight = max(0, (60 - balls_remaining) / 60) * 30
        wickets_weight = max(0, (10 - wickets_remaining) / 9) * 25
        raw_score = rrr_weight + balls_weight + wickets_weight

    if is_knockout:
        raw_score *= 1.15

    return round(min(99.9, max(10.0, raw_score)), 1)


def compute_sample_shrinkage(sample_size, threshold):
    if sample_size <= 0:
        return 0.1
    return min(1.0, math.sqrt(sample_size / threshold))


def calculate_batter_reliability_score(pressure_sr, pressure_boundary_pct, pressure_avg, balls_faced, min_balls=75):
    sr_factor = (pressure_sr / 160.0) * 45.0
    bound_factor = (pressure_boundary_pct / 22.0) * 30.0
    avg_factor = (min(60.0, pressure_avg) / 35.0) * 25.0
    
    raw_score = sr_factor + bound_factor + avg_factor
    shrinkage = compute_sample_shrinkage(balls_faced, min_balls)
    final_score = raw_score * shrinkage
    return round(min(99.4, max(45.0, final_score)), 1)


def calculate_bowler_reliability_score(pressure_econ, dot_ball_pct, wickets_per_over, overs_bowled, min_overs=25):
    econ_factor = max(0.0, (12.0 - pressure_econ) / 5.0) * 40.0
    dot_factor = (dot_ball_pct / 45.0) * 35.0
    wkt_factor = min(35.0, (wickets_per_over / 0.35) * 25.0)
    
    raw_score = econ_factor + dot_factor + wkt_factor
    shrinkage = compute_sample_shrinkage(overs_bowled, min_overs)
    final_score = raw_score * shrinkage
    return round(min(99.4, max(45.0, final_score)), 1)
