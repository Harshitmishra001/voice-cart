$ErrorActionPreference = "Stop"
Set-Location -Path $PSScriptRoot

Write-Host "Creating virtual environment..."
python -m venv venv

Write-Host "Activating venv and installing requirements..."
& .\venv\Scripts\python.exe -m pip install --upgrade pip
& .\venv\Scripts\python.exe -m pip install tensorflow==2.15.0 tensorflowjs sentence-transformers scikit-learn "protobuf<3.20"

Write-Host "Running training script..."
& .\venv\Scripts\python.exe train.py

Write-Host "Training complete!"
