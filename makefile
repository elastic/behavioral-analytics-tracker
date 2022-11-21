deploy:
	[ -n "$(ent_search_dir)" ] || { echo "No ENT-SEARCH directory specified. Use ent_search_dir argument to specify location of directory."; exit 1; }
	echo "Running Build"
	yarn build
	echo "Copying files to $(ent_search_dir)"
	cp -r packages/browser-tracker/dist/iife/index.js $(ent_search_dir)/public/analytics.js
