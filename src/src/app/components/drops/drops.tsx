import { useState, useEffect } from 'react'
import { PageLayout } from '../layout'
import { Card } from '../../../components/card'
import { Input } from '../../../components/input'
import { Button } from "@heroui/react";
import { GoalCard } from '../goal-card'
import { PlusCircleIcon } from '@heroicons/react/24/outline'
import type { Item } from './types'
import { UseItemSearch } from './use-item-search'
import type { GoalDependency } from '../../types'
import { DependencyPicker } from '../dependency-picker'
import { useAllGoals } from '../../hooks/use-all-goals'
import { notifyGoalsUpdated } from '../../hooks/notify-goals-updated'

interface DropGoal {
  id: string
  itemName: string
  targetDrops: number
  currentDrops: number
  itemIcon?: string
  dependencies?: GoalDependency[]
}

export function Drops() {
  const [goals, setGoals] = useState<DropGoal[]>([])
  const [showForm, setShowForm] = useState(false)
  const [itemName, setItemName] = useState('')
  const [targetDrops, setTargetDrops] = useState('1')
  const [selectedItem, setSelectedItem] = useState<Item | null>(null)
  const [showResults, setShowResults] = useState(false)
  const [selectedDeps, setSelectedDeps] = useState<GoalDependency[]>([])
  const { items, loading, error, searchItems } = UseItemSearch()
  const { isGoalBlocked, getBlockingDependencies } = useAllGoals()

  useEffect(() => {
    const savedGoals = localStorage.getItem('dropGoals')
    if (savedGoals) {
      setGoals(JSON.parse(savedGoals))
    }
  }, [])

  useEffect(() => {
    if (goals.length > 0) {
      localStorage.setItem('dropGoals', JSON.stringify(goals))
      notifyGoalsUpdated()
    }
  }, [goals])

  const addGoal = () => {
    if (!itemName.trim()) return

    const newGoal: DropGoal = {
      id: Date.now().toString(),
      itemName: selectedItem?.name || itemName.trim(),
      targetDrops: Number.parseInt(targetDrops) || 1,
      currentDrops: 0,
      itemIcon: selectedItem?.icon,
      dependencies: selectedDeps.length > 0 ? selectedDeps : undefined,
    }

    setGoals([...goals, newGoal])
    setItemName('')
    setTargetDrops('1')
    setSelectedItem(null)
    setShowResults(false)
    setShowForm(false)
    setSelectedDeps([])
  }

  const handleItemSearch = (value: string) => {
    setItemName(value)
    setSelectedItem(null)

    if (value.length >= 1) {
      searchItems(value.toLowerCase())
      setShowResults(true)
    } else {
      setShowResults(false)
    }
  }

  const selectItem = (item: Item) => {
    setItemName(item.name)
    setSelectedItem(item)
    setShowResults(false)
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
        <div className="relative">
          <Card className="flex flex-col gap-3">
            <div className="flex flex-row items-end gap-3">
              <div className="flex-1 relative">
                <Input
                  type="text"
                  label="Item name"
                  placeholder="Enter item name..."
                  value={itemName}
                  onChange={(e) => handleItemSearch(e.target.value)}
                />

                {showResults && (() => {
                  const filteredItems = items.filter(item =>
                    item.name.toLowerCase().includes(itemName.toLowerCase())
                  )

                  return filteredItems.length > 0 && (
                    <div className="absolute z-50 w-full mt-1 bg-zinc-900 border border-zinc-700 rounded-lg max-h-60 overflow-y-auto shadow-xl">
                      {loading && <div className="p-3 text-zinc-400 text-sm">Loading...</div>}
                      {error && <div className="p-3 text-red-400 text-sm">{error}</div>}
                      {filteredItems.map((item) => (
                        <Button
                          key={item.id}
                          className="w-full flex justify-start items-center gap-2 p-2 bg-zinc-900 hover:bg-zinc-800 text-left transition-colors"
                          onPress={() => selectItem(item)}
                        >
                          <img src={item.icon} alt={item.name} className="w-8 h-8" />
                          <div className="flex flex-col justify-start">
                            <span className="text-white text-sm">{item.name}</span>
                            <span className="text-zinc-400 text-xs">{item.description}</span>
                          </div>
                        </Button>
                      ))}
                    </div>
                  )
                })()}
            </div>

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
          </div>

          <DependencyPicker
            selectedDependencies={selectedDeps}
            onChange={setSelectedDeps}
          />
          </Card>
        </div>
      )}

      <div className="grid grid-cols-3 gap-3">
        {goals.map((goal) => {
          const progress = calculateProgress(goal.currentDrops, goal.targetDrops)
          const isComplete = goal.currentDrops >= goal.targetDrops
          const blocked = isGoalBlocked(goal.dependencies)
          const blockingDeps = getBlockingDependencies(goal.dependencies)

          return (
            <GoalCard
              key={goal.id}
              id={goal.id}
              title={goal.itemName}
              iconPath={goal.itemIcon}
              currentValue={goal.currentDrops}
              targetValue={goal.targetDrops}
              progress={progress}
              remainingText={`${goal.targetDrops - goal.currentDrops} drops remaining`}
              isComplete={isComplete}
              onDelete={deleteGoal}
              type="drop"
              onIncrement={incrementDrops}
              onDecrement={decrementDrops}
              isBlocked={blocked}
              blockingDependencies={blockingDeps}
            />
          )
        })}
      </div>
    </PageLayout>
  )
}
