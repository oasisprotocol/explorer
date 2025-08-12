import { FC } from 'react'
import { useTranslation } from 'react-i18next'
import Box from '@mui/material/Box'
import Tooltip from '@mui/material/Tooltip'
import InfoIcon from '@mui/icons-material/Info'
import CancelIcon from '@mui/icons-material/Cancel'
import { useConsensusScope } from '../../hooks/useScopeParam'
import { Proposal, useGetConsensusProposalsProposalId } from '../../../oasis-nexus/api'
import { AppErrors } from '../../../types/errors'
import { useLoaderData } from 'react-router-dom'
import { PageLayout } from '../../components/PageLayout'
import { SubPageCard } from '../../components/SubPageCard'
import { StyledDescriptionList } from 'app/components/StyledDescriptionList'
import { RoundedBalance } from '../../components/RoundedBalance'
import { DashboardLink } from '../ParatimeDashboardPage/DashboardLink'
import { useScreenSize } from '../../hooks/useScreensize'
import { ProposalStatusIcon } from '../../components/Proposals/ProposalStatusIcon'
import { TextSkeleton } from '../../components/Skeleton'
import { ConsensusAccountLink } from '../../components/Account/ConsensusAccountLink'
import { HighlightedText } from '../../components/HighlightedText'
import { ProposalIdLoaderData } from '../../utils/route-utils'
import { COLORS } from 'styles/theme/colors'
import { ProposalVotesCard } from './ProposalVotesCard'
import { useVoteStats } from './hooks'
import { Skeleton } from '@oasisprotocol/ui-library/src/components/ui/skeleton'
import { getTypeNameForProposal } from '../../../types/proposalType'

export const ProposalDetailsPage: FC = () => {
  const { t } = useTranslation()
  const scope = useConsensusScope()
  const { proposalId } = useLoaderData() as ProposalIdLoaderData
  const {
    isLoading: areStatsLoading,
    allVotesCount,
    isComplete: areStatsComplete,
  } = useVoteStats(scope.network, proposalId)
  const { isLoading, data } = useGetConsensusProposalsProposalId(scope.network, proposalId)
  if (!data?.data && !isLoading) {
    throw AppErrors.NotFoundProposalId
  }
  const proposal = data?.data!
  return (
    <PageLayout>
      <SubPageCard featured title={t('common.proposal')} mainTitle>
        <ProposalDetailView
          isLoading={isLoading}
          proposal={proposal}
          totalVotesLoading={areStatsLoading}
          totalVotesProblematic={!areStatsComplete && !areStatsLoading}
          totalVotes={allVotesCount}
        />
      </SubPageCard>
      <ProposalVotesCard />
    </PageLayout>
  )
}

const VoteLoadingProblemIndicator: FC = () => {
  const { t } = useTranslation()
  return (
    <Tooltip title={t('networkProposal.failedToLoadAllVotes')}>
      <CancelIcon color="error" fontSize="inherit" sx={{ ml: 2 }} />
    </Tooltip>
  )
}

export const ProposalDetailView: FC<{
  proposal: Proposal | undefined
  isLoading?: boolean
  totalVotesLoading?: boolean
  totalVotesProblematic?: boolean
  totalVotes?: number | undefined
  showLayer?: boolean
  standalone?: boolean
}> = ({
  proposal,
  isLoading,
  totalVotesLoading,
  totalVotesProblematic,
  totalVotes,
  showLayer = false,
  standalone = false,
}) => {
  const { t } = useTranslation()
  const { isMobile } = useScreenSize()
  if (isLoading) return <TextSkeleton numberOfRows={10} />
  if (!proposal) return null

  const proposalType = getTypeNameForProposal(t, proposal)

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
      <dd>
        <HighlightedText text={proposal.title} />
      </dd>

      <dt>{t('common.type')}</dt>
      <dd>{proposalType}</dd>

      <dt>{t('common.submitter')}</dt>
      <dd>
        <ConsensusAccountLink network={proposal.network} address={proposal.submitter} alwaysTrim={false} />
      </dd>

      {(totalVotes || totalVotesLoading || totalVotesProblematic) && (
        <>
          <dt>{t('common.totalVotes')}</dt>
          <dd>
            {totalVotesLoading ? <Skeleton className="w-1/4 h-4" /> : totalVotes?.toLocaleString()}
            {totalVotesProblematic && <VoteLoadingProblemIndicator />}
          </dd>
        </>
      )}

      {proposal.invalid_votes !== '0' && (
        <>
          <dt>{t('common.invalidVotes')}</dt>
          <dd>{proposal.invalid_votes}</dd>
        </>
      )}

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
