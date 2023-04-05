import { Meta, StoryFn, StoryObj } from '@storybook/react'
import Typography from '@mui/material/Typography'
import Box from '@mui/material/Box'
import { COLORS } from '../styles/theme/colors'

export default {
  title: 'Example/Typography',
  component: Typography,
} satisfies Meta<typeof Typography>

const Template: StoryFn<typeof Typography> = args => (
  <Box sx={{ backgroundColor: COLORS.white, display: 'inline-flex', p: 2, borderRadius: 1 }}>
    <Typography {...args} />
  </Box>
)

const DarkTemplate: StoryFn<typeof Typography> = args => (
  <Box sx={{ backgroundColor: COLORS.brandExtraDark, display: 'inline-flex', p: 2, borderRadius: 1 }}>
    <Typography {...args} />
  </Box>
)

type Story = StoryObj<typeof Typography>

export const Heading1: Story = {
  render: Template,
  args: {
    children: 'Heading 1',
    variant: 'h1',
  },
}

export const Heading2: Story = {
  render: Template,
  args: {
    children: 'Heading 2',
    variant: 'h2',
  },
}

export const Heading3: Story = {
  render: Template,
  args: {
    children: 'Heading 3',
    variant: 'h3',
  },
}

export const Heading4: Story = {
  render: Template,
  args: {
    children: 'Heading 4',
    variant: 'h4',
  },
}

export const Heading5: Story = {
  render: Template,
  args: {
    children: 'Heading 5',
    variant: 'h5',
  },
}

export const Heading6: Story = {
  render: Template,
  args: {
    children: 'Heading 6',
    variant: 'h6',
  },
}

export const Footer: Story = {
  render: DarkTemplate,
  args: {
    children: 'Footer text',
    variant: 'footer',
  },
}

export const Select: Story = {
  render: DarkTemplate,
  args: {
    children: 'Select text',
    variant: 'select',
  },
}
