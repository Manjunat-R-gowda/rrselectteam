"""
SupeRR Selector Season 2 — Server Launcher
Run this script to start the web application:
python run.py
"""

import sys
import os

sys.path.insert(0, os.path.join(os.path.dirname(__file__), "backend"))

from app import app

if __name__ == "__main__":
    print("=" * 70)
    print("  🏆 SupeRR Selector Season 2 — Cricket Analytics Platform")
    print("  Identify the Most Reliable Players Under Pressure")
    print("=" * 70)
    print("\nStarting local server...")
    print("Open your browser and navigate to: http://127.0.0.1:5000")
    print("Press CTRL+C to stop the server.\n")
    
    app.run(host="127.0.0.1", port=5000, debug=False)
