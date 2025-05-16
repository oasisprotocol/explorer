import { FC } from 'react'
import { useTranslation } from 'react-i18next'
import Button from '@mui/material/Button'
import Tooltip from '@mui/material/Tooltip'
import Typography from '@mui/material/Typography'
import { styled } from '@mui/material/styles'
import { tooltipDelay } from '../../../styles/theme'
import { NodeDisplayType } from '../../../types/node-display-type'
import { useLocalSettings } from '../../hooks/useLocalSettings'

const StyledButton = styled(Button)(() => ({
  paddingLeft: '0px',
  paddingRight: '0px',
  minWidth: 'auto',
}))

export const TableHeaderNode: FC = () => {
  const { t } = useTranslation()
  const {
    settings: { nodeHeaderType },
    changeSetting,
  } = useLocalSettings()

  switch (nodeHeaderType) {
    case NodeDisplayType.Address: {
      return (
        <Tooltip title={t('rofl.nodeIdSwitch')} enterDelay={tooltipDelay} leaveDelay={0} placement={'top'}>
          <StyledButton variant="text" onClick={() => changeSetting('nodeHeaderType', NodeDisplayType.Id)}>
            <Typography
              sx={{
                fontWeight: 700,
              }}
            >
              {t('common.nodeAddress')}
            </Typography>
          </StyledButton>
        </Tooltip>
      )
    }
    case NodeDisplayType.Id:
    default:
      return (
        <Tooltip
          title={t('rofl.nodeAddressSwitch')}
          enterDelay={tooltipDelay}
          leaveDelay={0}
          placement={'top'}
        >
          <StyledButton
            variant="text"
            onClick={() => changeSetting('nodeHeaderType', NodeDisplayType.Address)}
          >
            <Typography
              sx={{
                fontWeight: 700,
              }}
            >
              {t('common.nodeId')}
            </Typography>
          </StyledButton>
        </Tooltip>
      )
  }
}
