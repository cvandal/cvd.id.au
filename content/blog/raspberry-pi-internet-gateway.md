---
title: "Raspberry Pi Internet Gateway"
date: 2019-07-17T13:48:35+10:00
tags: ["Raspberry Pi", "Linux", "OpenVPN"]
image: "/images/raspberry-pi.png"
draft: false
---

### Install prerequisites

1. Run `sudo apt update && sudo apt upgrade`

2. Run `sudo apt install iptables-persistent openvpn`

### Set a static IP address

1. Run `vim /etc/netplan/50-cloud-init.yaml`, and set the following configuration:

    ```bash
    network:
    ethernets:
        eth0:
            dhcp4: no
            addresses: [<ip_address>/<cidr_prefix>]
            gateway4: <gateway_ip_address>
            nameservers:
                    addresses: [1.1.1.1,1.0.0.1]
    version: 2
    ```

### Enable the legacy version of iptables

1. Run `sudo update-alternatives --config iptables` and select option `1` to enable `iptables-legacy`

### Update iptables

1. Run `sudo iptables -t nat -A POSTROUTING -o eth0 -j MASQUERADE`

2. Run `sudo iptables -t nat -A POSTROUTING -o tun0 -j MASQUERADE`

3. Run `sudo netfilter-persistent save`

### Enable IP forwarding

1. Run `vim /etc/sysctl.conf` and uncomment `#net.ipv4.ip_forward = 1`
