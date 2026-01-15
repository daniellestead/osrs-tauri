import { Input as HeroUIInput, type InputProps } from '@heroui/react'

export function Input({ className, classNames, ...props }: InputProps) {
  return (
    <HeroUIInput
      className={className}
      classNames={{
        inputWrapper: "bg-zinc-900 border-zinc-700 hover:bg-zinc-800 focus-within:bg-zinc-900 data-[hover=true]:bg-zinc-800",
        input: "text-zinc-300! placeholder:text-zinc-400",
        label: "text-zinc-300",
        ...classNames,
      }}
      size="md"
      {...props}
    />
  )
}
