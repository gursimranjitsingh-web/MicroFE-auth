import { useState, useEffect } from 'react'
import { eventBus } from 'authApp/eventBus'
import { addToCart } from '../store/cartSlice'
import { useDispatch } from 'react-redux'
import { LookButton } from 'ui/components'

interface Product {
  id: number
  title: string
  price: number
  image: string
}

interface ProductCardProps {
  product: Product
  token: string | null
}

const ProductCard = ({ product, token }: ProductCardProps) => {
  const [isInCart, setIsInCart] = useState(false)
  const dispatch = useDispatch()

  useEffect(() => {
    // Subscribe to auth events to get token

    // Subscribe to cart events to update local state
    const cartSubscription = eventBus.onCart().subscribe((event: any) => {
      // Ignore REQUEST_STATE events
      if (event.payload === 'REQUEST_STATE') {
        return
      }

      switch (event.type) {
        case 'CART_STATE_CHANGE':
          // Only listen to state changes, not individual add/remove events
          if (event.payload && Array.isArray(event.payload)) {
            const inCart = event.payload.some(
              (item: any) => item.id === product.id,
            )
            console.log(`🛒 ProductCard (${product.id}): isInCart = ${inCart}`)
            setIsInCart(inCart)
          }
          break
      }
    })

    return () => {
      cartSubscription.unsubscribe()
    }
  }, [product.id])

  const handleAddToCart = () => {
    dispatch(addToCart(product))
    if (token && !isInCart) {
      console.log(`➕ ProductCard: Adding ${product.title} to cart`)
      eventBus.emit({ type: 'ADD_TO_CART', payload: product })
    }
  }

  return (
    <div
      style={{
        border: '1px solid #ddd',
        borderRadius: '8px',
        padding: '1rem',
        margin: '1rem',
        width: '250px',
        textAlign: 'center',
      }}
    >
      <img
        src={product.image}
        alt={product.title}
        style={{ width: '100%', height: '200px', objectFit: 'cover' }}
      />
      <h3 style={{ fontSize: '1rem', margin: '0.5rem 0' }}>{product.title}</h3>
      <p style={{ fontSize: '1.2rem', fontWeight: 'bold', color: '#007bff' }}>
        ${product.price}
      </p>
      <LookButton
        onClick={handleAddToCart}
        disabled={isInCart || !token}
        type="default"
      >
        {isInCart ? 'In Cart' : 'Add to Cart'}
      </LookButton>
    </div>
  )
}

export default ProductCard
