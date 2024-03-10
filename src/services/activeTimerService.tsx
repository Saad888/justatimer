import { Unsubscribe } from 'firebase/auth'
import {
  onSnapshot,
  doc,
  DocumentData,
  setDoc,
  deleteDoc,
  getDoc
} from 'firebase/firestore'
import { auth, firestore } from 'src/firebase'
import { TimerHistory, timerHistoryService } from './timerHistoryService'

export interface ActiveTimer {
  isPlaying: boolean
  lastTimePlayed: Date
  group: string
  project: string
  info: string
  startDate: Date
  totalSeconds: number
}

const getUid = () => {
  if (auth.currentUser === null) {
    throw new Error('User not logged in')
  }
  return auth.currentUser.uid
}

export const getActiveTimer = async (): Promise<ActiveTimer | null> => {
  const docRef = getActiveTimerDocRef()
  const doc = await getDoc(docRef)
  return convertTimerFromFirestore(doc)
}

export const subscribeToActiveTimer = (
  callback: (arg0: ActiveTimer | null) => void
): Unsubscribe => {
  const docRef = getActiveTimerDocRef()
  return onSnapshot(docRef, doc => callback(convertTimerFromFirestore(doc)))
}

const convertTimerFromFirestore = (doc: DocumentData): ActiveTimer | null => {
  if (!doc.exists()) return null
  const data = doc.data()
  const timer: ActiveTimer = {
    isPlaying: data.isPlaying,
    lastTimePlayed: data.lastTimePlayed.toDate(),
    group: data.group,
    project: data.project,
    info: data.info,
    startDate: data.startDate.toDate(),
    totalSeconds: data.totalSeconds
  }
  return timer
}

export const getActiveTimerDocRef = () => {
  const uid = getUid()
  return doc(firestore, `active/${uid}`)
}

export const saveTimerToFirestore = async (activeTimer: ActiveTimer | null) => {
  const docRef = getActiveTimerDocRef()
  if (activeTimer === null) {
    await deleteDoc(docRef)
  } else {
    await setDoc(docRef, activeTimer)
  }
}

export const saveTimerToHisotry = async (
  activeTimer: ActiveTimer
): Promise<void> => {
  const history = new TimerHistory(
    '',
    activeTimer.group,
    activeTimer.project,
    activeTimer.info,
    activeTimer.startDate.getFullYear(),
    activeTimer.startDate.getMonth(),
    activeTimer.startDate.getDate(),
    activeTimer.totalSeconds
  )
  await timerHistoryService.updateTimerHistory(history)
  await timerHistoryService.executeCallback();
}

export const startNewActiveTimer = async () => {
  const newTimer: ActiveTimer = {
    isPlaying: true,
    lastTimePlayed: new Date(),
    group: '',
    project: '',
    info: '',
    startDate: new Date(),
    totalSeconds: 0
  }
  await saveTimerToFirestore(newTimer)
}

export const pauseActiveTimer = async (activeTimer: ActiveTimer) => {
  const now = new Date()
  const seconds = Math.floor(
    (now.getTime() - activeTimer.lastTimePlayed.getTime()) / 1000
  )
  activeTimer.totalSeconds += seconds
  activeTimer.isPlaying = false
  await saveTimerToFirestore(activeTimer)
}

export const resumeActiveTimer = async (activeTimer: ActiveTimer) => {
  activeTimer.isPlaying = true
  activeTimer.lastTimePlayed = new Date()
  await saveTimerToFirestore(activeTimer)
}

export const saveAndCloseActiveTimer = async (activeTimer: ActiveTimer) => {
  await pauseActiveTimer(activeTimer)
  await saveTimerToFirestore(null)
  await saveTimerToHisotry(activeTimer)
}

export const deleteActiveTimer = async () => {
  await saveTimerToFirestore(null)
}

export const calculateTimePlayed = (activeTimer: ActiveTimer) => {
  const now = new Date()
  const seconds = activeTimer.isPlaying
    ? Math.floor((now.getTime() - activeTimer.lastTimePlayed.getTime()) / 1000)
    : 0
  return activeTimer.totalSeconds + seconds
}

export const updateTime = async (activeTimer: ActiveTimer, newTime: number) => {
  activeTimer.totalSeconds = newTime
  await saveTimerToFirestore(activeTimer)
}

export const updateGroup = async (
  activeTimer: ActiveTimer,
  newGroup: string
) => {
  activeTimer.group = newGroup
  await saveTimerToFirestore(activeTimer)
}

export const updateProject = async (
  activeTimer: ActiveTimer,
  newProject: string
) => {
  activeTimer.project = newProject
  await saveTimerToFirestore(activeTimer)
}

export const updateInfo = async (activeTimer: ActiveTimer, newInfo: string) => {
  activeTimer.info = newInfo
  await saveTimerToFirestore(activeTimer)
}

export const updateStartDate = async (
  activeTimer: ActiveTimer,
  newDate: Date
) => {
  activeTimer.startDate = newDate
  await saveTimerToFirestore(activeTimer)
}