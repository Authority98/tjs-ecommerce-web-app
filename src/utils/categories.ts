import { TreePine, Sparkles, Ribbon } from 'lucide-react'

export interface CategoryConfig {
  id: string
  title: string
  description: string
  icon: any
  gradient: string
  bgGradient: string
  accent: string
  iconBg: string
  hoverShadow: string
}

export const CATEGORY_CONFIGS: CategoryConfig[] = [
  {
    id: 'trees',
    title: 'Christmas Trees',
    description: 'Premium Christmas trees with professional decoration services and custom styling options',
    icon: TreePine,
    gradient: 'from-purple-600 via-violet-600 to-fuchsia-500',
    bgGradient: 'from-purple-50 to-violet-50 dark:from-purple-950/20 dark:to-violet-950/20',
    accent: 'purple',
    iconBg: 'bg-purple-500',
    hoverShadow: 'hover:shadow-purple-500/25'
  },
  {
    id: 'decorations',
    title: 'Christmas Decorations',
    description: 'Exquisite ornaments and magical decorative pieces to transform your space into a winter wonderland',
    icon: Sparkles,
    gradient: 'from-purple-500 via-fuchsia-500 to-violet-400',
    bgGradient: 'from-purple-50 to-fuchsia-50 dark:from-purple-950/20 dark:to-fuchsia-950/20',
    accent: 'purple',
    iconBg: 'bg-fuchsia-500',
    hoverShadow: 'hover:shadow-fuchsia-500/25'
  },
  {
    id: 'ribbons',
    title: 'Premium Ribbons',
    description: 'Luxurious ribbons and elegant bows crafted to add the perfect finishing touch to your holiday décor',
    icon: Ribbon,
    gradient: 'from-violet-400 via-purple-400 to-fuchsia-300',
    bgGradient: 'from-violet-50 to-purple-50 dark:from-violet-950/15 dark:to-purple-950/15',
    accent: 'violet',
    iconBg: 'bg-violet-500',
    hoverShadow: 'hover:shadow-violet-500/25'
  }
]

export const getCategoryConfig = (categoryId: string): CategoryConfig | undefined => {
  return CATEGORY_CONFIGS.find(config => config.id === categoryId)
}

export const getCategoryGradient = (categoryId: string): string => {
  const config = getCategoryConfig(categoryId)
  return config?.gradient || 'from-gray-500 to-gray-600'
}

export const getCategoryIcon = (categoryId: string) => {
  const config = getCategoryConfig(categoryId)
  return config?.icon || TreePine
}