import { FC } from 'react'
import { RuntimeScope } from '../../../types/searchScope'
import { useTranslation } from 'react-i18next'
import { TransactionLink } from '../Transactions/TransactionLink'
import {
  Runtime,
  useGetRuntimeAccountsAddress,
  useGetRuntimeTransactionsTxHash,
} from '../../../oasis-nexus/api'
import { AccountLink } from './AccountLink'
import { Skeleton } from '@oasisprotocol/ui-library/src/components/ui/skeleton'

const TxSender: FC<{ scope: RuntimeScope; txHash: string; alwaysTrim?: boolean }> = ({
  scope,
  txHash,
  alwaysTrim,
}) => {
  const { t } = useTranslation()
  const query = useGetRuntimeTransactionsTxHash(scope.network, scope.layer, txHash)
  const tx = query.data?.data.transactions[0]
  const senderAddress = tx?.signers[0].address_eth ?? tx?.signers[0].address

  return query.isLoading ? (
    <Skeleton className="w-1/4 h-4" />
  ) : senderAddress ? (
    <AccountLink scope={scope} address={senderAddress} alwaysTrim={alwaysTrim} />
  ) : (
    t('common.missing')
  )
}

export const ContractCreatorInfo: FC<{
  scope: RuntimeScope
  isLoading?: boolean
  creationTxHash: string | undefined
  alwaysTrim?: boolean
}> = ({ scope, isLoading, creationTxHash, alwaysTrim }) => {
  const { t } = useTranslation()

  return isLoading ? (
    <Skeleton className="w-1/4 h-4" />
  ) : creationTxHash === undefined ? (
    t('common.missing')
  ) : (
    <>
      <TxSender scope={scope} txHash={creationTxHash} alwaysTrim={alwaysTrim} />
      <div>&nbsp;{t('contract.createdAt')}&nbsp;</div>
      <TransactionLink scope={scope} hash={creationTxHash} alwaysTrim={alwaysTrim} />
    </>
  )
}

export const DelayedContractCreatorInfo: FC<{
  scope: RuntimeScope
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
