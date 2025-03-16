import { createSlice, PayloadAction } from '@reduxjs/toolkit'

interface Car {
  id: string
  make: string
  model: string
  year: number
  price: number
  location: string
  images: string[]
  description: string
  ownerId: string
  available: boolean
  features: string[]
}

interface CarState {
  cars: Car[]
  selectedCar: Car | null
  loading: boolean
  error: string | null
  filters: {
    priceRange: [number, number]
    location: string
    available: boolean
  }
}

const initialState: CarState = {
  cars: [],
  selectedCar: null,
  loading: false,
  error: null,
  filters: {
    priceRange: [0, 10000],
    location: '',
    available: true,
  },
}

const carSlice = createSlice({
  name: 'cars',
  initialState,
  reducers: {
    fetchCarsStart: (state) => {
      state.loading = true
      state.error = null
    },
    fetchCarsSuccess: (state, action: PayloadAction<Car[]>) => {
      state.loading = false
      state.cars = action.payload
    },
    fetchCarsFailure: (state, action: PayloadAction<string>) => {
      state.loading = false
      state.error = action.payload
    },
    setSelectedCar: (state, action: PayloadAction<Car>) => {
      state.selectedCar = action.payload
    },
    clearSelectedCar: (state) => {
      state.selectedCar = null
    },
    updateFilters: (state, action: PayloadAction<Partial<CarState['filters']>>) => {
      state.filters = { ...state.filters, ...action.payload }
    },
    addCar: (state, action: PayloadAction<Car>) => {
      state.cars.push(action.payload)
    },
    updateCar: (state, action: PayloadAction<Car>) => {
      const index = state.cars.findIndex((car) => car.id === action.payload.id)
      if (index !== -1) {
        state.cars[index] = action.payload
      }
    },
    deleteCar: (state, action: PayloadAction<string>) => {
      state.cars = state.cars.filter((car) => car.id !== action.payload)
    },
  },
})

export const {
  fetchCarsStart,
  fetchCarsSuccess,
  fetchCarsFailure,
  setSelectedCar,
  clearSelectedCar,
  updateFilters,
  addCar,
  updateCar,
  deleteCar,
} = carSlice.actions

export default carSlice.reducer 