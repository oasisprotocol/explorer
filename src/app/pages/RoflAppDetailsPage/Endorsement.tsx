import { FC, Fragment, PropsWithChildren, ReactNode } from 'react'
import { Trans, useTranslation } from 'react-i18next'
import Box from '@mui/material/Box'
import { RoflAppPolicy } from '../../../oasis-nexus/api'
import { exhaustedTypeWarning } from '../../../types/errors'
import { AccountLink } from '../../components/Account/AccountLink'
import { useRuntimeScope } from '../../hooks/useScopeParam'
import { useScreenSize } from '../../hooks/useScreensize'
import { getOasisAddressFromBase64PublicKey } from '../../utils/helpers'

const StyledBox: FC<PropsWithChildren> = ({ children }) => {
  const { isTablet } = useScreenSize()
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
        overflowY: 'hidden',
        // Fix WithHighlighting clipping
        padding: '3px 0 1px 5px',
      }}
    >
      {children}
    </Box>
  )
}

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

type GroupOperator = 'and' | 'or'

type EndorsementProps = {
  endorsements: RoflAppPolicy['endorsements']
  groupOp: GroupOperator
}

export const Endorsement: FC<EndorsementProps> = ({ endorsements, groupOp }) => {
  const { t } = useTranslation()
  const scope = useRuntimeScope()

  const groupOpLabel: Record<GroupOperator, string> = {
    or: t('rofl.endorsementLabels.or'),
    and: t('rofl.endorsementLabels.and'),
  }

  if (!endorsements || endorsements.length === 0) {
    return <>{t('common.missing')}</>
  }

  // Nexus is not parsing ROFL app policy, but we can expect object to be similar to this:
  // https://github.com/oasisprotocol/oasis-sdk/blob/3f1f6f4aa4a7800b1c176fea3cbb2faaba915ddb/runtime-sdk/src/modules/rofl/policy.rs#L91

  const getEndorsementExplanation = (key: RoflAllowedEndorsementFields, value: any): ReactNode => {
    switch (key) {
      case 'any':
        return (
          <StyledBox>
            <Trans t={t} i18nKey="rofl.endorsementLabels.any" />
          </StyledBox>
        )
      case 'role_compute':
        return (
          <StyledBox>
            <Trans t={t} i18nKey="rofl.endorsementLabels.role_compute" />
          </StyledBox>
        )
      case 'role_observer':
        return (
          <StyledBox>
            <Trans t={t} i18nKey="rofl.endorsementLabels.role_observer" />
          </StyledBox>
        )
      case 'provider_instance_admin':
        return (
          <StyledBox>
            <Trans
              t={t}
              i18nKey="rofl.endorsementLabels.provider_instance_admin"
              components={{
                Address: <AccountLink scope={scope} address={value} alwaysAdapt />,
              }}
            />
          </StyledBox>
        )
      case 'provider':
        return (
          <StyledBox>
            <Trans
              t={t}
              i18nKey="rofl.endorsementLabels.provider"
              components={{
                Address: <AccountLink scope={scope} address={value} alwaysAdapt />,
              }}
            />
          </StyledBox>
        )
      case 'node':
        return (
          <StyledBox>
            <Trans
              t={t}
              i18nKey="rofl.endorsementLabels.node"
              components={{
                Address: (
                  <AccountLink
                    scope={scope}
                    address={getOasisAddressFromBase64PublicKey(value)}
                    alwaysAdapt
                  />
                ),
              }}
            />
          </StyledBox>
        )
      case 'entity':
        return (
          <StyledBox>
            <Trans
              t={t}
              i18nKey="rofl.endorsementLabels.entity"
              components={{
                Address: (
                  <AccountLink
                    scope={{ network: scope.network, layer: 'consensus' }}
                    address={getOasisAddressFromBase64PublicKey(value)}
                    alwaysAdapt
                  />
                ),
              }}
            />
          </StyledBox>
        )
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
              borderLeft: '1px solid #000' /* Vertical line of the brace */,
              borderTopLeftRadius: '10px',
              borderBottomLeftRadius: '10px',
            }}
          >
            <Endorsement endorsements={value} groupOp={key} />
          </Box>
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
          <Fragment key={index}>
            {!!index && (
              <span
                style={{
                  textWrap: 'nowrap',
                  fontWeight: 'bold',
                }}
              >
                {groupOpLabel[groupOp]}
              </span>
            )}
            <Box
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
          </Fragment>
        ) : (
          <Fragment key={index}>{renderedExplanation}</Fragment>
        )
      })}
    </>
  )
}
