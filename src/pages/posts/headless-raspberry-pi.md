---
layout: ../../layouts/post.astro
image: /images/logos/rpi.png
title: Headless Raspberry Pi
description: Headless Raspberry Pi
publishDate: 15 Jul 2019
---

# {frontmatter.title}

###### {frontmatter.publishDate}

## Download and Extract the Ubuntu Server Image

1. Download the latest `arm64` Ubuntu server image from [https://ubuntu.com/download/raspberry-pi](https://ubuntu.com/download/raspberry-pi)
2. Run `unxz ubuntu-*-preinstalled-server-arm64+raspi3.img.xz` to extract the image

## Write the Ubuntu Server Image to an SD Card

1. Run `sudo dd bs=4M if=/path/to/ubuntu-*-preinstalled-server-arm64-*.img of=/dev/disk status=progress oflag=sync` to write the image to an SD card

## SSH to the Raspberry Pi

1. Run `ssh ubuntu@<ip_address>` to SSH to the Raspberry Pi. The default password is `ubuntu`

## Configure a Static IP Address

1. Run `vim /etc/netplan/50-cloud-init.yaml` and set the following configuration:

    ```yaml
    network:
    ethernets:
        eth0:
            dhcp4: no
            addresses: [<ip_address>/<cidr_prefix>]
            gateway4: <gateway_ip_address>
            nameservers:
                addresses: [1.1.1.1, 1.0.0.1]
    version: 2
    ```
