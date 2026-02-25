import { useSyncExternalStore } from 'react'
import type { GoalSummary, GoalDependency } from '../types'

function getSnapshot(): string {
  const skills = localStorage.getItem('skillGoals') || '[]'
  const drops = localStorage.getItem('dropGoals') || '[]'
  const other = localStorage.getItem('otherGoals') || '[]'
  return skills + '||' + drops + '||' + other
}

function subscribe(callback: () => void): () => void {
  window.addEventListener('storage', callback)
  window.addEventListener('goals-updated', callback)
  return () => {
    window.removeEventListener('storage', callback)
    window.removeEventListener('goals-updated', callback)
  }
}

export function useAllGoals() {
  const raw = useSyncExternalStore(subscribe, getSnapshot)
  const [skillsRaw, dropsRaw, otherRaw] = raw.split('||')

  const skillGoals = JSON.parse(skillsRaw) as Array<{
    id: string; skillName: string; targetLevel: number;
    currentLevel: number; currentXp: number
  }>

  const dropGoals = JSON.parse(dropsRaw) as Array<{
    id: string; itemName: string; targetDrops: number;
    currentDrops: number; itemIcon?: string
  }>

  const otherGoals = JSON.parse(otherRaw) as Array<{
    id: string; title: string; isComplete: boolean
  }>

  const allGoals: GoalSummary[] = [
    ...skillGoals.map(g => ({
      id: g.id,
      type: 'skill' as const,
      label: `${g.targetLevel} ${g.skillName}`,
      iconPath: `/skills/${g.skillName.toLowerCase()}.png`,
      isComplete: g.currentLevel >= g.targetLevel,
    })),
    ...dropGoals.map(g => ({
      id: g.id,
      type: 'drop' as const,
      label: g.itemName,
      iconPath: g.itemIcon,
      isComplete: g.currentDrops >= g.targetDrops,
    })),
    ...otherGoals.map(g => ({
      id: g.id,
      type: 'other' as const,
      label: g.title,
      isComplete: g.isComplete,
    })),
  ]

  function isGoalBlocked(dependencies?: GoalDependency[]): boolean {
    if (!dependencies || dependencies.length === 0) return false
    return dependencies.some(dep => {
      const target = allGoals.find(g => g.id === dep.goalId && g.type === dep.goalType)
      if (!target) return false
      return !target.isComplete
    })
  }

  function getBlockingDependencies(dependencies?: GoalDependency[]): GoalSummary[] {
    if (!dependencies || dependencies.length === 0) return []
    return dependencies
      .map(dep => allGoals.find(g => g.id === dep.goalId && g.type === dep.goalType))
      .filter((g): g is GoalSummary => g !== undefined && !g.isComplete)
  }

  return { allGoals, isGoalBlocked, getBlockingDependencies }
}
