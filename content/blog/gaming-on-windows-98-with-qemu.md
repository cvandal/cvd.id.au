---
title: "Gaming on Windows 98 with QEMU"
date: 2020-08-15T17:55:51+10:00
tags:
  [
    "Windows",
    "Windows 98",
    "QEMU",
    "Virtualisation",
    "Virtualization",
    "Gaming",
    "Games",
  ]
image: "/images/qemu.png"
draft: false
---

### Download the Windows 98 SE OEM ISO

1. Browse to [https://winworldpc.com/product/windows-98/98-second-edition](https://winworldpc.com/product/windows-98/98-second-edition), and download the Windows 98 SE OEM ISO

### Create the Windows 98 SE Virtual Machine

1. Create the virtual hard drive. Run `qemu-img create -f qcow2 win98.cow 512M`

2. Start the virtual machine. Run `qemu-system-x86_64 -cdrom win98.iso -boot order=d -drive file=win98.cow -m 512 -soundhw sb16 -display sdl`

3. Select `Boot from CD-ROM`

{{< figure src="/images/win98-1.png" >}}

4. Select `Start Windows 98 Setup from CD-ROM`

{{< figure src="/images/win98-2.png" >}}

5. Press `ENTER`

{{< figure src="/images/win98-3.png" >}}

6. Press `ENTER`

{{< figure src="/images/win98-4.png" >}}

7. Press `ENTER`

{{< figure src="/images/win98-5.png" >}}

8. Select `Boot from CD-ROM`

{{< figure src="/images/win98-1.png" >}}

9. Select `Start Windows 98 Setup from CD-ROM`

{{< figure src="/images/win98-2.png" >}}

10. Press `ENTER`

{{< figure src="/images/win98-6.png" >}}

11. Click on `Continue`

{{< figure src="/images/win98-7.png" >}}

12. Click on `Next`

{{< figure src="/images/win98-8.png" >}}

13. Click on `Next`

{{< figure src="/images/win98-9.png" >}}

14. Click on `Next`

{{< figure src="/images/win98-10.png" >}}

15. Change the default `Computer Name` if you like, and then click on `Next`

{{< figure src="/images/win98-11.png" >}}

16. Change the default `Location` if you like, and then click on `Next`

{{< figure src="/images/win98-12.png" >}}

17. Click on `Next`

{{< figure src="/images/win98-13.png" >}}

18. Select `Boot from Hard Disk`

{{< figure src="/images/win98-14.png" >}}

19. Within the `Name` field, enter your full name, and then click on `Next`

{{< figure src="/images/win98-15.png" >}}

20. Select `I accept the agreement`, and then click on `Next`

{{< figure src="/images/win98-16.png" >}}

21. Within the `Serial` field, enter `RW9MG-QR4G3-2WRR9-TG7BH-33GXB` or `RC7JH-VTKHG-RVKWJ-HBC3T-FWGBG`, and then click on `Next`

22. Click on `Finish`

{{< figure src="/images/win98-17.png" >}}

23. Select `Boot from Hard Disk`

{{< figure src="/images/win98-14.png" >}}

24. Change the default `Time Zone`, `Date`, and `Time` if you like, and then click on `Close`

{{< figure src="/images/win98-18.png" >}}

25. Click on `OK`

{{< figure src="/images/win98-19.png" >}}

26. Click on `Next`

{{< figure src="/images/win98-20.png" >}}

27. Click on `Next`

{{< figure src="/images/win98-21.png" >}}

28. Click on `Next`

{{< figure src="/images/win98-22.png" >}}

29. Click on `Next`

{{< figure src="/images/win98-23.png" >}}

30. Click on `Finish`

{{< figure src="/images/win98-24.png" >}}

31. Deselect `Show this screen each time Windows 98 starts`, and click on `Close`

{{< figure src="/images/win98-25.png" >}}

### Install Display Driver

1. Browse to [https://bearwindows.zcm.com.au/vbe9x.htm](https://bearwindows.zcm.com.au/vbe9x.htm), and download the latest version of the display driver.

2. Create a temp folder. Run `mkdir display-driver`

3. Extract the display driver archive to the temp folder. Run `unzip /path/to/display-driver.zip -d display-driver`

4. Create an ISO containing the contents of the temp folder. Run `mkisofs -o display-driver/display.iso display-driver`

5. With QEMU as the active window, press `CTRL+ALT+2` to open the QEMU monitor

{{< figure src="/images/win98-26.png" >}}

6. Run `info block`

{{< figure src="/images/win98-27.png" >}}

7. Run `change ide1-cd0 /path/to/display.iso`, and then run `info block` again to confirm that the `display.iso` has been loaded.

{{< figure src="/images/win98-28.png" >}}

8. With QEMU as the active window, press `CTRL+ALT+2` to close the QEMU monitor

9. Click on `Start` -> `Settings` -> `Control Panel`

10. Double-click on the `System` icon

11. Click on the `Device Manager` tab

12. Expand `Display Adapters`, Select `Standard Display Adapter (VGA)`, and then click `Properties`

13. Click on the `Driver` tab, and then click on `Update Driver`

14. Click on `Next`

15. Select `Display a list of all the drivers in a specific location`, and then click `Next`

16. Click `Have Disk`

17. Click `Browse`

18. Within the `Drives` drop-down menu, select `D:`

19. Double-click on the `064mb` folder, and then click on `OK`

20. Click on `OK`

21. Click on `OK`

22. Click on `Next`

23. Click on `Finish`

24. Click on `Yes`

25. Right-click on the desktop, and then click on `Properties`

26. Click on the `Settings` tab

27. Within the `Colors` drop-down menu, select `True Color (32 bit)`

28. Drag the `Screen Area` slider to `1024 by 768`

29. Click on `OK`

30. Click on `OK`

31. Click on `Yes`

{{< figure src="/images/win98-29.png" >}}

### Install a Game

1. With QEMU as the active window, press `CTRL+ALT+2` to open the QEMU monitor

2. Run `change ide1-cd0 /path/to/game.iso`

3. With QEMU as the active window, press `CTRL+ALT+2` to close the QEMU monitor

4. Double-click on `My Computer`

{{< figure src="/images/win98-30.png" >}}

5. Double-click on `D:`

{{< figure src="/images/win98-31.png" >}}
