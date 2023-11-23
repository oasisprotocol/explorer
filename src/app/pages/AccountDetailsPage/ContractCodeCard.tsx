import { FC } from 'react'
import { useTranslation } from 'react-i18next'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import { LinkableDiv } from '../../components/PageLayout/LinkableDiv'
import { useAccount } from './hook'
import { CardEmptyState } from './CardEmptyState'
import { TokenDashboardContext } from '../TokenDashboardPage'
import { RawDataDisplay } from '../../components/CodeDisplay'

export const contractCodeContainerId = 'code'

export const ContractCodeCard: FC<TokenDashboardContext> = ({ scope, address }) => {
  const { t } = useTranslation()

  const { isFetched, account } = useAccount(scope, address)
  const contract = account?.evm_contract
  const noCode = isFetched && !contract?.creation_bytecode && !contract?.runtime_bytecode
  return (
    <Card>
      {noCode && <CardEmptyState label={t('contract.noCode')} />}
      {contract && (contract.creation_bytecode || contract.runtime_bytecode) && (
        <CardContent>
          <LinkableDiv id={contractCodeContainerId}>
            <RawDataDisplay data={contract.creation_bytecode} label={t('contract.creationByteCode')} />
            <RawDataDisplay
              data={contract.runtime_bytecode}
              label={t('contract.runtimeByteCode')}
              extraTopPadding={!!contract.creation_bytecode}
            />
          </LinkableDiv>
        </CardContent>
      )}
    </Card>
  )
}
