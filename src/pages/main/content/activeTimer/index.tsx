import {
  ActiveTimer,
  getActiveTimer,
  subscribeToActiveTimer
} from 'src/services/activeTimerService'
import styles from './activeTimer.module.scss'
import { useEffect, useState } from 'react'
import { useAuth } from 'src/context/AuthContext'
import { ActiveTimerContent } from './activeTimerContent'
import { ActiveTimerToggle } from './activeTimerToggle'

export const ActiveTimerDisplay = () => {
  const { currentUser } = useAuth()
  const [activeTimer, setActiveTimer] = useState<ActiveTimer | null>(null)
  const [shown, setShown] = useState(false)

  useEffect(() => {
    if (currentUser === null) {
      setActiveTimer(null)
    } else {
      const getStartingData = async () => {
        setActiveTimer(await getActiveTimer())
      }
      getStartingData()
      const unsub = subscribeToActiveTimer(setActiveTimer)
      return unsub
    }
  }, [currentUser])

  return (
    <div className={styles.wrapper}>
      <div className={`${styles.timerWrapper} ${shown && styles.active}`}>
        <ActiveTimerContent
          timer={activeTimer}
          shown={shown}
          setShown={setShown}
        />
      </div>
      <div className={styles.toggle} onClick={() => setShown(!shown)}>
        <ActiveTimerToggle timer={activeTimer} />
      </div>
    </div>
  )
}
