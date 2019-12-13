# Step Template: Run a script
# Step Name: Deploy cvd.id.au
# Execution Location: On a worker from the default worker pool
# Script Source: Script file in a package
# Script Filename: .octopus/Deploy-Website.ps1

Set-Location -Path ..
$env:Path += ";$env:ProgramFiles\nodejs;$home\AppData\Roaming\npm"
& firebase deploy --token $FIREBASE_TOKEN
