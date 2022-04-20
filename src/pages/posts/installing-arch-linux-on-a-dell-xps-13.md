---
layout: ../../layouts/post.astro
image: /images/logos/arch-linux.png
title: Installing Arch Linux on a Dell XPS 13
description: Installing Arch Linux on a Dell XPS 13
publishDate: 1 Jun 2019
---

# {frontmatter.title}

###### ~~{frontmatter.publishDate}~~ 17 Apr 2022

## Connect to a Wireless Network

1. Run `iwctl`
1. Run `device list` to list the wireless devices
1. Run `station wlan0 scan` to scan for wireless networks
1. Run `station wlan0 get-networks` to list the wireless networks
1. Run `station wlan0 connect '<network_name>'` to connect to a wireless network
1. Run `station wlan0 show` to show information about the currently connected wireless network
1. Run `exit`

## Install Arch Linux

1. Run `archinstall`
1. Enter `26` to select the `us` keyboard layout
1. Enter `0` to select the `Australia` mirror region
1. Enter `1` to select the `/dev/nvme0n1` device. You'll need to press `enter` once again to proceed to the next step
1. Enter `0` to wipe all selected drives and use the best-effort default partition layout
1. Enter `1` to select the `ext4` filesystem
1. **(Optional)** Enter the disk encryption password, or leave blank to skip
1. Enter `n` when prompted to use `GRUB` instead of `systemd-boot`
1. Enter `y` when prompted to use swap on zram
1. Enter the hostname
1. Leave blank to disable root and create a superuser account
1. Enter `chris`
1. Enter the password for the user `chris`. You'll need to do this once more for verification
1. **(Optional)** Enter the username for an additional user, or leave blank to skip
1. Enter `0` to select the `desktop` profile
1. Enter `5` to select the `gnome` desktop environment
1. Enter `2` to select the `Intel (open-source)` graphics drivers
1. Enter `0` to select the `pipewire` audio framework
1. Something something something leave blank for the `linux` kernel
1. Enter `firefox` to install the firefox package
1. Enter `1` to use `NetworkManager`
1. Enter `Australia/Sydney` to set the timezone
1. Enter `y` to use automatic time synchronization
1. Press `enter` to begin the installation
1. Enter `n` when prompted to chroot into the newly created installation and perform post-installation configuration
1. Run `reboot`

## Install and Configure Bluetooth

1. Run `sudo pacman -Syu bluez bluez-utils gnome-bluetooth`
1. Run `sudo systemctl start bluetooth`
1. Run `sudo systemctl enable bluetooth`

![I Use Arch Linux](/images/i-use-arch-linux.jpg "I Use Arch Linux")
