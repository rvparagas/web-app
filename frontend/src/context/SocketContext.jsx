import { createContext, useContext, useEffect, useState } from 'react'
import { io } from 'socket.io-client'
import { useAuth } from './AuthContext'

const SocketContext = createContext(null)

export function SocketProvider({ children }) {
  const [socket, setSocket] = useState(null)
  const [onlineUsers, setOnlineUsers] = useState([])
  const [activities, setActivities] = useState([])
  const [typingUsers, setTypingUsers] = useState([])
  const { user, isAuthenticated } = useAuth()

  useEffect(() => {
    if (!isAuthenticated) {
      if (socket) {
        socket.disconnect()
        setSocket(null)
      }
      return
    }

    const newSocket = io('http://localhost:8080')
    setSocket(newSocket)

    newSocket.on('connect', () => {
      if (user?.email) {
        newSocket.emit('user:join', { email: user.email })
      }
    })

    newSocket.on('users:online', (users) => {
      setOnlineUsers(users)
    })

    newSocket.on('activity:new', (activity) => {
      setActivities(prev => [activity, ...prev].slice(0, 20))
    })

    newSocket.on('entry:typing', (data) => {
      if (data.isTyping) {
        setTypingUsers(prev => [...new Set([...prev, data.user])])
      } else {
        setTypingUsers(prev => prev.filter(u => u !== data.user))
      }
    })

    return () => {
      newSocket.disconnect()
    }
  }, [isAuthenticated, user?.email])

  const emitTyping = (isTyping) => {
    if (socket && user?.email) {
      socket.emit('entry:typing', { user: user.email, isTyping })
    }
  }

  const value = {
    socket,
    onlineUsers,
    activities,
    typingUsers,
    emitTyping
  }

  return (
    <SocketContext.Provider value={value}>
      {children}
    </SocketContext.Provider>
  )
}

export function useSocket() {
  const context = useContext(SocketContext)
  if (!context) {
    throw new Error('useSocket must be used within a SocketProvider')
  }
  return context
}
