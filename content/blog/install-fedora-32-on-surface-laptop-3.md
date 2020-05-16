---
title: "Install Fedora 32 on Surface Laptop 3"
date: 2020-05-05T09:26:56+10:00
draft: true
---

configure bios:
hold volume up while booting
boot configuration -> delete the windows boot manager
exit -> restart now

boot usb:
hold volume down while booting
select start-fedora-workstation-live 32

install fedora:
click install to hard drive
click continue
click time and date
set region to australia
set city to sydney
click done
click installation destination
click done
click reclaim space
click delete all
click reclaim space
click begin installation
click finish installation
power off - do not restart otherwise the laptop will hang at the surface logo
power on
click next
connect to wifi, click next
disable location services, disable automatic problem reporting, click next
click skip
enter full name, enter username, click next
enter password, click next
click start using fedora
close the getting started window

block new kernels:
sudo dnf install vim
sudo vim /etc/dnf/dnf.conf
add line `exclude=kernel*`

install updates:
sudo dnf update
power off - do not restart otherwise the laptop will hang at the surface logo

switch to x11:
power on
click the cog icon, click on gnome on xorg
sign in

install custom kernel:
sudo dnf config-manager --add-repo=https://pkg.surfacelinux.com/fedora/linux-surface.repo
sudo dnf install kernel-surface surface-firmware surface-secureboot --disableexcludes=all
sudo dnf install --allowerasing libwacom-surface
power off - do not restart otherwise the laptop will hang at the surface logo
power on
sudo grubby --update-kernel=ALL --args=reboot=pci
sudo grubby --info=ALL
power off - do not restart otherwise the laptop will hang at the surface logo... after this point, you can restart as per normal
