---
title: "Headless Raspberry Pi"
date: 2019-07-15T15:39:38+10:00
tags: ["Raspberry Pi", "Raspbian", "Linux"]
image: "/images/raspberry-pi.png"
draft: false
---

### Download, and extract the latest Raspbian image

1. Download the latest Raspbian image from `wget https://downloads.raspberrypi.org/raspbian_lite_latest -P ~/Downloads/raspbian.zip`

2. Extract the image: `unzip ~/Downloads/raspbian.zip`

### Write the Raspbian image to an SD card

1. Write the image to an SD card: `sudo dd bs=4M if=/path/to/*-raspbian-*-lite.img of=/dev/<disk_name> status=progress oflag=sync`

### Mount the boot partition

1. Run `sudo mkdir /media/pi`

2. Run `sudo mount /dev/<partition_name> /media/pi`

### Enable SSH

1. Run `touch /media/pi/ssh`
