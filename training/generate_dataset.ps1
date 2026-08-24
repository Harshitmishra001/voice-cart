# Dataset Generator for Voice Cart Intent Classifier
# Calls SmolLM3-3B via LM Studio to generate 1600 multilingual phrases

$LM_ENDPOINT = "http://10.17.9.206:1234/v1/chat/completions"

$intents = @(
    @{ action = "add"; desc = "add an item to their grocery shopping list" },
    @{ action = "remove"; desc = "remove an item from their grocery shopping list" },
    @{ action = "search"; desc = "search for or find a grocery item" },
    @{ action = "update_qty"; desc = "change or update the quantity of an item already in their shopping list" }
)

$languages = @("English", "Hindi", "Tamil", "Telugu", "Kannada", "Malayalam", "Bengali", "Marathi")

$allPhrases = [System.Collections.ArrayList]::new()

# Create training directory
if (-not (Test-Path "training")) { New-Item -ItemType Directory -Path "training" -Force | Out-Null }

$total = $intents.Count * $languages.Count
$current = 0

foreach ($intent in $intents) {
    foreach ($lang in $languages) {
        $current++
        Write-Host "[$current/$total] Generating: $($intent.action) x $lang" -ForegroundColor Cyan
        
        $prompt = "Generate 50 unique natural language phrases a real Indian person might say to $($intent.desc), spoken in $lang. Include casual speech, Hinglish mixing (mixing English words into the Indian language), number words like do/teen/char (Hindi), eradu/mooru (Kannada), rendu/moodu (Telugu), irandu/moondru (Tamil), quantity mentions like '2 kg', '3 bottles', varied word order, and filler words like yaar/na/bhi/toh. Write all phrases in ROMANIZED form (English letters, not native script). Return ONLY a JSON array of 50 strings. No explanation, no markdown formatting, no backticks."
        
        $body = @{
            model = "smollm3-3b"
            messages = @(
                @{ role = "system"; content = "You are a dataset generator. Return ONLY valid JSON arrays of strings. No markdown, no explanation, no backticks." },
                @{ role = "user"; content = $prompt }
            )
            max_tokens = 4096
            temperature = 0.9
        } | ConvertTo-Json -Depth 10
        
        $success = $false
        for ($retry = 0; $retry -lt 3; $retry++) {
            try {
                $response = Invoke-RestMethod -Uri $LM_ENDPOINT -Method POST -ContentType "application/json; charset=utf-8" -Body ([System.Text.Encoding]::UTF8.GetBytes($body)) -TimeoutSec 120
                
                $content = $response.choices[0].message.content
                
                # Strip markdown code blocks if present
                $content = $content -replace '```json\s*', '' -replace '```\s*', ''
                $content = $content.Trim()
                
                # Try to extract JSON array
                if ($content -match '\[[\s\S]*\]') {
                    $jsonMatch = $Matches[0]
                    $phrases = $jsonMatch | ConvertFrom-Json
                    
                    if ($phrases.Count -ge 10) {
                        foreach ($phrase in $phrases) {
                            if ($phrase -and $phrase.ToString().Trim().Length -gt 0) {
                                $entry = @{ text = $phrase.ToString().Trim(); label = $intent.action }
                                [void]$allPhrases.Add($entry)
                            }
                        }
                        Write-Host "  Got $($phrases.Count) phrases" -ForegroundColor Green
                        $success = $true
                        break
                    } else {
                        Write-Host "  Only got $($phrases.Count) phrases, retrying..." -ForegroundColor Yellow
                    }
                } else {
                    Write-Host "  No JSON array found in response, retrying..." -ForegroundColor Yellow
                }
            } catch {
                Write-Host "  Error: $($_.Exception.Message), retrying..." -ForegroundColor Red
                Start-Sleep -Seconds 2
            }
        }
        
        if (-not $success) {
            Write-Host "  FAILED after 3 retries for $($intent.action) x $lang" -ForegroundColor Red
        }
        
        # Save intermediate results
        $allPhrases | ConvertTo-Json -Depth 5 | Out-File -FilePath "training\dataset_partial.json" -Encoding UTF8
        
        # Brief pause between calls
        Start-Sleep -Milliseconds 500
    }
}

# Save final dataset
$allPhrases | ConvertTo-Json -Depth 5 | Out-File -FilePath "training\dataset.json" -Encoding UTF8
Write-Host "`nDone! Total phrases: $($allPhrases.Count)" -ForegroundColor Green
Write-Host "Saved to training\dataset.json" -ForegroundColor Green

# Print summary
$summary = $allPhrases | Group-Object { $_.label } | ForEach-Object { "$($_.Name): $($_.Count)" }
Write-Host "`nPer-intent counts:" -ForegroundColor Cyan
$summary | ForEach-Object { Write-Host "  $_" }
