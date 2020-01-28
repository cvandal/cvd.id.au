---
title: "Headless Raspberry Pi... Again"
date: 2019-12-17T20:41:30+11:00
tags: ["Raspberry Pi", "Ubuntu", "Linux"]
image: "/images/raspberry-pi.png"
draft: false
---

### Download, and extract the latest Ubuntu Server image

1. Download the latest 64-bit Ubuntu Server image from [https://ubuntu.com/download/raspberry-pi](https://ubuntu.com/download/raspberry-pi)

2. Extract the image: `unxz ubuntu-*-preinstalled-server-arm64+raspi3.img.xz`

### Write the Ubuntu Server image to an SD card

1. Write the image to an SD card: `sudo dd bs=4M if=/path/to/ubuntu-*-preinstalled-server-arm64+raspi3.img of=/dev/<disk_name> status=progress oflag=sync`

### Connect to the Raspberry Pi

1. Run `ssh ubuntu@<ip_address>`, and enter the default password `ubuntu`. Once you're in, you'll be prompted to change the default password.

### Configure a static IP address

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
