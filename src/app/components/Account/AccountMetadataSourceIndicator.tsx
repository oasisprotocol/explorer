import { FC } from 'react'
import { AccountMetadataSource } from '../../data/named-accounts'
import { exhaustedTypeWarning } from '../../../types/errors'
import { useTranslation } from 'react-i18next'
import Box from '@mui/material/Box'

const OasisNameIndicator: FC = () => {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <g clipPath="url(#clip0_11844_77033)">
        <path
          d="M17.63 5.84C17.27 5.33 16.67 5 16 5L5 5.01C3.9 5.01 3 5.9 3 7V17C3 18.1 3.9 18.99 5 18.99L16 19C16.67 19 17.27 18.67 17.63 18.16L22 12L17.63 5.84Z"
          fill="#4CD4A9"
        />
      </g>
      <defs>
        <clipPath id="clip0_11844_77033">
          <rect width="24" height="24" fill="white" />
        </clipPath>
      </defs>
    </svg>
  )
}

const SelfAcclaimedNameIndicator: FC = () => {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <g clipPath="url(#clip0_11844_77432)">
        <path
          d="M3.25 2.75L20.25 19.75L19 21L17 19H5C3.9 19 3 18.1 3 17V7C3 6.45 3.23 5.95 3.59 5.59L2 4L3.25 2.75ZM22 12L17.63 5.84C17.27 5.33 16.67 5 16 5H8L19 16L22 12Z"
          fill="#D5D6D7"
        />
      </g>
      <defs>
        <clipPath id="clip0_11844_77432">
          <rect width="24" height="24" fill="white" />
        </clipPath>
      </defs>
    </svg>
  )
}

interface AccountMetadataSourceIndicatorProps {
  source: AccountMetadataSource
  withText?: boolean
}

export const AccountMetadataSourceIndicator: FC<AccountMetadataSourceIndicatorProps> = ({
  source,
  withText,
}) => {
  const { t } = useTranslation()

  const renderWithOrWithoutLabel = (label: string, labelNeeded: boolean, icon: JSX.Element) =>
    labelNeeded ? (
      <Box sx={{ display: 'inline-flex', gap: 2, alignItems: 'Center', fontWeight: 'normal' }}>
        {icon}
        {label}
      </Box>
    ) : (
      icon
    )

  switch (source) {
    case 'OasisRegistry':
      return renderWithOrWithoutLabel(t('account.namedByOasis'), !!withText, <OasisNameIndicator />)
    case 'DeltaDaoRegistry':
      return renderWithOrWithoutLabel(t('account.namedByDeltaDao'), !!withText, <OasisNameIndicator />)
    case 'SelfProfessed':
      return renderWithOrWithoutLabel(t('account.namedBySelf'), !!withText, <SelfAcclaimedNameIndicator />)
    default:
      exhaustedTypeWarning('Unexpected account metadata source', source)
      return '?'
  }
}
