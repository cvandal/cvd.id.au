---
title: "Installing Arch Linux on my Dell XPS 13"
date: 2019-06-01T15:46:14+10:00
tags: ["Arch", "Linux", "Dell"]
draft: false
---

## Phase 1

1. Update the system clock: `timedatectl set-ntp true`

2. Partition the disk:
    1. `cfdisk /dev/nvme0n1`

    2. Delete any pre-existing partitions

    3. Create the first partition with a size of `512M`, and a type of `EFI System`

    4. Create the second partition with a size of `4G`, and a type of `Linux Swap`

    5. Create the third partition utilising the remaining disk space, and a type of `Linux Filesystem`

3. Format the partitions, and enable swap:
    1. `mkfs.fat -F32 /dev/nvme0n1p1`

    2. `mkswap /dev/nvme0n1p2`

    3. `swapon /dev/nvme0n1p2`

    4. `mkfs.ext4 /dev/nvme0n1p3`

4. Mount the file system: `mount /dev/nvme0n1p3 /mnt`

5. Enable the `multilib` repository by uncommenting the following lines in `/etc/pacman.conf`:

    ```bash
    #[multilib]
    #Include = /etc/pacman.d/mirrorlist
    ```

6. Install the `base`, and `base-devel` packages: `pacstrap /mnt base base-devel`

7. Generate an fstab file: `genfstab -U /mnt >> /mnt/etc/fstab`<!--more-->

8. Change root into the new system: `arch-chroot /mnt`

9. Set the time zone:
    1. `ln -sf /usr/share/zoneinfo/Australia/Sydney /etc/localtime`

    2. `hwclock --systohc`

10. Set the localisation:
    1. Uncomment `#en_AU.UTF-8 UTF-8`, and `#en_US.UTF-8 UTF-8` in `/etc/locale.gen`: `nano /etc/locale.gen`

    2. `echo "LANG=en_AU.UTF-8" > /etc/locale.conf`

    3. `locale-gen`

11. Set the hostname:
    1. `echo "arch" > /etc/hostname`

    2. `echo "127.0.0.1 localhost" >> /etc/hosts`

    3. `echo "::1 localhost" >> /etc/hosts`

    4. `echo "127.0.0.1 arch.localdomain arch" >> /etc/hosts`

12. Set the root password: `passwd`

13. Install the `apparmor`, `grub`, and `efibootmgr` packages: `pacman -Syu apparmor grub efibootmgr`

14. Configure apparmor, and the grub boot loader:
    1. `systemctl enable apparmor`

    2. `mkdir /boot/efi`

    3. `mount /dev/nvme0n1p1 /boot/efi`

    4. `grub-install --target=x86_64-efi --bootloader-id=grub_uefi --recheck`

    5. Enable apparmor by adding the kernel parameters `apparmor=1 security=apparmor` to `GRUB_CMDLINE_MODULES`: `nano /etc/default/grub`

    6. `grub-mkconfig -o /boot/grub/grub.cfg`

15. Install the `sudo` package: `pacman -Syu sudo`

16. Add a new local user: `useradd -m -g wheel -s /bin/bash chris`

17. Set the password for the new local user: `passwd <username>`

18. Uncomment `#%wheel ALL=(ALL) ALL` to allow sudo access to members of the group `wheel`: `EDITOR=nano visudo`

19. Exit `arch-chroot`: `exit`

20. Reboot the computer: `reboot`

21. Login as: `chris`

22. Start the `dhcpcd` service: `sudo systemctl start dhcpcd`

23. Install must-have packages: `sudo pacman -Syu intel-ucode xf86-video-fbdev xf86-video-intel mesa lib32-mesa xorg sddm plasma asciinema bash-completion bluez bluez-utils cura dnsutils docker dolphin ark firefox freerdp git go gwenview htop jq kate kcalc kdeconnect kompare kfind konsole krdc ksysguard ksystemlog kwalletmanager lutris networkmanager networkmanager-openvpn nfs-utils nodejs npm okular openssh partitionmanager peek pinta powerline powerline-fonts python-pip spectacle steam tmux transmission-qt ttf-bitstream-vera ttf-liberation unzip vim virtualbox virtualbox-guest-iso vlc wget wine-staging winetricks xterm`

24. Enable the `sddm` service: `sudo systemctl enable sddm`

25. Enable the `NetworkManager` service: `sudo systemctl enable NetworkManager`

26. Enable the `bluetooth` service: `sudo systemctl enable bluetooth`

27. Enable the `docker` service: `sudo systemctl enable docker`

28. Add the user `chris` to the group `docker`: `sudo usermod -aG docker chris`

29. Set the inotify watches limit:
    1. `echo "fs.inotify.max_user_watches = 524288" >> /usr/lib/sysctl.d/50-default.conf`

    2. `sudo sysctl -p --system`

30. Reboot the computer: `sudo reboot`

31. Configure the BIOS:
    1. Press `F2`

    2. Select `Boot sequence`

    3. Click `Add boot option`

    4. Set the `Boot option name` to `Arch`

    5. Set the `File name` to `efi/grub/grubx64.efi`

    6. Save your changes, and reboot the computer

## Phase 2

1. Install yay:
    1. `git clone https://aur.archlinux.org/yay.git ~/repos/aur/yay`

    2. `cd ~/repos/aur/yay`

    3. `makepkg -si`

2. Install must-have packages (cont) (aur): `yay -Syu ttf-ms-fonts slack-desktop discord zoom dropbox onedrive-abraunegg mono msbuild-stable dotnet-sdk powershell-bin visual-studio-code-bin rider azuredatastudio postman-bin github-desktop-bin`

3. Configure the bash startup file `.bashrc` by adding the following lines to `~/.bashrc`:

    ```bash
    powerline-daemon -q

    export GOPATH=$HOME/go
    export DOTNET_ROOT=/opt/dotnet
    export POWERLINE_BASH_CONTINUATION=1
    export POWERLINE_BASH_SELECT=1
    export PATH=$PATH:$HOME/.local/bin

    alias ll='ls -lah'
    alias cls='clear'

    . /usr/share/powerline/bindings/bash/powerline.sh
    ```

4. Configure the bash startup file `.inputrc` by adding the following lines to `~/.inputrc`:

    ```bash
    set completion-ignore-case on
    ```

5. Configure VIM
    1. `mkdir -p ~/.vim/autoload ~/.vim/bundle && curl -LSso ~/.vim/autoload/pathogen.vim https://tpo.pe/pathogen.vim`

    2. `git clone https://github.com/scrooloose/nerdtree.git ~/.vim/bundle/nerdtree`

    3. `git clone git://github.com/OmniSharp/omnisharp-vim.git ~/.vim/bundle/omnisharp-vim`

    4. `vim ~/.vimrc`, and add the following content:

        ```bash
        execute pathogen#infect()
        syntax on
        filetype plugin indent on

        autocmd vimenter * NERDTree

        let g:OmniSharp_start_server = 0
        ```

6. Configure `powerline`:
    1. `mkdir -p ~/.config/powerline`

    2. `touch ~/.config/powerline/config.json`

    3. Show the git branch in powerline by adding the following lines to `~/.config/powerline/config.json`:

        ```json
        {
          "ext": {
            "shell": {
              "theme": "default_leftonly"
            }
          }
        }
        ```

7. Install must-have Firefox extensions: `plasma integration`, `duck duck go privacy essentials`, `firefox multi-account containers`, and `lockwise`

{{< figure class="post-image" src="/images/arch.jpg" width="300px" >}}
