import { FC } from 'react'
import { useTranslation } from 'react-i18next'
import { NodeDisplayType } from '../../../types/node-display-type'
import { exhaustedTypeWarning } from '../../../types/errors'
import { useLocalSettings } from '../../hooks/useLocalSettings'
import { TableHeaderToggle } from '../TableHeaderToggle'

export const TableHeaderNode: FC = () => {
  const { t } = useTranslation()
  const {
    settings: { nodeHeaderType },
    changeSetting,
  } = useLocalSettings()

  switch (nodeHeaderType) {
    case NodeDisplayType.Address: {
      return (
        <TableHeaderToggle
          label={t('common.nodeAddress')}
          onClick={() => changeSetting('nodeHeaderType', NodeDisplayType.Id)}
          tooltipTitle={t('rofl.nodeIdSwitch')}
        />
      )
    }
    case NodeDisplayType.Id:
      return (
        <TableHeaderToggle
          label={t('common.nodeId')}
          onClick={() => changeSetting('nodeHeaderType', NodeDisplayType.Address)}
          tooltipTitle={t('rofl.nodeAddressSwitch')}
        />
      )
    default:
      exhaustedTypeWarning('Unknown node display type', nodeHeaderType)
      return null
  }
}
