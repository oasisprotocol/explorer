import { Meta, StoryFn, StoryObj } from '@storybook/react'
import { withRouter } from 'storybook-addon-react-router-v6'
import Box from '@mui/material/Box'
import { ConsensusTransactions } from '../app/components/Transactions'
import { ConsensusTxMethod, Layer, Transaction } from '../oasis-nexus/api'
import { Network } from '../types/network'
import { Ticker } from '../types/ticker'

export default {
  title: 'Example/Transactions',
  decorators: [withRouter],
} satisfies Meta<any>

const ConsensusListStory: StoryFn = () => {
  return (
    <Box>
      <ConsensusTransactions
        isLoading={false}
        limit={100}
        pagination={false}
        transactions={mockedTransactions}
      />
    </Box>
  )
}

export const ConsensusList: StoryObj = {
  render: ConsensusListStory,
  args: {},
}

const mockedTransactions = [
  {
    network: Network.mainnet,
    layer: Layer.consensus,
    ticker: Ticker.ROSE,
    block: 19851448,
    body: {
      account: 'oasis1qp0xuvw2a93w4yp8jwthfz93gxy87u7hes9eu2ev',
      amount: '100',
    },
    fee: '0',
    hash: 'd46e9223c45bd52d885673dd574f008b5e377ad879adb08f52af53c292151984',
    index: 26,
    method: ConsensusTxMethod.stakingAddEscrow,
    nonce: 275,
    sender: 'oasis1qz0k5q8vjqvu4s4nwxyj406ylnflkc4vrcjghuwk',
    success: true,
    timestamp: '2024-06-25T06:52:19Z',
  },
  {
    network: Network.mainnet,
    layer: Layer.consensus,
    ticker: Ticker.ROSE,
    block: 18818862,
    body: {
      amount_change: '10',
      beneficiary: 'oasis1qrd3mnzhhgst26hsp96uf45yhq6zlax0cuzdgcfc',
    },
    fee: '0',
    hash: '2c849b3b9aaf63d73c35502af5b3bbf5881439288ebe3153966c6b78891d1978',
    index: 26,
    method: ConsensusTxMethod.stakingAllow,
    nonce: 266,
    sender: 'oasis1qz0k5q8vjqvu4s4nwxyj406ylnflkc4vrcjghuwk',
    success: true,
    timestamp: '2024-04-15T07:09:52Z',
  },
  {
    network: Network.mainnet,
    layer: Layer.consensus,
    ticker: Ticker.ROSE,
    block: 19851464,
    body: {
      account: 'oasis1qq0xmq7r0z9sdv02t5j9zs7en3n6574gtg8v9fyt',
      shares: '30027579719',
    },
    fee: '0',
    hash: 'e8ca2ea8f664d668603178687bc335c6ebb79dce716ce4e54f33d14a57f9fa5e',
    index: 25,
    method: ConsensusTxMethod.stakingReclaimEscrow,
    nonce: 277,
    sender: 'oasis1qz0k5q8vjqvu4s4nwxyj406ylnflkc4vrcjghuwk',
    success: true,
    timestamp: '2024-06-25T06:53:53Z',
  },
  {
    network: Network.mainnet,
    layer: Layer.consensus,
    ticker: Ticker.ROSE,
    block: 19969302,
    body: {
      amount: '100',
      to: 'oasis1qzca4c3gch3ymy3w7e5ffzf9l6alpazpf5ffyytn',
    },
    fee: '0',
    hash: 'a06aa6c1535727a1f578638b3754e8feff34293f26449b76cf80d94f216d22ff',
    index: 25,
    method: ConsensusTxMethod.stakingTransfer,
    nonce: 322926,
    sender: 'oasis1qzyw98s2qrvf3t78nf0guu98laykw6lzkga5zlzy',
    success: true,
    timestamp: '2024-07-03T09:23:32Z',
  },
  {
    network: Network.mainnet,
    layer: Layer.consensus,
    ticker: Ticker.ROSE,
    sender: 'oasis1qzyw98s2qrvf3t78nf0guu98laykw6lzkga5zlzy',
    success: true,
    timestamp: '2024-07-03T09:23:32Z',
  } as Transaction,
]
