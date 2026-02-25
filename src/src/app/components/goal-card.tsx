import { Button } from "@heroui/react";
import { LockClosedIcon, CheckIcon } from "@heroicons/react/24/outline";
import type { GoalSummary } from "../types";

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
  type?: 'skill' | 'drop' | 'other'
  onIncrement?: (id: string) => void
  onDecrement?: (id: string) => void
  onToggleComplete?: (id: string) => void
  isBlocked?: boolean
  blockingDependencies?: GoalSummary[]
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
  onToggleComplete,
  isBlocked,
  blockingDependencies,
}: GoalCardProps) {
  return (
    <div
      className={`bg-zinc-900 border rounded-lg p-3 transition-all w-60 ${
        isComplete
          ? 'border-purple-500 bg-purple-500/5'
          : isBlocked
            ? 'border-amber-500/50 opacity-60'
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
          x
        </Button>
      </div>

      {isBlocked && blockingDependencies && blockingDependencies.length > 0 && (
        <div className="flex items-center gap-1 mb-2 px-2 py-1 bg-amber-500/10 border border-amber-500/20 rounded text-xs text-amber-400">
          <LockClosedIcon className="w-3 h-3 flex-shrink-0" />
          <span className="truncate">
            Blocked by: {blockingDependencies.map(d => d.label).join(', ')}
          </span>
        </div>
      )}

      <div className="flex flex-col gap-2">
        {type !== 'other' && (
          <div className="flex items-center gap-3 text-lg font-semibold justify-center">
            <span className="text-zinc-400">{currentLabel || currentValue}</span>
            <span className="text-purple-500">→</span>
            <span className="text-purple-500">{targetLabel || targetValue}</span>
          </div>
        )}

        {isComplete ? (
          <div
            className={`text-center text-purple-500 text-sm font-semibold p-2 bg-purple-500/10 rounded border border-purple-500/20 ${
              type === 'other' ? 'cursor-pointer hover:bg-purple-500/20' : ''
            }`}
            onClick={type === 'other' ? () => onToggleComplete?.(id) : undefined}
          >
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
        ) : type === 'drop' ? (
          <>
            <div className="flex items-center justify-center gap-2">
              <Button
                className="w-8 h-8 min-w-0 bg-zinc-800 border border-zinc-700 text-white text-lg cursor-pointer hover:bg-zinc-700"
                onPress={() => onDecrement?.(id)}
                isDisabled={currentValue <= 0 || isBlocked}
              >
                -
              </Button>
              <Button
                className="w-8 h-8 min-w-0  bg-purple-500 text-white text-lg cursor-pointer hover:bg-purple-600"
                onPress={() => onIncrement?.(id)}
                isDisabled={isBlocked}
              >
                +
              </Button>
            </div>
            <div className="text-center text-zinc-400 text-xs">{remainingText}</div>
          </>
        ) : (
          <Button
            className="w-full bg-zinc-800 border border-zinc-700 text-zinc-300 text-sm hover:bg-zinc-700 hover:text-white"
            onPress={() => onToggleComplete?.(id)}
            isDisabled={isBlocked}
          >
            <CheckIcon className="w-4 h-4" />
            Mark complete
          </Button>
        )}
      </div>
    </div>
  )
}
