import { FC } from 'react'
import { useTranslation } from 'react-i18next'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import { RoflAppPolicy } from '../../../oasis-nexus/api'

type EndorsementProps = {
  policy: RoflAppPolicy
}

export const Endorsement: FC<EndorsementProps> = ({ policy }) => {
  const { t } = useTranslation()

  if (!policy.endorsements || policy.endorsements.length === 0) {
    return <>{t('common.missing')}</>
  }

  // Nexus is not parsing ROFL app policy, but we can expect object to be similar to this:
  // https://github.com/oasisprotocol/oasis-sdk/blob/41480106d585debd33391cb0dfcad32d2f3cdc9d/runtime-sdk/src/modules/rofl/policy.rs#L27

  const getEndorsementLabel = (key: string): string => {
    const labelMap: Record<string, string> = {
      any: t('rofl.any'),
      role_compute: t('rofl.roleCompute'),
      role_observer: t('rofl.roleObserver'),
      entity: t('rofl.entity'),
      node: t('rofl.node'),
    }
    return labelMap[key] || key
  }

  return (
    <>
      {policy.endorsements.map((endorsement: { [key: string]: any }, index: number) => {
        const key = Object.keys(endorsement)[0]
        const value = endorsement[key]

        return (
          <Box key={index}>
            {getEndorsementLabel(key)}
            {(key === 'entity' || key === 'node') && value ? (
              <>
                : <Typography variant="mono">{value}</Typography>
              </>
            ) : (
              ''
            )}
          </Box>
        )
      })}
    </>
  )
}
