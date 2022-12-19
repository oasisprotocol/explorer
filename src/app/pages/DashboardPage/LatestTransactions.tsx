import { AppCard } from '../../components/AppCard/AppCard'
import { AppCardHeader } from '../../components/AppCardHeader/AppCardHeader'
import { AppCardContent } from '../../components/AppCardContent/AppCardContent'

export function LatestTransactions() {
  return (
    <AppCard>
      <AppCardHeader disableTypography component="h3" title="Latest Transactions" />
      <AppCardContent></AppCardContent>
    </AppCard>
  )
}
