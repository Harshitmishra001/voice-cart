$ErrorActionPreference = "Stop"
Set-Location -Path $PSScriptRoot

Write-Host "Creating virtual environment..."
python -m venv venv_json

Write-Host "Activating venv and installing requirements..."
& .\venv_json\Scripts\python.exe -m pip install --upgrade pip
& .\venv_json\Scripts\python.exe -m pip install tensorflow==2.15.0 sentence-transformers scikit-learn

Write-Host "Running training script..."
& .\venv_json\Scripts\python.exe train.py

Write-Host "Training complete!"
