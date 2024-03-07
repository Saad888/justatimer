import { Grid, GridColumn, GridRow, Segment, Select } from 'semantic-ui-react'
import styles from './controls.module.scss'
import SemanticDatepicker from 'react-semantic-ui-datepickers'

interface SelectData {
  options: string[]
  selected: string
  label: string
  onChange: any
}

interface DateData {
  date: Date
  label: string
  onChange: any
}

interface ControlsProps {
  groups: SelectData
  projects: SelectData
  times: SelectData
  startDate: DateData
  endDate: DateData
}

export const SelectOptions = ({
  options,
  selected,
  onChange,
  label
}: SelectData) => {
  return (
    <GridColumn>
      <div className={styles.label}>{label}</div>
      <Select
        labeled={true}
        disabled={options.length === 0}
        options={[...options.map(option => ({ text: option, value: option }))]}
        value={selected}
        placeholder='Select...'
        onChange={(e, data) => onChange(data.value)}
      />
    </GridColumn>
  )
}

export const DateOptions = ({ date, label, onChange }: DateData) => {
  return (
    <GridColumn>
      <div className={styles.label}>{label}</div>
      <SemanticDatepicker
        value={date}
        onChange={(_, d) => onChange(d.value)}
      />
    </GridColumn>
  )
}

export const Controls = ({
  groups,
  projects,
  times,
  startDate,
  endDate
}: ControlsProps) => {
  return (
    <div className={styles.wrapper}>
      <Segment inverted>
        <Grid columns={2} relaxed='very'>
          <GridRow>
            <SelectOptions {...groups} />
            <SelectOptions {...projects} />
          </GridRow>
        </Grid>
        <Grid columns={3} relaxed='very'>
          <GridRow>
            <DateOptions {...startDate} />
            <DateOptions {...endDate} />
            <SelectOptions {...times} />
          </GridRow>
        </Grid>
        <div style={{ height: 10 }}></div>
      </Segment>
    </div>
  )
}
