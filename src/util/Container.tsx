import { cn } from '@/lib/utils'
import React from 'react'

interface ContainerProps {
  children: React.ReactNode
  className?: string
  size?: 'sm' | 'md' | 'lg' | 'xl'
}

const Container = ({ 
  children, 
  className,
  size = 'xl' 
}: ContainerProps) => {
  const sizeClasses = {
    sm: 'max-w-4xl',    // 896px
    md: 'max-w-5xl',    // 1024px  
    lg: 'max-w-7xl',    // 1280px  
    xl: 'max-w-screen-2xl' // 1536px  
  }

  return (
    <div 
      className={cn(
        "mx-auto w-full px-4 sm:px-6 lg:px-8",
        sizeClasses[size],
        className
      )}
    >
      {children}
    </div>
  )
}

export default Container