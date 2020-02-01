---
title: "Securing Plex with MFA"
date: 2020-01-31T09:57:47+11:00
tags: ["Plex", "Nginx", "Okta", "Vouch", "Security", "Ubuntu", "Raspberry Pi"]
image: "/images/plex.png"
draft: false
---

### Configure NGINX

1. Run `sudo vim /etc/nginx/sites-enabled/plex.domain_name.conf` to create the NGINX configuration file for Plex, and then paste the following content:

    ```nginx
    server {
        listen 443 ssl http2;

        server_name plex.domain_name;

        ssl_certificate /path/to/certificate_and_chain.pem
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
            return 302 https://vouch.domain_name/login?url=$scheme://$http_host$request_uri&vouch-failcount=$auth_resp_failcount&X-Vouch-Token=$auth_resp_jwt&error=$auth_resp_err;
        }

        location / {
            proxy_pass http://plex_ip_address:plex_port;

            proxy_set_header X-Vouch-User $auth_resp_x_vouch_user;
        }
    }
    ```

2. Run `sudo vim /etc/nginx/sites-enabled/vouch.domain_name.conf` to create the NGINX configuration file for Vouch, and then paste the following content:

    ```nginx
    server {
        listen 443 ssl http2;

        server_name vouch.domain_name;

        ssl_certificate /path/to/certificate_and_chain.pem
        ssl_certificate_key /path/to/certificate_key.pem

        location / {
            proxy_pass http://127.0.0.1:9090;

            proxy_set_header Host $http_host;
        }
    }
    ```

3. Run `sudo nginx -s reload`

### Configure Okta

1. Browse to [https://developer.okta.com](https://developer.okta.com), and sign in.

2. Click on `Applications`, and then click on `Add Application`.

3. Click on `Web`, and then click on `Next`.

4. Set the following settings, and then click `Done`:

    - `Name` = `plex.domain_name`
    - `Base URIs` = `https://plex.domain_name`
    - `Login Redirect URIs` = `https://vouch.domain_name/auth`
    - Remove the `Logout Redirect URIs`

5. Click on `Security`, and then click on `Multifactor`

6. Click on `Google Authenticator`, and then click on the drop-down menu, and then select `Active`

7. Click on `Security`, and then click on `Authentication`

8. Click on `Sign On`

9. Click on `Add Rule`, set the following settings, and then click `Create Rule`

    - `Rule Name` = `MFA`
    - Select `Prompt for Factor`
    - Select `Per Device`
    - Select `Remember device by default`

### Install, and Configure Go

1. Run `wget https://dl.google.com/go/go1.13.7.linux-arm64.tar.gz -O $HOME/go1.13.7.linux-arm64.tar.gz`

2. Run `sudo tar xzf $HOME/go1.13.7.linux-arm64.tar.gz -C /usr/local`

3. Run `vim $HOME/.bashrc`, and then paste the following content:

    ```bash
    export GOPATH=$HOME/go
    export PATH=$PATH:/usr/local/go/bin
    ```

### Install, and Configure Vouch

1. Run `sudo git clone https://github.com/vouch/vouch-proxy.git /opt && cd /opt/vouch-proxy`

2. Run `sudo vim config/config.yml` to create the Vouch configuration file, and then paste the following content:

    ```yml
    vouch:
      logLevel: info

      listen: 0.0.0.0

      port: 9090

      allowAllUsers: true

      jwt:
        secret: #generate_some_random_44_character_string_and_put_it_here
        issuer: Vouch
        maxAge: 240
        compress: true

      cookie:
        name: VouchCookie
        domain: #domain_name
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
        client_id: #client_id_from_okta
        client_secret: #client_secret_from_okta
        auth_url: #org_url_from_okta/oauth2/default/v1/authorize
        token_url: #org_url_from_okta/oauth2/default/v1/token
        user_info_url: #org_url_from_okta/oauth2/default/v1/userinfo
        scopes:
          - openid
          - email
          - profile
        callback_url: #https://vouch.domain_name/auth
    ```

3. Run `sudo ./do.sh goget`

4. Run `sudo ./do.sh build`

5. Run `sudo adduser vouch-proxy`

6. Run `chown -R vouch-proxy:vouch-proxy /opt/vouch-proxy`

7. Run `sudo cp examples/startup/systemd/vouch-proxy.service /etc/systemd/system/vouch-proxy.service`

8. Run `sudo systemctl enable vouch-proxy.service`

9. Run `sudo systemctl start vouch-proxy.service`
