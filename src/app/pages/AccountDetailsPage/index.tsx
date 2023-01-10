import { FC } from 'react'
import { useTranslation } from 'react-i18next'
import { useParams } from 'react-router-dom'
import { staking } from '@oasisprotocol/client'
import Card from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader'
import CardContent from '@mui/material/CardContent'
import Skeleton from '@mui/material/Skeleton'
import useMediaQuery from '@mui/material/useMediaQuery'
import { useTheme } from '@mui/material/styles'
import { PageLayout } from '../../components/PageLayout'
import { SubPageCard } from '../../components/SubPageCard'
import { Transactions } from '../../components/Transactions'
import { StyledDescriptionList } from '../../components/StyledDescriptionList'
import { CopyToClipboard } from '../../components/CopyToClipboard'
import { JazzIcon } from '../../components/JazzIcon'
import { useGetConsensusAccountsAddress } from '../../../oasis-indexer/api'
import { useGetEmeraldTransactions } from '../../../oasis-indexer/api'
import { NUMBER_OF_ITEMS_ON_SEPARATE_PAGE } from '../../config'

export const addressToNumber = (address: string) => {
  // https://github.com/oasisprotocol/oasis-wallet-ext/blob/da7ad67/src/popup/component/AccountIcon/index.js#L26
  const addressU8 = staking.addressFromBech32(address)
  const seed = addressU8[20] | (addressU8[19] << 8) | (addressU8[18] << 16) | (addressU8[17] << 24)

  return seed
}
export const AccountDetailsPage: FC = () => {
  const { t } = useTranslation()
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'))
  const { address } = useParams()
  // switch to Emerald when API is ready
  const accountQuery = useGetConsensusAccountsAddress(address!)
  const account = accountQuery.data?.data
  const transactionsQuery = useGetEmeraldTransactions({
    limit: NUMBER_OF_ITEMS_ON_SEPARATE_PAGE,
    // filtering is not implemented in API yet
    // @ts-expect-error
    rel: address,
  })

  return (
    <PageLayout>
      <SubPageCard title={t('account.title')}>
        {accountQuery.isLoading && <Skeleton variant="text" height={30} sx={{ my: 4 }} />}
        {account && (
          <CardContent>
            <StyledDescriptionList>
              <dt>
                <JazzIcon diameter={isMobile ? 30 : 40} seed={addressToNumber(account.address!)} />
              </dt>
              <dd>
                <CopyToClipboard value={account.address!} />
              </dd>
            </StyledDescriptionList>
          </CardContent>
        )}
      </SubPageCard>
      <Card>
        <CardHeader disableTypography component="h3" title={t('account.transactionsListTitle')} />
        <CardContent>
          <Transactions
            transactions={transactionsQuery.data?.data.transactions}
            isLoading={transactionsQuery.isLoading}
            limit={NUMBER_OF_ITEMS_ON_SEPARATE_PAGE}
            pagination={true}
          />
        </CardContent>
      </Card>
    </PageLayout>
  )
}
