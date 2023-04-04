import { Search } from '../app/components/Search'
import { Meta, StoryFn } from '@storybook/react'
import { withRouter } from 'storybook-addon-react-router-v6'
import Box from '@mui/material/Box'
import { COLORS } from '../styles/theme/colors'

export default {
  title: 'Example/Search',
  component: Search,
  decorators: [withRouter],
} satisfies Meta<typeof Search>

const Template: StoryFn<typeof Search> = args => (
  <Box sx={{ width: '500px', backgroundColor: COLORS.brandDark, padding: '50px' }}>
    <Search {...args} />
  </Box>
)

export const ButtonVariant = {
  render: Template,

  args: {
    variant: 'button',
  },
}

export const IconVariant = {
  render: Template,

  args: {
    variant: 'icon',
  },
}
