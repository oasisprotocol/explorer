import { FC } from 'react'
import { useTranslation } from 'react-i18next'
import { staking } from '@oasisprotocol/client'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import useMediaQuery from '@mui/material/useMediaQuery'
import { useTheme } from '@mui/material/styles'
import { styled } from '@mui/material/styles'
import { StyledDescriptionList } from '../../components/StyledDescriptionList'
import { CopyToClipboard } from '../../components/CopyToClipboard'
import { JazzIcon } from '../../components/JazzIcon'
import { CoinGeckoReferral } from '../../components/CoinGeckoReferral'
import { trimLongString } from '../../utils/trimLongString'
import { type Account as AccountDetailsProps } from '../../../oasis-indexer/api'
import { TokenPills } from './TokenPills'
import { COLORS } from '../../../styles/theme/colors'

export const addressToNumber = (address: string) => {
  // https://github.com/oasisprotocol/oasis-wallet-ext/blob/da7ad67/src/popup/component/AccountIcon/index.js#L26
  const addressU8 = staking.addressFromBech32(address)
  const seed = addressU8[20] | (addressU8[19] << 8) | (addressU8[18] << 16) | (addressU8[17] << 24)

  return seed
}

const StyledBox = styled(Box)(() => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  flex: 1,
}))

type AccountProps = {
  account: AccountDetailsProps
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
          label={
            <Typography component="span" sx={{ color: COLORS.brandDark, fontWeight: 700 }}>
              {isMobile ? trimLongString(account.address) : account.address}
            </Typography>
          }
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
                  } satisfies Intl.NumberFormatOptions,
                },
              })}
              <CoinGeckoReferral />
            </StyledBox>
          </dd>
        </>
      )}
      <dt>{t('account.evmTokens')}</dt>
      <dd>
        <TokenPills tokens={account.runtime_evm_balances} />
      </dd>
    </StyledDescriptionList>
  )
}
