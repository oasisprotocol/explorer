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

export const ContractCreatorInfo: FC<{
  scope: SearchScope
  creationTxHash: string | undefined
}> = ({ scope, creationTxHash }) => {
  const { t } = useTranslation()

  return creationTxHash === undefined ? (
    t('common.missing')
  ) : (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        gap: 3,
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

  return <ContractCreatorInfo scope={scope} creationTxHash={creationTxHash} />
}
