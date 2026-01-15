import { useState, useEffect } from "react"
import { PageLayout } from "../layout"
import { GoalCard } from '../goal-card'
import { Card } from '../../../components/card'
import { Input } from '../../../components/input'
import { Select, SelectItem } from '@heroui/react'
import { Button } from '../../../components/button'
import { SKILLS, XP_TABLE } from "./types"
import { PlusCircleIcon } from "@heroicons/react/24/outline"

interface SkillGoal {
  id: string
  skillName: string
  targetLevel: number
  currentLevel: number
  currentXp: number
}

interface Skill {
  name: string
  level: number
  xp: number
}

export function Skills() {
  const [goals, setGoals] = useState<SkillGoal[]>([])
  const [showForm, setShowForm] = useState(false)
  const [selectedSkill, setSelectedSkill] = useState('')
  const [targetLevel, setTargetLevel] = useState('99')
  const [playerSkills, setPlayerSkills] = useState<Skill[]>([])

  useEffect(() => {
    // Load player skills from localStorage first
    const savedSkills = localStorage.getItem('playerSkills')
    if (savedSkills) {
      const skills = JSON.parse(savedSkills)
      setPlayerSkills(skills)
      
      // Then load goals and update them with current player data
      const savedGoals = localStorage.getItem('skillGoals')
      if (savedGoals) {
        const loadedGoals = JSON.parse(savedGoals)
        const updatedGoals = loadedGoals.map((goal: SkillGoal) => {
          const skill = skills.find((s: Skill) => s.name.toLowerCase() === goal.skillName.toLowerCase())
          if (skill) {
            return { ...goal, currentLevel: skill.level, currentXp: skill.xp }
          }
          return goal
        })
        setGoals(updatedGoals)
      }
    } else {
      // If no player skills, just load goals
      const savedGoals = localStorage.getItem('skillGoals')
      if (savedGoals) {
        setGoals(JSON.parse(savedGoals))
      }
    }
  }, [])

  // Save goals to localStorage whenever they change
  useEffect(() => {
    if (goals.length > 0) {
      localStorage.setItem('skillGoals', JSON.stringify(goals))
    }
  }, [goals])

  // Update goals when player skills change
  useEffect(() => {
    if (playerSkills.length > 0 && goals.length > 0) {
      setGoals(prevGoals => {
        const updatedGoals = prevGoals.map(goal => {
          const skill = playerSkills.find((s: Skill) => s.name.toLowerCase() === goal.skillName.toLowerCase())
          if (skill) {
            return { ...goal, currentLevel: skill.level, currentXp: skill.xp }
          }
          return goal
        })
        return updatedGoals
      })
    }
  }, [playerSkills])

  const addGoal = () => {
    if (!selectedSkill) return

    const targetLevelNum = parseInt(targetLevel)
    if (isNaN(targetLevelNum) || targetLevelNum < 2 || targetLevelNum > 99) {
      alert('Please enter a valid level between 2 and 99')
      return
    }

    const skill = playerSkills.find(s => s.name.toLowerCase() === selectedSkill.toLowerCase())
    const currentLevel = skill?.level || 1
    const currentXp = skill?.xp || 0

    if (currentLevel >= targetLevelNum) {
      alert(`You already have level ${currentLevel} ${selectedSkill}! Choose a higher target level.`)
      return
    }

    const newGoal: SkillGoal = {
      id: Date.now().toString(),
      skillName: selectedSkill,
      targetLevel: targetLevelNum,
      currentLevel,
      currentXp
    }

    setGoals([...goals, newGoal])
    setShowForm(false)
    setSelectedSkill('')
    setTargetLevel('99')
  }

  const deleteGoal = (id: string) => {
    setGoals(goals.filter(goal => goal.id !== id))
  }

  const calculateProgress = (currentXp: number, targetLevel: number) => {
    const targetXp = XP_TABLE[targetLevel] || 0
    return targetXp > 0 ? (currentXp / targetXp) * 100 : 0
  }

  const getXpRemaining = (currentXp: number, targetLevel: number) => {
    const targetXp = XP_TABLE[targetLevel] || 0
    return Math.max(0, targetXp - currentXp)
  }

  return (
    <PageLayout 
      headerButton={{
        children: showForm ? 'Cancel' : <PlusCircleIcon className="w-5 h-5" />,
        onClick: () => setShowForm(!showForm),
        isActive: showForm
      }}
    >
      {showForm && (
        <Card className="flex flex-row items-end gap-3">
            <Select 
              selectionMode="single"
              selectedKeys={selectedSkill ? [selectedSkill] : []}
              onSelectionChange={(keys) => {
                const selected = Array.from(keys)[0] as string
                setSelectedSkill(selected)
              }}
              size="md"
              className="flex-1 max-h-10"
              classNames={{
                trigger: "bg-zinc-900 border-zinc-700 hover:bg-zinc-800 focus-within:bg-zinc-900 data-[hover=true]:bg-zinc-800",
                value: "text-white!",
                label: "text-zinc-300",
                popoverContent: "bg-zinc-900 border-zinc-700",
              }}
              renderValue={(items) => {
                return (
                  <div className="flex items-center gap-2">
                    {items.map((item) => (
                      <Skill skill={item.textValue ? item.textValue : ''} />
                    ))}
                  </div>
                );
              }}
              
            >
              {SKILLS.map(skill => (
                <SelectItem 
                  key={skill} 
                  textValue={skill}
                >
                  <Skill skill={skill} />
                </SelectItem>
              ))}
            </Select>

            <Input
              type="number"
              placeholder="99"
              min={2}
              max={99}
              value={targetLevel}
              onChange={(e) => setTargetLevel(e.target.value)}
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

      <div className="grid grid-cols-3 gap-3">
        {goals.map(goal => {
            const progress = calculateProgress(goal.currentXp, goal.targetLevel)
            const xpRemaining = getXpRemaining(goal.currentXp, goal.targetLevel)
            const isComplete = goal.currentLevel >= goal.targetLevel

            return (
              <GoalCard
                key={goal.id}
                id={goal.id}
                title={goal.skillName}
                iconPath={`/skills/${goal.skillName.toLowerCase()}.png`}
                currentValue={goal.currentLevel}
                targetValue={goal.targetLevel}
                progress={progress}
                remainingText={`${xpRemaining.toLocaleString()} XP remaining`}
                isComplete={isComplete}
                onDelete={deleteGoal}
              />
            )
        })}
      </div>
    </PageLayout>
  )
}

function Skill({ skill }: { skill: string }) {
  return (
    <div key={skill} className="flex items-center gap-2">
      <img 
        src={`/skills/${skill?.toLowerCase()}.png`} 
        alt={skill || ''}
        className="w-5 h-5"
      />
      <span>{skill}</span>
    </div>
  )
}