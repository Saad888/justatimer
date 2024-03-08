import { useEffect, useState } from 'react'
import {
  Button,
  ButtonGroup,
  ButtonOr,
  Form,
  FormField,
  Grid,
  Input,
  TextArea
} from 'semantic-ui-react'
import { TimePicker } from 'src/components/timePicker'
import { TimerHistory } from 'src/services/timers'

interface TimerViewProps {
  timer: TimerHistory | null
  onSave: (timer: TimerHistory) => void
}

export const TimerView = ({ timer, onSave }: TimerViewProps) => {
  const [currentSeconds, setCurrentSeconds] = useState(0)
  const [group, setGroup] = useState('')
  const [project, setProject] = useState('')
  const [info, setInfo] = useState('')

  const dirty =
    currentSeconds !== timer?.totalSeconds ||
    group !== timer?.group ||
    project !== timer?.project ||
    info !== timer?.info

  const setState = (timer: TimerHistory | null) => {
    if (!timer) return
    setCurrentSeconds(timer.totalSeconds)
    setGroup(timer.group)
    setProject(timer.project)
    setInfo(timer.info)
  }

  const handleSave = () => {
    if (!timer) return
    const newTimer = new TimerHistory(
      timer.id,
      group,
      project,
      info,
      timer.year,
      timer.month,
      timer.day,
      currentSeconds
    )
    onSave(newTimer)
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
          <Input
            value={group}
            onChange={(_, { value }) => setGroup(value)}
            label='Group'
          />
        </FormField>
        <FormField>
          <Input
            value={project}
            onChange={(_, { value }) => setProject(value)}
            label='Project'
          />
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
            <ButtonOr />
            <Button color='green' onClick={handleSave} disabled={!dirty}>
              Save Changes
            </Button>
          </ButtonGroup>
        </div>
      </Form>
    </div>
  )
}
