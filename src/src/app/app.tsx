import { useState } from 'react'
import { PlayerLookup } from './components/player-lookup'
import { NavigationTabs } from './components/navigation-tabs'
import { UpdaterFooter } from './components/updater'

const TABS = ['skills', 'drops', 'other']

export interface Skill {
  name: string
  level: number
  xp: number
}

function App() {
  const [skills, setSkills] = useState<Skill[]>(() => {
    const saved = localStorage.getItem('playerSkills')
    return saved ? JSON.parse(saved) : []
  })

  return (
    <div className="min-h-screen">
      <PlayerLookup onSkillsLoaded={setSkills} />

      <NavigationTabs tabs={TABS} skills={skills} />

      <UpdaterFooter />
    </div>
  )
}

export default App
