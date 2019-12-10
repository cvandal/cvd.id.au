---
title: "X11 Forwarding with WSL1"
date: 2019-10-12T17:28:42+11:00
tags: ["Linux", "Windows", "WSL"]
draft: false
---

## On Windows

1. Download, install and then run `VcXsrv Windows X Server`: [https://sourceforge.net/projects/vcxsrv/](https://sourceforge.net/projects/vcxsrv/)

## On WSL

1. Uninstall the `openssh-server` package: `sudo apt purge openssh-server`

2. Install the `openssh-server` package: `sudo apt install openssh-server`

3. Edit the SSH config file: `sudo vim /etc/ssh/sshd_config`
    1. Uncomment `#Port 22` and replace `22` with `2222`

    2. Uncomment `#PasswordAuthentication yes`

4. Restart the `ssh` service: `sudo service ssh --full-restart`

5. Exit the current session: `exit`

6. Start a new session: `ssh <username>@127.0.0.1 -p 2222 -X`

7. Set the `$DISPLAY` environment variable: `export DISPLAY=localhost:0`

8. Launch any graphical application

<!--more-->
