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
import { TextSkeleton } from '../../components/Skeleton'
import { trimLongString } from '../../utils/trimLongString'
import { type RuntimeAccount } from '../../../oasis-indexer/api'
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
  account?: RuntimeAccount
  isLoading: boolean
  roseFiatValue?: number
}

export const Account: FC<AccountProps> = ({ account, isLoading, roseFiatValue }) => {
  const { t } = useTranslation()
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'))
  const balance = account?.balances[0]?.balance ?? '0'

  return (
    <>
      {isLoading && <TextSkeleton numberOfRows={8} />}
      {account && (
        <StyledDescriptionList titleWidth={isMobile ? '100px' : '200px'}>
          <dt>
            <JazzIcon diameter={isMobile ? 30 : 40} seed={addressToNumber(account.address)} />
          </dt>
          <dd>
            <CopyToClipboard
              label={
                <Typography variant="mono" component="span" sx={{ color: COLORS.brandDark, fontWeight: 700 }}>
                  {isMobile ? trimLongString(account.address) : account.address}
                </Typography>
              }
              value={account.address}
            />
          </dd>

          <dt>{t('account.chain')}</dt>
          <dd>{t('common.emerald')}</dd>

          <dt>{t('common.balance')}</dt>
          <dd>{t('common.valueInRose', { value: balance })}</dd>
          {roseFiatValue && balance && (
            <>
              <dt>{t('common.fiatValue')}</dt>
              <dd>
                <StyledBox>
                  {t('common.fiatValueInUSD', {
                    value: parseFloat(balance) * roseFiatValue,
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

          <dt>{t('common.transactions')}</dt>
          <dd>{/* TODO: waiting for API update */}</dd>

          <dt>{t('account.evmTokens')}</dt>
          <dd>
            <TokenPills tokens={account.evm_balances} />
          </dd>

          <dt>{t('account.totalReceived')}</dt>
          <dd>{/* TODO: waiting for API update */}</dd>

          <dt>{t('account.totalSent')}</dt>
          <dd>{/* TODO: waiting for API update */}</dd>
        </StyledDescriptionList>
      )}
    </>
  )
}
