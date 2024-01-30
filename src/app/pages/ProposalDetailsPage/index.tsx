import { FC } from 'react'
import { useTranslation } from 'react-i18next'
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
  console.log('loaded proposal', proposal)
  return (
    <StyledDescriptionList titleWidth={isMobile ? '100px' : '200px'} standalone={standalone}>
      {showLayer && (
        <>
          <dt>{t('common.network')}</dt>
          <dd>
            <DashboardLink scope={{ network: proposal.network, layer: Layer.consensus }} />
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
        <AccountLink
          scope={{ network: proposal.network, layer: Layer.consensus }}
          address={proposal.submitter}
        />
      </dd>

      {/*Not enough data*/}
      {/*<dt>{t('common.totalVotes')}</dt>*/}
      {/*<dd>{proposal.invalid_votes}</dd>*/}

      <dt>{t('common.status')}</dt>
      <dd>
        <ProposalStatusIcon status={proposal.state} />
      </dd>

      <dt>{t('networkProposal.deposit')}</dt>
      <dd>
        <RoundedBalance value={proposal.deposit} />
      </dd>

      <dt>{t('networkProposal.create')}</dt>
      <dd>{proposal.created_at}</dd>

      <dt>{t('networkProposal.close')}</dt>
      <dd>{proposal.closes_at}</dd>
    </StyledDescriptionList>
  )
}
