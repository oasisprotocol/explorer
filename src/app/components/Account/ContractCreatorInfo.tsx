import { FC } from 'react'
import { SearchScope } from '../../../types/searchScope'
import { Trans, useTranslation } from 'react-i18next'
import { TransactionLink } from '../Transactions/TransactionLink'
import { Layer, useGetRuntimeTransactionsTxHash } from '../../../oasis-nexus/api'
import { AppErrors } from '../../../types/errors'
import { AccountLink } from './AccountLink'
import Box from '@mui/material/Box'

const TxSender: FC<{ scope: SearchScope; txHash: string }> = ({ scope, txHash }) => {
  const { t } = useTranslation()
  if (scope.layer === Layer.consensus) {
    throw AppErrors.UnsupportedLayer
  }
  const query = useGetRuntimeTransactionsTxHash(scope.network, scope.layer, txHash)
  const tx = query.data?.data.transactions[0]
  const senderAddress = tx?.sender_0_eth || tx?.sender_0
  return senderAddress ? (
    <AccountLink scope={scope} address={senderAddress} alwaysTrim />
  ) : (
    t('common.missing')
  )
}

export const ContractCreatorInfo: FC<{ scope: SearchScope; address: string | undefined }> = ({
  scope,
  address,
}) => {
  const { t } = useTranslation()
  return address === undefined ? (
    t('common.missing')
  ) : (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        gap: 3,
      }}
    >
      <TxSender scope={scope} txHash={address} />
      &nbsp;
      <Trans
        t={t}
        i18nKey={'contract.createdAt'}
        components={{
          TransactionLink: <TransactionLink scope={scope} hash={address} alwaysTrim />,
        }}
      />
    </Box>
  )
}
