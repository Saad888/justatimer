import { auth } from 'src/firebase'

export class TimerHistory {
  id: string
  group: string
  project: string
  info: string
  year: number
  month: number
  day: number
  totalSeconds: number

  constructor (
    id: string,
    group: string,
    project: string,
    info: string,
    year: number,
    month: number,
    day: number,
    totalSeconds: number
  ) {
    this.id = id
    this.group = group
    this.project = project
    this.info = info
    this.year = year
    this.month = month
    this.day = day
    this.totalSeconds = totalSeconds
  }

  get date (): Date {
    return new Date(this.year, this.month, this.day)
  }

  get hourString (): string {
    const hours = Math.floor(this.totalSeconds / 3600)
    const minutes = Math.floor((this.totalSeconds % 3600) / 60)
    return `${hours}h ${minutes}m`
  }
}

class TimerService {
  timers: TimerHistory[] | null = null

  private static instance: TimerService
  private constructor () {}
  public static getInstance (): TimerService {
    if (!TimerService.instance) {
      TimerService.instance = new TimerService()
    }
    return TimerService.instance
  }

  public async getTimers (): Promise<TimerHistory[]> {
    const user = auth.currentUser
    if (!user) return []

    if (this.timers) return this.timers

    const timers = []
    for (let i = 0; i < 1000; i++)
      timers.push(generateFakeTimerData(i.toString()))
    this.timers = timers
    return timers
  }

  public async updateTimerHistory (TimerHistory: TimerHistory): Promise<void> {
    const timers = await this.getTimers()

    const index = timers.findIndex(timer => timer.id === TimerHistory.id)
    if (index !== -1) timers[index] = TimerHistory
  }

  public async saveNewTimer (timer: TimerHistory): Promise<void> {
    const timers = await this.getTimers()
    const id = timers.length.toString()
    timer.id = id
    timers.push(timer)
  }
}

const generateFakeTimerData = (id: string): TimerHistory => {
  const groups = ['Aeroflare', 'Teraflare', 'Viewpoint', 'Personal']
  const projects = ['Project1', 'Project2', 'Project3', 'Project4']

  const group = groups[Math.floor(Math.random() * groups.length)]
  const project = `${group[0]}_${
    projects[Math.floor(Math.random() * projects.length)]
  }`
  const info = 'This is a fake timer'

  const date = new Date()
  date.setDate(date.getDate() - Math.floor(Math.random() * 180))
  const totalSeconds = Math.floor(Math.random() * 3600 * 8)

  return new TimerHistory(
    id,
    group,
    project,
    info,
    date.getFullYear(),
    date.getMonth(),
    date.getDate(),
    totalSeconds
  )
}

export const timersService = TimerService.getInstance()
