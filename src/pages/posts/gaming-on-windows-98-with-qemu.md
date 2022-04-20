---
layout: ../../layouts/post.astro
image: /images/logos/qemu.png
title: Gaming on Windows 98 with QEMU
description: Gaming on Windows 98 with QEMU
publishDate: 15 Aug 2020
---

# {frontmatter.title}

###### {frontmatter.publishDate}

> Use `CTRL+ALT+2` to open/close the QEMU console

> Use `CTRL+ALT+G` to release the mouse

## Download the Windows 98 SE OEM ISO

1. Browse to [https://winworldpc.com/product/windows-98/98-second-edition](https://winworldpc.com/product/windows-98/98-second-edition), and download the Windows 98 SE OEM ISO
1. Run `sudo pacman -Syu p7zip`
1. Run `7z e "Microsoft Windows 98 Second Edition.7z"`
1. Run `mv "Windows 98 Second Edition.iso" win98.iso`

## Install QEMU

1. Run `sudo pacman -Syu qemu-headless`

## Create a Virtual Machine

1. Run `qemu-img create -f qcow2 win98.cow 512M` to create the virtual hard drive
1. Run `qemu-system-x86_64 -cdrom path/to/win98.iso -boot order=d -drive file=/path/to/win98.cow -m 512 -device sb16 -display sdl` to create and start the virtual machine
1. Select `Boot from CD-ROM`

    ![1](/images/posts/gaming-on-windows-98-with-qemu/1.png "1")

1. Select `Start Windows 98 Setup from CD-ROM`

    ![2](/images/posts/gaming-on-windows-98-with-qemu/2.png "2")

1. Press `Enter` to continue

    ![3](/images/posts/gaming-on-windows-98-with-qemu/3.png "3")

1. Press `Enter` to configure unallocated disk space

    ![4](/images/posts/gaming-on-windows-98-with-qemu/4.png "4")

1. Press `Enter` to restart the virtual machine

    ![5](/images/posts/gaming-on-windows-98-with-qemu/5.png "5")

1. Select `Boot from CD-ROM`

    ![6](/images/posts/gaming-on-windows-98-with-qemu/6.png "6")

1. Select `Start Windows 98 Setup from CD-ROM`

    ![7](/images/posts/gaming-on-windows-98-with-qemu/7.png "7")

1. Press `Enter` to continue

    ![8](/images/posts/gaming-on-windows-98-with-qemu/8.png "8")

1. Click on `Continue`

    ![9](/images/posts/gaming-on-windows-98-with-qemu/9.png "9")

1. Ensure `C:\WINDOWS` is selected, and then click on `Next`

    ![10](/images/posts/gaming-on-windows-98-with-qemu/10.png "10")

1. Ensure `Typical` is selected, and then click on `Next`

    ![11](/images/posts/gaming-on-windows-98-with-qemu/11.png "11")

1. Ensure `Install the most common components` is selected, and then click on `Next`

    ![12](/images/posts/gaming-on-windows-98-with-qemu/12.png "12")

1. Leave the `Computer Name`, `Workgroup`, and `Computer Description` as is, and then click on `Next`

    ![13](/images/posts/gaming-on-windows-98-with-qemu/13.png "13")

1. Leave the `Location` as is, and then click on `Next`

    ![14](/images/posts/gaming-on-windows-98-with-qemu/14.png "14")

1. Click on `Next`

    ![15](/images/posts/gaming-on-windows-98-with-qemu/15.png "15")

1. Select `Boot from Hard Disk`

    ![16](/images/posts/gaming-on-windows-98-with-qemu/16.png "16")

1. Within the `Name` field, enter your full name, and then click on `Next`

    ![17](/images/posts/gaming-on-windows-98-with-qemu/17.png "17")

1. Select `I accept the agreement`, and then click on `Next`

    ![18](/images/posts/gaming-on-windows-98-with-qemu/18.png "18")

1. Within the `Serial` field, enter `RW9MG-QR4G3-2WRR9-TG7BH-33GXB` or `RC7JH-VTKHG-RVKWJ-HBC3T-FWGBG`, and then click on `Next`

1. Click on `Finish`

    ![19](/images/posts/gaming-on-windows-98-with-qemu/19.png "19")

1. Select `Boot from Hard Disk`

    ![20](/images/posts/gaming-on-windows-98-with-qemu/20.png "20")

1. Leave the `Date/Time Properties` as is, and then click on `Close`

    ![21](/images/posts/gaming-on-windows-98-with-qemu/21.png "21")

1. Click on `OK`

    ![22](/images/posts/gaming-on-windows-98-with-qemu/22.png "22")

1. Click on `Next`

    ![23](/images/posts/gaming-on-windows-98-with-qemu/23.png "23")

1. Click on `Next`

    ![24](/images/posts/gaming-on-windows-98-with-qemu/24.png "24")

1. Click on `Next`

    ![25](/images/posts/gaming-on-windows-98-with-qemu/25.png "25")

1. Click on `Next`

    ![26](/images/posts/gaming-on-windows-98-with-qemu/26.png "26")

1. Click on `Finish`

    ![27](/images/posts/gaming-on-windows-98-with-qemu/27.png "27")

1. Deselect `Show this screen each time Windows 98 starts`, and then click on `Close`

    ![28](/images/posts/gaming-on-windows-98-with-qemu/28.png "28")

## Install Display Driver

1. Browse to [https://bearwindows.zcm.com.au/vbe9x.htm](https://bearwindows.zcm.com.au/vbe9x.htm)
1. Click on `Download Drivers`
1. Download the latest version of the display driver (`2014.02.14` at the time of writing this blog post)
1. Run `unzip /path/to/140214.zip -d drivers`
1. Run `mkisofs -o drivers.iso drivers` to create an ISO containing the display drivers
1. Press `CTRL+ALT+2` to open the QEMU console

    ![29](/images/posts/gaming-on-windows-98-with-qemu/29.png "29")

1. Run `info block` to list the available devices

    ![30](/images/posts/gaming-on-windows-98-with-qemu/30.png "30")

1. Run `change ide1-cd0 /path/to/drivers.iso`, and then run `info block` again to confirm that the `drivers.iso` has been loaded

    ![31](/images/posts/gaming-on-windows-98-with-qemu/31.png "31")

1. Press `CTRL+ALT+2` to close the QEMU console
1. Click on `Start` -> `Settings` -> `Control Panel`
1. Double-click on `System`
1. Click on the `Device Manager` tab
1. Expand `Display Adapters`, select `Standard Display Adapter (VGA)`, and then click on `Properties`
1. Click on the `Driver` tab, and then click on `Update Driver`
1. Click on `Next`
1. Select `Display a list of all the drivers in a specific location`, and then click on `Next`
1. Click on `Have Disk`
1. Click on `Browse`
1. Within the `Drives` drop-down meny, select `D:`
1. Doulbe-click on `064mb`, and then click on `OK`
1. Click on `OK`
1. Click on `OK`
1. Click on `Next`
1. Click on `Finish`
1. Click on `Yes`
1. Right-click on the desktop, and then click on `Properties`
1. Click on the `Settings` tab
1. Within the `Colors` drop-down menu, select `True Color (32 bit)`
1. Drag the `Screen Area` slider to `1024x768`
1. Click on `OK`
1. Click on `OK`
1. Click on `OK`
1. Click on `Yes`

    ![32](/images/posts/gaming-on-windows-98-with-qemu/32.png "32")

## Install a Game

1. Press `CTRL+ALT+2` to open the QEMU console
1. Run `info block` to list the available devices
1. Run `change ide1-cd0 /path/to/game.iso`
1. Press `CTRL+ALT+2` to close the QEMU console
1. Double-click on `My Computer`

    ![33](/images/posts/gaming-on-windows-98-with-qemu/33.png "33")

1. Double-click on `D:`

    ![34](/images/posts/gaming-on-windows-98-with-qemu/34.png "34")
