import { FC } from 'react'
import Typography from '@mui/material/Typography'
import { NodeDisplayType } from '../../../types/node-display-type'
import { useScreenSize } from '../../hooks/useScreensize'
import { useLocalSettings } from '../../hooks/useLocalSettings'
import { getOasisAddressFromBase64PublicKey } from '../../utils/helpers'
import { trimLongString } from '../../utils/trimLongString'

export const TableCellNode: FC<{ id: string }> = ({ id }) => {
  const { isTablet } = useScreenSize()

  const {
    settings: { nodeHeaderType },
  } = useLocalSettings()

  const value = nodeHeaderType === NodeDisplayType.Address ? getOasisAddressFromBase64PublicKey(id) : id

  return <Typography variant="mono">{isTablet ? trimLongString(value) : value}</Typography>
}
