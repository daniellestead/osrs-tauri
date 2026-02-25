export type GoalType = 'skill' | 'drop' | 'other'

export interface GoalDependency {
  goalId: string
  goalType: GoalType
}

export interface GoalSummary {
  id: string
  type: GoalType
  label: string
  iconPath?: string
  isComplete: boolean
}
