---
title: "X11 Forwarding with WSL1"
date: 2019-10-12T17:28:42+11:00
tags: ["Linux", "Windows", "WSL", "Ubuntu"]
image: "/images/ubuntu.png"
draft: false
---

### Install VcXsrv, and configure OpenSSH

1. Download, and install `VcXsrv Windows X Server` from: [https://sourceforge.net/projects/vcxsrv/](https://sourceforge.net/projects/vcxsrv/)

2. Run `ubuntu.exe`

3. Run `sudo apt purge openssh-server`

4. Run `sudo apt install openssh-server`

5. Run `sudo vim /etc/ssh/sshd_config` and perform the following actions:
    1. Uncomment `#Port 22` and replace `22` with `2222`

    2. Uncomment `#PasswordAuthentication yes`

6. Run `sudo service ssh --full-restart`

7. Run `echo 'export DISPLAY=localhost:0' >> ~/.bashrc`

8. Run `exit`

### Test

1. Run `ssh <username>@127.0.0.1 -p 2222 -X`

2. Launch any graphical application
