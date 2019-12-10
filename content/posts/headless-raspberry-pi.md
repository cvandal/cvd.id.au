---
title: "Headless Raspberry Pi"
date: 2019-07-15T15:39:38+10:00
tags: ["Raspberry Pi", "Linux"]
draft: false
---

## Download and extract the latest Raspbian image

1. `wget https://downloads.raspberrypi.org/raspbian_lite_latest -P ~/Downloads/raspbian.zip`

2. `unzip ~/Downloads/raspbian.zip`

## List block devices

1. `lsblk`

## Write the Raspbian image to an SD card

1. `sudo dd bs=4M if=/path/to/file.img of=/dev/<disk_name> status=progress oflag=sync`

## Mount the boot partition

1. `sudo mkdir /media/pi`

2. `sudo mount /dev/<partition_name> /media/pi`

<!--more-->

## Enable SSH

1. `touch /media/pi/ssh`

## Enable and configure WiFi

1. `vim /media/pi/wpa_supplicant.conf` and add the following content:

    ```bash
    ctrl_interface=DIR=/var/run/wpa_supplicant GROUP=netdev
    update_config=1
    country=AU

    network={
        ssid="<ssid>"
        psk="<password>"
        key_mgmt=WPA-PSK
    }
    ```
