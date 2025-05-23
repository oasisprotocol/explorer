import { FC } from 'react'
import { Ticker } from '../../../types/ticker'
import { SmallOasisLogo } from './SmallOasisLogo'

export const SmallTokenLogo: FC<{ ticker: Ticker }> = ({ ticker }) => {
  switch (ticker) {
    case Ticker.ROSE:
      return <SmallOasisLogo />
    case Ticker.EUROe:
      return <img src="https://assets.oasis.io/explorer-tokens/euroe.png" width={25} alt={ticker} />
    default:
      return null
  }
}
