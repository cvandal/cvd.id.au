---
layout: ../../layouts/post.astro
image: /images/logos/octopus.svg
title: "How to: Provision an Octopus Server using Terraform"
description: "How to: Provision an Octopus Server using Terraform"
publishDate: 11 Jun 2019
---

# {frontmatter.title}

###### {frontmatter.publishDate}

## main.tf

```hcl
terraform {
  backend "remote" {
    organization = "<organization_name>"

    workspaces {
      name = "<workspace_name>"
    }
  }

  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 3.0"
    }
  }
}

provider "aws" {
  region     = var.aws_region
  access_key = var.aws_access_key
  secret_key = var.aws_secret_key
}
```

## vpc.tf

```hcl
resource "aws_vpc" "octopus" {
  cidr_block           = "10.0.0.0/26"
  enable_dns_hostnames = true
}
```

## subnet.tf

```hcl
resource "aws_subnet" "octopus_public_a" {
  vpc_id            = aws_vpc.octopus.id
  cidr_block        = "10.0.0.0/28"
  availability_zone = "ap-southeast-2a"
}

resource "aws_subnet" "octopus_public_b" {
  vpc_id            = aws_vpc.octopus.id
  cidr_block        = "10.0.0.16/28"
  availability_zone = "ap-southeast-2b"
}
```

## igw.tf

```hcl
resource "aws_internet_gateway" "octopus" {
  vpc_id = aws_vpc.octopus.id
}
```

## route-table.tf

```hcl
resource "aws_default_route_table" "octopus" {
  default_route_table_id = aws_vpc.octopus.default_route_table_id

  route {
    cidr_block = "0.0.0.0/0"
    gateway_id = aws_internet_gateway.octopus.id
  }
}
```

## key-pair.tf

```hcl
resource "aws_key_pair" "octopus" {
  key_name   = "octopus"
  public_key = var.public_key
}
```

## security-group.tf

```hcl
resource "aws_security_group" "octopus" {
  name   = "octopus"
  vpc_id = aws_vpc.octopus.id

  ingress {
    from_port   = 80
    to_port     = 80
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  ingress {
    from_port   = 443
    to_port     = 443
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  ingress {
    from_port   = 10943
    to_port     = 10943
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }
}
```

## asg.tf

```hcl
data "aws_ami" "ubuntu" {
  most_recent = true
  owners      = ["801119661308"]

  filter {
    name   = "name"
    values = ["Windows_Server-2022-English-Core-Base-*"]
  }

  filter {
    name   = "virtualization-type"
    values = ["hvm"]
  }
}

resource "aws_launch_template" "octopus" {
  name_prefix   = "octopus-"
  image_id      = data.aws_ami.ubuntu.id
  instance_type = "t3.medium"
  key_name      = aws_key_pair.octopus.key_name

  user_data = base64encode(templatefile("${path.module}/user-data.tpl", {
    DB_ADDRESS       = var.db_address
    DB_USERNAME      = var.db_username
    DB_PASSWORD      = var.db_password
    OCTOPUS_USERNAME = var.octopus_username
    OCTOPUS_PASSWORD = var.octopus_password
  }))

  network_interfaces {
    associate_public_ip_address = true
    security_groups             = [aws_security_group.octopus.id]
  }
}

resource "aws_autoscaling_group" "octopus" {
  name_prefix      = "octopus-"
  desired_capacity = 1
  min_size         = 1
  max_size         = 1

  vpc_zone_identifier = [
    aws_subnet.octopus_public_a.id,
    aws_subnet.octopus_public_b.id
  ]

  launch_template {
    id      = aws_launch_template.octopus.id
    version = aws_launch_template.octopus.latest_version
  }
}
```

## user-data.tpl

```powershell
<powershell>
New-Item -ItemType "Directory" -Path "C:\tmp"

(New-Object -TypeName "System.Net.WebClient").DownloadFile("https://octopus.com/downloads/fastlane/WindowsX64/OctopusServer", "C:\tmp\OctopusServer.msi")
Start-Process -FilePath "msiexec.exe" -ArgumentList "/i C:\tmp\OctopusServer.msi /qn" -NoNewWindow -Wait

& "C:\Program Files\Octopus Deploy\Octopus\Octopus.Server.exe" create-instance --instance="OctopusServer" --config="C:\Octopus\OctopusServer.config"
& "C:\Program Files\Octopus Deploy\Octopus\Octopus.Server.exe" database --instance="OctopusServer" --connectionString="Data Source=${DB_ADDRESS};Initial Catalog=Octopus;Integrated Security=False;User ID=${DB_USERNAME};Password=${DB_PASSWORD}" --create
& "C:\Program Files\Octopus Deploy\Octopus\Octopus.Server.exe" configure --instance="OctopusServer" --webForceSSL=false --webListenPrefixes="http://localhost/" --commsListenPort=10943 --serverNodeName=$env:ComputerName --usernamePasswordIsEnabled=true
& "C:\Program Files\Octopus Deploy\Octopus\Octopus.Server.exe" service --instance="OctopusServer" --stop
& "C:\Program Files\Octopus Deploy\Octopus\Octopus.Server.exe" admin --instance="OctopusServer" --username="${OCTOPUS_USERNAME}" --email="" --password="${OCTOPUS_PASSWORD}"
& "C:\Program Files\Octopus Deploy\Octopus\Octopus.Server.exe" service --instance="OctopusServer" --install --reconfigure --start

New-NetFirewallRule -DisplayName "Octopus Server (80)" -Direction "Inbound" -LocalPort 80 -Protocol "TCP" -Action "Allow"
New-NetFirewallRule -DisplayName "Octopus Server (443)" -Direction "Inbound" -LocalPort 443 -Protocol "TCP" -Action "Allow"
New-NetFirewallRule -DisplayName "Octopus Server (10943)" -Direction "Inbound" -LocalPort 10943 -Protocol "TCP" -Action "Allow"
</powershell>
```
