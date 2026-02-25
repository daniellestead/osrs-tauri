export function notifyGoalsUpdated() {
  window.dispatchEvent(new Event('goals-updated'))
}
