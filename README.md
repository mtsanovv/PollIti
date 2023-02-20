# PollIti
An open source political polling agency software.

## Prerequisites
- `podman` & `bash`
- `awk`, `sed`, `grep` but if you have `podman` & `bash`, you *most likely* have those too

## Initial setup
You need to use the template `containerization_config.yml.dist`.

Configure the parameters as follows:
- `AGENCY_NAME` - your agency's name
- `POLLITI_PUBLIC_ORIGIN` - the origin that the agents & poll invitees will be using to access your app (the format is `protocol://domain[:port]`, by default PollIti's origin is `http://<SERVER_IP>:8080`)
    - **Note:** Using the default origin is insecure mostly because the credentials are sent over HTTP and its usage is only fine for development purposes. For productive environments, consider using a reverse proxy (that can be accessed only over HTTPS) for `http://<SERVER_IP>:8080`
- `MAX_LOGIN_ATTEMPTS_PER_IP` - max failed login attempts before a given IP is blocked (recommended value: `10`)
- `LOGIN_ATTEMPTS_HOURS_BEFORE_RESET` - hours until the login attempts for each IP are reset (recommended value: `6`)
    - Considering the `MAX_LOGIN_ATTEMPTS_PER_IP` and `LOGIN_ATTEMPTS_HOURS_BEFORE_RESET` recommended values, the recommended scenario would be max 10 login attempts per IP each 6 hours
- `PAGE_TOKEN` - Meta page token that will be used to post to Facebook and Instagram. Some important remarks:
    - You need to have a Facebook page that's managed by you in order to generate a token
    - It is important to have a linked Instagram **business** account to your page so that the Instagram sharing works properly as well
    - The token is generated from Meta's [Graph API Explorer](https://developers.facebook.com/tools/explorer/). You can learn more on how to obtain it [here](https://docs.squiz.net/funnelback/docs/latest/build/data-sources/facebook/facebook-page-access-token.html)
    - Required token permissions: `pages_show_list`, `business_management`, `instagram_basic`, `instagram_content_publish`, `pages_read_management`, `pages_manage_posts`, `public_profile`
    - Unless you submit your Meta app for review, only you will see posts on your Facebook page that have been published via PollIti
        - **This is not the case for Instagram:** everyone will see posts, published via Polliti, even if the app has not been reviewed by Meta
        - The app review should be pretty easy, as PollIti is open source. They may require some screenshots/videos, though - you can setup a test instance to collect those
- `PAGE_ID` - your Facebook page ID
- `SMTP_HOST`- the SMTP host that PollIti will be connecting to in order to send mail
- `SMTP_USERNAME` - the SMTP username (email) that PollIti will be sending emails from
- `SMTP_PASSWORD`- the password, associated with `SMTP_USERNAME`
    - Since PollIti's backend cannot return such detailed errors for security reasons (but you may be able to see them in the container log), a 500 Internal Server Error will occur if you're trying to connect to Gmail directly with your account's password
        - You will need to setup an App Password, as described by Google themselves [here](https://support.google.com/accounts/answer/185833)
- `SMTP_PORT` - the port of the `SMTP_HOST` that accepts SMTP connections
- `SMTP_ENABLE_STARTTLS`- true/false - instructs the SMTP client to notify the mail server if the contents of emails need to be encrypted (recommended value: `true` - I am actually unaware if any big email hosting providers allow unencrypted emails); you can learn more [here](https://www.anubisnetworks.com/blog/ssl_and_tls_explained_in_5_minutes)
- `DB_USER_PASSWORD` - the password that the PollIti application will be using to connect to the PollIti database (it is on a set-it-and-forget-it principle)
- `POLLITIADMIN_USER_PASSWORD` - master admin (`pollitiAdmin`) password

After you're done configuring `containerization_config.yml.dist`, rename it to `containerization_config.yml`.

## First run
- Call the `containerize.sh` script from a bash shell and based on your `containerization_config.yml` file, it will create the required volumes for the containers, the container images and the containers themselves. It's as simple as running that script - PollIti will be up and running in no time

## Updating the configuration
- If you need to change anything related to the configuration of the PollIti application, feel free to check out the configurable properties inside `<HOME_DIR_OF_THE_USER_THAT_RAN_CONTAINERIZE_SCRIPT>/polliti_podman_volumes/polliti_backend_application.properties` and `<HOME_DIR_OF_THE_USER_THAT_RAN_CONTAINERIZE_SCRIPT>/polliti_podman_volumes/polliti_podman_volumes/polliti_frontend_config.js`
- After making any changes to those configs, don't forget to restart the `polliti_pod` pod using `podman pod restart polliti_pod`

## Updating PollIti
- Currently, there is no update channel available, so you can download the latest sources from the [GitHub repository](https://github.com/mtsanovv/PollIti) (if you've cloned it, you can just run `git pull -r`)
- You can delete the files `<HOME_DIR_OF_THE_USER_THAT_RAN_CONTAINERIZE_SCRIPT_PREVIOUSLY>/polliti_podman_volumes/polliti_backend_application.properties` and `<HOME_DIR_OF_THE_USER_THAT_RAN_CONTAINERIZE_SCRIPT_PREVIOUSLY>/polliti_podman_volumes/polliti_podman_volumes/polliti_frontend_config.js`
- Make sure that your `containerization_config.yml` file contains all the necessary information, as described by `containerization_config.yml.dist` (don't worry if you miss something out - the `containerize.sh` script should report any properties that have not been set)
- Run the `containerize.sh` script

## Important `containerize.sh` remark
- The `containerize.sh` script leaves some leftover podman images every time it runs. Since there is no way to delete the untagged images that are left behind + the ones that will not be used in any containers (except for `podman image prune -a -f`), feel free to see what the leftover images are  by calling `podman images` and to remove those that you don't need using `podman rmi`

## Notes
- This project was created for my bachelor thesis at my university, TU-Sofia and thus the support is limited (but if you open any issues, I *might* consider them)

*M. Tsanov, 2023*