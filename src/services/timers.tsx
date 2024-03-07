import { auth } from 'src/firebase'


export class TimerHistory {
  group: string
  project: string
  info: string
  year: number
  month: number
  day: number
  totalSeconds: number

  constructor (group: string, project: string, info: string, year: number, month: number, day: number, totalSeconds: number) {
    this.group = group
    this.project = project
    this.info = info
    this.year = year
    this.month = month
    this.day = day
    this.totalSeconds = totalSeconds
  }
}

class TimerService {
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

    const timers = []
    for (let i = 0; i < 100; i++) timers.push(generateFakeTimerData())
    return timers
  }
}

const generateFakeTimerData = (): TimerHistory => {
  const groups = ['Aeroflare', 'Teraflare', 'Viewpoint', 'Personal']
  const projects = ['Project1', 'Project2', 'Project3', 'Project4']

  const group = groups[Math.floor(Math.random() * groups.length)]
  const project = `${group[0]}_${projects[Math.floor(Math.random() * projects.length)]}`
  const info = 'This is a fake timer'

  const date = new Date()
  // start date is anytime in the last 180 days
  date.setDate(date.getDate() - Math.floor(Math.random() * 180))
  const totalSeconds = Math.floor(Math.random() * 3600 * 8)

  return new TimerHistory(group, project, info, date.getFullYear(), date.getMonth(), date.getDate(), totalSeconds);
}

export const timersService = TimerService.getInstance()
