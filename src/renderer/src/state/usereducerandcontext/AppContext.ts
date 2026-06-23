// 1. 定义要共享的数据
export interface AppState {
  theme: 'light' | 'dark'
  language: 'zh' | 'en'
}

// 2. 定义允许做哪些“动作”
export type AppAction = { type: 'TOGGLE_THEME' } | { type: 'SET_LANGUAGE'; payload: 'zh' | 'en' }

// 3. 初始默认值
export const initAppState: AppState = {
  theme: 'light',
  language: 'zh'
}

// 4. 计算新数据的核心大脑
export function appReducer(state: AppState, action: AppAction): AppState {
  switch (action.type) {
    case 'TOGGLE_THEME':
      return {
        ...state,
        theme: state.theme === 'light' ? 'dark' : 'light'
      }
    case 'SET_LANGUAGE':
      return {
        ...state,
        language: action.payload
      }
    default:
      return state
  }
}
