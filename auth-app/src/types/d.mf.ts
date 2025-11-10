import type { ComponentType } from 'react';

declare module 'productsApp/ProductsApp' {
  interface UserData {
    name: string;
    role: string;
    permissions: string[];
    theme: string;
  }

  interface ProductsAppProps {
    token?: string | null;
    userData?: UserData | null;
  }

  const ProductsApp: ComponentType<ProductsAppProps>;
}
