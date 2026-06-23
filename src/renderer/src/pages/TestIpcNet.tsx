import { useState } from 'react'

// 1. 模拟一个第三方接口返回的数据结构
interface ThirdPartyWeather {
  city: string
  temperature: string
  weather: string
}

//这个页面主要用来测试主进程的 API 桥接功能，展示如何在渲染进程中调用主进程暴露的 API 来实现请求，并获取第三方数据。

export const WeatherWidget = () => {
  const [weather, setWeather] = useState<ThirdPartyWeather | null>(null)
  const [loading, setLoading] = useState(false)

  const getThirdPartyData = async () => {
    setLoading(true)
    try {
      // 2. 直接调用主进程暴露的 API，这里填写的第三方 URL 绝对不会报跨域错误！
      const result = await window.thirdApi.requestThirdParty<ThirdPartyWeather>({
        method: 'GET',
        url: 'https://api.thirdparty-weather.com/v1/current',
        params: { location: 'singapore' }
      })

      if (result.success && result.data) {
        setWeather(result.data.data)
      } else {
        alert(`请求失败: ${result.error}`)
      }
    } catch (err) {
      console.error('通信异常:', err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="weather-box">
      <h3>第三方天气插件 (主进程转发)</h3>
      <button onClick={getThirdPartyData} disabled={loading}>
        {loading ? '正在穿透跨域请求...' : '获取最新数据'}
      </button>
      {weather && (
        <p>
          城市: {weather.city} | 温度: {weather.temperature}℃ ({weather.weather})
        </p>
      )}
    </div>
  )
}
