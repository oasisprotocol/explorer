import { ComponentMeta, ComponentStory } from '@storybook/react'
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
} satisfies ComponentMeta<typeof AppendMobileSearch>

const Template: ComponentStory<typeof AppendMobileSearch> = args => (
  <Box sx={{ px: 0 }}>
    <Grid container sx={{ background: COLORS.brandDark, py: 4 }}>
      <Grid item xs={12} sx={{ px: 4 }}>
        <AppendMobileSearch {...args} />
      </Grid>
    </Grid>
  </Box>
)

export const Default = Template.bind({})
Default.args = {
  children: <Typography sx={{ color: COLORS.white }}>Header</Typography>,
}
Default.parameters = {
  layout: 'fullscreen',
  viewport: {
    defaultViewport: 'iphone6',
  },
}
