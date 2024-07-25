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
    amount: '100',
    to: 'oasis1qp0xuvw2a93w4yp8jwthfz93gxy87u7hes9eu2ev',
    network: Network.mainnet,
    layer: Layer.consensus,
    ticker: Ticker.ROSE,
    block: 19851448,
    body: {
      account: 'oasis1qp0xuvw2a93w4yp8jwthfz93gxy87u7hes9eu2ev',
      amount: '100',
    },
    fee: '0',
    gas_limit: '0',
    hash: 'd46e9223c45bd52d885673dd574f008b5e377ad879adb08f52af53c292151984',
    index: 26,
    method: ConsensusTxMethod.stakingAddEscrow,
    nonce: 275,
    sender: 'oasis1qz0k5q8vjqvu4s4nwxyj406ylnflkc4vrcjghuwk',
    success: true,
    timestamp: '2024-06-25T06:52:19Z',
  },
  {
    amount: '10',
    to: 'oasis1qrd3mnzhhgst26hsp96uf45yhq6zlax0cuzdgcfc',
    network: Network.mainnet,
    layer: Layer.consensus,
    ticker: Ticker.ROSE,
    block: 18818862,
    body: {
      amount_change: '10',
      beneficiary: 'oasis1qrd3mnzhhgst26hsp96uf45yhq6zlax0cuzdgcfc',
    },
    fee: '0',
    gas_limit: '0',
    hash: '2c849b3b9aaf63d73c35502af5b3bbf5881439288ebe3153966c6b78891d1978',
    index: 26,
    method: ConsensusTxMethod.stakingAllow,
    nonce: 266,
    sender: 'oasis1qz0k5q8vjqvu4s4nwxyj406ylnflkc4vrcjghuwk',
    success: true,
    timestamp: '2024-04-15T07:09:52Z',
  },
  {
    amount: undefined,
    to: 'oasis1qq0xmq7r0z9sdv02t5j9zs7en3n6574gtg8v9fyt',
    network: Network.mainnet,
    layer: Layer.consensus,
    ticker: Ticker.ROSE,
    block: 19851464,
    body: {
      account: 'oasis1qq0xmq7r0z9sdv02t5j9zs7en3n6574gtg8v9fyt',
      shares: '30027579719',
    },
    fee: '0',
    gas_limit: '0',
    hash: 'e8ca2ea8f664d668603178687bc335c6ebb79dce716ce4e54f33d14a57f9fa5e',
    index: 25,
    method: ConsensusTxMethod.stakingReclaimEscrow,
    nonce: 277,
    sender: 'oasis1qz0k5q8vjqvu4s4nwxyj406ylnflkc4vrcjghuwk',
    success: true,
    timestamp: '2024-06-25T06:53:53Z',
  },
  {
    amount: '100',
    to: 'oasis1qzca4c3gch3ymy3w7e5ffzf9l6alpazpf5ffyytn',
    network: Network.mainnet,
    layer: Layer.consensus,
    ticker: Ticker.ROSE,
    block: 19969302,
    body: {
      amount: '100',
      to: 'oasis1qzca4c3gch3ymy3w7e5ffzf9l6alpazpf5ffyytn',
    },
    fee: '0',
    gas_limit: '0',
    hash: 'a06aa6c1535727a1f578638b3754e8feff34293f26449b76cf80d94f216d22ff',
    index: 25,
    method: ConsensusTxMethod.stakingTransfer,
    nonce: 322926,
    sender: 'oasis1qzyw98s2qrvf3t78nf0guu98laykw6lzkga5zlzy',
    success: true,
    timestamp: '2024-07-03T09:23:32Z',
  },
  {
    amount: undefined,
    to: undefined,
    network: Network.mainnet,
    layer: Layer.consensus,
    ticker: Ticker.ROSE,
    block: 19969802,
    body: {
      commits: [
        {
          header: {
            header: {
              in_msgs_hash: 'c672b8d1ef56ed28ab87c3622c5114069bdd3ad7b8f9737498d0c01ecef0967a',
              io_root: '6a134a3102e3ea9f4871ece1c5824ce06f4dc06571e0e5dd04e7e282a6348991',
              messages_hash: 'c672b8d1ef56ed28ab87c3622c5114069bdd3ad7b8f9737498d0c01ecef0967a',
              previous_hash: 'ebb7743594d53594f95585de30b563042724f3d48ac9c7c37b292c299d7b8ddd',
              round: 4419548,
              state_root: '77824195a9191c802cd83af14a2bdbb974eb16919e5a333cf03f81dc1dc1d688',
            },
            rak_sig:
              'OyaCvwnekOqKv+3ymvXJzoQulhb7KVun6g8F2kWabeUXShPxGnFt9JR8J7JEV7Fgs7vlAdjkduSDN2n2GZdJDw==',
            scheduler_id: 'drsZxbpqG5h+4tq/JKWqmoVGXmQUirVCjD8GLBuNj9M=',
          },
          node_id: 'UCKrtVNlmCaCdKpMMDT8AQxqVs/JP1/zQUH4yxUY4mM=',
          sig: 'DGs5KVnCg2EqArJ4yqFufta0ujGiSFzVQlpi0E8LgOIGztiSpnhhk6ktwB7s/Xe5dYSugPeKpCAxwgtgKpoLBw==',
        },
      ],
      id: '000000000000000000000000000000000000000000000000f80306c9858e7279',
    },
    fee: '0',
    gas_limit: '0',
    hash: '11c58dc52abba9cf838b87bf9aa691dac5aef96c84428aa608a67a2b3a206f46',
    index: 0,
    method: ConsensusTxMethod.roothashExecutorCommit,
    nonce: 942923,
    sender: 'oasis1qrxvr94pgj6kt36fkwn4al3uttj2veh5ey8jvapv',
    success: true,
    timestamp: '2024-07-03T10:12:47Z',
  },
  {
    amount: undefined,
    to: undefined,
    network: Network.mainnet,
    layer: Layer.consensus,
    hash: '11c58dc52abba9cf838b87bf9aa691dac5aef96c84428aa608a67a2b3a206f46',
    ticker: Ticker.ROSE,
    sender: 'oasis1qzyw98s2qrvf3t78nf0guu98laykw6lzkga5zlzy',
    success: true,
    timestamp: '2024-07-03T09:23:32Z',
  } as Transaction,
]
