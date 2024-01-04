import { Meta, StoryFn, StoryObj } from '@storybook/react'
import Card from '@mui/material/Card'
import { PieChart } from '../../app/components/charts/PieChart'

export default {
  title: 'Example/Charts/PieChart',
  component: PieChart,
} satisfies Meta<typeof PieChart>

interface DataItem {
  x: string
  y: number
}

const data: DataItem[] = [
  { x: 'Active', y: 50 },
  { x: 'Inactive', y: 10 },
  { x: 'Waiting', y: 39 },
]

const Template: StoryFn<typeof PieChart<DataItem>> = args => {
  return (
    <Card sx={{ width: '500px', height: '300px' }}>
      <PieChart {...args} />
    </Card>
  )
}

type Story = StoryObj<typeof PieChart<DataItem>>

export const SamplePieChart: Story = {
  render: Template,
  args: {
    compact: true,
    data,
    dataKey: 'y',
    formatters: {
      data: (value: number) => value.toLocaleString(),
      label: (value: string) => `${value} validators`,
    },
  },
}
