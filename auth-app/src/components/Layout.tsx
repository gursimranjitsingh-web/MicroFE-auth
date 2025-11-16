import { Link, Outlet } from 'react-router-dom'
import { useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { useState, useEffect } from 'react'
import type { RootState } from '../store'
import { logout, setTheme, updateUserData } from '../store/authSlice'
import { eventBus } from '../eventBus'
import { LookButton } from 'ui/components'

const LayoutContent = () => {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const { userData, theme } = useSelector((state: RootState) => state.auth)
  const [cartItems, setCartItems] = useState<any[]>([])

  console.log('🧑‍💼 Layout: User Data:', userData)

  useEffect(() => {
    // Subscribe to cart events to get cart count
    const subscription = eventBus.onCart().subscribe((event: any) => {
      // Ignore REQUEST_STATE events
      if (event.payload === 'REQUEST_STATE') {
        return
      }

      switch (event.type) {
        case 'CART_STATE_CHANGE':
          if (event.payload && Array.isArray(event.payload)) {
            console.log('🛒 Layout: Cart updated, count:', event.payload.length)
            setCartItems(event.payload)
          }
          break
      }
    })

    // Request current cart state on mount with delay
    setTimeout(() => {
      eventBus.emit({ type: 'CART_STATE_CHANGE', payload: 'REQUEST_STATE' })
    }, 50)

    return () => subscription.unsubscribe()
  }, [])

  const handleLogout = () => {
    dispatch(logout())
    navigate('/login')
  }

  const handleGenerateUsername = () => {
    const randomName = 'User' + Math.floor(Math.random() * 1000)
    dispatch(updateUserData(randomName))
  }

  const handleChangeTheme = () => {
    if (theme === 'dark') {
      dispatch(setTheme('light'))
    } else {
      dispatch(setTheme('dark'))
    }
  }

  return (
    <div style={{ display: 'flex', height: '100vh' }}>
      {/* Sidebar */}
      <div
        style={{
          width: '200px',
          backgroundColor: '#343a40',
          color: 'white',
          padding: '1rem',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <h3 style={{ marginBottom: '2rem' }}>Welcome {userData?.fullName}</h3>
        <Link
          to="/"
          style={{
            color: 'white',
            textDecoration: 'none',
            marginBottom: '1rem',
            padding: '0.5rem',
            borderRadius: '4px',
            display: 'block',
          }}
        >
          Home
        </Link>
        <Link
          to="/cart"
          style={{
            color: 'white',
            textDecoration: 'none',
            marginBottom: '1rem',
            padding: '0.5rem',
            borderRadius: '4px',
            display: 'block',
          }}
        >
          Cart ({cartItems.length})
        </Link>
        <div>Current Theme: {theme}</div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <LookButton type="primary" onClick={handleGenerateUsername}>
            Generate New Username
          </LookButton>
          <LookButton type="default" onClick={handleChangeTheme}>
            Change Theme
          </LookButton>
          <LookButton onClick={handleLogout} type="primary" danger>
            Logout
          </LookButton>
        </div>
      </div>

      {/* Main Content */}
      <div
        style={{
          flex: 1,
          padding: '2rem',
          backgroundColor: '#f8f9fa',
          overflow: 'auto',
        }}
      >
        <Outlet />
      </div>
    </div>
  )
}

const Layout = () => {
  return <LayoutContent />
}

export default Layout
