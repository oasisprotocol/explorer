import { FC } from 'react'
import { useTranslation } from 'react-i18next'
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader'
import CardContent from '@mui/material/CardContent'
import Grid from '@mui/material/Unstable_Grid2'
import { styled } from '@mui/material/styles'
import { Layer, Runtime } from '../../../oasis-nexus/api'
import { CardHeaderWithCounter } from '../../components/CardHeaderWithCounter'
import { isNotOnHiddenLayer, RouteUtils } from '../../utils/route-utils'
import { SearchScope } from '../../../types/searchScope'
import { EnabledRuntimePreview, DisabledRuntimePreview } from './RuntimePreview'

function shouldIncludeLayer(layer: Layer) {
  return layer !== Layer.consensus && isNotOnHiddenLayer({ layer })
}

const StyledInnerGrid = styled(Grid)(({ theme }) => ({
  [theme.breakpoints.down('md')]: {
    paddingTop: 0,
  },
}))

const StyledBox = styled(Box)(({ theme }) => ({
  display: 'flex',
  [theme.breakpoints.down('md')]: {
    flexDirection: 'column',
    gap: theme.spacing(4),
  },
  [theme.breakpoints.up('md')]: {
    flexDirection: 'row',
    gap: theme.spacing(5),
  },
}))

type ParaTimesCardProps = { scope: SearchScope }

export const ParaTimesCard: FC<ParaTimesCardProps> = ({ scope }) => {
  const { t } = useTranslation()
  const { network } = scope
  const { enabled, disabled } = RouteUtils.getAllLayersForNetwork(network)
  const enabledRuntimes = enabled.filter(shouldIncludeLayer) as Runtime[]
  const disabledRuntimes = disabled.filter(shouldIncludeLayer) as Runtime[]
  const runtimesNumber = enabledRuntimes.length + disabledRuntimes.length
  const [firstEnabledRuntime, ...restEnabledRuntimes] = enabledRuntimes
  const spaceForSecondaryParaTimes = enabledRuntimes.length > 2

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
        <Grid container spacing={5}>
          <Grid xs={12} md={spaceForSecondaryParaTimes ? 5 : 6}>
            <EnabledRuntimePreview prominentItem network={scope.network} runtime={firstEnabledRuntime} />
          </Grid>
          <Grid xs={12} md={spaceForSecondaryParaTimes ? 7 : 6} container>
            <StyledInnerGrid xs={12} md={spaceForSecondaryParaTimes ? 9 : 8}>
              <StyledBox>
                {!!restEnabledRuntimes.length &&
                  restEnabledRuntimes.map(runtime => (
                    <EnabledRuntimePreview key={runtime} network={scope.network} runtime={runtime} />
                  ))}
              </StyledBox>
            </StyledInnerGrid>
            <StyledInnerGrid xs={12} md={spaceForSecondaryParaTimes ? 3 : 4}>
              {!!disabledRuntimes.length &&
                disabledRuntimes.map(runtime => <DisabledRuntimePreview key={runtime} runtime={runtime} />)}
            </StyledInnerGrid>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  )
}
