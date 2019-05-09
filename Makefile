build:
	cd static/vue && yarn install && yarn build --modern
	yarn install && hugo
	rm -rf public/vue
	cd static/vue && yarn onesignal
run:
	hugo serve & cd static/vue && yarn serve
