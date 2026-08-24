$ErrorActionPreference = "Stop"
Set-Location -Path $PSScriptRoot

Write-Host "Creating virtual environment..."
python -m venv venv2

Write-Host "Activating venv and installing requirements..."
& .\venv2\Scripts\python.exe -m pip install --upgrade pip setuptools wheel
& .\venv2\Scripts\python.exe -m pip install tensorflow==2.15.0 tensorflowjs sentence-transformers scikit-learn

Write-Host "Running training script..."
& .\venv2\Scripts\python.exe train.py

Write-Host "Training complete!"
