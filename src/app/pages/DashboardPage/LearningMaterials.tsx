import { FC } from 'react'
import { type PaperProps } from '@mui/material/Paper'
import ArrowForwardIcon from '@mui/icons-material/ArrowForward'
import { styled } from '@mui/material/styles'
import { AppLink } from '../../components/AppLink/AppLink'
import { AppTypography } from '../../components/AppTypography/AppTypography'
import { AppCard } from '../../components/AppCard/AppCard'
import { AppCardHeader } from '../../components/AppCardHeader/AppCardHeader'
import { AppCardContent } from '../../components/AppCardContent/AppCardContent'
import { AppPaper } from '../../components/AppPaper/AppPaper'
import { AppGrid2 } from '../../components/AppGrid2/AppGrid2'

const docsUrl = 'https://docs.oasis.io/'
const docsPages = {
  emerald: 'dapp/emerald/',
  token: 'general/oasis-network/token-metrics-and-distribution',
  transfer: 'general/manage-tokens/how-to-transfer-rose-into-paratime',
}
const getDocsLink = (document: keyof typeof docsPages) => `${docsUrl}${docsPages[document]}`
const StyledLink = styled(AppLink)(() => ({
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
    <AppPaper variant="content" {...props}>
      <AppTypography variant="h4">{title}</AppTypography>
      <AppTypography variant="body2">{description}</AppTypography>
      <StyledLink href={url} rel="noopener noreferrer" target="_blank">
        <ArrowForwardIcon />
      </StyledLink>
    </AppPaper>
  )
}

export function LearningMaterials() {
  return (
    <AppCard>
      <AppCardHeader
        disableTypography
        component="h3"
        title="Learning materials"
        action={
          <AppLink href={docsUrl} rel="noopener noreferrer" target="_blank">
            Access Learning Center
          </AppLink>
        }
      />
      <AppCardContent>
        <AppGrid2 container spacing={3}>
          <AppGrid2 xs={12} md={6}>
            <LearningSection
              description="The Emerald ParaTime is our official EVM Compatible ParaTime providing smart contract environment with full EVM compatibility."
              title="What is the Emerald network?"
              url={getDocsLink('emerald')}
              sx={{ height: '100%' }}
            />
          </AppGrid2>
          <AppGrid2 xs={12} md={6}>
            <AppGrid2 container spacing={3}>
              <AppGrid2>
                <LearningSection
                  description="Rose is the currency powering the Emerald network."
                  title="What is the ROSE token?"
                  url={getDocsLink('token')}
                />
              </AppGrid2>
              <AppGrid2>
                <LearningSection
                  description="Rose is the currency powering the Emerald network."
                  title="How to Transfer ROSE into a ParaTime"
                  url={getDocsLink('transfer')}
                />
              </AppGrid2>
            </AppGrid2>
          </AppGrid2>
        </AppGrid2>
      </AppCardContent>
    </AppCard>
  )
}
