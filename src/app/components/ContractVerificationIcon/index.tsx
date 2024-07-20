import { FC, ReactNode, useState } from 'react'
import { Trans, useTranslation } from 'react-i18next'
import Box from '@mui/material/Box'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import CancelIcon from '@mui/icons-material/Cancel'
import { styled } from '@mui/material/styles'
import { COLORS } from '../../../styles/theme/colors'
import Link from '@mui/material/Link'
import Typography from '@mui/material/Typography'
import Skeleton from '@mui/material/Skeleton'
import { RuntimeAccount } from '../../../oasis-nexus/api'
import { SearchScope } from '../../../types/searchScope'
import * as externalLinks from '../../utils/externalLinks'

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

type ContractVerificationIconProps = {
  account: Pick<RuntimeAccount, 'address_eth' | 'evm_contract' | 'network' | 'layer'> | undefined
  noLink?: boolean
}

const Waiting: FC = () => (
  <Skeleton
    variant="text"
    sx={{ display: 'inline-block', width: '100%', height: verificationIconBoxHeight }}
  />
)

export const ContractVerificationIcon: FC<ContractVerificationIconProps> = ({ account, noLink = false }) => {
  if (!account) {
    return <Waiting />
  }

  const verified = !!account.evm_contract?.verification
  const address_eth = account.address_eth!

  return <VerificationIcon address_eth={address_eth} scope={account} verified={verified} noLink={noLink} />
}

export const VerificationIcon: FC<{
  address_eth: string
  scope: SearchScope
  verified: boolean
  noLink?: boolean
}> = ({ address_eth, verified, noLink = false }) => {
  const { t } = useTranslation()
  const [explainDelay, setExplainDelay] = useState(false)

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
