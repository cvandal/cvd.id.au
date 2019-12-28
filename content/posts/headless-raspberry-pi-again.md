---
title: "Headless Raspberry Pi... Again"
date: 2019-12-17T20:41:30+11:00
tags: ["Raspberry Pi", "Ubuntu", "Linux"]
draft: false
---

## Download, and extract the latest Ubuntu Server image

1. Download the latest 64-bit Ubuntu Server image from [https://ubuntu.com/download/raspberry-pi](https://ubuntu.com/download/raspberry-pi)

2. Run `unxz ubuntu-*-preinstalled-server-arm64+raspi3.img.xz`

## Write the Ubuntu Server image to an SD card

1. Run `lsblk`, and take note of the disk name

2. Run `sudo dd bs=4M if=/path/to/ubuntu-*-preinstalled-server-arm64+raspi3.img of=/dev/<disk_name> status=progress oflag=sync`

<!--more-->

## SSH

1. Run `ssh ubuntu@<ip_address>`, and enter the default password `ubuntu`. Once you're in, you'll be prompted to change the default password.

## Configure a Static IP Address

1. Run `vim /etc/netplan/50-cloud-init.yaml`, and set the following configuration:

    ```bash
    network:
    ethernets:
        eth0:
            dhcp4: no
            addresses: [<ip_address>/<cidr_prefix>]
            gateway4: <gateway_ip_address>
            nameservers:
                    addresses: [1.1.1.1,1.0.0.1]
    version: 2
    ```
