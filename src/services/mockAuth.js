// Mock authentication service for development
const MOCK_USERS_KEY = 'mockBuyerUsers'
const MOCK_INTERACTIONS_KEY = 'mockBuyerInteractions'

// Initialize mock data
const initMockData = () => {
  if (!localStorage.getItem(MOCK_USERS_KEY)) {
    localStorage.setItem(MOCK_USERS_KEY, JSON.stringify([]))
  }
  if (!localStorage.getItem(MOCK_INTERACTIONS_KEY)) {
    localStorage.setItem(MOCK_INTERACTIONS_KEY, JSON.stringify([]))
  }
}

const generateId = () => 'B' + Date.now() + Math.random().toString(36).substr(2, 9)
const generateToken = () => 'token_' + Date.now() + Math.random().toString(36).substr(2, 9)

export const mockAuthAPI = {
  signup: async (userData) => {
    initMockData()
    const users = JSON.parse(localStorage.getItem(MOCK_USERS_KEY))
    
    // Check if email exists
    if (users.find(user => user.email === userData.email)) {
      throw new Error('Email already exists')
    }
    
    const newUser = {
      _id: generateId(),
      name: userData.name,
      email: userData.email,
      password: userData.password, // In real app, this would be hashed
      createdAt: new Date().toISOString()
    }
    
    users.push(newUser)
    localStorage.setItem(MOCK_USERS_KEY, JSON.stringify(users))
    
    const token = generateToken()
    
    return {
      data: {
        token,
        buyer: {
          _id: newUser._id,
          name: newUser.name,
          email: newUser.email
        }
      }
    }
  },

  login: async (credentials) => {
    initMockData()
    const users = JSON.parse(localStorage.getItem(MOCK_USERS_KEY))
    
    const user = users.find(u => u.email === credentials.email && u.password === credentials.password)
    
    if (!user) {
      throw new Error('Invalid email or password')
    }
    
    const token = generateToken()
    
    return {
      data: {
        token,
        buyer: {
          _id: user._id,
          name: user.name,
          email: user.email
        }
      }
    }
  },

  logInteraction: async (interactionData) => {
    initMockData()
    const interactions = JSON.parse(localStorage.getItem(MOCK_INTERACTIONS_KEY))
    
    const newInteraction = {
      _id: generateId(),
      ...interactionData,
      timestamp: interactionData.timestamp || new Date().toISOString()
    }
    
    interactions.push(newInteraction)
    localStorage.setItem(MOCK_INTERACTIONS_KEY, JSON.stringify(interactions))
    
    return { data: newInteraction }
  },

  getProfile: async () => {
    const buyerId = localStorage.getItem('buyerId')
    if (!buyerId) throw new Error('Not authenticated')
    
    const users = JSON.parse(localStorage.getItem(MOCK_USERS_KEY) || '[]')
    const user = users.find(u => u._id === buyerId)
    
    if (!user) throw new Error('User not found')
    
    return {
      data: {
        _id: user._id,
        name: user.name,
        email: user.email
      }
    }
  }
}