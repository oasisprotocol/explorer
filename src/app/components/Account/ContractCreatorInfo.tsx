import { FC } from 'react'
import { SearchScope } from '../../../types/searchScope'
import { Trans, useTranslation } from 'react-i18next'
import { TransactionLink } from '../Transactions/TransactionLink'
import {
  Layer,
  Runtime,
  useGetRuntimeAccountsAddress,
  useGetRuntimeTransactionsTxHash,
} from '../../../oasis-nexus/api'
import { AppErrors } from '../../../types/errors'
import { AccountLink } from './AccountLink'
import Box from '@mui/material/Box'
import Skeleton from '@mui/material/Skeleton'

const TxSender: FC<{ scope: SearchScope; txHash: string }> = ({ scope, txHash }) => {
  const { t } = useTranslation()
  if (scope.layer === Layer.consensus) {
    throw AppErrors.UnsupportedLayer
  }
  const query = useGetRuntimeTransactionsTxHash(scope.network, scope.layer, txHash)
  const tx = query.data?.data.transactions[0]
  const senderAddress = tx?.sender_0_eth || tx?.sender_0

  return query.isLoading ? (
    <Skeleton
      variant="text"
      sx={{
        width: '25%',
      }}
    />
  ) : senderAddress ? (
    <AccountLink scope={scope} address={senderAddress} alwaysTrim />
  ) : (
    t('common.missing')
  )
}

export const ContractCreatorInfo: FC<{
  scope: SearchScope
  isLoading?: boolean
  creationTxHash: string | undefined
}> = ({ scope, isLoading, creationTxHash }) => {
  const { t } = useTranslation()

  return isLoading ? (
    <Skeleton variant="text" sx={{ width: '50%' }} />
  ) : creationTxHash === undefined ? (
    t('common.missing')
  ) : (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        gap: 3,
        minWidth: '25%',
      }}
    >
      <TxSender scope={scope} txHash={creationTxHash} />
      &nbsp;
      <Trans
        t={t}
        i18nKey={'contract.createdAt'}
        components={{
          TransactionLink: <TransactionLink scope={scope} hash={creationTxHash} alwaysTrim />,
        }}
      />
    </Box>
  )
}

export const DelayedContractCreatorInfo: FC<{
  scope: SearchScope
  contractAddress: string | undefined
}> = ({ scope, contractAddress }) => {
  const accountQuery = useGetRuntimeAccountsAddress(scope.network, scope.layer as Runtime, contractAddress!)

  const account = accountQuery.data?.data
  const contract = account?.evm_contract

  const creationTxHash = contract?.eth_creation_tx || contract?.creation_tx

  return (
    <ContractCreatorInfo scope={scope} isLoading={accountQuery.isLoading} creationTxHash={creationTxHash} />
  )
}
