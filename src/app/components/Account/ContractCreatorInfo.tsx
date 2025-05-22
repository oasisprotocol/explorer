import { FC } from 'react'
import { SearchScope } from '../../../types/searchScope'
import { useTranslation } from 'react-i18next'
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

const TxSender: FC<{ scope: SearchScope; txHash: string; alwaysTrim?: boolean }> = ({
  scope,
  txHash,
  alwaysTrim,
}) => {
  const { t } = useTranslation()
  if (scope.layer === Layer.consensus) {
    throw AppErrors.UnsupportedLayer
  }
  const query = useGetRuntimeTransactionsTxHash(scope.network, scope.layer, txHash)
  const tx = query.data?.data.transactions[0]
  const senderAddress = tx?.signers[0].address_eth ?? tx?.signers[0].address

  return query.isLoading ? (
    <Skeleton
      variant="text"
      sx={{
        width: '25%',
      }}
    />
  ) : senderAddress ? (
    <AccountLink scope={scope} address={senderAddress} alwaysTrim={alwaysTrim} />
  ) : (
    t('common.missing')
  )
}

export const ContractCreatorInfo: FC<{
  scope: SearchScope
  isLoading?: boolean
  creationTxHash: string | undefined
  alwaysTrim?: boolean
}> = ({ scope, isLoading, creationTxHash, alwaysTrim }) => {
  const { t } = useTranslation()

  return isLoading ? (
    <Skeleton variant="text" sx={{ width: '50%' }} />
  ) : creationTxHash === undefined ? (
    t('common.missing')
  ) : (
    <>
      <TxSender scope={scope} txHash={creationTxHash} alwaysTrim={alwaysTrim} />
      <Box>&nbsp;{t('contract.createdAt')}&nbsp;</Box>
      <TransactionLink scope={scope} hash={creationTxHash} alwaysTrim={alwaysTrim} />
    </>
  )
}

export const DelayedContractCreatorInfo: FC<{
  scope: SearchScope
  contractOasisAddress: string | undefined
  alwaysTrim?: boolean
}> = ({ scope, contractOasisAddress, alwaysTrim }) => {
  const accountQuery = useGetRuntimeAccountsAddress(
    scope.network,
    scope.layer as Runtime,
    contractOasisAddress!,
  )

  const account = accountQuery.data?.data
  const contract = account?.evm_contract

  const creationTxHash = contract?.eth_creation_tx || contract?.creation_tx

  return (
    <ContractCreatorInfo
      scope={scope}
      isLoading={accountQuery.isLoading}
      creationTxHash={creationTxHash}
      alwaysTrim={alwaysTrim}
    />
  )
}
