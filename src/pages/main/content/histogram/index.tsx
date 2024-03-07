import { TimerHistory } from 'src/services/timers'
import styles from './histogram.module.scss'

interface HistogramProps {
  timers: TimerHistory[]
  group: string
  project: string
  start: Date
  end: Date
}

export const Histogram = ({
  timers,
  group,
  project,
  start,
  end
}: HistogramProps) => {
  return (
    <div className={styles.wrapper}>
      <h1>Histogram</h1>
    </div>
  )
}
