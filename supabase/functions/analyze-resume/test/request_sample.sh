#!/usr/bin/env bash
# Sample request to the local analyze-resume function
# Usage: Start `supabase functions serve analyze-resume` and run this script.

set -e

body='{"resumeText":"Experienced frontend developer with 4 years of React and TypeScript experience. Built responsive UIs and worked on performance optimizations.","jobDescription":"We are seeking a Senior Frontend Developer with 5+ years of React, TypeScript, and performance optimization experience. Experience with accessibility and testing preferred."}'

curl -X POST "http://localhost:54321/functions/v1/analyze-resume" -H "Content-Type: application/json" -d "$body" | jq '.' > analysis_result.json

echo "Saved analysis to analysis_result.json"
