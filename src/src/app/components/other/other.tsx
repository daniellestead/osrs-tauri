import { useState, useEffect } from 'react'
import { PageLayout } from '../layout'
import { Card } from '../../../components/card'
import { Input } from '../../../components/input'
import { Button } from '@heroui/react'
import { GoalCard } from '../goal-card'
import { PlusCircleIcon } from '@heroicons/react/24/outline'
import type { GoalDependency } from '../../types'
import { DependencyPicker } from '../dependency-picker'
import { useAllGoals } from '../../hooks/use-all-goals'
import { notifyGoalsUpdated } from '../../hooks/notify-goals-updated'

interface OtherGoal {
  id: string
  title: string
  isComplete: boolean
  dependencies?: GoalDependency[]
}

export function Other() {
  const [goals, setGoals] = useState<OtherGoal[]>(() => {
    const saved = localStorage.getItem('otherGoals')
    return saved ? JSON.parse(saved) : []
  })
  const [showForm, setShowForm] = useState(false)
  const [goalTitle, setGoalTitle] = useState('')
  const [selectedDeps, setSelectedDeps] = useState<GoalDependency[]>([])
  const { isGoalBlocked, getBlockingDependencies } = useAllGoals()

  useEffect(() => {
    if (goals.length > 0) {
      localStorage.setItem('otherGoals', JSON.stringify(goals))
    } else {
      localStorage.removeItem('otherGoals')
    }
    notifyGoalsUpdated()
  }, [goals])

  const addGoal = () => {
    if (!goalTitle.trim()) return

    const newGoal: OtherGoal = {
      id: Date.now().toString(),
      title: goalTitle.trim(),
      isComplete: false,
      dependencies: selectedDeps.length > 0 ? selectedDeps : undefined,
    }

    setGoals([...goals, newGoal])
    setGoalTitle('')
    setSelectedDeps([])
    setShowForm(false)
  }

  const toggleComplete = (id: string) => {
    setGoals(prevGoals =>
      prevGoals.map(goal =>
        goal.id === id ? { ...goal, isComplete: !goal.isComplete } : goal
      )
    )
  }

  const deleteGoal = (id: string) => {
    setGoals(goals.filter(goal => goal.id !== id))
  }

  return (
    <PageLayout
      headerButton={{
        children: showForm ? 'Cancel' : <PlusCircleIcon className="w-5 h-5" />,
        onClick: () => setShowForm(!showForm),
        isActive: showForm,
      }}
    >
      {showForm && (
        <Card className="flex flex-col gap-3">
          <div className="flex flex-row items-end gap-3">
            <Input
              type="text"
              placeholder="Enter goal description..."
              value={goalTitle}
              onChange={(e) => setGoalTitle(e.target.value)}
              className="flex-1"
              onKeyDown={(e) => e.key === 'Enter' && addGoal()}
            />

            <Button
              onPress={addGoal}
              className="text-white bg-purple-500 hover:bg-purple-700 h-10"
            >
              Add goal
            </Button>
          </div>

          <DependencyPicker
            selectedDependencies={selectedDeps}
            onChange={setSelectedDeps}
          />
        </Card>
      )}

      <div className="grid grid-cols-3 gap-3">
        {goals.map(goal => {
          const blocked = isGoalBlocked(goal.dependencies)
          const blockingDeps = getBlockingDependencies(goal.dependencies)

          return (
            <GoalCard
              key={goal.id}
              id={goal.id}
              title={goal.title}
              currentValue={goal.isComplete ? 1 : 0}
              targetValue={1}
              progress={goal.isComplete ? 100 : 0}
              remainingText=""
              isComplete={goal.isComplete}
              onDelete={deleteGoal}
              type="other"
              onToggleComplete={toggleComplete}
              isBlocked={blocked}
              blockingDependencies={blockingDeps}
            />
          )
        })}
      </div>
    </PageLayout>
  )
}
