import { FC, ReactNode } from 'react'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import { styled } from '@mui/material/styles'
import Typography from '@mui/material/Typography'
import { SnapshotCard } from '../../components/Snapshots/SnapshotCard'
import { COLORS } from '../../../styles/theme/colors'
import { isUrlSafe } from 'app/utils/url'

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
  label?: ReactNode
  title: string
  url?: string
}

export const SnapshotCardExternalLink: FC<SnapshotCardExternalLinkProps> = ({
  description,
  label,
  title,
  url,
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
        {url && isUrlSafe(url) && (
          <Button href={url} target="_blank" rel="noopener noreferrer" color="secondary" variant="outlined">
            {label}
          </Button>
        )}
      </StyledBox>
    </SnapshotCard>
  )
}
