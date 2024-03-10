import { useEffect, useState } from 'react'
import { Button, Container, Grid, Loader } from 'semantic-ui-react'
import {
  TimerHistory,
  timerHistoryService
} from 'src/services/timerHistoryService'

import styles from './content.module.scss'
import { Controls } from './controls'
import { Histogram } from './histogram'
import { HistoryTable } from './table'
import { ModalContent } from './modal'
import { TimerView } from './timerView'
import { ActiveTimerDisplay } from './activeTimer'
import { auth } from 'src/firebase'

const TIMER_OPTIONS = {
  Last7Days: 'Last 7 Days',
  Last14Days: 'Last 14 Days',
  Last30Days: 'Last 30 Days',
  LastYear: 'Last Year',
  Last5Years: 'Last 5 Years',
  ThisMonth: 'This Month',
  ThisYear: 'This Year'
}

const addDays = (date: Date, days: number): Date => {
  const newDate = new Date(date)
  newDate.setDate(newDate.getDate() + days)
  return newDate
}

const getBlankTimeHistory = () => {
  const date = new Date()
  return new TimerHistory(
    '',
    '',
    '',
    '',
    date.getFullYear(),
    date.getMonth(),
    date.getDate(),
    0
  )
}

const filterTimerData = (
  timers: TimerHistory[],
  group: string,
  project: string,
  start: Date,
  end: Date
) => {
  return timers.filter(timer => {
    return (
      (group === 'All' || timer.group === group) &&
      (project === 'All' || timer.project === project) &&
      timer.date >= start &&
      timer.date <= end
    )
  })
}

export const Content = () => {
  const user = auth.currentUser
  const [loading, setIsLoading] = useState(true)
  const [timers, setTimers] = useState<TimerHistory[]>([])
  const [filteredTimers, setFilteredTimers] = useState<TimerHistory[]>([])

  // ----------------
  // States
  const [activeGroup, setActiveGroup] = useState('All')
  const [activeProject, setActiveProject] = useState('All')
  const [activeTime, setActiveTime] = useState(TIMER_OPTIONS.Last7Days)
  const [startDate, setStartDate] = useState(addDays(new Date(), -7))
  const [endDate, setEndDate] = useState(new Date())
  const [viewModalTimer, setViewModalTimer] = useState<TimerHistory | null>(
    null
  )

  // ----------------
  // Calculated Values Based On Filters
  const groups = [
    'All',
    ...Array.from(new Set(timers.map(timer => timer.group))).sort()
  ]
  const projects = [
    'All',
    ...(activeGroup !== ''
      ? Array.from(
          new Set(
            timers
              .filter(timer => timer.group === activeGroup)
              .map(timer => timer.project)
          )
        )
      : []
    ).sort()
  ]

  // ----------------
  // Event Handlers
  const onGroupChange = (group: string) => {
    setActiveGroup(group)
    setActiveProject('All')
  }
  const onTimeSelectionChange = (time: string) => {
    setActiveTime(time)
    setEndDate(new Date())
    switch (time) {
      case TIMER_OPTIONS.Last7Days:
        setStartDate(addDays(new Date(), -7))
        break
      case TIMER_OPTIONS.Last14Days:
        setStartDate(addDays(new Date(), -14))
        break
      case TIMER_OPTIONS.Last30Days:
        setStartDate(addDays(new Date(), -30))
        break
      case TIMER_OPTIONS.LastYear:
        setStartDate(addDays(new Date(), -365))
        break
      case TIMER_OPTIONS.Last5Years:
        setStartDate(addDays(new Date(), -365 * 5))
        break
      case TIMER_OPTIONS.ThisMonth:
        setStartDate(
          new Date(new Date().getFullYear(), new Date().getMonth(), 1)
        )
        break
      case TIMER_OPTIONS.ThisYear:
        setStartDate(new Date(new Date().getFullYear(), 0, 1))
        break
    }
  }

  const onGroupNameClick = (group: string) => {
    setActiveGroup(group)
    setActiveProject('All')
  }

  const onProjectNameClick = (group: string, project: string) => {
    setActiveGroup(group)
    setActiveProject(project)
  }

  const onUpdateTimer = async (timer: TimerHistory) => {
    await timerHistoryService.updateTimerHistory(timer)
    const updatedTimers = await timerHistoryService.getTimers()
    setTimers([...updatedTimers])
    setViewModalTimer(null)
  }

  const onDeleteTimer = async (timer: TimerHistory) => {
    await timerHistoryService.deleteTimerFromHistory(timer.id)
    const updatedTimers = await timerHistoryService.getTimers()
    setTimers([...updatedTimers])
    setViewModalTimer(null)
  }

  // ----------------
  // Effect
  useEffect(() => {
    if (!user) return
    const getTimers = async () => {
      const timers = await timerHistoryService.getTimers()
      timerHistoryService.setupCallback(setTimers)
      setTimers(timers)
      setIsLoading(false)
    }
    getTimers()
  }, [user])

  useEffect(() => {
    setFilteredTimers(
      filterTimerData(timers, activeGroup, activeProject, startDate, endDate)
    )
  }, [timers, activeGroup, activeProject, startDate, endDate])

  if (loading) {
    return <Loader active />
  }

  return (
    <div className={styles.wrapper}>
      <Container>
        <Controls
          groups={{
            options: groups,
            selected: activeGroup,
            onChange: onGroupChange,
            label: 'Groups'
          }}
          projects={{
            options: projects,
            selected: activeProject,
            onChange: setActiveProject,
            label: 'Projects'
          }}
          times={{
            options: Array.from(Object.values(TIMER_OPTIONS)),
            selected: activeTime,
            onChange: onTimeSelectionChange,
            label: 'Time'
          }}
          startDate={{
            date: startDate,
            label: 'Start Date',
            onChange: setStartDate
          }}
          endDate={{
            date: endDate,
            label: 'End Date',
            onChange: setEndDate
          }}
        />

        <Histogram
          timers={filteredTimers}
          group={activeGroup}
          project={activeProject}
          start={startDate}
          end={endDate}
        />

        <div>
          <Button
            color='grey'
            onClick={() => setViewModalTimer(getBlankTimeHistory())}
          >
            Add New Timer
          </Button>
        </div>

        <HistoryTable
          timers={filteredTimers}
          onGroupClick={onGroupNameClick}
          onProjectClick={onProjectNameClick}
          onViewClick={setViewModalTimer}
        />

        <ModalContent
          open={!!viewModalTimer}
          handleClose={() => setViewModalTimer(null)}
        >
          <TimerView
            timer={viewModalTimer}
            onSave={onUpdateTimer}
            onDelete={onDeleteTimer}
          />
        </ModalContent>

        <ActiveTimerDisplay />
      </Container>
    </div>
  )
}
