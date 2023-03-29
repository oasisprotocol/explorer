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
import { TextSkeleton } from '../../components/Skeleton'
import { type RuntimeAccount } from '../../../oasis-indexer/api'
import { TokenPills } from './TokenPills'
import { AccountLink } from './AccountLink'

export const StyledAvatarContainer = styled('dt')(({ theme }) => ({
  '&&': {
    [theme.breakpoints.down('sm')]: {
      padding: `${theme.spacing(2)} 0`,
    },
    [theme.breakpoints.up('sm')]: {
      padding: `${theme.spacing(3)} 0`,
    },
  },
}))

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
  showLayer?: boolean
}

export const Account: FC<AccountProps> = ({ account, isLoading, roseFiatValue, showLayer }) => {
  const { t } = useTranslation()
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'))
  const balance = account?.balances[0]?.balance ?? '0'
  const address = account ? account.address_eth ?? account.address : undefined

  return (
    <>
      {isLoading && <TextSkeleton numberOfRows={8} />}
      {account && (
        <StyledDescriptionList titleWidth={isMobile ? '100px' : '200px'}>
          {showLayer && (
            <>
              <dt>{t('common.paratime')}</dt>
              <dd>{t(`common.${account.layer}`)}</dd>
            </>
          )}
          <StyledAvatarContainer>
            <JazzIcon diameter={isMobile ? 30 : 40} seed={addressToNumber(account.address)} />
          </StyledAvatarContainer>
          <dd>
            <AccountLink address={address!} layer={account.layer} />
            <CopyToClipboard value={address!} />
          </dd>

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
          <dd>{account.stats.num_txns}</dd>

          <dt>{t('account.evmTokens')}</dt>
          <dd>
            <TokenPills account={account} tokens={account.evm_balances} />
          </dd>

          <dt>{t('account.totalReceived')}</dt>
          <dd>{t('common.valueInRose', { value: account.stats.total_received })}</dd>

          <dt>{t('account.totalSent')}</dt>
          <dd>{t('common.valueInRose', { value: account.stats.total_sent })}</dd>
        </StyledDescriptionList>
      )}
    </>
  )
}
