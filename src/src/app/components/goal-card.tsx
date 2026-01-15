import { Button } from "../../components/button"

interface GoalCardProps {
  id: string
  title: string
  iconPath?: string
  currentValue: number
  targetValue: number
  currentLabel?: string
  targetLabel?: string
  progress: number
  remainingText: string
  isComplete: boolean
  onDelete: (id: string) => void
  type?: 'skill' | 'drop'
  onIncrement?: (id: string) => void
  onDecrement?: (id: string) => void
}

export function GoalCard({
  id,
  title,
  iconPath,
  currentValue,
  targetValue,
  currentLabel,
  targetLabel,
  progress,
  remainingText,
  isComplete,
  onDelete,
  type = 'skill',
  onIncrement,
  onDecrement,
}: GoalCardProps) {
  return (
    <div
      className={`bg-zinc-900 border rounded-lg p-3 transition-all w-60 ${
        isComplete
          ? 'border-purple-500 bg-purple-500/5'
          : 'border-zinc-700 hover:border-purple-500/50'
      }`}
    >
      <div className="flex justify-between items-center mb-3">
        <div className="flex items-center gap-2 text-base font-semibold text-white">
          {iconPath && <img src={iconPath} alt={title} className="w-6 h-6" />}
          <span>{title}</span>
        </div>
        <Button
          className="w-5 h-5 min-w-0 bg-transparent border-none text-red-400 text-sm p-0 hover:bg-red-400/10"
          onPress={() => onDelete(id)}
        >
          ×
        </Button>
      </div>

      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-3 text-lg font-semibold justify-center">
          <span className="text-zinc-400">{currentLabel || currentValue}</span>
          <span className="text-purple-500">→</span>
          <span className="text-purple-500">{targetLabel || targetValue}</span>
        </div>

        {isComplete ? (
          <div className="text-center text-purple-500 text-sm font-semibold p-2 bg-purple-500/10 rounded border border-purple-500/20">
            Complete!
          </div>
        ) : type === 'skill' ? (
          <>
            <div className="w-full h-4 bg-zinc-800 rounded overflow-hidden border border-zinc-700">
              <div
                className="h-full bg-gradient-to-r from-purple-500 to-purple-600 transition-all duration-300"
                style={{ width: `${Math.min(100, progress)}%` }}
              />
            </div>
            <div className="text-center text-zinc-400 text-xs">{remainingText}</div>
          </>
        ) : (
          <>
            <div className="flex items-center justify-center gap-2">
              <Button
                className="w-8 h-8 min-w-0 bg-zinc-800 border border-zinc-700 text-white text-lg cursor-pointer hover:bg-zinc-700"
                onPress={() => onDecrement?.(id)}
                isDisabled={currentValue <= 0}
              >
                -
              </Button>
              <Button
                className="w-8 h-8 min-w-0  bg-purple-500 text-white text-lg cursor-pointer hover:bg-purple-600"
                onPress={() => onIncrement?.(id)}
              >
                +
              </Button>
            </div>
            <div className="text-center text-zinc-400 text-xs">{remainingText}</div>
          </>
        )}
      </div>
    </div>
  )
}