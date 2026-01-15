import { Button as HeroUIButton } from '@heroui/react'

interface ButtonProps {
  className?: string
  onPress: () => void
  isDisabled?: boolean
  isLoading?: boolean
  children?: React.ReactNode
}

export function Button({ className, onPress, isDisabled, isLoading, children }: ButtonProps) {
  return (
    <HeroUIButton
      className={`${className} px-2 py-2 max-h-10 rounded text-sm transition-colors`}
      onPress={onPress}
      isDisabled={isDisabled}
      isLoading={isLoading}
    >
      {children}
    </HeroUIButton>
  )
}
