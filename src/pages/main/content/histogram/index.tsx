import { TimerHistory } from 'src/services/timerHistoryService'
import styles from './histogram.module.scss'
import { BarChart } from '@mui/x-charts'

interface HistogramProps {
  timers: TimerHistory[]
  group: string
  project: string
  start: Date
  end: Date
}

function generateBarGraphData (
  timerHistories: TimerHistory[],
  startDate: Date,
  endDate: Date
): Array<{ label: string; totalHours: number }> {
  const msPerDay = 86400000 // Milliseconds per day
  const diffDays = (endDate.getTime() - startDate.getTime()) / msPerDay
  let formatLabel: (date: Date) => string

  if (diffDays < 16) {
    formatLabel = date => date.toISOString().split('T')[0] // Daily
  } else if (diffDays < 95) {
    formatLabel = date => {
      const day =
        date.getDate() - date.getDay() + (date.getDay() === 0 ? -6 : 1) // Get last Monday
      const monday = new Date(date.setDate(day))
      return monday.toISOString().split('T')[0]
    } // Weekly
  } else if (diffDays < 400) {
    formatLabel = date => `${date.getFullYear()}-${date.getMonth() + 1}` // Monthly
  } else {
    formatLabel = date => `${date.getFullYear()}` // Yearly
  }

  const results = new Map<string, number>()
  timerHistories.forEach(history => {
    if (history.date >= startDate && history.date <= endDate) {
      const label = formatLabel(history.date)
      const totalHours = (results.get(label) || 0) + history.totalSeconds / 3600
      results.set(label, totalHours)
    }
  })

  // Convert Map to Array, then sort based on labels which are date strings
  return Array.from(results)
    .map(([label, totalHours]) => ({ label, totalHours }))
    .sort((a, b) => {
      // For daily and weekly, direct comparison works because the format is ISO YYYY-MM-DD
      // For monthly and yearly, extend them to a comparable format
      const labelA = a.label.includes('-') ? a.label : `${a.label}-01`
      const labelB = b.label.includes('-') ? b.label : `${b.label}-01`
      return labelA.localeCompare(labelB)
    })
}

export const Histogram = ({
  timers,
  group,
  project,
  start,
  end
}: HistogramProps) => {
  const dataset = generateBarGraphData(timers, start, end)

  const chartSetting = {
    yAxis: [
      {
        label: 'Hours'
      }
    ],
    height: 300,
    sx: {
      '& .MuiChartsAxis-tickLabel': {
        fill: 'white'
      },
      '& .MuiChartsAxis-line': {
        stroke: 'white'
      }
    }
  }

  if (dataset.length === 0) {
    return <div>No data available</div>
  }

  return (
    <div className={styles.wrapper}>
      <BarChart
        dataset={dataset}
        colors={['#AEC3B0']}
        xAxis={[{ scaleType: 'band', dataKey: 'label' }]}
        series={[{ dataKey: 'totalHours' }]}
        {...chartSetting}
      />
    </div>
  )
}
