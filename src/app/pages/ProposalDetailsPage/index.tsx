import { FC } from 'react'
import { useTranslation } from 'react-i18next'
import Box from '@mui/material/Box'
import Tooltip from '@mui/material/Tooltip'
import InfoIcon from '@mui/icons-material/Info'
import { useRequiredScopeParam } from '../../hooks/useScopeParam'
import { Layer, Proposal, useGetConsensusProposalsProposalId } from '../../../oasis-nexus/api'
import { AppErrors } from '../../../types/errors'
import { useParams } from 'react-router-dom'
import { PageLayout } from '../../components/PageLayout'
import { SubPageCard } from '../../components/SubPageCard'
import { StyledDescriptionList } from 'app/components/StyledDescriptionList'
import { RoundedBalance } from '../../components/RoundedBalance'
import { DashboardLink } from '../ParatimeDashboardPage/DashboardLink'
import { useScreenSize } from '../../hooks/useScreensize'
import { ProposalStatusIcon } from '../../components/Proposals/ProposalStatusIcon'
import { TextSkeleton } from '../../components/Skeleton'
import { AccountLink } from '../../components/Account/AccountLink'
import { COLORS } from 'styles/theme/colors'

export const ProposalDetailsPage: FC = () => {
  const { t } = useTranslation()
  const scope = useRequiredScopeParam()
  if (scope.layer !== Layer.consensus) {
    throw AppErrors.UnsupportedLayer
  }
  const proposalId = parseInt(useParams().proposalId!, 10)

  const { isLoading, data } = useGetConsensusProposalsProposalId(scope.network, proposalId)
  if (!data?.data && !isLoading) {
    throw AppErrors.NotFoundProposalId
  }
  const proposal = data?.data!
  return (
    <PageLayout>
      <SubPageCard featured title={t('common.proposal')}>
        <ProposalDetailView isLoading={isLoading} proposal={proposal} />
      </SubPageCard>
    </PageLayout>
  )
}

export const ProposalDetailView: FC<{
  proposal: Proposal
  isLoading?: boolean
  showLayer?: boolean
  standalone?: boolean
}> = ({ proposal, isLoading, showLayer = false, standalone = false }) => {
  const { t } = useTranslation()
  const { isMobile } = useScreenSize()
  if (isLoading) return <TextSkeleton numberOfRows={7} />

  return (
    <StyledDescriptionList titleWidth={isMobile ? '100px' : '200px'} standalone={standalone}>
      {showLayer && (
        <>
          <dt>{t('common.network')}</dt>
          <dd>
            <DashboardLink scope={proposal} />
          </dd>
        </>
      )}

      <dt>{t('networkProposal.id')}</dt>
      <dd>{proposal.id}</dd>

      <dt>{t('common.title')}</dt>
      <dd>{proposal.handler}</dd>

      {/*Not enough data*/}
      {/*<dt>{t('common.type')}</dt>*/}
      {/*<dd>???</dd>*/}

      <dt>{t('common.submitter')}</dt>
      <dd>
        <AccountLink scope={proposal} address={proposal.submitter} />
      </dd>

      {/*Not enough data*/}
      {/*<dt>{t('common.totalVotes')}</dt>*/}
      {/*<dd>{proposal.invalid_votes}</dd>*/}

      <dt>{t('common.status')}</dt>
      <dd>
        <Box>
          <ProposalStatusIcon status={proposal.state} />
        </Box>
      </dd>

      <dt>{t('networkProposal.deposit')}</dt>
      <dd>
        <RoundedBalance value={proposal.deposit} />
      </dd>

      <dt>{t('networkProposal.create')}</dt>
      <dd>
        <Tooltip title={t('networkProposal.createTooltip')} placement={'top'}>
          <Box sx={{ display: 'flex' }} gap={2}>
            {proposal.created_at}
            <InfoIcon htmlColor={COLORS.brandDark} />
          </Box>
        </Tooltip>
      </dd>

      <dt>{t('networkProposal.close')}</dt>
      <dd>
        <Tooltip title={t('networkProposal.closeTooltip')} placement={'top'}>
          <Box sx={{ display: 'flex' }} gap={2}>
            {proposal.closes_at}
            <InfoIcon htmlColor={COLORS.brandDark} />
          </Box>
        </Tooltip>
      </dd>
    </StyledDescriptionList>
  )
}
