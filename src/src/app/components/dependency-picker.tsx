import { useState } from 'react'
import { Button, Checkbox } from '@heroui/react'
import { ChevronDownIcon, ChevronUpIcon } from '@heroicons/react/24/outline'
import type { GoalDependency, GoalSummary } from '../types'
import { useAllGoals } from '../hooks/use-all-goals'

interface DependencyPickerProps {
  selectedDependencies: GoalDependency[]
  onChange: (deps: GoalDependency[]) => void
}

export function DependencyPicker({ selectedDependencies, onChange }: DependencyPickerProps) {
  const { allGoals } = useAllGoals()
  const [expanded, setExpanded] = useState(false)

  const availableGoals = allGoals.filter(g => !g.isComplete)

  const isSelected = (goal: GoalSummary) =>
    selectedDependencies.some(d => d.goalId === goal.id && d.goalType === goal.type)

  const toggle = (goal: GoalSummary) => {
    if (isSelected(goal)) {
      onChange(selectedDependencies.filter(d => !(d.goalId === goal.id && d.goalType === goal.type)))
    } else {
      onChange([...selectedDependencies, { goalId: goal.id, goalType: goal.type }])
    }
  }

  if (availableGoals.length === 0) return null

  return (
    <div className="w-full">
      <Button
        className="w-full flex justify-between items-center bg-zinc-800 border border-zinc-700 text-zinc-300 text-sm h-8 px-3"
        onPress={() => setExpanded(!expanded)}
      >
        <span>
          Dependencies {selectedDependencies.length > 0 && `(${selectedDependencies.length})`}
        </span>
        {expanded
          ? <ChevronUpIcon className="w-4 h-4" />
          : <ChevronDownIcon className="w-4 h-4" />
        }
      </Button>

      {expanded && (
        <div className="mt-1 bg-zinc-900 border border-zinc-700 rounded-lg max-h-40 overflow-y-auto p-2 flex flex-col gap-1">
          {availableGoals.map(goal => (
            <label
              key={`${goal.type}-${goal.id}`}
              className="flex items-center gap-2 p-1 hover:bg-zinc-800 rounded cursor-pointer"
            >
              <Checkbox
                isSelected={isSelected(goal)}
                onValueChange={() => toggle(goal)}
                size="sm"
                classNames={{
                  wrapper: "border-zinc-600",
                }}
              />
              {goal.iconPath && <img src={goal.iconPath} alt="" className="w-5 h-5" />}
              <span className="text-sm text-zinc-300">{goal.label}</span>
              <span className="text-xs text-zinc-500 ml-auto">{goal.type}</span>
            </label>
          ))}
        </div>
      )}
    </div>
  )
}
