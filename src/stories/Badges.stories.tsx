import { Meta, StoryFn, StoryObj } from '@storybook/react'
import Box from '@mui/material/Box'
import { StatusBadge } from '../app/components/common/StatusBadge'
import { AppStatus } from '../app/components/Rofl/AppStatus'
import { ValidatorStatusBadge } from '../app/pages/ValidatorDetailsPage/ValidatorStatusBadge'

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

export const StatusBadgesList: StoryObj = {
  render: DefaultBadges,
  args: {},
}

const RoflAppStatusStory: StoryFn = () => {
  return (
    <Box>
      <AppStatus status="active" />
      <AppStatus status="inactive" />
      <AppStatus status="removed" />
    </Box>
  )
}

export const RoflStatusesList: StoryObj = {
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

export const ValidatorStatusesList: StoryObj = {
  render: ValidatorStatusStory,
  args: {},
}
