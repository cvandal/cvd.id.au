---
title: "Headless Raspberry Pi"
date: 2019-07-15T15:39:38+10:00
tags: ["Raspberry Pi", "Raspbian", "Linux"]
draft: false
---

## Download, and extract the latest Raspbian image

1. Run `wget https://downloads.raspberrypi.org/raspbian_lite_latest -P ~/Downloads/raspbian.zip`

2. Run `unzip ~/Downloads/raspbian.zip`

## Write the Raspbian image to an SD card

1. Run `lsblk` and take note of the disk name

2. Run `sudo dd bs=4M if=/path/to/*-raspbian-*-lite.img of=/dev/<disk_name> status=progress oflag=sync`

## Mount the boot partition

1. Run `sudo mkdir /media/pi`

2. Run `sudo mount /dev/<partition_name> /media/pi`

<!--more-->

## Enable SSH

1. Run `touch /media/pi/ssh`

## Enable, and configure WiFi

1. Run `vim /media/pi/wpa_supplicant.conf`, and add the following content:

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
