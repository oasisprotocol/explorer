import { FC, useState } from 'react'
import { Trans, useTranslation } from 'react-i18next'
import { Link } from '@oasisprotocol/ui-library/src/components/link'
import { SearchScope } from '../../../types/searchScope'
import * as externalLinks from '../../utils/externalLinks'
import { isLocalnet } from '../../utils/route-utils'
import { AbiPlaygroundLink } from './AbiPlaygroundLink'
import { Badge } from '@oasisprotocol/ui-library/src/components/badge'

export const verificationIconBoxHeight = 28

export const VerificationIcon: FC<{
  address_eth: string
  scope: SearchScope
  verificationLevel?: 'full' | 'partial'
  hideLink?: boolean
}> = ({ address_eth, scope, verificationLevel, hideLink }) => {
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
    verificationLevel === 'full' ? 'success' : verificationLevel === 'partial' ? 'partial-success' : 'error'

  const sourcifyLinkProps = {
    href: hideLink ? undefined : `${externalLinks.dapps.sourcifyRoot}#/lookup/${address_eth}`,
    rel: 'noopener noreferrer',
    target: '_blank',
    onClick: verificationLevel ? undefined : () => setExplainDelay(true),
  }
  return (
    <>
      <Link {...sourcifyLinkProps}>
        <Badge variant={statusVariant}>{label}</Badge>
      </Link>
      {!hideLink &&
        (verificationLevel ? (
          <span className="text-xs">
            &nbsp; &nbsp;
            <Trans
              t={t}
              i18nKey={'contract.verification.openInSourcify'}
              components={{
                SourcifyLink: <Link className="text-inherit underline" {...sourcifyLinkProps} />,
              }}
            />
            <AbiPlaygroundLink address_eth={address_eth} scope={scope} />
          </span>
        ) : (
          <span className="text-xs">
            &nbsp; &nbsp;
            <Trans
              t={t}
              i18nKey={'contract.verification.verifyInSourcify'}
              components={{
                SourcifyLink: <Link className="text-inherit underline" {...sourcifyLinkProps} />,
              }}
            />{' '}
            {explainDelay && t('contract.verification.explainVerificationDelay')}
          </span>
        ))}
    </>
  )
}
