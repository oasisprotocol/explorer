import { FC } from 'react'
import { useTranslation } from 'react-i18next'
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader'
import CardContent from '@mui/material/CardContent'
import { styled } from '@mui/material/styles'
import { Layer, Runtime } from '../../../oasis-nexus/api'
import { isNotOnHiddenLayer } from '../../../types/layers'
import { COLORS } from '../../../styles/theme/colors'
import { CardHeaderWithCounter } from '../../components/CardHeaderWithCounter'
import { RouteUtils } from '../../utils/route-utils'
import { SearchScope } from '../../../types/searchScope'
import { EnabledRuntimePreview, InactiveRuntimePreview } from './RuntimePreview'

const StyledBox = styled(Box)(({ theme }) => ({
  display: 'flex',
  [theme.breakpoints.up('md')]: {
    paddingRight: theme.spacing(4),
    paddingLeft: theme.spacing(4),
  },
  [theme.breakpoints.down('md')]: {
    flexDirection: 'column',
  },
  '> div:not(:last-child)': {
    [theme.breakpoints.down('md')]: {
      paddingBottom: theme.spacing(4),
      borderBottom: `1px solid ${COLORS.grayMediumLight}`,
    },
    [theme.breakpoints.up('md')]: {
      paddingRight: theme.spacing(5),
      marginRight: theme.spacing(5),
      borderRight: `1px solid ${COLORS.grayMediumLight}`,
    },
  },
}))

function shouldIncludeLayer(layer: Layer) {
  return layer !== Layer.consensus && isNotOnHiddenLayer({ layer })
}

type ParaTimesCardProps = { scope: SearchScope }

export const ParaTimesCard: FC<ParaTimesCardProps> = ({ scope }) => {
  const { t } = useTranslation()
  const { network } = scope
  const { enabled, disabled } = RouteUtils.getAllLayersForNetwork(network)
  const enabledOasisRuntimes = enabled.filter(shouldIncludeLayer) as Runtime[]
  const disabledOasisRuntimes = disabled.filter(shouldIncludeLayer) as Runtime[]
  const runtimesNumber = enabledOasisRuntimes.length + disabledOasisRuntimes.length

  return (
    <Card>
      <CardHeader
        disableTypography
        component="h3"
        title={
          <CardHeaderWithCounter
            label={t('paratimes.listTitle')}
            totalCount={runtimesNumber}
            isTotalCountClipped={false}
          />
        }
      />
      <CardContent>
        <StyledBox>
          {!!enabledOasisRuntimes.length &&
            enabledOasisRuntimes.map(runtime => (
              <EnabledRuntimePreview key={runtime} network={scope.network} runtime={runtime} />
            ))}
          {!!disabledOasisRuntimes.length &&
            disabledOasisRuntimes.map(runtime => (
              <InactiveRuntimePreview key={runtime} network={scope.network} runtime={runtime} />
            ))}
        </StyledBox>
      </CardContent>
    </Card>
  )
}
