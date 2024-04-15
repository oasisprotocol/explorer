import { Meta, StoryFn, StoryObj } from '@storybook/react'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import { ConsensusTransactionMethod } from '../app/components/ConsensusTransactionMethod'
import { RuntimeTransactionMethod } from '../app/components/RuntimeTransactionMethod'
import { TokenTransferIcon } from '../app/components/Tokens/TokenTransferIcon'
import { EventTypeIcon } from '../app/components/RuntimeEvents/RuntimeEventDetails'
import { ConsensusTxMethod, RuntimeEventType } from '../oasis-nexus/api'
import { COLORS } from '../styles/theme/colors'

export default {
  title: 'Example/Icons',
} satisfies Meta<any>

const Template: StoryFn = () => {
  return (
    <Box>
      {Object.values(ConsensusTxMethod).map(method => (
        <Box
          key={method}
          gap={4}
          sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingBottom: 4 }}
        >
          <ConsensusTransactionMethod method={method} />
          <Typography sx={{ color: COLORS.grayMedium, fontSize: '12px' }}>({method})</Typography>
        </Box>
      ))}
    </Box>
  )
}

export const ConsensusTransactionIcons: StoryObj = {
  render: Template,
  args: {},
}

const storyRuntimeMethods = [
  'accounts.Transfer',
  'consensus.Deposit',
  'consensus.Withdraw',
  'consensus.Delegate',
  'consensus.Undelegate',
  'evm.Create',
  'evm.Call',
]

const RuntimeTemplate: StoryFn = () => {
  return (
    <Box>
      {storyRuntimeMethods.map(method => (
        <Box
          key={method}
          gap={4}
          sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingBottom: 4 }}
        >
          <RuntimeTransactionMethod method={method} />
          <Typography sx={{ color: COLORS.grayMedium, fontSize: '12px' }}>({method})</Typography>
        </Box>
      ))}
    </Box>
  )
}

export const RuntimeTransactionIcons: StoryObj = {
  render: RuntimeTemplate,
  args: {},
}

const storyTokensMethods = ['Transfer', 'Approval', 'Minting', 'Burning']

const TokensTemplate: StoryFn = () => {
  return (
    <Box>
      {storyTokensMethods.map(name => (
        <Box
          key={name}
          gap={4}
          sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingBottom: 4 }}
        >
          <TokenTransferIcon name={name} />
          <Typography sx={{ color: COLORS.grayMedium, fontSize: '12px' }}>({name})</Typography>
        </Box>
      ))}
    </Box>
  )
}

export const TokenTransactionIcons: StoryObj = {
  render: TokensTemplate,
  args: {},
}

const EventsTemplate: StoryFn = () => {
  return (
    <Box>
      {Object.values(RuntimeEventType).map(method => (
        <Box
          key={method}
          gap={4}
          sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingBottom: 4 }}
        >
          <EventTypeIcon eventType={method} eventName="" />
          <Typography sx={{ color: COLORS.grayMedium, fontSize: '12px' }}>({method})</Typography>
        </Box>
      ))}
    </Box>
  )
}

export const EventIcons: StoryObj = {
  render: EventsTemplate,
  args: {},
}
