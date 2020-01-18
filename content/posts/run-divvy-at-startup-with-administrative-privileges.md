---
title: "Run Divvy at Startup with Administrative Privileges"
date: 2020-01-18T17:16:10+11:00
draft: false
---

## Create a PowerShell Script to Run Divvy with Administrative Privileges

1. Create a file named `Start-Divvy.ps1` with the following content:

`Start-Process -FilePath "C:\Users\$env:UserName\AppData\Local\Mizage LLC\Divvy\Divvy.exe" -Verb RunAs`

## Create a Shortcut to Run the PowerShell Script in your Startup Folder

1. Create a shortcut in `C:\Users\$env:UserName\AppData\Roaming\Microsoft\Windows\Start Menu\Programs\Startup` named `Divvy`.
2. Set the `Target` of the shortcut to `"C:\Program Files\PowerShell\6\pwsh.exe" -Command "/path/to/Start-Divvy.ps1"`
