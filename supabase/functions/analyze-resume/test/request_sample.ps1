# Sample request to the local analyze-resume function
# Usage: Open a PowerShell terminal and run this script after starting `supabase functions serve analyze-resume`.

$body = @{
    resumeText = "Experienced frontend developer with 4 years of React and TypeScript experience. Built responsive UIs and worked on performance optimizations."
    jobDescription = "We are seeking a Senior Frontend Developer with 5+ years of React, TypeScript, and performance optimization experience. Experience with accessibility and testing preferred."
} | ConvertTo-Json

$response = Invoke-RestMethod -Method Post -Uri "http://localhost:54321/functions/v1/analyze-resume" -ContentType "application/json" -Body $body

$response | ConvertTo-Json -Depth 5 | Out-File -FilePath ./analysis_result.json -Encoding utf8

Write-Host "Saved analysis to analysis_result.json"
