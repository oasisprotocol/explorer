import { Meta, StoryFn, StoryObj } from '@storybook/react'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import { ConsensusTransactionMethod } from '../app/components/ConsensusTransactionMethod'
import { ConsensusTxMethod } from '../oasis-nexus/api'
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
