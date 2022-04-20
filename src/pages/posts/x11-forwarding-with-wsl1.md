---
layout: ../../layouts/post.astro
image: /images/logos/wsl.png
title: X11 Forwarding with WSL1
description: X11 Forwarding with WSL1
publishDate: 12 Oct 2019
---

# {frontmatter.title}

###### {frontmatter.publishDate}

## Download and Install VcXsrv

1. Download and install [VcXsrv Windows X Server](https://sourceforge.net/projects/vcxsrv/)

## Configure OpenSSH

1. Run `ubuntu.exe`
1. Run `sudo apt purge openssh-server`
1. Run `sudo apt install openssh-server`
1. Run `sudo vim /etc/ssh/sshd_config` and uncomment the following lines:
    1. Uncomment `#Port 22` and replace `22` with `2222`
    1. Uncomment `#PasswordAuthentication yes`
1. Run `sudo service ssh --full-restart`
1. Run `echo 'export DISPLAY=localhost:0' | tee -a ~/.bashrc`
1. Run `exit`

## Usage

1. Run `ssh <username>@127.0.0.1 -p 2222 -X`
1. Run any graphical application
