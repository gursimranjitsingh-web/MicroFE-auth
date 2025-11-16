/// <reference types="vite/client" />

declare module 'productsApp/ProductsApp' {
  import type { ComponentType } from 'react'
  const ProductsApp: ComponentType
  export default ProductsApp
}

declare module 'ui/ThemeProvider' {
  type ComponentType<T = any> = import('react').ComponentType<T>
  type ReactNode = import('react').ReactNode

  interface ThemeProviderProps {
    children?: ReactNode
  }

  const ThemeProvider: ComponentType<ThemeProviderProps>
  export default ThemeProvider
}

declare module 'ui/components' {
  import type { FC, ReactNode, MouseEvent } from 'react'

  interface ThemeProviderProps {
    children?: ReactNode
  }

  interface LookButtonProps {
    children?: ReactNode
    onClick?: (e: MouseEvent<HTMLButtonElement>) => void
    disabled?: boolean
    className?: string
    style?: React.CSSProperties
    type?: 'primary' | 'link' | 'text' | 'default' | 'dashed'
    loading?: boolean
    block?: boolean
    [key: string]: any
  }

  interface LookIconProps {
    [key: string]: any
  }

  interface SvgIconsProps {
    [key: string]: any
  }

  export const ThemeProvider: FC<ThemeProviderProps>
  export const LookButton: FC<LookButtonProps>
  export const LookIcon: FC<LookIconProps>
  export const SvgIcons: FC<SvgIconsProps>
}

declare module 'ui/styles/datepicker' {
  const styles: any
  export default styles
}

declare module 'ui/styles/modal' {
  const styles: any
  export default styles
}

declare module 'ui/styles/table' {
  const styles: any
  export default styles
}
