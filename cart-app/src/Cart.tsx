import React, { useState, useEffect } from 'react'
import { eventBus } from 'authApp/eventBus'
import { LookButton } from 'ui/components'

interface CartItem {
  id: number
  title: string
  price: number
  image: string
}

const Cart: React.FC = () => {
  const [cartItems, setCartItems] = useState<CartItem[]>([])
  const [isReady, setIsReady] = useState(false)

  useEffect(() => {
    console.log('🎬 Cart: Initializing...')

    // Subscribe to cart events
    const subscription = eventBus.onCart().subscribe((event: any) => {
      console.log('📥 Cart: Received cart event:', event.type, event.payload)

      // Ignore REQUEST_STATE events (these are from other MFs)
      if (event.payload === 'REQUEST_STATE') {
        return
      }

      switch (event.type) {
        case 'CART_STATE_CHANGE':
          if (Array.isArray(event.payload)) {
            console.log(
              '🛒 Cart: Updating cart items:',
              event.payload.length,
              'items',
            )
            setCartItems(event.payload)
            setIsReady(true)
          }
          break
      }
    })

    // Request current cart state on mount with delay
    setTimeout(() => {
      console.log('📤 Cart: Requesting cart state...')
      eventBus.emit({ type: 'CART_STATE_CHANGE', payload: 'REQUEST_STATE' })
    }, 50)

    return () => subscription.unsubscribe()
  }, [])

  const handleRemoveFromCart = (itemId: number) => {
    console.log('🗑️ Cart: Requesting removal of item:', itemId)
    eventBus.emit({ type: 'REMOVE_FROM_CART', payload: itemId })
  }

  const handleClearCart = () => {
    console.log('🗑️ Cart: Requesting clear cart')
    eventBus.emit({ type: 'CLEAR_CART' })
  }

  const totalPrice = cartItems.reduce((sum, item) => sum + item.price, 0)

  if (!isReady) {
    return <div>Loading cart...</div>
  }

  return (
    <div>
      <h2>Shopping Cart ({cartItems.length} items)</h2>
      {cartItems.length === 0 ? (
        <p>Your cart is empty</p>
      ) : (
        <div>
          <div style={{ marginBottom: '2rem' }}>
            {cartItems.map((item) => (
              <div
                key={item.id}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  padding: '1rem',
                  border: '1px solid #ddd',
                  borderRadius: '8px',
                  marginBottom: '1rem',
                }}
              >
                <img
                  src={item.image}
                  alt={item.title}
                  style={{
                    width: '80px',
                    height: '80px',
                    objectFit: 'cover',
                    marginRight: '1rem',
                  }}
                />
                <div style={{ flex: 1 }}>
                  <h3 style={{ margin: '0 0 0.5rem 0', fontSize: '1.1rem' }}>
                    {item.title}
                  </h3>
                  <p
                    style={{
                      margin: '0',
                      fontSize: '1.2rem',
                      fontWeight: 'bold',
                      color: '#007bff',
                    }}
                  >
                    ${item.price}
                  </p>
                </div>
                <LookButton
                  onClick={() => handleRemoveFromCart(item.id)}
                  danger
                  style={{}}
                >
                  Remove
                </LookButton>
              </div>
            ))}
          </div>
          <div
            style={{
              borderTop: '2px solid #ddd',
              paddingTop: '1rem',
              textAlign: 'right',
            }}
          >
            <h3>Total: ${totalPrice.toFixed(2)}</h3>
            <LookButton onClick={handleClearCart} type="link">
              Clear Cart
            </LookButton>
            <LookButton type="primary">Checkout</LookButton>
          </div>
        </div>
      )}
    </div>
  )
}

export default Cart
