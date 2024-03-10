import { useEffect, useState } from 'react'
import SemanticDatepicker from 'react-semantic-ui-datepickers'
import {
  Button,
  ButtonGroup,
  ButtonOr,
  Form,
  FormField,
  Input,
  TextArea
} from 'semantic-ui-react'
import { GroupInput, ProjectInput } from 'src/components/input'
import { TimePicker } from 'src/components/timePicker'
import { TimerHistory } from 'src/services/timerHistoryService'

interface TimerViewProps {
  timer: TimerHistory | null
  onSave: (timer: TimerHistory) => void
  onDelete: (timer: TimerHistory) => void
}

export const TimerView = ({ timer, onSave, onDelete }: TimerViewProps) => {
  const [currentSeconds, setCurrentSeconds] = useState(0)
  const [group, setGroup] = useState('')
  const [project, setProject] = useState('')
  const [info, setInfo] = useState('')
  const [date, setDate] = useState(new Date())

  const dirty =
    currentSeconds !== timer?.totalSeconds ||
    group !== timer?.group ||
    project !== timer?.project ||
    info !== timer?.info ||
    date.getFullYear() !== timer?.date.getFullYear() ||
    date.getMonth() !== timer?.date.getMonth() ||
    date.getDate() !== timer?.date.getDate()

  const setState = (timer: TimerHistory | null) => {
    if (!timer) return
    setDate(timer.date)
    setCurrentSeconds(timer.totalSeconds)
    setGroup(timer.group)
    setProject(timer.project)
    setInfo(timer.info)
  }

  const handleSave = () => {
    // Alert for confirmation
    if (!window.confirm('Are you sure you want to save?')) return

    if (!timer) return
    const newTimer = new TimerHistory(
      timer.id,
      group,
      project,
      info,
      date.getFullYear(),
      date.getMonth(),
      date.getDate(),
      currentSeconds
    )
    onSave(newTimer)
  }

  const handleDelete = () => {
    if (!window.confirm('Are you sure you want to save?')) return

    if (!timer || timer.id === '') return
    onDelete(timer)
  }

  useEffect(() => {
    setState(timer)
  }, [timer])

  if (timer === null) return null

  return (
    <div>
      <TimePicker value={currentSeconds} setValue={setCurrentSeconds} />
      <div style={{ height: 10 }}></div>
      <Form>
        <FormField>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <SemanticDatepicker
              value={date}
              clearable={false}
              onChange={(_, { value }: any) => setDate(value)}
            />
          </div>
        </FormField>
        <FormField>
          <GroupInput value={group} onChange={setGroup} />
        </FormField>
        <FormField>
          <ProjectInput value={project} onChange={setProject} group={group} />
        </FormField>
        <FormField>
          <TextArea
            value={info}
            onChange={(_, { value }) => setInfo(value?.toString() ?? '')}
            placeholder='Info'
          />
        </FormField>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          <ButtonGroup>
            <Button
              color='grey'
              onClick={() => setState(timer)}
              disabled={!dirty}
            >
              Undo Changes
            </Button>
            <Button color='green' onClick={handleSave} disabled={!dirty}>
              Save Changes
            </Button>
            <Button
              color='red'
              onClick={handleDelete}
              disabled={timer.id === ''}
            >
              Delete
            </Button>
          </ButtonGroup>
        </div>
      </Form>
    </div>
  )
}
