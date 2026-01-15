interface CardProps {
  children: React.ReactNode
  className?: string
}

export function Card({ children, className = '' }: CardProps) {
  return (
    <div className={`flex flex-wrap px-2 py-2 justify-center mb-3 mt-3 bg-zinc-800 rounded-xl ${className}`}>
      {children}
    </div>
  )   
}