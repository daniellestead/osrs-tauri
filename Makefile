.PHONY: release

release:
ifndef v
	$(error Usage: make release v=0.3.0)
endif
	cd src-tauri && sed -i '' 's/"version": ".*"/"version": "$(v)"/' tauri.conf.json
	cd src-tauri && git add tauri.conf.json
	git commit -m "Release v$(v)"
	git push origin --delete v$(v) && git tag -d v$(v)
	git tag v$(v)
	git push origin main --tags
	@echo "Pushed v$(v) — GitHub Actions will build the release draft."
