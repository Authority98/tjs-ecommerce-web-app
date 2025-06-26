import React from 'react'

interface StaggeredGridProps {
  children: React.ReactNode[]
  staggerDelay?: number
  className?: string
  itemClassName?: string
}

const StaggeredGrid: React.FC<StaggeredGridProps> = ({
  children,
  staggerDelay = 0.05,
  className = '',
  itemClassName = ''
}) => {
  return (
    <div className={className}>
      {React.Children.map(children, (child, index) => (
        <div
          key={index}
          className={itemClassName}
        >
          {child}
        </div>
      ))}
    </div>
  )
}

export default StaggeredGrid