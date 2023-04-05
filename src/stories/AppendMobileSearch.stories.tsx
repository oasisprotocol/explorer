import { Meta, StoryFn, StoryObj } from '@storybook/react'
import { withRouter } from 'storybook-addon-react-router-v6'
import { COLORS } from '../styles/theme/colors'
import { AppendMobileSearch } from '../app/components/AppendMobileSearch'
import Typography from '@mui/material/Typography'
import Grid from '@mui/material/Grid'
import Box from '@mui/material/Box'

export default {
  title: 'Example/AppendMobileSearch',
  component: AppendMobileSearch,
  decorators: [withRouter],
} satisfies Meta<typeof AppendMobileSearch>

const Template: StoryFn<typeof AppendMobileSearch> = args => (
  <Box sx={{ px: 0 }}>
    <Grid container sx={{ background: COLORS.brandDark, py: 4 }}>
      <Grid item xs={12} sx={{ px: 4 }}>
        <AppendMobileSearch {...args} />
      </Grid>
    </Grid>
  </Box>
)

type Story = StoryObj<typeof AppendMobileSearch>

export const Default: Story = {
  render: Template,
  args: {
    children: <Typography sx={{ color: COLORS.white }}>Header</Typography>,
  },
  parameters: {
    layout: 'fullscreen',
    viewport: {
      defaultViewport: 'iphone6',
    },
  },
}
