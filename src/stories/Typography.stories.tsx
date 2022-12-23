import React, { ComponentProps } from 'react'
import { ComponentMeta } from '@storybook/react'
import Typography from '@mui/material/Typography'
import { COLORS } from '../styles/theme/colors'
import Box from '@mui/material/Box'
import { Story } from '@storybook/react'

type TypographyStory = ComponentProps<typeof Typography> & {
  darkMode: boolean
}

export default {
  title: 'Example/Typography',
  component: Typography,
} as ComponentMeta<typeof Typography>

const Template: Story<TypographyStory> = args => {
  const { darkMode } = args
  const backgroundColor = darkMode ? COLORS.brandExtraDark : COLORS.white

  return (
    <Box sx={{ backgroundColor, display: 'inline-flex', p: 2, borderRadius: 1 }}>
      <Typography {...args} />
    </Box>
  )
}

export const Heading1 = Template.bind({})
Heading1.args = {
  children: 'Heading 1',
  variant: 'h1',
}

export const Heading2 = Template.bind({})
Heading2.args = {
  children: 'Heading 2',
  variant: 'h2',
}

export const Heading3 = Template.bind({})
Heading3.args = {
  children: 'Heading 3',
  variant: 'h3',
}

export const Heading4 = Template.bind({})
Heading4.args = {
  children: 'Heading 4',
  variant: 'h4',
}

export const Heading5 = Template.bind({})
Heading5.args = {
  children: 'Heading 5',
  variant: 'h5',
}

export const Heading6 = Template.bind({})
Heading6.args = {
  children: 'Heading 6',
  variant: 'h6',
}

export const Footer = Template.bind({})
Footer.args = {
  children: 'Footer text',
  variant: 'footer',
  darkMode: true,
}

export const Select = Template.bind({})
Select.args = {
  children: 'Select text',
  variant: 'select',
  darkMode: true,
}
