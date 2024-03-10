import {
  doc,
  getDoc,
  updateDoc,
  setDoc
} from 'firebase/firestore'
import { auth, firestore } from 'src/firebase'

function generateGUID () {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    const r = (Math.random() * 16) | 0
    const v = c === 'x' ? r : (r & 0x3) | 0x8
    return v.toString(16)
  })
}

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

  get serialized (): string {
    return JSON.stringify({
      group: this.group,
      project: this.project,
      info: this.info,
      year: this.year,
      month: this.month,
      day: this.day,
      totalSeconds: this.totalSeconds
    })
  }

  static deserialize (key: string, data: string): TimerHistory {
    const parsed = JSON.parse(data)
    return new TimerHistory(
      key,
      parsed.group,
      parsed.project,
      parsed.info,
      parsed.year,
      parsed.month,
      parsed.day,
      parsed.totalSeconds
    )
  }
}

class TimerHistoryService {
  timers: TimerHistory[] | null = null
  callback: (timers: TimerHistory[]) => void = () => {}

  private static instance: TimerHistoryService
  private constructor () {}
  public static getInstance (): TimerHistoryService {
    if (!TimerHistoryService.instance) {
      TimerHistoryService.instance = new TimerHistoryService()
    }
    return TimerHistoryService.instance
  }

  public getTimersFromFirestore = async (): Promise<TimerHistory[]> => {
    const user = auth.currentUser
    if (!user) return []

    const timers: TimerHistory[] = []
    const docRef = doc(firestore, 'history', user.uid)
    const snapshot = await getDoc(docRef)
    if (snapshot.exists()) {
      const data = snapshot.data()
      if (data) {
        for (const key in data) {
          if (data[key] === null) continue
          timers.push(TimerHistory.deserialize(key, data[key]))
        }
      }
    }
    return timers
  }

  public setupCallback = (callback: (timers: TimerHistory[]) => void): void => {
    this.callback = callback
  }

  public executeCallback = async (): Promise<void> => {
    if (this.callback !== null) this.callback(await this.getTimers())
  }

  public getTimers = async (): Promise<TimerHistory[]> => {
    const user = auth.currentUser
    if (!user) return []
    if (this.timers !== null) return this.timers
    const timers = await this.getTimersFromFirestore()
    return timers
  }

  public updateTimerHistory = async (timer: TimerHistory): Promise<void> => {
    const user = auth.currentUser
    if (!user) return

    const docRef = doc(firestore, 'history', user.uid)
    const id = timer.id !== '' ? timer.id : generateGUID()
    const docData: any = {}
    docData[id] = timer.serialized
    await setDoc(docRef, docData, { merge: true })
    this.timers = null
  }

  public deleteTimerFromHistory = async (id: string): Promise<void> => {
    const user = auth.currentUser
    if (!user) return

    const docRef = doc(firestore, 'history', user.uid)
    await updateDoc(docRef, {
      [id]: null
    })
    this.timers = null
  }

  public getGroupsList = async () => {
    const groups = new Set<string>()
    const timers = await this.getTimers()
    timers?.forEach(timer => groups.add(timer.group))
    return Array.from(groups)
  }

  public getProjectsList = async (group: string) => {
    const projects = new Set<string>()
    const timers = await this.getTimers()
    timers?.forEach(timer => {
      if (timer.group === group) projects.add(timer.project)
    })
    return Array.from(projects)
  }
}

export const timerHistoryService = TimerHistoryService.getInstance()
