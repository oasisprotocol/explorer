import { ComponentProps } from 'react'
import { Meta } from '@storybook/react'
import Typography from '@mui/material/Typography'
import { COLORS } from '../styles/theme/colors'
import Box from '@mui/material/Box'
import { StoryFn } from '@storybook/react'

type TypographyStory = ComponentProps<typeof Typography> & {
  darkMode: boolean
}

export default {
  title: 'Example/Typography',
  component: Typography,
} satisfies Meta<typeof Typography>

const Template: StoryFn<TypographyStory> = args => {
  const { darkMode, ...props } = args
  const backgroundColor = darkMode ? COLORS.brandExtraDark : COLORS.white

  return (
    <Box sx={{ backgroundColor, display: 'inline-flex', p: 2, borderRadius: 1 }}>
      <Typography {...props} />
    </Box>
  )
}

export const Heading1 = {
  render: Template,
  args: {
    children: 'Heading 1',
    variant: 'h1',
  },
}

export const Heading2 = {
  render: Template,
  args: {
    children: 'Heading 2',
    variant: 'h2',
  },
}

export const Heading3 = {
  render: Template,
  args: {
    children: 'Heading 3',
    variant: 'h3',
  },
}

export const Heading4 = {
  render: Template,
  args: {
    children: 'Heading 4',
    variant: 'h4',
  },
}

export const Heading5 = {
  render: Template,
  args: {
    children: 'Heading 5',
    variant: 'h5',
  },
}

export const Heading6 = {
  render: Template,
  args: {
    children: 'Heading 6',
    variant: 'h6',
  },
}

export const Footer = {
  render: Template,
  args: {
    children: 'Footer text',
    variant: 'footer',
    darkMode: true,
  },
}

export const Select = {
  render: Template,
  args: {
    children: 'Select text',
    variant: 'select',
    darkMode: true,
  },
}
