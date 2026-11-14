# SupeRR Selector Season 2 — UI/UX Design System & Layout Blueprint

**Project Title:** Identify the Most Reliable Players Under Pressure  
**Target:** Professional Cricket Data Analytics Web Application  
**Competition:** SupeRR Selector Season 2  

---

## 1. Visual Identity & Design System

### 1.1 Color Palette (Sports Analytics Dark Theme)
The color scheme is inspired by premium sports platforms (ESPNcricinfo, Cricbuzz Plus, Formula 1 telemetry, Opta Sports) with a dark navy & charcoal foundation paired with high-contrast cricket emerald accents:

| Token Name | Hex Code | Usage |
| :--- | :--- | :--- |
| **Deep Pitch Black** | `#070B14` | Body canvas background, page wrapper |
| **Navy Canvas** | `#0B132B` | Section background, header, secondary containers |
| **Slate Card Surface** | `#131E3A` | Cards, data tables, modals, interactive panels |
| **Surface Elevate** | `#1C2A4D` | Hover states, active tabs, dropdown menus |
| **Cricket Emerald (Primary)** | `#10B981` | Primary accents, buttons, high-reliability badges, winning metrics |
| **Cricket Emerald Glow** | `#059669` | Hover states, borders of top performers |
| **Electric Cyan** | `#38BDF8` | Strike rate, speed indicators, secondary highlights |
| **Warning Gold** | `#F59E0B` | Medium reliability ratings, pressure threshold warnings |
| **High Pressure Coral** | `#EF4444` | High stress situations, dismissals, critical required run rates |
| **Pure White** | `#FFFFFF` | Headings, primary player names, key data numbers |
| **Muted Slate Text** | `#94A3B8` | Subtitles, column labels, secondary statistical details |
| **Border Slate** | `#1E293B` | Structural dividers, card borders (1px solid) |

### 1.2 Typography
- **Primary Font Family:** `'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif`
- **Headings & Numbers:** Bold weights (700, 800) with clean tabular numerals (`font-feature-settings: 'tnum'`) for statistical alignment.
- **Weights:**
  - `400 (Regular)`: Body copy, descriptions, methodology text
  - `500 (Medium)`: Table cells, navigation links, filters
  - `600 (Semi-Bold)`: Card titles, metric labels, button text
  - `700 & 800 (Bold / Extra-Bold)`: Key statistics, player ranks, hero headers

---

## 2. Layout Structure & Responsive Grid

- **Container Widths:**
  - Desktop Max Width: `1280px` (centered with `auto` margins and `1.5rem` gutter padding)
  - Tablet (768px – 1024px): Fluid grid, 2-column card layouts, scrollable data tables
  - Mobile (< 768px): Single-column stacked cards, collapsible hamburger menu, touch-friendly swipeable table rows
- **Component Geometry:**
  - Card Border Radius: `12px` (subtle modern curve)
  - Button Border Radius: `8px`
  - Pill Badges: `9999px` (rounded-full)
  - Card Shadows: `0 10px 25px -5px rgba(0, 0, 0, 0.4), 0 8px 10px -6px rgba(0, 0, 0, 0.3)`
  - Card Borders: `1px solid rgba(255, 255, 255, 0.08)`
