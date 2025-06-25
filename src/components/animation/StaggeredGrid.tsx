import React from 'react'
import { motion } from 'framer-motion'

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
        <motion.div
          key={index}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: index * staggerDelay }}
          className={itemClassName}
        >
          {child}
        </motion.div>
      ))}
    </div>
  )
}

export default StaggeredGrid