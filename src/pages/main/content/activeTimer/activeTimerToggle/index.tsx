import {
  ActiveTimer,
  calculateTimePlayed
} from 'src/services/activeTimerService'
import styles from './activeTimerToggle.module.scss'
import { useEffect, useState } from 'react'

interface ActiveTimerToggleProps {
  timer: ActiveTimer | null
}

export const ActiveTimerToggle = ({ timer }: ActiveTimerToggleProps) => {
  const [content, setContent] = useState('No Active Timers')

  const updateContent = () => {
    console.log('hi')
    if (!timer) {
      setContent('No Active Timers')
    } else {
      const timePlayed = calculateTimePlayed(timer)

      const hours = Math.floor(timePlayed / 3600)
      const minutes = Math.floor((timePlayed % 3600) / 60)
      const seconds = timePlayed % 60

      const entries = []
      if (timer.group !== '') entries.push(`${timer.group}`)

      entries.push(`${hours}h ${minutes}m ${seconds}s`)

      setContent(entries.join(' - '))
    }
  }

  useEffect(() => {
    const interval = setInterval(updateContent, 500)
    return () => clearInterval(interval)
  }, [timer, updateContent])

  return <div className={styles.content}>{content}</div>
}
