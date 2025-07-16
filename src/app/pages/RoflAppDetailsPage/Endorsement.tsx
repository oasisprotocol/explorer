import { FC } from 'react'
import { useTranslation } from 'react-i18next'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import { RoflAppPolicy } from '../../../oasis-nexus/api'
import { exhaustedTypeWarning } from '../../../types/errors'
import { AccountLink } from '../../components/Account/AccountLink'
import { useRuntimeScope } from '../../hooks/useScopeParam'

type RoflAllowedEndorsementFields =
  | 'any'
  | 'role_compute'
  | 'role_observer'
  | 'entity'
  | 'node'
  | 'provider'
  | 'provider_instance_admin'
  | 'and'
  | 'or'

type EndorsementProps = {
  endorsements: RoflAppPolicy['endorsements']
}

export const Endorsement: FC<EndorsementProps> = ({ endorsements }) => {
  const { t } = useTranslation()
  const scope = useRuntimeScope()

  if (!endorsements || endorsements.length === 0) {
    return <>{t('common.missing')}</>
  }

  // Nexus is not parsing ROFL app policy, but we can expect object to be similar to this:
  // https://github.com/oasisprotocol/oasis-sdk/blob/3f1f6f4aa4a7800b1c176fea3cbb2faaba915ddb/runtime-sdk/src/modules/rofl/policy.rs#L91

  const getEndorsementLabel = (key: RoflAllowedEndorsementFields): string => {
    switch (key) {
      case 'any':
        return t('rofl.endorsementLabels.any')
      case 'role_compute':
        return t('rofl.endorsementLabels.role_compute')
      case 'role_observer':
        return t('rofl.endorsementLabels.role_observer')
      case 'entity':
        return t('rofl.endorsementLabels.entity')
      case 'node':
        return t('rofl.endorsementLabels.node')
      case 'provider':
        return t('rofl.endorsementLabels.provider')
      case 'provider_instance_admin':
        return t('rofl.endorsementLabels.provider_instance_admin')
      case 'and':
        return t('rofl.endorsementLabels.and')
      case 'or':
        return t('rofl.endorsementLabels.or')
    }
    exhaustedTypeWarning('Unknown endorsement', key)
    return key
  }

  const getValue = (key: RoflAllowedEndorsementFields, value: any) => {
    switch (key) {
      case 'any':
        return ''
      case 'role_compute':
        return ''
      case 'role_observer':
        return ''
      case 'entity':
        // TODO: make this a link to consensus layer entity with the given public key
        // (probably you need to derive an address from that public key)
        return <Typography variant="mono">{value}</Typography>
      case 'node':
        return <AccountLink scope={scope} address={value} />
      case 'provider':
        return <AccountLink scope={scope} address={value} />
      case 'provider_instance_admin':
        return <AccountLink scope={scope} address={value} />
      case 'and':
        return (
          <Box sx={{ ml: 4 }}>
            <Endorsement endorsements={value} />
          </Box>
        )
      case 'or':
        return (
          <Box sx={{ ml: 4 }}>
            <Endorsement endorsements={value} />
          </Box>
        )
    }
    exhaustedTypeWarning('Unknown endorsement', key)
    return JSON.stringify(value)
  }

  return (
    <div>
      {endorsements.map((endorsement: { [key: string]: any }, index: number) => {
        const key = Object.keys(endorsement)[0] as RoflAllowedEndorsementFields
        const value = endorsement[key]

        return (
          <Box
            key={index}
            sx={{
              display: 'flex',
              gap: 3,
              alignItems: 'center',
            }}
          >
            {getEndorsementLabel(key)}
            {getValue(key, value)}
          </Box>
        )
      })}
    </div>
  )
}
