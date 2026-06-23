//此类为zustand 状态管理库的一个示例，展示了如何创建一个全局状态来管理第三方数据，
// 并提供一个异步方法来请求数据并更新状态。这个状态可以在任何组件中通过 hook 来访问和使用。
import { create } from 'zustand'

interface ThirdPartyState {
  configId: string
  isEnabled: boolean
  // 异步动作：去请求网络数据并更新状态
  fetchConfig: () => Promise<void>
}

// 创建 一个 hook，任何地方一调就能用
export const useThirdPartyStore = create<ThirdPartyState>((set) => ({
  configId: 'default_id',
  isEnabled: false,

  fetchConfig: async () => {
    // 像在 GetxController 里写异步请求一样，如果主进程没有配置baseurl，这里直接写第三方接口的完整 URL 就行，
    const res = await window.thirdApi.requestThirdParty<ThirdPartyState>({
      method: 'GET',
      url: 'https://api.openai.com/v1/config',
      params: {
        id: 'default_id',
        active: true
      }
    })
    // const res = await window.thirdApi.requestThirdParty({ method: 'GET', url: '/config' });
    if (res.success) {
      // 相当于 GetX 里的更新状态，会自动触发 UI 刷新
      set({
        configId: res.data?.data?.configId ?? '',
        isEnabled: res.data?.data?.isEnabled ?? false
      })
    }
  }
}))

//使用方式
// import React, { useEffect } from 'react';
// import { useThirdPartyStore } from '../store/useThirdPartyStore';

// export const SettingsPage = () => {
//   // 💡 1. 精准订阅你需要的某一个属性（类似 GetX 的响应式监听，只有当 configId 变化时该组件才会刷新）
//   const configId = useThirdPartyStore((state) => state.configId);

//   // 💡 2. 获取触发请求的方法
//   const fetchConfig = useThirdPartyStore((state) => state.fetchConfig);

//   useEffect(() => {
//     fetchConfig(); // 页面加载时请求
//   }, []);

//   return (
//     <div>
//       <h1>设置页面</h1>
//       <p>全局的第三方属性 configId 是: {configId}</p>
//     </div>
//   );
// };
