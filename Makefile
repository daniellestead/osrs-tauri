.PHONY: release

release:
ifndef v
	$(error Usage: make release v=0.3.0)
endif
	@if [ "$$(git branch --show-current)" != "main" ]; then \
		echo "Error: must be on main branch"; exit 1; \
	fi
	@if ! git diff --quiet || ! git diff --cached --quiet; then \
		echo "Error: working tree is dirty — commit or stash changes first"; exit 1; \
	fi
	cd src-tauri && sed -i '' 's/"version": ".*"/"version": "$(v)"/' tauri.conf.json
	cd src-tauri && git add tauri.conf.json
	git diff --cached --quiet || git commit -m "Release v$(v)"
	-git push origin --delete v$(v) 2>/dev/null
	-git tag -d v$(v) 2>/dev/null
	git tag v$(v)
	git push origin v$(v)
	@echo "Pushed v$(v) — GitHub Actions will build the release draft."
