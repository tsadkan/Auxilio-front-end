build:
	cd static/vue && yarn install && yarn build --modern
	yarn install
	cd static/vue && rm -rf node_modules/.bin
	hugo
	rm -rf public/vue
	cd static/vue && yarn onesignal
run:
	hugo serve & cd static/vue && yarn serve
