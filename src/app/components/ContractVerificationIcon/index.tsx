import { FC, ReactNode, useState } from 'react'
import { Trans, useTranslation } from 'react-i18next'
import Box from '@mui/material/Box'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import CancelIcon from '@mui/icons-material/Cancel'
import { styled } from '@mui/material/styles'
import { COLORS } from '../../../styles/theme/colors'
import Link from '@mui/material/Link'
import Typography from '@mui/material/Typography'
import { SearchScope } from '../../../types/searchScope'
import * as externalLinks from '../../utils/externalLinks'
import { isLocalnet } from '../../utils/route-utils'
import { AbiPlaygroundLink } from './AbiPlaygroundLink'

type VerificationStatus = 'verified' | 'unverified'

const statusBgColor: Record<VerificationStatus, string> = {
  verified: COLORS.honeydew,
  unverified: COLORS.linen,
}

const statusFgColor: Record<VerificationStatus, string> = {
  verified: COLORS.brandExtraDark,
  unverified: COLORS.brandExtraDark,
}

const statusIcon: Record<VerificationStatus, ReactNode> = {
  verified: <CheckCircleIcon color="success" fontSize="small" />,
  unverified: <CancelIcon color="error" fontSize="small" />,
}

export const verificationIconBoxHeight = 28

const StyledPill = styled(Box, {
  shouldForwardProp: prop => prop !== 'verified' && prop !== 'address_eth',
})(({ verified }: { verified: boolean; address_eth: string }) => {
  const status: VerificationStatus = verified ? 'verified' : 'unverified'
  return {
    display: 'flex',
    flexShrink: 0,
    justifyContent: 'center',
    height: verificationIconBoxHeight,
    fontSize: '12px',
    backgroundColor: statusBgColor[status],
    color: statusFgColor[status],
    borderRadius: 10,
    padding: 4,
    paddingLeft: 10,
    paddingRight: 5,
    '&&': {
      textDecoration: 'none',
    },
  }
})

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
  const status: VerificationStatus = verified ? 'verified' : 'unverified'
  const statusLabel: Record<VerificationStatus, string> = {
    verified: t('contract.verification.isVerified'),
    unverified: t('contract.verification.isNotVerified'),
  }
  const sourcifyLinkProps = {
    href: `${externalLinks.dapps.sourcifyRoot}#/lookup/${address_eth}`,
    rel: 'noopener noreferrer',
    target: '_blank',
    sx: { fontWeight: 400, color: 'inherit', textDecoration: 'underline' },
    onClick: verified ? undefined : () => setExplainDelay(true),
  }
  const Component = noLink ? Box : Link
  const componentProps = noLink ? {} : sourcifyLinkProps

  return (
    <>
      <StyledPill component={Component} verified={verified} address_eth={address_eth} {...componentProps}>
        {statusLabel[status]}
        &nbsp; &nbsp;
        {statusIcon[status]}
      </StyledPill>
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
