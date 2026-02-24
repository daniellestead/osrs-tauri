import { useState, useEffect } from "react"
import { invoke } from "@tauri-apps/api/core"
import { ArrowPathIcon } from "@heroicons/react/24/outline"
import { Input } from "../../components/input";
import { Button } from "@heroui/react";
import { Error } from "../../components/error";
import { Card } from "../../components/card";

interface Skill {
  name: string
  level: number
  xp: number
}

export function PlayerLookup({ onSkillsLoaded }: { onSkillsLoaded: (skills: Skill[]) => void }) {
  const [playerName, setPlayerName] = useState(() => {
    return localStorage.getItem("playerName") || ""
  })
  const [skills, setSkills] = useState<Skill[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  useEffect(() => {
    if (playerName) {
      localStorage.setItem("playerName", playerName)
    }
  }, [playerName])

  const lookupPlayer = async () => {
    if (!playerName.trim()) {
      setError("Please enter a player name")
      return
    }

    setLoading(true)
    setError('')
    setSkills([])

    try {
      const result = await invoke<Skill[]>("lookup_player", {
        playerName: playerName.trim()
      })
      setSkills(result)
      localStorage.setItem("playerSkills", JSON.stringify(result))
      onSkillsLoaded(result)
    } catch (err) {
      setError(err as string)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="p-3">
      <div className="flex flex-row gap-3">
        <Input
          type="text"
          placeholder="Enter player name..."
          value={playerName}
          onChange={(e) => setPlayerName(e.target.value)}
          disabled={loading}
        />
        <Button 
          className="text-white bg-purple-500 hover:bg-purple-700"
          onPress={lookupPlayer}
          isDisabled={loading}
          isLoading={loading}
          isIconOnly
        >
          <ArrowPathIcon className="w-5 h-5" />
        </Button>
      </div>

      {error && <Error error={error} />}

      {skills.length > 0 && (
        <Card className="gap-3">
            {skills.filter(skill => skill.name.toLowerCase() !== "overall").map((skill) => (
                <div key={skill.name} className="flex flex-col items-center p-2 bg-zinc-700 rounded-lg">
                    <img 
                        src={`/skills/${skill.name.toLowerCase()}.png`} 
                        alt={skill.name}
                        className="w-6 h-6"
                    />
                    <span className="text-sm font-semibold">{skill.level}</span>
                </div>
            ))}
        </Card>
      )}
    </div>
  )
}