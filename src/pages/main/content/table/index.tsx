import { useEffect, useState } from 'react'
import { Grid, Pagination, Segment } from 'semantic-ui-react'
import { TimerHistory } from 'src/services/timerHistoryService'
import styles from './table.module.scss'

interface HistoryTableProps {
  timers: TimerHistory[]
  onGroupClick: (group: string) => void
  onProjectClick: (group: string, project: string) => void
  onViewClick: (timer: TimerHistory) => void
}

interface HistoryTableItemProps {
  timer: TimerHistory
  onGroupClick: (group: string) => void
  onProjectClick: (group: string, project: string) => void
  onViewClick: (timer: TimerHistory) => void
}

const HistoryListItem = ({
  timer,
  onGroupClick,
  onProjectClick,
  onViewClick
}: HistoryTableItemProps) => {
  return (
    <Grid.Row divided centered verticalAlign='middle'>
      <Grid.Column width={2}>
        <div
          className={styles.pressable}
          onClick={_ => onGroupClick(timer.group)}
        >
          {timer.group}
        </div>
      </Grid.Column>
      <Grid.Column width={2}>
        <div
          className={styles.pressable}
          onClick={_ => onProjectClick(timer.group, timer.project)}
        >
          {timer.project}
        </div>
      </Grid.Column>
      <Grid.Column width={3}>{timer.date.toDateString()}</Grid.Column>
      <Grid.Column floated='right' width={2}>
        {timer.hourString}
      </Grid.Column>
      <Grid.Column width={1}>
        <span
          className={`${styles.icon} ${styles.pressable}`}
          onClick={_ => onViewClick(timer)}
        >
          🔍
        </span>
      </Grid.Column>
    </Grid.Row>
  )
}

export const HistoryTable = ({
  timers,
  onGroupClick,
  onProjectClick,
  onViewClick
}: HistoryTableProps) => {
  const [sortedTimers, setSortedTimers] = useState<TimerHistory[][]>([])
  const [pageSize, setPageSize] = useState(25)
  const [activePageIndex, setActivePageIndex] = useState(0)
  const [pageLength, setPageLength] = useState(1)

  useEffect(() => {
    const sortedTimers = [...timers].sort(
      (a, b) => b.date.getTime() - a.date.getTime()
    )
    const pages = []
    for (let i = 0; i < sortedTimers.length; i += pageSize) {
      pages.push(sortedTimers.slice(i, i + pageSize))
    }
    setSortedTimers(pages)
    setPageLength(pages.length)
    setActivePageIndex(1)
    setPageSize(25)
  }, [timers, pageSize])

  return (
    <Segment inverted>
      <Grid
        columns={5}
        verticalAlign='middle'
        divided='vertically'
        textAlign='center'
      >
        <Grid.Row centered verticalAlign='middle'>
          <Grid.Column width={2}>
            <h3>Group</h3>
          </Grid.Column>
          <Grid.Column width={2}>
            <h3>Project</h3>
          </Grid.Column>
          <Grid.Column width={3}>
            <h3>Date</h3>
          </Grid.Column>
          <Grid.Column floated='right' width={2}>
            <h3>Time</h3>
          </Grid.Column>
          <Grid.Column width={1}>
            <h3>View</h3>
          </Grid.Column>
        </Grid.Row>

        {sortedTimers[activePageIndex - 1] &&
          sortedTimers[activePageIndex - 1].map(
            (timer: TimerHistory, index: number) => (
              <HistoryListItem
                key={index}
                timer={timer}
                onGroupClick={onGroupClick}
                onProjectClick={onProjectClick}
                onViewClick={onViewClick}
              />
            )
          )}
      </Grid>

      <Pagination
        onPageChange={(_, { activePage }: any) =>
          setActivePageIndex(parseInt(activePage))
        }
        activePage={activePageIndex}
        totalPages={pageLength}
      />
    </Segment>
  )
}
