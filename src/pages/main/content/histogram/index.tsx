import { TimerHistory } from 'src/services/timers'
import styles from './histogram.module.scss'
import { useEffect, useState } from 'react'
import { BarChart, axisClasses } from '@mui/x-charts'

interface HistogramProps {
  timers: TimerHistory[]
  group: string
  project: string
  start: Date
  end: Date
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

const generateBarGraphData = (
  timers: TimerHistory[],
  startDate: Date,
  endDate: Date
) => {
  // Get timer data between start date and end date
  const timeByDay: { [key: string]: number } = {}
  for (const timer of timers) {
    if (timer.date >= startDate && timer.date <= endDate) {
      const dateString = timer.date.toDateString()
      if (timeByDay[dateString]) {
        timeByDay[dateString] += timer.totalSeconds / 3600
      } else {
        timeByDay[dateString] = timer.totalSeconds / 3600
      }
    }
  }

  // Get the number of days between start date and end date
  const days = Math.floor(
    (endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)
  )

  const currentDate = new Date(startDate)
  const dayOfRecording = new Date(currentDate)
  const histogramData = []
  const daysBetweenRecords =
    days < 14 ? 1 : days < 90 ? 7 : days < 400 ? 30 : 365
  let daysTillRecord = daysBetweenRecords
  let cumulatedTime = 0
  while (currentDate <= endDate) {
    const dateString = currentDate.toDateString()

    if (timeByDay[dateString]) {
      cumulatedTime += timeByDay[dateString]
    }

    if (daysTillRecord === 0 || currentDate === endDate) {
      histogramData.push({
        date: dayOfRecording.toDateString(),
        time: cumulatedTime
      })
      cumulatedTime = 0
      daysTillRecord = daysBetweenRecords
      dayOfRecording.setDate(dayOfRecording.getDate() + daysBetweenRecords)
    }
    currentDate.setDate(currentDate.getDate() + 1)
    daysTillRecord--
  }

  return histogramData
}

const generateBarGraphDataV2 = (
  timers: TimerHistory[],
  startDate: Date,
  endDate: Date
) => {
  // Helper function to get Monday of the current week
  const getMonday = (date: Date) => {
    const day = date.getDay()
    const diff = date.getDate() - day + (day === 0 ? -6 : 1) // adjust when day is Sunday
    return new Date(date.setDate(diff))
  }

  // Helper function to format month names
  const getMonthName = (date: Date) => {
    return date.toLocaleDateString('default', {
      month: 'long',
      year: 'numeric'
    })
  }

  const timeByDay: { [key: string]: number } = {}
  for (const timer of timers) {
    if (timer.date >= startDate && timer.date <= endDate) {
      const dateString = timer.date.toDateString()
      if (timeByDay[dateString]) {
        timeByDay[dateString] += timer.totalSeconds / 3600
      } else {
        timeByDay[dateString] = timer.totalSeconds / 3600
      }
    }
  }

  const days = Math.floor(
    (endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)
  )
  console.log(days)
  let daysBetweenRecords
  let labelFunction

  if (days < 30) {
    daysBetweenRecords = 1
    labelFunction = (date: Date) => date.toDateString()
  } else if (days < 90) {
    daysBetweenRecords = 7
    labelFunction = (date: Date) => getMonday(new Date(date)).toDateString()
  } else if (days < 400) {
    daysBetweenRecords = 30 // Approximation for monthly data
    labelFunction = (date: Date) => getMonthName(new Date(date))
  } else {
    daysBetweenRecords = 365 // Approximation for yearly data
    labelFunction = (date: Date) => getMonthName(new Date(date))
  }

  const histogramData = []
  const currentDate = new Date(startDate)
  let cumulatedTime = 0
  let dayOfRecording = new Date(currentDate)

  while (currentDate <= endDate) {
    const dateString = currentDate.toDateString()

    if (timeByDay[dateString]) {
      cumulatedTime += timeByDay[dateString]
    }

    currentDate.setDate(currentDate.getDate() + 1)

    if (--daysBetweenRecords === 0 || currentDate > endDate) {
      histogramData.push({
        date: labelFunction(dayOfRecording),
        time: cumulatedTime
      })
      cumulatedTime = 0
      daysBetweenRecords = days < 90 ? 7 : 30 // Reset daysBetweenRecords based on condition
      dayOfRecording = new Date(currentDate) // Move to next recording period
    }
  }

  return histogramData
}

function generateBarGraphDataV3 (
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
  const [filteredData, setFilteredData] = useState<TimerHistory[]>([])

  const dataset = generateBarGraphDataV3(filteredData, start, end)
  console.log(dataset)

  const chartSetting = {
    yAxis: [
      {
        label: 'Hours'
      }
    ],
    height: 300,
    sx: {
      '& .axis-labels-class': {
        color: 'white'
      },
      '& .axis-line-class': {
        color: 'red',
        fontSize: '12px',
        backgroundColor: 'red'
      },
      '& .MuiChartsAxis-tickLabel': {
        fill: 'white',
      },
      '& .MuiChartsAxis-line': {
        stroke: 'white',
      },
      '& .MuiChartsAxis-tickContainer': {
        stroke: 'white',
      },
      '& .MuiChartsAxisHighlight-tickLabel': {
        stroke: 'red',
        fill: 'red',
        color: 'red'
      },
    }
  }

  useEffect(() => {
    setFilteredData(filterTimerData(timers, group, project, start, end))
  }, [timers, group, project, start, end])

  if (dataset.length === 0) {
    return <div>No data available</div>
  }

  return (
    <div className={styles.wrapper}>
      <BarChart
        dataset={dataset}
        colors={["#AEC3B0"]}
        xAxis={[{ scaleType: 'band', dataKey: 'label' }]}
        series={[{ dataKey: 'totalHours' }]}
        {...chartSetting}
      />
    </div>
  )
}
