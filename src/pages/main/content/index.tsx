import { useEffect, useState } from 'react'
import { Loader } from 'semantic-ui-react'
import { TimerData, timersService } from 'src/services/timers'

export const Content = () => {
  const [loading, setIsLoading] = useState(true)
  const [timers, setTimers] = useState<TimerData[]>([])

  useEffect(() => {
    const getTimers = async () => {
      const timers = await timersService.getTimers()
      setTimers(timers)
      setIsLoading(false)
    }
    getTimers()
  }, [])

  if (loading) {
    return <Loader active />
  }

  return (
    <div>
      <div></div>
    </div>
  )
}
