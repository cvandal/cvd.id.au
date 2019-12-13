# Step Template: Run a script
# Step Name: Install Dependencies
# Execution Location: On a worker from the default worker pool
# Script Source: Script file in a package
# Script Filename: .octopus/Install-Dependencies.ps1

& choco install -y nodejs
$env:Path += ";$env:ProgramFiles\nodejs"
& npm install -g firebase-tools --no-optional
