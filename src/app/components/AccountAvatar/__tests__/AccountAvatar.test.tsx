import { AccountAvatar } from '../index'
import { render } from '@testing-library/react'

describe('AccountAvatar', () => {
  test('oasis1qq3xrq0urs8qcffhvmhfhz4p0mu7ewc8rscnlwxe', () => {
    expect(
      render(
        <AccountAvatar
          account={{
            address: 'oasis1qq3xrq0urs8qcffhvmhfhz4p0mu7ewc8rscnlwxe',
          }}
        />,
      ).container,
    ).toMatchSnapshot()
  })

  test('oasis1qz0k5q8vjqvu4s4nwxyj406ylnflkc4vrcjghuwk', () => {
    expect(
      render(
        <AccountAvatar
          account={{
            address: 'oasis1qz0k5q8vjqvu4s4nwxyj406ylnflkc4vrcjghuwk',
          }}
        />,
      ).container,
    ).toMatchSnapshot()
  })

  test('0xdAC17F958D2ee523a2206206994597C13D831ec7', () => {
    expect(
      render(
        <AccountAvatar
          account={{
            address_eth: '0xdAC17F958D2ee523a2206206994597C13D831ec7',
            address: 'oasis1qqyehmqgp04swwv2vtz7lhy937r6m4wtmuxk9rtk',
          }}
        />,
      ).container,
    ).toMatchSnapshot()
  })

  test('0x8Bc2B030b299964eEfb5e1e0b36991352E56D2D3', () => {
    expect(
      render(
        <AccountAvatar
          account={{
            address_eth: '0x8Bc2B030b299964eEfb5e1e0b36991352E56D2D3',
            address: 'oasis1qpdgv5nv2dhxp4q897cgag6kgnm9qs0dccwnckuu',
          }}
        />,
      ).container,
    ).toMatchSnapshot()
  })
})
