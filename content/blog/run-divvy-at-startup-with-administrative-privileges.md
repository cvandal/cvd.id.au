---
title: "Run Divvy at Startup with Administrative Privileges"
date: 2020-01-18T17:16:10+11:00
tags: ["Windows", "PowerShell"]
image: "/images/mizage.png"
draft: false
---

### Create a PowerShell Script

1. Create a PowerShell script named `Start-Divvy.ps1` with the following content:

    ```powershell
    Start-Process -FilePath "C:\Users\$env:UserName\AppData\Local\Mizage LLC\Divvy\Divvy.exe" -Verb RunAs`
    ```

2. Save the PowerShell script to `C:\Users\$env:UserName\AppData\Local\Mizage LLC\Divvy\Start-Divvy.ps1`

### Create a Shortcut

1. Run the following PowerShell commands:

    ```powershell
    $shell = New-Object -ComObject WScript.Shell
    $shortcut = $shell.CreateShortcut("C:\Users\$env:UserName\AppData\Roaming\Microsoft\Windows\Start Menu\Programs\Startup\Divvy.lnk")
    $shortcut.TargetPath = '"C:\Program Files\PowerShell\6\pwsh.exe" -Command "C:\Users\$env:UserName\AppData\Local\Mizage LLC\Divvy\Start-Divvy.ps1"'
    $shortcut.Save()
    ```
