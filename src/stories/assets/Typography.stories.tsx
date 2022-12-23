import React from 'react'
import { ComponentStory, ComponentMeta } from '@storybook/react'
import Typography from '@mui/material/Typography'

export default {
  title: 'Example/Typography',
  component: Typography,
} as ComponentMeta<typeof Typography>

const Template: ComponentStory<typeof Typography> = args => <Typography {...args} />

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
