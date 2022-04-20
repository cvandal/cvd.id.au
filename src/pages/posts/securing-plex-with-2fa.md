---
layout: ../../layouts/post.astro
image: /images/logos/plex.png
title: Securing Plex with 2FA
description: Securing Plex with 2FA
publishDate: 31 Jan 2020
---

# {frontmatter.title}

###### ~~{frontmatter.publishDate}~~ 16 Apr 2021

> As of the 16th of April 2021, you can natively enable two-factor authentication to help protect your Plex account.

## Configure NGINX

1. Run `sudo vim /etc/nginx/sites-enabled/plex.example.com.conf` to create the NGINX configuration file for Plex, and then paste the following content:

```nginx
server {
    listen 443 ssl http2;

    server_name plex.example.com;

    ssl_certificate /path/to/certificate.pem
    ssl_certificate_key /path/to/certificate_key.pem

    auth_request /validate;

    location = /validate {
        proxy_pass http://127.0.0.1:9090/validate;
        proxy_pass_request_body off;

        proxy_set_header Host $http_host;
        proxy_set_header Content-Length "";

        auth_request_set $auth_resp_x_vouch_user $upstream_http_x_vouch_user;
        auth_request_set $auth_resp_jwt $upstream_http_x_vouch_jwt;
        auth_request_set $auth_resp_err $upstream_http_x_vouch_err;
        auth_request_set $auth_resp_failcount $upstream_http_x_vouch_failcount;
    }

    error_page 401 = @error401;

    location @error401 {
        return 302 https://vouch.example.com/login?url=$scheme://$http_host$request_uri&vouch-failcount=$auth_resp_failcount&X-Vouch-Token=$auth_resp_jwt&error=$auth_resp_err;
    }

    location / {
        proxy_pass http://127.0.0.1:32400;

        proxy_set_header X-Vouch-User $auth_resp_x_vouch_user;
    }
}
```

1. Run `sudo vim /etc/nginx/sites-enabled/vouch.example.com.conf` to create the NGINX configuration file for Vouch, and then paste the following content:

```nginx
server {
    listen 443 ssl http2;

    server_name vouch.example.com;

    ssl_certificate /path/to/certificate.pem
    ssl_certificate_key /path/to/certificate_key.pem

    location / {
        proxy_pass http://127.0.0.1:9090;

        proxy_set_header Host $http_host;
    }
}
```

1. Run `sudo nginx -s reload`

## Configure Okta

1. Browse to [https://developer.okta.com](https://developer.okta.com) and sign in
1. Click on `Applications`, and then click on `Add Application`
1. Click on `Web`, and then click on `Next`
1. Apply the following settings, and then click on `Done`:
    1. `Name` = `plex.example.com`
    1. `Base URIs` = `https://plex.example.com`
    1. `Login Redirect URIs` = `https://vouch.example.com/auth`
    1. Remove the `Logout Redirect URIs`
1. Click on `Security`, and then click on `Multifactor`
1. Click on `Google Authenticator`, click on the drop-down menu, and then select `Active`
1. Click on `Security`, and then click on `Authentication`
1. Click on `Sign On`
1. Click on `Add Rule`, apply the following settings, and then click on `Create Rule`
    1. `Rule Name` = `MFA`
    1. Select `Prompt for Factor`
    1. Select `Per Device`
    1. Select `Remember Device by Default`

## Install and Configure Vouch

1. Run `wget https://dl.google.com/go/go1.13.7.linux-arm64.tar.gz -O $HOME/go1.13.7.linux-arm64.tar.gz`
1. Run `sudo tar xzf $HOME/go1.13.7.linux-arm64.tar.gz -C /usr/local`
1. Run `vim ~/.bashrc`, and add the following content:
    ```bash
    export GOPATH=$HOME/go
    export PATH=$PATH:/usr/local/go/bin
    ```

1. Run `source ~/.bashrc`
1. Run `sudo git clone https://github.com/vouch/vouch-proxy.git /opt && cd /opt/vouch-proxy`
1. Run `sudo vim config/config.yml` to create the Vouch configuration file, and then paste the following content:
    ```yaml
    vouch:
        logLevel: info

        listen: 0.0.0.0

        port: 9090

        allowAllUsers: true

        jwt:
            secret: <random_44_character_string>
            issuer: Vouch
            maxAge: 240
            compress: true

        cookie:
            name: VouchCookie
            domain: example.com
            secure: true
            httpOnly: false
            maxAge: 0

        headers:
            jwt: X-Vouch-Token
            querystring: access_token
            redirect: X-Vouch-Requested-URI

        claims:
            - groups
            - given_name

        oauth:
            provider: oidc
            client_id: <okta_client_id>
            client_secret: <okta_client_secret>
            auth_url: <okta_org_url>/oauth2/default/v1/authorize
            token_url: <okta_org_url>/oauth2/default/v1/token
            user_info_url: <okta_org_url>/oauth2/default/v1/userinfo
            scopes:
                - openid
                - email
                - profile
            callback_url: https://vouch.example.com/auth
    ```

1. Run `sudo ./do.sh goget`
1. Run `sudo ./do.sh build`
1. Run `sudo adduser vouch-proxy`
1. Run `chown -R vouch-proxy:vouch-proxy /opt/vouch-proxy`
1. Run `sudo cp examples/startup/systemd/vouch-proxy.service /etc/systemd/system/vouch-proxy.service`
1. Run `sudo systemctl enable vouch-proxy.service`
1. Run `sudo systemctl start vouch-proxy.service`
