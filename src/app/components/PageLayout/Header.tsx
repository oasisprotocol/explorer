import { Logotype } from './Logotype'
import { NetworkHeader } from './NetworkHeader'
import { AppGrid2 } from '../AppGrid2/AppGrid2'

export function Header() {
  return (
    <header>
      <AppGrid2 container sx={{ px: 6, pb: 5 }}>
        <AppGrid2 xs={12} sx={{ pb: '50px' }}>
          <Logotype />
        </AppGrid2>
        <AppGrid2 xs={4}>
          <NetworkHeader />
        </AppGrid2>
        <AppGrid2 xs={8}>{/* Search Placeholder */}</AppGrid2>
      </AppGrid2>
    </header>
  )
}
