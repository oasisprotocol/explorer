import { Meta, StoryFn, StoryObj } from '@storybook/react'
import Box from '@mui/material/Box'
import { StatusBadge } from '../app/components/common/StatusBadge'
import { RoflAppStatusBadge } from '../app/components/Rofl/RoflAppStatusBadge'
import { ValidatorStatusBadge } from '../app/pages/ValidatorDetailsPage/ValidatorStatusBadge'
import { ContractStatus } from 'app/components/ContractVerificationIcon'

export default {
  title: 'Example/Badges',
} satisfies Meta<any>

const DefaultBadges: StoryFn = () => {
  return (
    <Box>
      <StatusBadge label="Label" variant="success" />
      <StatusBadge label="Label" variant="info" />
      <StatusBadge label="Label" variant="warning" />
      <StatusBadge label="Label" variant="danger" />
    </Box>
  )
}

export const Default: StoryObj = {
  render: DefaultBadges,
  args: {},
}

const RoflAppStatusStory: StoryFn = () => {
  return (
    <Box>
      <RoflAppStatusBadge status="active" />
      <RoflAppStatusBadge status="inactive" />
      <RoflAppStatusBadge status="removed" />
    </Box>
  )
}

export const RoflAppStatuses: StoryObj = {
  render: RoflAppStatusStory,
  args: {},
}

const ValidatorStatusStory: StoryFn = () => {
  return (
    <Box>
      <ValidatorStatusBadge active={true} inValidatorSet={true} />
      <ValidatorStatusBadge active={true} inValidatorSet={false} />
      <ValidatorStatusBadge active={false} inValidatorSet={false} />
    </Box>
  )
}

export const ValidatorStatuses: StoryObj = {
  render: ValidatorStatusStory,
  args: {},
}

const ContractStatusStory: StoryFn = () => {
  return (
    <Box>
      <ContractStatus verified={true} />
      <ContractStatus verified={false} />
    </Box>
  )
}

export const ContractStatuses: StoryObj = {
  render: ContractStatusStory,
  args: {},
}
