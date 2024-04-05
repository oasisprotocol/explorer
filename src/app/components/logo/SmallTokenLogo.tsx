import { FC } from 'react'
import { Ticker } from '../../../types/ticker'
import { SmallOasisLogo } from './SmallOasisLogo'
import euroELogo from '../../../../public/euroe.png'

export const SmallTokenLogo: FC<{ ticker: Ticker }> = ({ ticker }) => {
  switch (ticker) {
    case Ticker.ROSE:
      return <SmallOasisLogo />
    case Ticker.EUROe:
      return <img src={euroELogo} width={25} alt={ticker} />
    default:
      return null
  }
}
