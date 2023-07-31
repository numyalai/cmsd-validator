# cmsd-validator

The validator was tested on Ubuntu 22.04.2 LTS using nginx 1.22.1.

## Installation instructions by [karmatothex](https://github.com/karmatothex) from https://github.com/karmatothex/awt-pj-ss22-streaming-analytics-using-cmcd-and-cmsd-1

- **Install nginx**: `sudo apt install nginx`
- **Install NJS module**: `sudo apt install nginx-module-njs`
	- Possible error:  "E: Unable to locate package nginx-module-njs"
	- Follow those steps to get the newest nginx version: https://nginx.org/en/linux_packages.html#Ubuntu
	- Run `sudo apt install nginx-module-njs` again
- **Install echo module**, look into https://github.com/openresty/echo-nginx-module#installation or follow these steps:
	- Create directory for temporary nginx installation: `mkdir tmp_nginx` + `cd tmp_nginx`
	- Copy path for later (e.g. `pwd` ->  `/home/username/Documents/tmp_nginx`)
	- `cd ~/Downloads`
	- Download echo module: `wget 'https://github.com/openresty/echo-nginx-module/archive/refs/tags/v0.62.tar.gz'`
	- Unzip: `tar xf v0.62.tar.gz`
	- `cd echo-nginx-module-0.62/`
	- Copy path for later (e.g. `pwd` ->  `/home/username/Downloads/echo-nginx-module-0.62`)
	- `cd ..`
	- Check version of global nginx version: `nginx -v` (e.g. 1.22.0)
	- Download file for temporary nginx installation  (needs to be the same version as the current global nginx installation❗): `wget 'http://nginx.org/download/nginx-1.22.0.tar.gz'`
	- Unzip: `tar xf nginx-1.22.0.tar.gz`
	-  `cd nginx-1.22.0/`
	-  Install temporary nginx with downloaded module into temporary folder: `./configure --with-compat --prefix=/home/username/Documents/tmp_nginx --add-dynamic-module=/home/username/Downloads/echo-nginx-module-0.62` 
		- Possible PCRE library error -> `sudo apt install libpcre3 libpcre3-dev`, then run `./configure ...` command again
		- Possible zlib error -> `sudo apt install zlib1g-dev` and`sudo apt install zlib1g`, then run `./configure ...` command again
	- `make -j2`
	- `make install`
	- Copy the module from temporary installation into global nginx installation: `sudo cp /home/username/Documents/tmp_nginx/modules/ngx_http_echo_module.so /usr/lib/nginx/modules/`

## Running the project

For using the test server the BigBuckBunny video has to be added to <ABSOLUTE-PATH-TO>/cmsd-validator/server/nginx/media/vod/bbb_30_fps_akamai from the [NUStreaming](https://github.com/NUStreaming/CMSD-DASH/tree/master/server/nginx/media/vod/bbb_30fps_akamai) project.

Change the Paths in line 28 and 47 of [nginx.conf](https://github.com/numyalai/cmsd-validator/blob/main/server/nginx/config/nginx.conf) to fit your local datastructure.

Start the nginx server using: `sudo nginx -c <ABSOLUTE-PATH-TO>/cmsd-validator/server/nginx/config/nginx.conf`
Open http://localhost:8080 in a web browser.

The video from the test server starts running automatically. To change the CMSD header keys the test server sends use the checkboxes.

To stop the test server use: `sudo killall nginx`

For testing a CMSD server use the input field and add the URL to the manifest file.

## Notes

The test server which is also hosting the website is running on port 8080. Change the port of the CMSD server to be tested or change the test server port in line 26 of [nginx.conf](https://github.com/numyalai/cmsd-validator/blob/main/server/nginx/config/nginx.conf) and in lines 12, 18 and 111 of [index.js](https://github.com/numyalai/cmsd-validator/blob/main/index.js).

The URL of the test server is http://localhost:8080/cmsdValidator/media/vod/bbb_30fps_akamai/bbb_30fps.mpd

For running the validator without the test server, the index.html can be opend directly with a web browser.
