import { ExclamationTriangleIcon } from '@heroicons/react/24/outline'

interface ErrorProps {
  error: string
}

export function Error({ error }: ErrorProps) {
  return (
    <div className="flex items-center gap-3 p-3 text-sm text-danger">
      <ExclamationTriangleIcon className="w-5 h-5" />
      <span>{error}</span>
    </div>
  )
}