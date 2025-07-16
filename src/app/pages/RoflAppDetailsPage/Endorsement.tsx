import { FC, ReactNode } from 'react'
import { Trans, useTranslation } from 'react-i18next'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import { RoflAppPolicy } from '../../../oasis-nexus/api'
import { exhaustedTypeWarning } from '../../../types/errors'
import { AccountLink } from '../../components/Account/AccountLink'
import { useRuntimeScope } from '../../hooks/useScopeParam'
import { useScreenSize } from '../../hooks/useScreensize'

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
  separator?: ReactNode
}

export const Endorsement: FC<EndorsementProps> = ({ endorsements, separator }) => {
  const { isTablet } = useScreenSize()
  const { t } = useTranslation()
  const scope = useRuntimeScope()

  const orSeparator = (
    <span style={{ textWrap: 'nowrap', fontWeight: 'bold' }}>{t('rofl.endorsementLabels.or')}</span>
  )

  const andSeparator = (
    <span style={{ textWrap: 'nowrap', fontWeight: 'bold' }}>{t('rofl.endorsementLabels.and')}</span>
  )

  if (!endorsements || endorsements.length === 0) {
    return <>{t('common.missing')}</>
  }

  // Nexus is not parsing ROFL app policy, but we can expect object to be similar to this:
  // https://github.com/oasisprotocol/oasis-sdk/blob/3f1f6f4aa4a7800b1c176fea3cbb2faaba915ddb/runtime-sdk/src/modules/rofl/policy.rs#L91

  const getEndorsementLabel = (
    key: Exclude<
      RoflAllowedEndorsementFields,
      'provider_instance_admin' | 'provider' | 'any' | 'node' | 'and' | 'or'
    >,
  ): ReactNode => {
    switch (key) {
      case 'role_compute':
        return t('rofl.endorsementLabels.role_compute')
      case 'role_observer':
        return t('rofl.endorsementLabels.role_observer')
      case 'entity':
        return t('rofl.endorsementLabels.entity')
    }
    exhaustedTypeWarning('Unknown endorsement', key)
    return key
  }

  const getValue = (
    key: Exclude<
      RoflAllowedEndorsementFields,
      'provider_instance_admin' | 'provider' | 'any' | 'node' | 'and' | 'or'
    >,
    value: any,
  ) => {
    switch (key) {
      case 'role_compute':
        return ''
      case 'role_observer':
        return ''
      case 'entity':
        // TODO: make this a link to consensus layer entity with the given public key
        // (probably you need to derive an address from that public key)
        return <Typography variant="mono">{value}</Typography>
    }
    exhaustedTypeWarning('Unknown endorsement', key)
    return JSON.stringify(value)
  }

  const getEndorsementExplanation = (key: RoflAllowedEndorsementFields, value: any): ReactNode => {
    switch (key) {
      case 'provider_instance_admin':
        return (
          <Box
            sx={{
              display: 'flex',
              flexWrap: isTablet ? 'wrap' : 'nowrap',
              textWrap: isTablet ? 'wrap' : 'nowrap',
              gap: 2,
              alignItems: 'center',
              flex: 1,
              overflowX: 'hidden',
            }}
          >
            <Trans
              t={t}
              i18nKey="rofl.endorsementLabels.provider_instance_admin"
              components={{
                address: <AccountLink scope={scope} address={value} alwaysTrim preferAdaptive />,
              }}
            />
          </Box>
        )
      case 'provider':
        return (
          <Box
            sx={{
              display: 'flex',
              gap: 2,
              alignItems: 'center',
              flexWrap: isTablet ? 'wrap' : 'nowrap',
              textWrap: isTablet ? 'wrap' : 'nowrap',
              overflowX: 'hidden',
              flex: 1,
            }}
          >
            <Trans
              t={t}
              i18nKey="rofl.endorsementLabels.provider"
              components={{
                address: <AccountLink scope={scope} address={value} alwaysTrim preferAdaptive />,
              }}
            />
          </Box>
        )
      case 'node':
        return (
          <Trans
            t={t}
            i18nKey="rofl.endorsementLabels.node"
            components={{
              address: <AccountLink scope={scope} address={value} alwaysTrim preferAdaptive />,
            }}
          />
        )
      case 'any':
        return t('rofl.endorsementLabels.any')
      case 'and':
      case 'or':
        return (
          <Box
            component={'div'}
            sx={{
              flex: 1,
              display: 'flex',
              flexDirection: 'column',
              overflowX: 'hidden',
              paddingLeft: '15px',
              position: 'relative',
              '&::before': {
                content: '""',
                position: 'absolute',
                left: 0,
                top: 0,
                height: '100%',
                width: '20px' /* Width of the brace area */,
                borderLeft: '1px solid #000' /* Vertical line of the brace */,
                boxSizing: 'border-box',
                borderTopLeftRadius: '10px',
                borderBottomLeftRadius: '10px',
              },
            }}
          >
            <Endorsement endorsements={value} separator={key === 'and' ? andSeparator : orSeparator} />
          </Box>
        )
      case 'role_compute':
      case 'role_observer':
      case 'entity':
        return (
          <>
            {getEndorsementLabel(key)}
            {getValue(key, value)}
          </>
        )
    }
    exhaustedTypeWarning('Unknown endorsement', key)
  }
  return (
    <>
      {endorsements.map((endorsement: { [key: string]: any }, index: number) => {
        const key = Object.keys(endorsement)[0] as RoflAllowedEndorsementFields
        const value = endorsement[key]

        const renderedExplanation = getEndorsementExplanation(key, value)

        return endorsements.length !== 1 ? (
          <>
            {!!index && <span key={index}>{separator ?? orSeparator}</span>}
            <Box
              key={index}
              sx={{
                flex: 1,
                display: 'flex',
                alignItems: 'center',
                flexWrap: 'nowrap',
                overflowX: 'hidden',
                gap: 3,
              }}
            >
              {renderedExplanation}
            </Box>
          </>
        ) : (
          <>{renderedExplanation}</>
        )
      })}
    </>
  )
}
