---
title: "Raspberry Pi Internet Gateway pt. 1"
date: 2019-07-17T13:48:35+10:00
tags: ["Raspberry Pi", "Linux", "OpenVPN"]
draft: false
---

## Install prerequisites

1. Run `sudo apt update && sudo apt upgrade`

2. Run `sudo apt install iptables-persistent openvpn`

## Set a static IP address

1. Add the following content to `/etc/dhcpcd.conf`:

    ```bash
    interface eth0
    static ip_address=192.168.0.2/24
    static routers=192.168.0.1
    static domain_name_servers=1.1.1.1 1.0.0.1
    ```

## Enable the legacy version of iptables

1. Run `sudo update-alternatives --config iptables` and select option `1` to enable `iptables-legacy`

## Update iptables

1. Run `sudo iptables -t nat -A POSTROUTING -o eth0 -j MASQUERADE`

2. Run `sudo iptables -t nat -A POSTROUTING -o tun0 -j MASQUERADE`

3. Run `sudo netfilter-persistent save`

<!--more-->

## Enable IP forwarding

1. Uncomment `#net.ipv4.ip_forward = 1` in `/etc/sysctl.conf`

## Establish a VPN connection

1. Run `sudo openvpn --config /path/to/config.ovpn`
