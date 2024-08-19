import { FC } from 'react'
import { useTranslation } from 'react-i18next'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import { styled } from '@mui/material/styles'
import OpenInNewIcon from '@mui/icons-material/OpenInNew'
import { getHostname } from '../../utils/url'
import { SnapshotCardExternalLink } from '../../components/Snapshots/SnapshotCardExternalLink'

const StyledTypography = styled(Typography)(() => ({
  fontSize: 18,
  fontWeight: 500,
  textTransform: 'lowercase',
}))

type ExternalLinkCardProps = {
  link: string | undefined
}

export const ExternalLinkCard: FC<ExternalLinkCardProps> = ({ link }) => {
  const { t } = useTranslation()

  return (
    <SnapshotCardExternalLink
      description={t('validator.externalLinkDescription')}
      label={
        <Box gap={2} sx={{ display: 'flex', alignItems: 'center' }}>
          <StyledTypography>{getHostname(link)}</StyledTypography>
          <OpenInNewIcon sx={{ fontSize: 20 }} />
        </Box>
      }
      title={t('validator.externalLink')}
      url={link}
    />
  )
}
