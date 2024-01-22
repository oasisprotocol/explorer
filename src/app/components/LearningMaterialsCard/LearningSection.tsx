import Paper, { type PaperProps } from '@mui/material/Paper'
import ArrowForwardIcon from '@mui/icons-material/ArrowForward'
import Link from '@mui/material/Link'
import Typography from '@mui/material/Typography'
import { styled } from '@mui/material/styles'
import { FC } from 'react'
import { COLORS } from 'styles/theme/colors'

const StyledLink = styled(Link)(() => ({
  width: '44px',
  height: '44px',
  borderRadius: '50%',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  marginLeft: 'auto',
  backgroundColor: COLORS.brandDark,
  color: COLORS.white,
  boxShadow: '0px 10px 8px rgba(117, 60, 239, 0.1)',
  '&:hover, &:focus-visible': {
    backgroundColor: COLORS.cosmicCobalt,
  },
}))

type LearningSectionProps = PaperProps & {
  description: string
  title: string
  url: string
}

export const LearningSection: FC<LearningSectionProps> = ({ description, title, url, ...props }) => {
  return (
    <Paper variant="content" {...props}>
      <Typography variant="h4" sx={{ mb: 4 }}>
        {title}
      </Typography>
      <Typography variant="body2" sx={{ color: COLORS.grayMedium }}>
        {description}
      </Typography>
      <StyledLink href={url} rel="noopener noreferrer" target="_blank">
        <ArrowForwardIcon sx={{ fontSize: 16 }} />
      </StyledLink>
    </Paper>
  )
}
