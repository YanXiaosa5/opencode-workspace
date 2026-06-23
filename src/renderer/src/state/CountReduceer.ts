//1、定义状态类型
export interface CountState {
  count: number
}
//2、定义动作类型
export type CountAction =
  | { type: 'increment' }
  | { type: 'decrement' }
  | { type: 'SET'; payload: number }
// 3、定义初始状态
export const initialState: CountState = { count: 0 }

//4、定义 reducer 函数 根据 action.type 来决定如何更新状态
export function countReducer(state: CountState, action: CountAction): CountState {
  switch (action.type) {
    case 'increment':
      return { ...state, count: state.count + 1 }
    case 'decrement':
      return { ...state, count: state.count - 1 }
    case 'SET':
      return { ...state, count: action.payload }
    default:
      return state
  }
}
