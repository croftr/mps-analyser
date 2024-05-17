// @ts-nocheck
import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export type Mp = {
  id: number
  nameDisplayAs: string
  thumbnailUrl: string
}

export type State = {  
  mp: Mp  
}

export type Actions = {
  setMp: (mp: Mp) => void
  getMp: () => Mp
}

export const useMpStore = create<State & Actions>()(
    persist(
      set => ({
        mp: { nameDisplayAs: 'not set', id: 1 },
        setMp: (mp: Mp) => { console.log("woooo"); set({ mp }) },
        getMp: () => set.mp
      }),
      { name: 'mp-store', skipHydration: true }
    )
  )