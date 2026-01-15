import { useState } from "react"
import { Skills } from "./skills/skills"
import { Drops } from "./drops/drops"
import { Button } from "../../components/button"

export function NavigationTabs({ tabs }: { tabs: string[] }) {
    const [activeTab, setActiveTab] = useState<string>('skills')

    return (
        <div className="px-3">
            <nav className="flex flex-row gap-3">
                {tabs.map(tab => (
                    <Button 
                        key={tab}
                        className={`bg-transparent ${activeTab === tab 
                            ? 'border-b-3 text-purple-500 border-purple-900' 
                            : 'text-zinc-300 hover:text-purple-500 hover:border-purple-900'
                        }`}
                        onPress={() => setActiveTab(tab)}
                    >
                        {tab.charAt(0).toUpperCase() + tab.slice(1)}
                    </Button>
                ))}
            </nav>

            <div>
                {activeTab === 'skills' && <Skills />}
                {activeTab === 'drops' && <Drops />}
            </div>
        </div>
    )
}