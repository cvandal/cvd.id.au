---
layout: ../../layouts/post.astro
image: /images/logos/rpi.png
title: Raspberry Pi Internet Gateway
description: Raspberry Pi Internet Gateway
publishDate: 17 Jul 2019
---

# {frontmatter.title}

###### {frontmatter.publishDate}

## Install Prerequisite Packages

1. Run `sudo apt update && sudo apt upgrade`
1. Run `sudo apt install ptables-persistent`

## Configure a Static IP Address

1. Run `vim /etc/netplan/50-cloud-init.yaml` and set the following configuration:

    ```yaml
    network:
    ethernets:
        eth0:
            dhcp4: no
            addresses: [<ip_address>/<cidr_prefix>]
            gateway4: <gateway_ip_address>
            nameservers:
                addresses: [1.1.1.1, 1.0.0.1]
    version: 2
    ```

## Enable the Legacy Verion of iptables

1. Run `sudo update-alternatives --config iptables` and select option `1` to enable `iptables-legacy`

## Update iptables

1. Run `sudo iptables -t nat -A POSTROUTING -o eth0 -j MASQUERADE`
1. Run `sudo netfilter-persistent save`

## Enable IP Forwarding

1. Run `vim /etc/sysctl.conf` and uncomment `#net.ipv4.ip_forward = 1`
