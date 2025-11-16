type ComponentType<T = any> = import('react').ComponentType<T>
type ReactNode = import('react').ReactNode

declare module 'ui/ThemeProvider' {
  interface ThemeProviderProps {
    children?: ReactNode
  }
  const ThemeProvider: ComponentType<ThemeProviderProps>
}

declare module 'productsApp/ProductsApp' {
  interface UserData {
    name: string
    role: string
    permissions: string[]
    theme: string
  }

  interface ProductsAppProps {
    token?: string | null
    userData?: UserData | null
  }

  const ProductsApp: ComponentType<ProductsAppProps>
}
