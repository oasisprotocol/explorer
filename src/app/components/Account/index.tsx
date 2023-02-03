import { FC } from 'react'
import { useTranslation } from 'react-i18next'
import { staking } from '@oasisprotocol/client'
import Box from '@mui/material/Box'
import useMediaQuery from '@mui/material/useMediaQuery'
import { useTheme } from '@mui/material/styles'
import { styled } from '@mui/material/styles'
import { StyledDescriptionList } from '../../components/StyledDescriptionList'
import { CopyToClipboard } from '../../components/CopyToClipboard'
import { JazzIcon } from '../../components/JazzIcon'
import { CoinGeckoReferral } from '../../components/CoinGeckoReferral'
import { trimLongString } from '../../utils/trimLongString'
import { FullConsensusAccount } from '../../../oasis-indexer/api'
import { TokenPills } from './TokenPills'

export const addressToNumber = (address: string) => {
  // https://github.com/oasisprotocol/oasis-wallet-ext/blob/da7ad67/src/popup/component/AccountIcon/index.js#L26
  const addressU8 = staking.addressFromBech32(address)
  const seed = addressU8[20] | (addressU8[19] << 8) | (addressU8[18] << 16) | (addressU8[17] << 24)

  return seed
}

const StyledBox = styled(Box)(() => ({
  display: 'flex',
  justifyContent: 'space-between',
  flex: 1,
}))

type AccountProps = {
  // TODO: switch to Emerald when endpoint is ready
  account: FullConsensusAccount
  roseFiatValue?: number
}

export const Account: FC<AccountProps> = ({ account, roseFiatValue }) => {
  const { t } = useTranslation()
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'))
  const mockedRuntimeBalance = 1000 // TODO: replace with real value when API is ready

  return (
    <StyledDescriptionList titleWidth={isMobile ? '100px' : '200px'}>
      <dt>
        <JazzIcon diameter={isMobile ? 30 : 40} seed={addressToNumber(account.address)} />
      </dt>
      <dd>
        <CopyToClipboard
          label={isMobile ? trimLongString(account.address) : account.address}
          value={account.address}
        />
      </dd>
      {roseFiatValue && (
        <>
          <dt>{t('common.fiatValue')}</dt>
          <dd>
            <StyledBox>
              {t('common.fiatValueInUSD', {
                value: mockedRuntimeBalance * roseFiatValue,
                formatParams: {
                  value: {
                    currency: 'USD',
                  },
                },
              })}
              <CoinGeckoReferral />
            </StyledBox>
          </dd>
        </>
      )}
      <dt>{t('account.tokens')}</dt>
      <dd>
        <TokenPills tokens={account.runtime_evm_balances} />
      </dd>
    </StyledDescriptionList>
  )
}
