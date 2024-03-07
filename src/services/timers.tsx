import { auth } from 'src/firebase'

export interface TimerData {
  group: string
  project: string
  info: string
  totalSeconds: number
  isActive: boolean
  lastStarted: Date
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

  public async getTimers (): Promise<TimerData[]> {
    const user = auth.currentUser
    if (!user) return []

    const timers = []
    for (let i = 0; i < 100; i++) timers.push(generateFakeTimerData())
    return timers
  }
}

const generateFakeTimerData = (): TimerData => {
  // Group can be "Aeroflare", "Teraflare", "Viewpoint", or "Personal"
  // Project can be "Website", "App", "Design", or "Other"
  // Info can be any string
  // TotalSeconds can be any number
  // IsActive can be true or false
  // LastStarted can be any date

  const groups = ['Aeroflare', 'Teraflare', 'Viewpoint', 'Personal']
  const projects = ['Project1', 'Project2', 'Project3', 'Project4']

  const group = groups[Math.floor(Math.random() * groups.length)]
  const project = projects[Math.floor(Math.random() * projects.length)]
  const info = 'This is a fake timer'
  const totalSeconds = Math.floor(Math.random() * 100000)
  const isActive = false
  const lastStarted = new Date()

  return { group, project, info, totalSeconds, isActive, lastStarted }
}

export const timersService = TimerService.getInstance()
