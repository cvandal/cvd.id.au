---
layout: ../../layouts/post.astro
image: /images/logos/mizage.png
title: "How to: Run Divvy at Startup with Administrative Privileges"
description: "How to: Run Divvy at Startup with Administrative Privileges"
publishDate: 18 Jan 2020
---

# {frontmatter.title}

###### {frontmatter.publishDate}

1. Create a PowerShell script named `Start-Divvy.ps1` in `C:\Users\$env:UserName\AppData\Local\Mizage LLC\Divvy` with the following content:

```powershell
Start-Process -FilePath "C:\Users\$env:UserName\AppData\Local\Mizage LLC\Divvy\Divvy.exe" -Verb RunAs
```

1. Run `$shell = New-Object -ComObject WScript.Shell`
1. Run `$shortcut = $shell.CreateShortcut("C:\Users\$env:UserName\AppData\Roaming\Microsoft\Windows\Start Menu\Programs\Startup\Divvy.lnk")`
1. Run `$shortcut.TargetPath = '"C:\Program Files\PowerShell\6\pwsh.exe" -Command "C:\Users\$env:UserName\AppData\Local\Mizage LLC\Divvy\Start-Divvy.ps1"'`
1. Run `$shortcut.Save()`
