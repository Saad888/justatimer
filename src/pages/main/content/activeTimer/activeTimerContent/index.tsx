import styles from './activeTimerContent.module.scss'
import {
  Button,
  ButtonGroup,
  ButtonOr,
  Form,
  Icon,
  Input,
  Label,
  TextArea
} from 'semantic-ui-react'
import { useEffect, useState } from 'react'
import {
  ActiveTimer,
  calculateTimePlayed,
  deleteActiveTimer,
  pauseActiveTimer,
  resumeActiveTimer,
  saveAndCloseActiveTimer,
  startNewActiveTimer,
  updateGroup,
  updateInfo,
  updateProject,
  updateStartDate,
  updateTime
} from 'src/services/activeTimerService'
import { TimePicker } from 'src/components/timePicker'
import SemanticDatepicker from 'react-semantic-ui-datepickers'
import { GroupInput, ProjectInput } from 'src/components/input'

interface ActiveTimerComponentProp {
  timer: ActiveTimer | null
}

interface ActiveTimerContentProps {
  timer: ActiveTimer | null
  shown: boolean
  setShown: (shown: boolean) => void
}

const ActiveTimerStart = ({ timer }: ActiveTimerComponentProp) => {
  if (timer !== null) return null

  return (
    <div className={styles.start}>
      <Button
        icon
        labelPosition='left'
        color='green'
        onClick={() => startNewActiveTimer()}
      >
        <Icon name='play' />
        Start a New Timer
      </Button>
    </div>
  )
}

const ActiveTimerView = ({
  timer,
  shown,
  setShown
}: ActiveTimerContentProps) => {
  const [timePlayed, setTimePlayed] = useState(
    !!timer ? calculateTimePlayed(timer) : 0
  )
  const [group, setGroup] = useState(timer?.group)
  const [project, setProject] = useState(timer?.project)
  const [info, setInfo] = useState(timer?.info)
  const [startDate, setStartDate] = useState(timer?.startDate)

  const getTimePlayed = () => {
    if (timer === null) return
    setTimePlayed(calculateTimePlayed(timer))
  }

  const updateTimerValue = (value: number) => {
    if (timer === null || timer.isPlaying) return
    updateTime(timer, value)
    setTimePlayed(value)
  }

  const onGroupUpdate = (v: string) => {
    if (timer === null) return
    updateGroup(timer, v)
    setGroup(v)
  }

  const onProjectUpdate = (v: string) => {
    if (timer === null) return
    updateProject(timer, v)
    setProject(v)
  }

  const onInfoUpdate = (v: string) => {
    if (timer === null) return
    updateInfo(timer, v)
    setInfo(v)
  }

  const onStartDateChange = (v: Date | Date[] | null | undefined) => {
    if (timer === null) return
    if (!v) v = new Date()
    if (Array.isArray(v)) v = v[0]
    updateStartDate(timer, v)
    setStartDate(v)
  }

  useEffect(() => {
    if (timer?.group !== group) {
      const timeVal = setTimeout(() => setGroup(timer?.group), 100)
      return () => clearTimeout(timeVal)
    }
    if (timer?.project !== project) {
      const timeVal = setTimeout(() => setProject(timer?.project), 100)
      return () => clearTimeout(timeVal)
    }
    if (timer?.info !== info) {
      const timeVal = setTimeout(() => setInfo(timer?.info), 100)
      return () => clearTimeout(timeVal)
    }
    if (timer?.startDate !== startDate) {
      const timeVal = setTimeout(() => setStartDate(timer?.startDate), 100)
      return () => clearTimeout(timeVal)
    }
  }, [timer?.group, timer?.project, timer?.info, timer?.startDate])

  useEffect(() => {
    if (timer === null) return
    const interval = setInterval(getTimePlayed, 100)
    return () => clearInterval(interval)
  }, [timer])

  if (timer === null) return null

  return (
    <div className={styles.timer}>
      <div
        className={`${styles.icon} ${styles.delete} ${shown && styles.show}`}
        onClick={deleteActiveTimer}
      >
        <Icon name='trash' />
      </div>
      <div
        className={`${styles.icon} ${styles.close} ${shown && styles.show}`}
        onClick={() => setShown(false)}
      >
        <Icon name='close' />
      </div>

      <TimePicker
        value={timePlayed}
        readOnly={timer.isPlaying}
        setValue={updateTimerValue}
      />

      <div style={{ margin: 20 }}>
        {timer.isPlaying && (
          <ButtonGroup>
            <Button
              icon
              labelPosition='left'
              color='red'
              onClick={() => pauseActiveTimer(timer)}
            >
              <Icon name='pause' />
              Pause
            </Button>
          </ButtonGroup>
        )}
        {!timer.isPlaying && (
          <ButtonGroup>
            <Button
              icon
              labelPosition='left'
              color='green'
              onClick={() => resumeActiveTimer(timer)}
            >
              <Icon name='play' />
              Resume
            </Button>
            <Button
              icon
              labelPosition='left'
              color='blue'
              onClick={() => saveAndCloseActiveTimer(timer)}
            >
              <Icon name='save' />
              Save
            </Button>
          </ButtonGroup>
        )}
      </div>

      <Form>
        <div className={styles.inputs}>
          <div className={styles.inputLabel}>Date</div>
          <SemanticDatepicker
            value={startDate}
            clearable={false}
            onChange={(_, { value }) => onStartDateChange(value)}
            pointing='right'
          />
          <div className={styles.inputLabel}>Group</div>
          <GroupInput value={group} onChange={onGroupUpdate} />
          <div className={styles.inputLabel}>Project</div>
          <ProjectInput
            value={project}
            onChange={onProjectUpdate}
            group={group}
          />
          <div className={styles.inputLabel}>Info</div>
          <TextArea
            value={info}
            onChange={(_, { value }) => onInfoUpdate(value?.toString() ?? '')}
            placeholder='Info'
            rows={7}
          />
        </div>
      </Form>
    </div>
  )
}

export const ActiveTimerContent = ({
  timer,
  shown,
  setShown
}: ActiveTimerContentProps) => {
  const [showStart, setShowStart] = useState(false)

  useEffect(() => {
    setShowStart(timer === null)
  }, [timer])

  if (showStart) {
    return (
      <div className={styles.content}>
        <ActiveTimerStart timer={timer} />
      </div>
    )
  }

  return (
    <div className={styles.content}>
      <ActiveTimerView timer={timer} shown={shown} setShown={setShown} />
    </div>
  )
}
