#!/usr/bin/env bash
# run.sh — start backend in bg, then frontend in fg

# get the directory this script lives in
ROOT="$(cd "$(dirname "$0")" && pwd)"

# 1) Backend
cd "$ROOT/Backend"
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000 &

# 2) Frontend
cd "$ROOT/frontend"
npm start
