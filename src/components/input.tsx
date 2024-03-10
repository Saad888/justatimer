import { useEffect, useState } from 'react'
import { Input } from 'semantic-ui-react'
import { timerHistoryService } from 'src/services/timerHistoryService'

interface InputWithListProps {
  list: string[]
  listName: string
  value: string | undefined
  onChange: (value: string) => void
  placeholder: string
}

export const InputWithList = ({
  list,
  listName,
  value,
  onChange,
  placeholder
}: InputWithListProps) => {
  return (
    <>
      <Input
        list={listName}
        placeholder={placeholder}
        value={value}
        onChange={(_, { value }) => onChange(value)}
      />
      <datalist id={listName}>
        {list.map((item, index) => (
          <option key={index} value={item} />
        ))}
      </datalist>
    </>
  )
}

interface GroupInputProps {
  value: string | undefined
  onChange: (value: string) => void
}

export const GroupInput = ({ value, onChange }: GroupInputProps) => {
  const [list, setList] = useState<Array<string>>([])

  useEffect(() => {
    const updateList = async () => {
      setList(await timerHistoryService.getGroupsList())
    }
    updateList()
  }, [])

  return (
    <InputWithList
      list={list}
      listName='groupList'
      value={value}
      onChange={onChange}
      placeholder='Group'
    />
  )
}

interface ProjectInputProps {
  value: string | undefined
  group: string | undefined
  onChange: (value: string) => void
}

export const ProjectInput = ({ value, onChange, group }: ProjectInputProps) => {
  const [list, setList] = useState<Array<string>>([])

  useEffect(() => {
    const updateList = async () => {
      if (group === undefined) return
      setList(await timerHistoryService.getProjectsList(group))
    }
    updateList()
  }, [group])

  return (
    <InputWithList
      list={list}
      listName='projectList'
      value={value}
      onChange={onChange}
      placeholder='Project'
    />
  )
}
