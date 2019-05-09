build:
	cd static/vue && yarn install && yarn build --modern && yarn onesignal
	yarn install && hugo
	rm -rf public/vue
run:
	hugo serve & cd static/vue && yarn serve
