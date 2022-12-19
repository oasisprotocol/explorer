import { FC } from 'react'
import Card from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader'
import CardContent from '@mui/material/CardContent'
import Grid from '@mui/material/Unstable_Grid2'
import Link from '@mui/material/Link'
import Paper, { type PaperProps } from '@mui/material/Paper'
import ArrowForwardIcon from '@mui/icons-material/ArrowForward'
import Typography from '@mui/material/Typography'
import { styled } from '@mui/material/styles'

const docsUrl = 'https://docs.oasis.io/'
const docsPages = {
  emerald: 'dapp/emerald/',
  token: 'general/oasis-network/token-metrics-and-distribution',
  transfer: 'general/manage-tokens/how-to-transfer-rose-into-paratime',
}
const getDocsLink = (document: keyof typeof docsPages) => `${docsUrl}${docsPages[document]}`
const StyledLink = styled(Link)(() => ({
  width: '44px',
  height: '44px',
  borderRadius: '50%',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  marginLeft: 'auto',
  backgroundColor: '#3333C4',
  color: '#fff',
  boxShadow: '0px 10px 8px rgba(117, 60, 239, 0.1)',
  '&:hover': {
    backgroundColor: '#222199',
  },
}))

type LearningSectionProps = PaperProps & {
  description: string
  title: string
  url: string
}

const LearningSection: FC<LearningSectionProps> = ({ description, title, url, ...props }) => {
  return (
    <Paper variant="content" {...props}>
      <Typography variant="h4">{title}</Typography>
      <Typography variant="body2">{description}</Typography>
      <StyledLink href={url} rel="noopener noreferrer" target="_blank">
        <ArrowForwardIcon />
      </StyledLink>
    </Paper>
  )
}

export function LearningMaterials() {
  return (
    <Card>
      <CardHeader
        disableTypography
        component="h3"
        title="Learning materials"
        action={
          <Link href={docsUrl} rel="noopener noreferrer" target="_blank">
            Access Learning Center
          </Link>
        }
      />
      <CardContent>
        <Grid container spacing={3}>
          <Grid xs={12} md={6}>
            <LearningSection
              description="The Emerald ParaTime is our official EVM Compatible ParaTime providing smart contract environment with full EVM compatibility."
              title="What is the Emerald network?"
              url={getDocsLink('emerald')}
              sx={{ height: '100%' }}
            />
          </Grid>
          <Grid xs={12} md={6}>
            <Grid>
              <LearningSection
                description="Rose is the currency powering the Emerald network."
                title="What is the ROSE token?"
                url={getDocsLink('token')}
              />
            </Grid>
            <Grid>
              <LearningSection
                description="Rose is the currency powering the Emerald network."
                title="How to Transfer ROSE into a ParaTime"
                url={getDocsLink('transfer')}
              />
            </Grid>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  )
}
