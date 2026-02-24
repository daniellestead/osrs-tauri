import { PlayerLookup } from './components/player-lookup'
import { NavigationTabs } from './components/navigation-tabs'
import { UpdaterFooter } from './components/updater'

const TABS = ['skills', 'drops']

function App() {
  return (
    <div className="min-h-screen">
      <PlayerLookup />

      <NavigationTabs tabs={TABS}/>

      <UpdaterFooter />
    </div>
  )
}

export default App
