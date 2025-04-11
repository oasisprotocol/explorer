import { FC } from 'react'
import { useTranslation } from 'react-i18next'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import { LinkableDiv } from '../../components/PageLayout/LinkableDiv'
import { useAccount } from './hook'
import { CardEmptyState } from '../../components/CardEmptyState'
import { TokenDashboardContext } from '../TokenDashboardPage'
import { RawDataDisplay } from '../../components/CodeDisplay'
import { codeContainerId } from '../../utils/tabAnchors'

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
          <LinkableDiv id={codeContainerId}>
            {contract.verification?.source_files?.map((file, index) => (
              <RawDataDisplay key={index} data={file.content} label={file.name} />
            ))}

            {contract.verification?.compilation_metadata && (
              <RawDataDisplay
                data={JSON.stringify(contract.verification.compilation_metadata, null, 2)}
                label={t('contract.contractMetadata')}
              />
            )}

            <RawDataDisplay
              data={contract.creation_bytecode}
              label={t('contract.creationByteCode')}
              decodeBase64
            />

            <RawDataDisplay
              data={contract.runtime_bytecode}
              label={t('contract.runtimeByteCode')}
              decodeBase64
            />
          </LinkableDiv>
        </CardContent>
      )}
    </Card>
  )
}
