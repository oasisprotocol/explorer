import { FC } from 'react'
import { useTranslation } from 'react-i18next'
import CancelIcon from '@mui/icons-material/Cancel'
import { RuntimeEvent } from '../../../oasis-nexus/api'
import { StatusDetails, StyledBox } from '../StatusIcon'

// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { RuntimeEventType } from '../../../oasis-nexus/api'

/**
 * https://github.com/oasisprotocol/oasis-sdk/blob/9fb148a/client-sdk/go/modules/consensusaccounts/types.go#L145-L217
 *
 * Can appear in:
 * - {@link RuntimeEventType.consensus_accountsdeposit}
 * - {@link RuntimeEventType.consensus_accountswithdraw}
 * - {@link RuntimeEventType.consensus_accountsdelegate}
 * - {@link RuntimeEventType.consensus_accountsundelegate_start}
 */
type ConsensusError = {
  module: string
  code: number
}

type EventErrorProps = {
  event: RuntimeEvent
}

export const EventError: FC<EventErrorProps> = ({ event }) => {
  const { t } = useTranslation()
  const error: ConsensusError | undefined = event.body.error
  if (!error) return null

  const errorMessage = `${t('errors.code')} ${error.code}, ${t('errors.module')}: ${error.module}`
  return (
    <>
      <StyledBox status="failure" withText>
        {t('common.failed')}
        &nbsp;
        <CancelIcon color="error" fontSize="inherit" />
      </StyledBox>
      <StatusDetails error>{errorMessage}</StatusDetails>
    </>
  )
}

export const MaybeEventErrorLine: FC<EventErrorProps> = ({ event }) => {
  const { t } = useTranslation()
  return (
    event.body.error && (
      <>
        <dt>{t('common.status')}</dt>
        <dd style={{ flexWrap: 'wrap', gap: '10px' }}>
          <EventError event={event} />
        </dd>
      </>
    )
  )
}
