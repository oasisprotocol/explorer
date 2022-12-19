import { AppCard } from '../../components/AppCard/AppCard'
import { AppCardHeader } from '../../components/AppCardHeader/AppCardHeader'
import { AppCardContent } from '../../components/AppCardContent/AppCardContent'

export function TransactionsPerSecond() {
  return (
    <AppCard>
      <AppCardHeader disableTypography component="h3" title="Transactions Per Second" />
      <AppCardContent></AppCardContent>
    </AppCard>
  )
}
