import { useEffect, useState } from 'react'
import { Container, Loader } from 'semantic-ui-react'
import { TimerHistory, timersService } from 'src/services/timers'

import styles from './content.module.scss'
import { Controls } from './controls'
import { Histogram } from './histogram'
import { HistoryTable } from './table'

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

  // ----------------
  // Effect
  useEffect(() => {
    const getTimers = async () => {
      const timers = await timersService.getTimers()
      setTimers(timers)
      setIsLoading(false)
    }
    getTimers()
  }, [])

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

        <HistoryTable
          timers={filteredTimers}
          onGroupClick={onGroupNameClick}
          onProjectClick={onProjectNameClick}
          onViewClick={() => {}} // TODO
        />
      </Container>
    </div>
  )
}
