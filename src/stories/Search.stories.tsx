import { Search } from '../app/components/Search'
import { ComponentMeta, ComponentStory } from '@storybook/react'
import { withRouter } from 'storybook-addon-react-router-v6'
import Box from '@mui/material/Box'
import { COLORS } from '../styles/theme/colors'

export default {
  title: 'Example/Search',
  component: Search,
  decorators: [withRouter],
} satisfies ComponentMeta<typeof Search>

const Template: ComponentStory<typeof Search> = args => (
  <Box sx={{ width: '500px', backgroundColor: COLORS.brandDark, padding: '50px' }}>
    <Search {...args} />
  </Box>
)

export const ButtonVariant = Template.bind({})
ButtonVariant.args = {
  variant: 'button',
}

export const IconVariant = Template.bind({})
IconVariant.args = {
  variant: 'icon',
}
