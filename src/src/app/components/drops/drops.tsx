import { useState, useEffect } from 'react'
import { PageLayout } from '../layout'
import { Card } from '../../../components/card'
import { Input } from '../../../components/input'
import { Button } from '../../../components/button'
import { GoalCard } from "../goal-card"
import { PlusCircleIcon } from "@heroicons/react/24/outline"

interface DropGoal {
  id: string
  itemName: string
  targetDrops: number
  currentDrops: number
}

export function Drops() {
  const [goals, setGoals] = useState<DropGoal[]>([])
  const [showForm, setShowForm] = useState(false)
  const [itemName, setItemName] = useState('')
  const [targetDrops, setTargetDrops] = useState('1')

  useEffect(() => {
    const savedGoals = localStorage.getItem('dropGoals')
    if (savedGoals) {
      setGoals(JSON.parse(savedGoals))
    }
  }, [])

  useEffect(() => {
    if (goals.length > 0) {
      localStorage.setItem('dropGoals', JSON.stringify(goals))
    }
  }, [goals])

  const addGoal = () => {
    if (!itemName.trim()) return

    const newGoal: DropGoal = {
      id: Date.now().toString(),
      itemName: itemName.trim(),
      targetDrops: Number.parseInt(targetDrops) || 1,
      currentDrops: 0,
    }

    setGoals([...goals, newGoal])
    setItemName('')
    setTargetDrops('1')
    setShowForm(false)
  }

  const deleteGoal = (id: string) => {
    const updatedGoals = goals.filter((goal) => goal.id !== id)
    setGoals(updatedGoals)
    if (updatedGoals.length === 0) {
      localStorage.removeItem('dropGoals')
    }
  }

  const incrementDrops = (id: string) => {
    setGoals((prevGoals) =>
      prevGoals.map((goal) =>
        goal.id === id ? { ...goal, currentDrops: goal.currentDrops + 1 } : goal
      )
    )
  }

  const decrementDrops = (id: string) => {
    setGoals((prevGoals) =>
      prevGoals.map((goal) =>
        goal.id === id && goal.currentDrops > 0
          ? { ...goal, currentDrops: goal.currentDrops - 1 }
          : goal
      )
    )
  }

  const calculateProgress = (current: number, target: number): number => {
    return (current / target) * 100
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
        <Card className="flex flex-row items-end gap-3">
          <Input
            type="text"
            label="Item name"
            placeholder="Enter item name..."
            value={itemName}
            onChange={(e) => setItemName(e.target.value)}
            className="flex-1"
          />

          <Input
            type="number"
            label="Target drops"
            placeholder="1"
            min={1}
            value={targetDrops}
            onChange={(e) => setTargetDrops(e.target.value)}
            className="w-32"
          />

          <Button
            onPress={addGoal}
            className="text-white bg-purple-500 hover:bg-purple-700 h-10"
          >
            Add goal
          </Button>
        </Card>
      )}

      <div className="grid grid-cols-[repeat(auto-fill,minmax(300px,1fr))] gap-3">
        {goals.map((goal) => {
          const progress = calculateProgress(goal.currentDrops, goal.targetDrops)
          const isComplete = goal.currentDrops >= goal.targetDrops

          return (
            <GoalCard
              key={goal.id}
              id={goal.id}
              title={goal.itemName}
              currentValue={goal.currentDrops}
              targetValue={goal.targetDrops}
              progress={progress}
              remainingText={`${goal.targetDrops - goal.currentDrops} drops remaining`}
              isComplete={isComplete}
              onDelete={deleteGoal}
              type="drop"
              onIncrement={incrementDrops}
              onDecrement={decrementDrops}
            />
          )
        })}
      </div>
    </PageLayout>
  )
}
