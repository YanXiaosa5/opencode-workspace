import React, { createContext, useContext, useReducer, ReactNode } from 'react'

import {
  appReducer,
  AppState,
  AppAction,
  initAppState
} from '@renderer/state/usereducerandcontext/AppContext'

// 5. 重点：创建两个上下文（一个存数据，一个存修改数据的 dispatch 方法）
const StateContext = createContext<AppState | undefined>(undefined as any)
const DispatchContext = createContext<React.Dispatch<AppAction> | undefined>(undefined as any)

// 6. 重点：创建一个包装盒（Provider），谁被它包住，谁就能收听到这个电台
export function AppProvider({ children }: { children: ReactNode }) {
  // 在这里运行 useReducer，拿到当前最新的 state 和 dispatch
  const [state, dispatch] = useReducer(appReducer, initAppState)

  return (
    <StateContext.Provider value={state}>
      <DispatchContext.Provider value={dispatch}>{children}</DispatchContext.Provider>
    </StateContext.Provider>
  )
}

// 7. 重点：封装两个极其简单好使的快捷钥匙（Hooks）
export function useAppState() {
  const context = useContext(StateContext)
  if (!context) throw new Error('useAppState 必须在 AppProvider 内部使用')
  return context
}

export function useAppDispatch() {
  const context = useContext(DispatchContext)
  if (!context) throw new Error('useAppDispatch 必须在 AppProvider 内部使用')
  return context
}

/* 8/9/10 查看SettingsView.tsx / SettingItemComponents.tsx */
