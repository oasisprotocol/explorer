import { AppCard } from '../../components/AppCard/AppCard'
import { AppCardHeader } from '../../components/AppCardHeader/AppCardHeader'
import { AppCardContent } from '../../components/AppCardContent/AppCardContent'

export function AverageTransactionSize() {
  return (
    <AppCard>
      <AppCardHeader disableTypography component="h3" title="Average Transaction Size" />
      <AppCardContent></AppCardContent>
    </AppCard>
  )
}
