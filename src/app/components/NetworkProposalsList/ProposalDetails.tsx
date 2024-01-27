import { FC } from 'react'
import { Layer, Proposal } from '../../../oasis-nexus/api'
import { StyledDescriptionList } from '../StyledDescriptionList'
import { useScreenSize } from '../../hooks/useScreensize'
import { DashboardLink } from '../../pages/ParatimeDashboardPage/DashboardLink'
import { useTranslation } from 'react-i18next'
import { RoundedBalance } from '../RoundedBalance'
import { ProposalStatusIcon } from '../ProposalStatusIcon'

export const ProposalDetails: FC<{ proposal: Proposal; showLayer?: boolean; standalone?: boolean }> = ({
  proposal,
  showLayer = false,
  standalone = false,
}) => {
  const { t } = useTranslation()
  const { isMobile } = useScreenSize()
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

      <dt>{t('networkProposal.handler')}</dt>
      <dd>{proposal.handler}</dd>

      <dt>{t('networkProposal.deposit')}</dt>
      <dd>
        <RoundedBalance value={proposal.deposit} />
      </dd>

      <dt>{t('networkProposal.create')}</dt>
      <dd>{proposal.created_at}</dd>

      <dt>{t('networkProposal.close')}</dt>
      <dd>{proposal.closes_at}</dd>

      <dt>{t('common.status')}</dt>
      <dd>
        <ProposalStatusIcon status={proposal.state} />
      </dd>
    </StyledDescriptionList>
  )
}
