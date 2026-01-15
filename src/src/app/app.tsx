import { PlayerLookup } from './components/player-lookup'
import { NavigationTabs } from './components/navigation-tabs'

const TABS = ['skills', 'drops']

function App() {
  return (
    <div className="min-h-screen">
      <PlayerLookup />

      <NavigationTabs tabs={TABS}/>
    </div>
  )
}

export default App
