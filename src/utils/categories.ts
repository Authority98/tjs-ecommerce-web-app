import { TreePine, Sparkles, Ribbon, Gift, Crown } from 'lucide-react'

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
    hoverShadow: ''
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
    hoverShadow: ''
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
    hoverShadow: ''
  },
  {
    id: 'centrepieces',
    title: 'Centre Pieces',
    description: 'Stunning centrepieces and table decorations to create the perfect focal point for your holiday gatherings',
    icon: Crown,
    gradient: 'from-amber-400 via-orange-400 to-yellow-300',
    bgGradient: 'from-amber-50 to-orange-50 dark:from-amber-950/15 dark:to-orange-950/15',
    accent: 'amber',
    iconBg: 'bg-amber-500',
    hoverShadow: ''
  },
  {
    id: 'gift-card',
    title: 'Gift Cards',
    description: 'Share the magic of the holidays with our beautiful digital gift cards - the perfect present for loved ones',
    icon: Gift,
    gradient: 'from-pink-400 via-rose-400 to-red-300',
    bgGradient: 'from-pink-50 to-rose-50 dark:from-pink-950/15 dark:to-rose-950/15',
    accent: 'pink',
    iconBg: 'bg-pink-500',
    hoverShadow: ''
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