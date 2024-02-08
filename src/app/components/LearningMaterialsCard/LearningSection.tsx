import Paper, { type PaperProps } from '@mui/material/Paper'
import Typography from '@mui/material/Typography'
import { FC } from 'react'
import { COLORS } from 'styles/theme/colors'
import { AnchorCircle } from '../StyledLinks'

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
      <AnchorCircle url={url} />
    </Paper>
  )
}
