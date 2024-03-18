import { FC } from 'react'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import { styled } from '@mui/material/styles'
import Typography from '@mui/material/Typography'
import { SnapshotCard } from '../../components/Snapshots/SnapshotCard'
import { COLORS } from '../../../styles/theme/colors'
import { hasValidProtocol } from 'app/utils/url'

const StyledBox = styled(Box)(({ theme }) => ({
  gap: theme.spacing(5),
  padding: `0 ${theme.spacing(4)} ${theme.spacing(4)}`,
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'stretch',
  justifyContent: 'space-between',
}))

type SnapshotCardExternalLinkProps = {
  description: string
  label?: string
  title: string
  url?: string

  /**
   * Should we accept "mailto:" links?
   *
   * Those are more dangerous than other types, since they can
   * facilitate displaying malicious URLs like javascript: and mailto:?attach=
   *
   * In order to prevent this, only enable this flag if we can be sure that the link is safe.
   */
  emailAccepted?: boolean
}

export const SnapshotCardExternalLink: FC<SnapshotCardExternalLinkProps> = ({
  description,
  label,
  title,
  url,
  emailAccepted,
}) => {
  return (
    <SnapshotCard title={title} withContentPadding={false}>
      <StyledBox>
        <Typography
          sx={{
            fontSize: '12px',
            color: COLORS.grayMedium,
          }}
        >
          {description}
        </Typography>
        {url && (hasValidProtocol(url) || (emailAccepted && url.startsWith('mailto:'))) && (
          <Button href={url} target="_blank" rel="noopener noreferrer" color="secondary" variant="outlined">
            {label}
          </Button>
        )}
      </StyledBox>
    </SnapshotCard>
  )
}
