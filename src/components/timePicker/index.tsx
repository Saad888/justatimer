import { useEffect, useState } from 'react'
import styles from './timePicker.module.scss'

interface TimePickerProps {
  value: number
  setValue?: (value: number) => void
  readOnly?: boolean
}

const TimerInput = ({ value, setValue, long, readOnly }: any) => {
  let strVal = value.toString()
  if (strVal.length === 1) {
    strVal = `0${strVal}`
  }
  return (
    <input
      className={`${styles.input} ${long && styles.long}`}
      value={strVal}
      onChange={e => setValue(parseInt(e.target.value))}
      readOnly={readOnly}
    />
  )
}

export const TimePicker = ({ value, setValue, readOnly }: TimePickerProps) => {
  const [hours, setHours] = useState(999)
  const [minutes, setMinutes] = useState(99)
  const [seconds, setSeconds] = useState(99)

  useEffect(() => {
    setHours(Math.floor(value / 3600))
    setMinutes(Math.floor((value % 3600) / 60))
    setSeconds(value % 60)
  }, [value])

  const onHoursChange = (value: number) => {
    value = isNaN(value) ? 0 : value
    if (value >= 1000) value = value % 1000
    if (!!setValue) setValue(value * 3600 + minutes * 60 + seconds)
  }

  const onMinutesChange = (value: number) => {
    value = isNaN(value) ? 0 : value
    if (value >= 100) value = value % 100
    if (value >= 60) value %= 60
    if (!!setValue) setValue(hours * 3600 + value * 60 + seconds)
  }

  const onSecondsChange = (value: number) => {
    value = isNaN(value) ? 0 : value
    if (value >= 100) value = value % 100
    if (value >= 60) value %= 60
    if (!!setValue) setValue(hours * 3600 + minutes * 60 + value)
  }

  return (
    <div>
      <TimerInput
        value={hours}
        setValue={onHoursChange}
        long
        readOnly={readOnly}
      />
      <span className={styles.divider}>:</span>
      <TimerInput
        value={minutes}
        setValue={onMinutesChange}
        readOnly={readOnly}
      />
      <span className={styles.divider}>:</span>
      <TimerInput
        value={seconds}
        setValue={onSecondsChange}
        readOnly={readOnly}
      />
    </div>
  )
}
