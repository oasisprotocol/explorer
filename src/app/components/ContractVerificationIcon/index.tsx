import { FC, useState } from 'react'
import { Trans, useTranslation } from 'react-i18next'
import { COLORS } from '../../../styles/theme/colors'
import Link from '@mui/material/Link'
import Typography from '@mui/material/Typography'
import { SearchScope } from '../../../types/searchScope'
import * as externalLinks from '../../utils/externalLinks'
import { isLocalnet } from '../../utils/route-utils'
import { AbiPlaygroundLink } from './AbiPlaygroundLink'
import { StatusBadge } from '../common/StatusBadge'

export const verificationIconBoxHeight = 28

export const VerificationIcon: FC<{
  address_eth: string
  scope: SearchScope
  verificationLevel?: 'full' | 'partial'
  hideLink?: boolean
  hideLabel?: boolean
}> = ({ address_eth, scope, verificationLevel, hideLink, hideLabel }) => {
  const { t } = useTranslation()
  const [explainDelay, setExplainDelay] = useState(false)
  if (isLocalnet(scope.network)) {
    return null
  }
  const label =
    verificationLevel === 'full'
      ? t('contract.verification.isVerified')
      : verificationLevel === 'partial'
        ? t('contract.verification.isPartiallyVerified')
        : t('contract.verification.isNotVerified')
  const statusVariant =
    verificationLevel === 'full' ? 'success' : verificationLevel === 'partial' ? 'partialsuccess' : 'danger'

  const sourcifyLinkProps = {
    href: hideLink ? undefined : `${externalLinks.dapps.sourcifyRoot}#/lookup/${address_eth}`,
    rel: 'noopener noreferrer',
    target: '_blank',
    sx: { fontWeight: 400, color: 'inherit', textDecoration: 'underline' },
    onClick: verificationLevel ? undefined : () => setExplainDelay(true),
  }
  return (
    <>
      <Link {...sourcifyLinkProps}>
        <StatusBadge label={hideLabel ? '' : label} variant={statusVariant} />
      </Link>
      {!hideLink &&
        (verificationLevel ? (
          <Typography component="span" sx={{ fontSize: '12px', color: COLORS.brandExtraDark }}>
            &nbsp; &nbsp;
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
            &nbsp; &nbsp;
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
