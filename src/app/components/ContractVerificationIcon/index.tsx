import React, { FC, ReactNode } from 'react'
import { useTranslation } from 'react-i18next'
import Box from '@mui/material/Box'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import CancelIcon from '@mui/icons-material/Cancel'
import { styled } from '@mui/material/styles'
import { COLORS } from '../../../styles/theme/colors'

type VerificationStatus = 'verified' | 'unverified'

const statusBgColor: Record<VerificationStatus, string> = {
  verified: COLORS.honeydew,
  unverified: COLORS.linen,
}

const statusFgColor: Record<VerificationStatus, string> = {
  verified: COLORS.eucalyptus,
  unverified: COLORS.errorIndicatorBackground,
}

const statusIcon: Record<VerificationStatus, ReactNode> = {
  verified: <CheckCircleIcon color="success" fontSize="inherit" />,
  unverified: <CancelIcon color="error" fontSize="inherit" />,
}

const StyledBox = styled(Box, {
  shouldForwardProp: prop => prop !== 'verified',
})(({ verified }: ContractVerificationIconProps) => {
  const status: VerificationStatus = verified ? 'verified' : 'unverified'
  return {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '28px',
    fontSize: '15px',
    backgroundColor: statusBgColor[status],
    color: statusFgColor[status],
    borderRadius: 10,
    padding: 4,
    paddingLeft: 12,
    paddingRight: 12,
  }
})

type ContractVerificationIconProps = {
  verified: boolean
  address_eth: string
}

export const ContractVerificationIcon: FC<ContractVerificationIconProps> = ({ verified, address_eth }) => {
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
        &nbsp;
        {statusIcon[status]}
      </StyledBox>
      {verified && t('contract.verification.openInSourcify')}
    </>
  )
}
