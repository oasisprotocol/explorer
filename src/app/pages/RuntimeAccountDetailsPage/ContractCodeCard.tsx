import { FC } from 'react'
import { useTranslation } from 'react-i18next'
import { Card, CardContent } from '@oasisprotocol/ui-library/src/components/cards'
import { LinkableDiv } from '../../components/PageLayout/LinkableDiv'
import { useAccount } from './hooks'
import { CardEmptyState } from '../../components/CardEmptyState'
import { TokenDashboardContext } from '../TokenDashboardPage/types'
import { CodeDisplay } from '../../components/CodeDisplay'
import { codeContainerId } from '../../utils/tabAnchors'
import { Typography } from '@oasisprotocol/ui-library/src/components/typography'
import { VerificationIcon } from 'app/components/ContractVerificationIcon'
import { useTokenInfo } from '../TokenDashboardPage/hooks'
import { base64ToHex } from '../../utils/helpers'
import { Separator } from '@oasisprotocol/ui-library/src/components/ui/separator'

export const ContractCodeCard: FC<TokenDashboardContext> = ({ scope, address }) => {
  const { t } = useTranslation()

  const { isFetched, account } = useAccount(scope, address)
  const contract = account?.evm_contract
  const noCode = isFetched && !contract?.creation_bytecode && !contract?.runtime_bytecode
  const { token } = useTokenInfo(scope, address, {
    enabled: !!contract,
  })
  const entryFilePath = Object.keys(
    contract?.verification?.compilation_metadata?.settings?.compilationTarget ?? {},
  )[0]
  const filesSorted = contract?.verification?.source_files
    ?.slice()
    .sort((a, b) => b.path.endsWith(entryFilePath) - a.path.endsWith(entryFilePath))

  return (
    <Card variant="layout" className="rounded-t-none border-t-0">
      {noCode && <CardEmptyState label={t('contract.noCode')} />}
      {contract && (contract.creation_bytecode || contract.runtime_bytecode) && (
        <CardContent>
          <LinkableDiv id={codeContainerId}>
            {contract.verification?.source_files && (
              <>
                <Typography variant="h4" className="mb-4">
                  {t('contract.sourceCode')}
                </Typography>

                <dl className="grid grid-cols-[max-content_1fr] items-baseline gap-y-3">
                  <dt className="mx-6 py-2">
                    <Typography>{t('contract.verification.title')}</Typography>
                  </dt>
                  <dd className="flex items-center">
                    <VerificationIcon
                      address_eth={account.address_eth!}
                      scope={account}
                      verificationLevel={contract.verification?.verification_level}
                      hideLink
                    />
                  </dd>

                  {contract.verification?.compilation_metadata?.settings?.compilationTarget && (
                    <>
                      <dt className="mx-6 py-2">
                        <Typography>{t('contract.name')}</Typography>
                      </dt>
                      <dd>
                        <Typography>
                          {
                            Object.values(
                              contract.verification.compilation_metadata.settings.compilationTarget,
                            )[0] as string
                          }
                        </Typography>
                      </dd>
                    </>
                  )}

                  {token?.name && (
                    <>
                      <dt className="mx-6 py-2">
                        <Typography>{t('common.tokenName')}</Typography>
                      </dt>
                      <dd>
                        <Typography>{token.name}</Typography>
                      </dd>
                    </>
                  )}
                </dl>
                <Separator className="my-4" />
              </>
            )}

            {filesSorted?.map((file, index) => (
              <CodeDisplay key={file.path} code={file.content} label={file.name} language="sol" />
            ))}

            {contract.verification?.compilation_metadata && (
              <CodeDisplay
                code={JSON.stringify(contract.verification.compilation_metadata, null, 2)}
                label={t('contract.contractMetadata')}
                language="sol"
              />
            )}

            {contract.creation_bytecode && (
              <CodeDisplay
                code={base64ToHex(contract.creation_bytecode)}
                label={t('contract.creationByteCode')}
                language="plaintext"
              />
            )}

            {contract.runtime_bytecode && (
              <CodeDisplay
                code={base64ToHex(contract.runtime_bytecode)}
                label={t('contract.runtimeByteCode')}
                language="plaintext"
              />
            )}
          </LinkableDiv>
        </CardContent>
      )}
    </Card>
  )
}
