import { createSlice, PayloadAction } from '@reduxjs/toolkit'

interface Message {
  id: string
  senderId: string
  receiverId: string
  content: string
  timestamp: string
  read: boolean
}

interface Chat {
  id: string
  participants: string[]
  messages: Message[]
  lastMessage: Message | null
}

interface ChatState {
  chats: Chat[]
  activeChat: string | null
  loading: boolean
  error: string | null
  unreadCount: number
}

const initialState: ChatState = {
  chats: [],
  activeChat: null,
  loading: false,
  error: null,
  unreadCount: 0,
}

const chatSlice = createSlice({
  name: 'chat',
  initialState,
  reducers: {
    fetchChatsStart: (state) => {
      state.loading = true
      state.error = null
    },
    fetchChatsSuccess: (state, action: PayloadAction<Chat[]>) => {
      state.loading = false
      state.chats = action.payload
      state.unreadCount = action.payload.reduce((count, chat) => {
        return count + chat.messages.filter((msg) => !msg.read).length
      }, 0)
    },
    fetchChatsFailure: (state, action: PayloadAction<string>) => {
      state.loading = false
      state.error = action.payload
    },
    setActiveChat: (state, action: PayloadAction<string>) => {
      state.activeChat = action.payload
    },
    addMessage: (state, action: PayloadAction<{ chatId: string; message: Message }>) => {
      const chat = state.chats.find((c) => c.id === action.payload.chatId)
      if (chat) {
        chat.messages.push(action.payload.message)
        chat.lastMessage = action.payload.message
        if (!action.payload.message.read) {
          state.unreadCount++
        }
      }
    },
    markMessageAsRead: (state, action: PayloadAction<{ chatId: string; messageId: string }>) => {
      const chat = state.chats.find((c) => c.id === action.payload.chatId)
      if (chat) {
        const message = chat.messages.find((m) => m.id === action.payload.messageId)
        if (message && !message.read) {
          message.read = true
          state.unreadCount--
        }
      }
    },
    createChat: (state, action: PayloadAction<Chat>) => {
      state.chats.push(action.payload)
    },
  },
})

export const {
  fetchChatsStart,
  fetchChatsSuccess,
  fetchChatsFailure,
  setActiveChat,
  addMessage,
  markMessageAsRead,
  createChat,
} = chatSlice.actions

export default chatSlice.reducer 