export interface Event {
  Denomination: string
  Amount: number
  round: number
  body: any
  eth_tx_hash: any
  evm_log_name: string
}

export type Results = {
  events: Event[]
}

// https://nexus.oasis.io/v1/sapphire/events?limit=100&offset=0
const example1: Event = {
  body: {
    amount: {
      Amount: '100000000000000000',
      Denomination: '',
    },
    owner: 'oasis1qquzek9y9guk6plys32s7zvf4g2f8rvn9slu8uye',
  },
  evm_log_name: null,
  round: 2579739,
  timestamp: '2024-02-23T13:52:58Z',
  tx_hash: null,
  type: 'accounts.mint',
}

export {}
