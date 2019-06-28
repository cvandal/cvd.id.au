---
title: "Provision a single Octopus server with an RDS MSSQL database using Terraform"
date: 2019-06-11T19:22:37+10:00
tags: ["Octopus", "RDS", "Terraform"]
postSummary: >
    ## Terraform
    
    ```

    provider "aws" {
        region     = "ap-southeast-2"
        access_key = "${var.primary_aws_access_key}"
        secret_key = "${var.primary_aws_secret_key}"
    }


    provider "aws" {
        alias      = "cvd"
        region     = "ap-southeast-2"
        access_key = "${var.secondary_aws_access_key}"
        secret_key = "${var.secondary_aws_secret_key}"
    }


    data "aws_ami" "ami" {
        most_recent = true
        owners      = ["801119661308"]

        filter {
            name   = "name"
            values = ["Windows_Server-2019-English-Core-Base-*"]
        }

        filter {
            name   = "virtualization-type"
            values = ["hvm"]
        }
    }
    
    ```
draft: false
---

## Terraform

```
provider "aws" {
    region     = "ap-southeast-2"
    access_key = "${var.primary_aws_access_key}"
    secret_key = "${var.primary_aws_secret_key}"
}

provider "aws" {
    alias      = "cvd"
    region     = "ap-southeast-2"
    access_key = "${var.secondary_aws_access_key}"
    secret_key = "${var.secondary_aws_secret_key}"
}

data "aws_ami" "ami" {
    most_recent = true
    owners      = ["801119661308"]

    filter {
        name   = "name"
        values = ["Windows_Server-2019-English-Core-Base-*"]
    }

    filter {
        name   = "virtualization-type"
        values = ["hvm"]
    }
}

resource "aws_vpc" "vpc" {
    cidr_block           = "10.0.0.0/16"
    enable_dns_support   = true
    enable_dns_hostnames = true

    tags = {
        Name = "cvd-vpc"
    }
}

resource "aws_subnet" "public_subnet_a" {
    vpc_id                  = "${aws_vpc.vpc.id}"
    cidr_block              = "10.0.0.0/24"
    availability_zone       = "ap-southeast-2a"
    map_public_ip_on_launch = true

    tags = {
        Name = "cvd-public-subnet-a"
    }
}

resource "aws_subnet" "public_subnet_b" {
    vpc_id                  = "${aws_vpc.vpc.id}"
    cidr_block              = "10.0.1.0/24"
    availability_zone       = "ap-southeast-2b"
    map_public_ip_on_launch = true

    tags = {
        Name = "cvd-public-subnet-b"
    }
}

resource "aws_subnet" "private_subnet_a" {
    vpc_id                  = "${aws_vpc.vpc.id}"
    cidr_block              = "10.0.2.0/24"
    availability_zone       = "ap-southeast-2a"
    map_public_ip_on_launch = true

    tags = {
        Name = "cvd-private-subnet-a"
    }
}

resource "aws_subnet" "private_subnet_b" {
    vpc_id                  = "${aws_vpc.vpc.id}"
    cidr_block              = "10.0.3.0/24"
    availability_zone       = "ap-southeast-2b"
    map_public_ip_on_launch = true

    tags = {
        Name = "cvd-private-subnet-b"
    }
}

resource "aws_internet_gateway" "internet_gateway" {
    vpc_id = "${aws_vpc.vpc.id}"

    tags = {
        Name = "cvd-internet-gateway"
    }
}

resource "aws_eip" "nat_gateway_eip" {
    vpc = true

    tags = {
        Name = "cvd-nat-gateway-eip"
    }
}

resource "aws_eip" "instance_eip" {
    vpc = true

    tags = {
        Name = "cvd-instance-eip"
    }
}

resource "aws_nat_gateway" "nat_gateway" {
    allocation_id = "${aws_eip.nat_gateway_eip.id}"
    subnet_id     = "${aws_subnet.public_subnet_a.id}"

    tags = {
        Name = "cvd-nat-gateway"
    }
}

resource "aws_route_table" "public_route_table" {
    vpc_id = "${aws_vpc.vpc.id}"

    route {
        cidr_block = "0.0.0.0/0"
        gateway_id = "${aws_internet_gateway.internet_gateway.id}"
    }

    tags = {
        Name = "cvd-public-route-table"
    }
}

resource "aws_route_table" "private_route_table" {
    vpc_id = "${aws_vpc.vpc.id}"

    route {
        cidr_block     = "0.0.0.0/0"
        nat_gateway_id = "${aws_nat_gateway.nat_gateway.id}"
    }

    tags = {
        Name = "cvd-private-route-table"
    }
}

resource "aws_route_table_association" "public_route_table_association_a" {
    subnet_id      = "${aws_subnet.public_subnet_a.id}"
    route_table_id = "${aws_route_table.public_route_table.id}"
}

resource "aws_route_table_association" "public_route_table_association_b" {
    subnet_id      = "${aws_subnet.public_subnet_b.id}"
    route_table_id = "${aws_route_table.public_route_table.id}"
}

resource "aws_route_table_association" "private_route_table_association_a" {
    subnet_id      = "${aws_subnet.private_subnet_a.id}"
    route_table_id = "${aws_route_table.private_route_table.id}"
}

resource "aws_route_table_association" "private_route_table_association_b" {
    subnet_id      = "${aws_subnet.private_subnet_b.id}"
    route_table_id = "${aws_route_table.private_route_table.id}"
}

resource "aws_security_group" "db_instance_security_group" {
    name = "cvd-db-instance-security-group"
    description = "cvd-db-instance-security-group"
    vpc_id = "${aws_vpc.vpc.id}"

    ingress {
        from_port   = 1433
        to_port     = 1433
        protocol    = "tcp"
        cidr_blocks = ["${aws_vpc.vpc.cidr_block}"]
    }

    egress {
        from_port   = 0
        to_port     = 0
        protocol    = "-1"
        cidr_blocks = ["0.0.0.0/0"]
    }

    tags = {
        Name = "cvd-db-instance-security-group"
    }
}

resource "aws_security_group" "instance_security_group" {
    name = "cvd-instance-security-group"
    description = "cvd-instance-security-group"
    vpc_id = "${aws_vpc.vpc.id}"

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

    tags = {
        Name = "cvd-instance-security-group"
    }
}

resource "aws_db_subnet_group" "db_subnet_group" {
    name        = "cvd-db-subnet-group"
    description = "cvd-db-subnet-group"
    subnet_ids  = ["${aws_subnet.private_subnet_a.id}", "${aws_subnet.private_subnet_b.id}"]

    tags = {
        Name = "cvd-db-subnet-group"
    }
}

resource "aws_db_instance" "db_instance" {
    identifier              = "cvd-db-instance"

    instance_class          = "db.t2.micro"
    storage_type            = "gp2"
    allocated_storage       = 20

    vpc_security_group_ids  = ["${aws_security_group.db_instance_security_group.id}"]
    db_subnet_group_name    = "${aws_db_subnet_group.db_subnet_group.name}"
    availability_zone       = "ap-southeast-2a"
    publicly_accessible     = false

    engine                  = "sqlserver-ex"
    engine_version          = "14.00.3049.1.v1"
    license_model           = "license-included"
    username                = "${var.rds_username}"
    password                = "${var.rds_password}"
    timezone                = "AUS Eastern Standard Time"
    port                    = 1433

    parameter_group_name    = "default.sqlserver-ex-14.0"
    option_group_name       = "default:sqlserver-ex-14-00"

    backup_retention_period = 0
    backup_window           = "00:00-01:00"
    maintenance_window      = "Mon:01:00-Mon:02:00"

    skip_final_snapshot     = true
}

resource "aws_key_pair" "key_pair" {
    key_name   = "cvd-key-pair"
    public_key = "${var.key_pair_public_key}"
}

resource "aws_instance" "instance" {
    ami                    = "${data.aws_ami.ami.id}"

    instance_type          = "t2.micro"

    vpc_security_group_ids = ["${aws_security_group.instance_security_group.id}"]
    subnet_id              = "${aws_subnet.public_subnet_a.id}"
    availability_zone      = "ap-southeast-2a"

    key_name               = "${aws_key_pair.key_pair.key_name}"

    root_block_device {
        volume_type           = "gp2"
        volume_size           = 120
        delete_on_termination = true
    }

    user_data = <<EOF
    <powershell>
    $hostname = $env:ComputerName
    $localAdminPassword = "${var.local_admin_password}"
    $localAdminPasswordAsSecureString = ConvertTo-SecureString -String $localAdminPassword -AsPlainText -Force
    $rdsUsername = "${var.rds_username}"
    $rdsPassword = "${var.rds_password}"
    $rdsEndpoint = "${aws_db_instance.db_instance.address}"
    $octopusUsername = "${var.octopus_username}"
    $octopusPassword = "${var.octopus_password}"

    Get-LocalUser -Name "Administrator" | Set-LocalUser -Password $localAdminPasswordAsSecureString

    Set-TimeZone -Name "AUS Eastern Standard Time"

    New-Item -ItemType "Directory" -Path "C:\tmp"

    (New-Object -TypeName "System.Net.WebClient").DownloadFile("https://aka.ms/vs/16/release/vc_redist.x64.exe", "C:\tmp\vc_redist.x64.exe")
    (New-Object -TypeName "System.Net.WebClient").DownloadFile("https://download.microsoft.com/download/E/6/B/E6BFDC7A-5BCD-4C51-9912-635646DA801E/en-US/msodbcsql_17.3.1.1_x64.msi", "C:\tmp\msodbcsql_17.3.1.1_x64.msi")
    (New-Object -TypeName "System.Net.WebClient").DownloadFile("https://download.microsoft.com/download/4/A/3/4A323490-8EC0-48AE-9F22-638AA6C508C6/EN/x64/MsSqlCmdLnUtils.msi", "C:\tmp\MsSqlCmdLnUtils.msi")
    (New-Object -TypeName "System.Net.WebClient").DownloadFile("https://octopus.com/downloads/fastlane/WindowsX64/OctopusServer", "C:\tmp\OctopusServer.msi")

    Start-Process -FilePath "C:\tmp\vc_redist.x64.exe" -ArgumentList "/install /quiet /norestart" -NoNewWindow -Wait
    Start-Process -FilePath "msiexec.exe" -ArgumentList "/i C:\tmp\msodbcsql_17.3.1.1_x64.msi IACCEPTMSODBCSQLLICENSETERMS=YES /qn" -NoNewWindow -Wait
    Start-Process -FilePath "msiexec.exe" -ArgumentList "/i C:\tmp\MsSqlCmdLnUtils.msi IACCEPTMSSQLCMDLNUTILSLICENSETERMS=YES /qn" -NoNewWindow -Wait
    Start-Process -FilePath "msiexec.exe" -ArgumentList "/i C:\tmp\OctopusServer.msi /qn" -NoNewWindow -Wait

    & "C:\Program Files\Microsoft SQL Server\Client SDK\ODBC\170\Tools\Binn\SQLCMD.EXE" -S $rdsEndpoint -U $rdsUsername -P $rdsPassword -Q "DROP DATABASE IF EXISTS [Octopus]"
    & "C:\Program Files\Octopus Deploy\Octopus\Octopus.Server.exe" create-instance --instance="OctopusServer" --config="C:\Octopus\OctopusServer.config"
    & "C:\Program Files\Octopus Deploy\Octopus\Octopus.Server.exe" database --instance="OctopusServer" --connectionString="Data Source=$rdsEndpoint;Initial Catalog=Octopus;Integrated Security=False;User ID=$rdsUsername;Password=$rdsPassword" --create
    & "C:\Program Files\Octopus Deploy\Octopus\Octopus.Server.exe" configure --instance="OctopusServer" --webForceSSL="False" --webListenPrefixes="http://localhost/" --commsListenPort="10943" --serverNodeName=$hostname --usernamePasswordIsEnabled="True"
    & "C:\Program Files\Octopus Deploy\Octopus\Octopus.Server.exe" service --instance="OctopusServer" --stop
    & "C:\Program Files\Octopus Deploy\Octopus\Octopus.Server.exe" admin --instance="OctopusServer" --username=$octopusUsername --email="" --password=$octopusPassword
    & "C:\Program Files\Octopus Deploy\Octopus\Octopus.Server.exe" service --instance="OctopusServer" --install --reconfigure --start

    New-NetFirewallRule -DisplayName "Octopus Server (80)" -Direction "Inbound" -LocalPort 80 -Protocol "TCP" -Action "Allow"
    New-NetFirewallRule -DisplayName "Octopus Server (443)" -Direction "Inbound" -LocalPort 443 -Protocol "TCP" -Action "Allow"
    New-NetFirewallRule -DisplayName "Octopus Tentacle (10943)" -Direction "Inbound" -LocalPort 10943 -Protocol "TCP" -Action "Allow"
    </powershell>
    EOF

    tags = {
        Name = "cvd-instance"
    }
}

resource "aws_eip_association" "instance_eip_association" {
    instance_id   = "${aws_instance.instance.id}"
    allocation_id = "${aws_eip.instance_eip.id}"
}

resource "aws_route53_record" "route53_record" {
    provider = "aws.cvd"
    zone_id  = "${var.route53_zone_id}"
    name     = "deploy"
    type     = "A"
    ttl      = "300"
    records  = ["${aws_eip.instance_eip.public_ip}"]
}
```

## Post Terraform

1. Enable Let's Encrypt

2. Enable HTTP Strict Transport Security:
    ```
    & "C:\Program Files\Octopus Deploy\Octopus\Octopus.Server.exe" configure --instance="OctopusServer" --webForceSSL="True"
    & "C:\Program Files\Octopus Deploy\Octopus\Octopus.Server.exe" configure --hstsEnabled=true --hstsMaxAge=31556926
    ```
