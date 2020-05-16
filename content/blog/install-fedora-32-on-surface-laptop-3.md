---
title: "Install Fedora 32 on Surface Laptop 3"
date: 2020-05-05T09:26:56+10:00
draft: false
---

> Before you begin, ensure that you have connected an external keyboard, and mouse.

## Configure UEFI, and boot from USB

1. Insert the Fedora 32 Live USB.

2. Press and hold the volume up button and at the same time, press and release the power button.

3. Click on `Boot Configuration`.

4. Delete the `Windows Boot Manager` option.

5. Click on `Exit`, and then click on `Restart Now`.

6. Press and hold the volume down button.

7. Select `start-fedora-workstation-live 32`.

## Install Fedora 32

1. Click on `Install to Hard Drive`.

2. Click on `Continue`.

3. Click on `Time and Date`.

4. Set the region to `Australia`.

5. Set the city to `Sydney`.

6. Click on `Done`.

7. Click on `Installation Destination`.

8. Click on `Done`.

9. Click on `Reclaim Space`.

10. Click on `Delete All`.

11. Click on `Begin Installation`.

12. Click on `Finish Installation`.

13. Power off the laptop, and then power on the laptop †.

14. Click on `Next`.

15. Connect to your WiFi network, and then click on `Next`.

16. Disable `Location Services`, disable `Automatic Problem Reporting`, and then click on `Next`.

17. Click on `Skip`.

18. Enter your `Full Name`, enter your `Username`, and then click on `Next`.

19. Click on `Start Using Fedora`.

## Prevent DNF from installing a newer Linux Kernel

1. Run `echo "exclude=kernel*" > "/etc/dnf/dnf.conf"`.

## Install updates

1. Run `sudo dnf update`.

2. Power off the laptop, and then power on the laptop †.

## Switch to Xorg

1. At the login screen, click on the cog icon, click on `Gnome of Xorg`, and then login.

## Install the Surface Linux Kernel

1. Run `sudo dnf config-manager --add-repo=https://pkg.surfacelinux.com/fedora/linux-surface.repo`.

2. Run `sudo dnf install kernel-surface surface-firmware surface-secureboot --disableexcludes=all`.

3. Run `sudo dnf install --allowerasing libwacom-surface`.

4. Power off the laptop, and then power on the laptop †.

5. Run `sudo grubby --update-kernel=ALL --args=reboot=pci`

6. Power off the laptop, and then power on the laptop † - This is the last time you'll need to power off/on instead of restarting.

> At this point you no longer need to have an external keyboard, and mouse connected.

## Change the display scale, and resolution

1. Open the `Display` settings, and set the `Scale` from `200%` to `100%`.

2. Run

   ```
   sudo tee /etc/X11/xorg.conf.d/10-monitor.conf << END
   Section "Monitor"
       Identifier "eDP-1"
       Modeline "1920x1280_60.00"  206.25  1920 2056 2256 2592  1280 1283 1293 1327 -hsync +vsync
       Option "PreferredMode" "1920x1280_60.00"
   EndSection
   END
   ```

3. Run `sudo dnf install vim`.

4. Run `sudo vim /usr/share/glib-2.0/schemas/org.gnome.desktop.interface.gschema.xml`.

5. Enter `/name="scaling-factor"`, change the default value from `0` to `1`, and then enter `:wq`.

6. Run `sudo glib-compile-schemas /usr/share/glib-2.0/schemas`.

7. Restart the laptop

## Notes

† _Normally you would restart at this point, however if you restart, your laptop will hang at the Surface logo while booting._
