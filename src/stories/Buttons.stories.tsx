import { Meta, StoryObj } from '@storybook/react'
import Button from '@mui/material/Button'
import { ButtonTypeMap } from '@mui/material/Button/Button'

export default {
  title: 'Example/Buttons',
  component: Button,
  argTypes: {
    color: {
      control: 'select',
      options: ['primary', 'secondary', 'tertiary'] satisfies ButtonTypeMap['props']['color'][],
    },
    size: {
      control: 'select',
      options: ['small', 'medium', 'large'] satisfies ButtonTypeMap['props']['size'][],
    },
  },
} satisfies Meta<typeof Button>

type Story = StoryObj<typeof Button>

export const Primary: Story = {
  args: {
    children: 'Primary',
    color: 'primary',
    size: 'small',
  },
}

export const Secondary: Story = {
  args: {
    children: 'Secondary',
    color: 'secondary',
    size: 'small',
  },
}

export const Tertiary: Story = {
  args: {
    children: 'Tertiary',
    color: 'tertiary',
    size: 'small',
  },
}
