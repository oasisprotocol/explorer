import React from 'react'
import { ComponentStory, ComponentMeta } from '@storybook/react'
import Button from '@mui/material/Button'
import { ButtonTypeMap } from '@mui/material/Button/Button'

export default {
  title: 'Example/Buttons',
  component: Button,
} satisfies ComponentMeta<typeof Button>

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
    options: ['small', 'medium', 'large'] satisfies ButtonTypeMap['props']['size'][],
  },
}

export const Secondary = Template.bind({})
Secondary.args = {
  children: 'Secondary',
  color: 'secondary',
  size: 'small',
}
Secondary.argTypes = {
  size: {
    control: 'select',
    options: ['small', 'medium', 'large'] satisfies ButtonTypeMap['props']['size'][],
  },
}

export const Tertiary = Template.bind({})
Tertiary.args = {
  children: 'Tertiary',
  color: 'tertiary',
  size: 'small',
}
Tertiary.argTypes = {
  size: {
    control: 'select',
    options: ['small', 'medium', 'large'] satisfies ButtonTypeMap['props']['size'][],
  },
}
