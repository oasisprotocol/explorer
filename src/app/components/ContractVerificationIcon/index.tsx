import { FC, useState } from 'react'
import { Trans, useTranslation } from 'react-i18next'
import Box from '@mui/material/Box'
import { COLORS } from '../../../styles/theme/colors'
import Link from '@mui/material/Link'
import Typography from '@mui/material/Typography'
import { SearchScope } from '../../../types/searchScope'
import * as externalLinks from '../../utils/externalLinks'
import { isLocalnet } from '../../utils/route-utils'
import { AbiPlaygroundLink } from './AbiPlaygroundLink'
import { StatusBadge } from '../common/StatusBadge'

export const verificationIconBoxHeight = 28

type ContractStatusProps = {
  verified: boolean
}

export const ContractStatus = ({ verified }: ContractStatusProps) => {
  const { t } = useTranslation()
  const statusLabel = verified
    ? t('contract.verification.isVerified')
    : t('contract.verification.isNotVerified')
  const statusVariant = verified ? 'success' : 'danger'

  return <StatusBadge label={statusLabel} variant={statusVariant} />
}

export const VerificationIcon: FC<{
  address_eth: string
  scope: SearchScope
  verified: boolean
  noLink?: boolean
}> = ({ address_eth, scope, verified, noLink = false }) => {
  const { t } = useTranslation()
  const [explainDelay, setExplainDelay] = useState(false)
  if (isLocalnet(scope.network)) {
    return null
  }
  const sourcifyLinkProps = {
    href: `${externalLinks.dapps.sourcifyRoot}#/lookup/${address_eth}`,
    rel: 'noopener noreferrer',
    target: '_blank',
    sx: { fontWeight: 400, color: 'inherit', textDecoration: 'underline' },
    onClick: verified ? undefined : () => setExplainDelay(true),
  }
  const Component = noLink ? Box : (Link as React.ElementType)
  const componentProps = noLink ? {} : sourcifyLinkProps

  return (
    <>
      <Component {...componentProps}>
        <ContractStatus verified={verified} />
      </Component>
      &nbsp; &nbsp;
      {!noLink &&
        (verified ? (
          <Typography component="span" sx={{ fontSize: '12px', color: COLORS.brandExtraDark }}>
            <Trans
              t={t}
              i18nKey={'contract.verification.openInSourcify'}
              components={{
                SourcifyLink: <Link {...sourcifyLinkProps} />,
              }}
            />
            <AbiPlaygroundLink address_eth={address_eth} scope={scope} />
          </Typography>
        ) : (
          <Typography component="span" sx={{ fontSize: '12px', color: COLORS.brandExtraDark }}>
            <Trans
              t={t}
              i18nKey={'contract.verification.verifyInSourcify'}
              components={{
                SourcifyLink: <Link {...sourcifyLinkProps} />,
              }}
            />{' '}
            {explainDelay && t('contract.verification.explainVerificationDelay')}
          </Typography>
        ))}
    </>
  )
}
