import { FC, ReactNode } from 'react'
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

const StyledBox = styled(Box, {
  shouldForwardProp: prop => prop !== 'verified',
})(({ verified }: { verified: boolean; address_eth: string }) => {
  const status: VerificationStatus = verified ? 'verified' : 'unverified'
  return {
    display: 'flex',
    justifyContent: 'center',
    height: verificationIconBoxHeight,
    fontSize: '12px',
    backgroundColor: statusBgColor[status],
    color: statusFgColor[status],
    borderRadius: 10,
    padding: 4,
    paddingLeft: 10,
    paddingRight: 5,
  }
})

type ContractVerificationIconProps = {
  account: Pick<RuntimeAccount, 'address_eth' | 'evm_contract'> | undefined
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

  return <VerificationIcon address_eth={address_eth} verified={verified} noLink={noLink} />
}

export const VerificationIcon: FC<{ address_eth: string; verified: boolean; noLink?: boolean }> = ({
  address_eth,
  verified,
  noLink = false,
}) => {
  const { t } = useTranslation()

  const status: VerificationStatus = verified ? 'verified' : 'unverified'
  const statusLabel: Record<VerificationStatus, string> = {
    verified: t('contract.verification.isVerified'),
    unverified: t('contract.verification.isNotVerified'),
  }

  return (
    <>
      <StyledBox verified={verified} address_eth={address_eth}>
        {statusLabel[status]}
        &nbsp; &nbsp;
        {statusIcon[status]}
      </StyledBox>
      &nbsp; &nbsp;
      {!noLink && (
        <Typography component="span" sx={{ fontSize: '12px', color: COLORS.brandExtraDark }}>
          <Trans
            t={t}
            i18nKey={
              verified ? 'contract.verification.openInSourcify' : 'contract.verification.verifyInSourcify'
            }
            components={{
              SourcifyLink: (
                <Link
                  href={`https://sourcify.dev/#/lookup/${address_eth}`}
                  rel="noopener noreferrer"
                  target="_blank"
                  sx={{ fontWeight: 400, color: 'inherit', textDecoration: 'underline' }}
                />
              ),
            }}
          />
        </Typography>
      )}
    </>
  )
}
