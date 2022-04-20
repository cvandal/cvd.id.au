---
layout: ../../layouts/post.astro
image: /images/logos/fedora.png
title: Installing Fedora 32 on a Surface Laptop 3
description: Installing Fedora 32 on a Surface Laptop 3
publishDate: 5 May 2020
---

# {frontmatter.title}

###### {frontmatter.publishDate}

> Before you begin, ensure that you have an external keyboard and mouse connected to the laptop

## Configure UEFI and Boot from USB

1. Insert the Fedora 32 Live USB
1. Hold down the volume up button, and at the same time, press the power button once
1. Click on `Boot Configuration`
1. Delete the `Windows Boot Manager` option
1. Click on `Exit`, and then click on `Restart Now`
1. Hold down the volume down button
1. Select `start-fedora-workstation-live-32`

## Install Fedora 32

1. Click on `Install to Hard Drive`
1. Click on `Continue`
1. Click on `Time & Date`
1. Set the region to `Australia`
1. Set the city to `Sydney`
1. Click on `Done`
1. Click on `Installation Destination`
1. Click on `Done`
1. Click on `Reclaim Space`
1. Click on `Delete All`
1. Click on `Begin Installation`
1. Click on `Finish Installation`
1. Power off the laptop, and then power on the laptop [^1]
1. Click on `Next`
1. Connect to your WiFi network, and then click on `Next`
1. Disable `Location Services`, disable `Automatic Problem Reporting`, and then click on `Next`
1. Click on `Skip`
1. Enter your `Full Name`, enter your `Username`, and then click on `Next`
1. Click on `Start Using Fedora`

## Prevent DNF from Installing a Newer Linux Kernel

1. Run `echo "exclude=kernel*" | tee -a /etc/dnf/dnf.conf"`

## Install Updates

1. Run `sudo dnf update`
1. Power off the laptop, and then power on the laptop [^1]

## Install the Surface Linux Kernel

1. Run `sudo dnf config-manager --add-repo=https://pkg.surfacelinux.com/fedora/linux-surface.repo`
1. Run `sudo dnf install kernel-surface surface-firmware surface-secureboot --disableexcludes=all`
1. Run `sudo dnf install --allowerasing libwacom-surface`
1. Power off the laptop, and then power on the laptop [^1]
1. Run `sudo grubby --update-kernel=ALL --args=reboot=pci`
1. Power off the laptop, and then power on the laptop [^1]. This will be the last time we need to power off/on instead of restarting.

[^1]: Typically you would simply restart at this point. However, if you restart, your laptop will hang at the Surface logo while booting. This issue will be resolved once the Surface Linux Kernel has been installed.
