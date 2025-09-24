import { FC } from 'react'
import { NodeDisplayType } from '../../../types/node-display-type'
import { SearchScope } from '../../../types/searchScope'
import { useScreenSize } from '../../hooks/useScreensize'
import { useLocalSettings } from '../../hooks/useLocalSettings'
import { getOasisAddressFromBase64PublicKey } from '../../utils/helpers'
import { trimLongString } from '../../utils/trimLongString'
import { AccountLink } from '../../components/Account/AccountLink'

type TableCellNodeProps = {
  id: string
  scope: SearchScope
}

export const TableCellNode: FC<TableCellNodeProps> = ({ id, scope }) => {
  const { isTablet } = useScreenSize()

  const {
    settings: { nodeHeaderType },
  } = useLocalSettings()

  if (nodeHeaderType === NodeDisplayType.Address) {
    return <AccountLink alwaysTrimOnTablet scope={scope} address={getOasisAddressFromBase64PublicKey(id)} />
  }

  return <span className="font-medium">{isTablet ? trimLongString(id) : id}</span>
}
