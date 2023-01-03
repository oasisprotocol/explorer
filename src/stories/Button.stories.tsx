import React from 'react'
import { ComponentStory, ComponentMeta } from '@storybook/react'
import Button from '@mui/material/Button'
import { ButtonTypeMap } from '@mui/material/Button/Button'

export default {
  title: 'Example/Button',
  component: Button,
} as ComponentMeta<typeof Button>

const Template: ComponentStory<typeof Button> = args => <Button {...args} />

export const Primary = Template.bind({})
Primary.args = {
  children: 'Primary',
  color: 'primary',
  size: 'small',
}
Primary.argTypes = {
  size: {
    control: 'select',
    options: ['small', 'medium', 'large'] as unknown as ButtonTypeMap['props']['size'],
  },
}

export const Secondary = Template.bind({})
Secondary.args = {
  children: 'Secondary',
  color: 'primary',
  size: 'small',
}
Primary.argTypes = {
  size: {
    control: 'select',
    options: ['small', 'medium', 'large'] as unknown as ButtonTypeMap['props']['size'],
  },
}

export const Tertiary = Template.bind({})
Tertiary.args = {
  children: 'Tertiary',
  color: 'primary',
  size: 'small',
}
Primary.argTypes = {
  size: {
    control: 'select',
    options: ['small', 'medium', 'large'] as unknown as ButtonTypeMap['props']['size'],
  },
}
