import { FC } from 'react'
import { useTranslation } from 'react-i18next'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import { LinkableDiv } from '../../components/PageLayout/LinkableDiv'
import { useAccount } from './hook'
import { CardEmptyState } from '../../components/CardEmptyState'
import { TokenDashboardContext } from '../TokenDashboardPage'
import { FileDisplay, RawDataDisplay } from '../../components/CodeDisplay'
import { codeContainerId } from '../../utils/tabAnchors'
import Typography from '@mui/material/Typography'
import { VerificationIcon } from 'app/components/ContractVerificationIcon'
import Box from '@mui/material/Box'
import { COLORS } from 'styles/theme/colors'
import { useTokenInfo } from '../TokenDashboardPage/hook'
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
    <Card>
      {noCode && <CardEmptyState label={t('contract.noCode')} />}
      {contract && (contract.creation_bytecode || contract.runtime_bytecode) && (
        <CardContent>
          <LinkableDiv id={codeContainerId}>
            {contract.verification?.source_files && (
              <>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 3, mb: 4 }}>
                  <Typography variant="h4" component="h4">
                    {t('contract.sourceCode')}
                  </Typography>
                  <VerificationIcon
                    address_eth={account.address_eth!}
                    scope={account}
                    verificationLevel={contract.verification?.verification_level}
                    noLink
                  />
                </Box>

                {contract.verification?.compilation_metadata?.settings?.compilationTarget && (
                  <Typography
                    variant="body1"
                    component="span"
                    sx={{ display: 'block', mb: 2 }}
                    color={COLORS.brandExtraDark}
                  >
                    {t('contract.name')}:{' '}
                    <b>
                      {
                        Object.values(
                          contract.verification.compilation_metadata.settings.compilationTarget,
                        )[0] as string
                      }
                    </b>
                  </Typography>
                )}

                {token?.name && (
                  <Typography
                    variant="body1"
                    component="span"
                    sx={{ display: 'block' }}
                    color={COLORS.brandExtraDark}
                  >
                    {t('common.tokenName')}: <b>{token.name}</b>
                  </Typography>
                )}
              </>
            )}

            {filesSorted?.map((file, index) => (
              <FileDisplay key={file.path} code={file.content} filename={file.name} />
            ))}

            {contract.verification?.compilation_metadata && (
              <FileDisplay
                code={JSON.stringify(contract.verification.compilation_metadata, null, 2)}
                filename={t('contract.contractMetadata')}
              />
            )}

            <RawDataDisplay data={contract.creation_bytecode} label={t('contract.creationByteCode')} />

            <RawDataDisplay data={contract.runtime_bytecode} label={t('contract.runtimeByteCode')} />
          </LinkableDiv>
        </CardContent>
      )}
    </Card>
  )
}
