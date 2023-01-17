import { ComponentMeta, ComponentStory } from '@storybook/react'
import Box from '@mui/material/Box'
import React from 'react'
import { Table, TableCellAlign, TableColProps, TableRowProps } from '../app/components/Table'
import { withRouter } from 'storybook-addon-react-router-v6'
import { intlDateFormat } from '../app/utils/dateFormatter'

export default {
  title: 'Example/Table',
  component: Table,
  decorators: [withRouter],
} satisfies ComponentMeta<typeof Table>

const columns: TableColProps[] = [{ content: 'Status' }, { content: 'Date', align: TableCellAlign.Right }]
const data = [
  {
    id: '1',
    status: 'ok',
    date: new Date('2023-01-01T00:00:00.000Z'),
  },
  {
    id: '2',
    status: 'ok',
    date: new Date('2023-01-02T00:00:00.000Z'),
  },
  {
    id: '3',
    status: 'ok',
    date: new Date('2023-01-03T00:00:00.000Z'),
  },
  {
    id: '4',
    status: 'ok',
    date: new Date('2023-01-04T00:00:00.000Z'),
  },
  {
    id: '5',
    status: 'ok',
    date: new Date('2023-01-05T00:00:00.000Z'),
  },
  {
    id: '6',
    status: 'ok',
    date: new Date('2023-01-06T00:00:00.000Z'),
  },
  {
    id: '7',
    status: 'ok',
    date: new Date('2023-01-07T00:00:00.000Z'),
  },
  {
    id: '8',
    status: 'ok',
    date: new Date('2023-01-08T00:00:00.000Z'),
  },
  {
    id: '9',
    status: 'ok',
    date: new Date('2023-01-09T00:00:00.000Z'),
  },
  {
    id: '10',
    status: 'ok',
    date: new Date('2023-01-10T00:00:00.000Z'),
  },
]

const rows: TableRowProps[] = data?.map(rowData => ({
  key: rowData.id!,
  data: [
    {
      content: rowData.status,
      key: 'success',
    },
    {
      content: intlDateFormat(rowData.date),
      key: 'data',
      align: TableCellAlign.Right,
    },
  ],
}))

const Template: ComponentStory<typeof Table> = args => {
  return (
    <Box sx={{ width: '500px' }}>
      <Table {...args} />
    </Box>
  )
}

export const SampleTable = Template.bind({})
SampleTable.args = {
  columns,
  rows,
  isLoading: false,
  name: 'Sample table',
  pagination: {
    selectedPage: 5,
    linkToPage: page => ({ search: `?page=${page}` }),
  },
}
