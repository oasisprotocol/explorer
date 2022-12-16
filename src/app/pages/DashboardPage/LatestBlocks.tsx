import { Link as RouterLink } from 'react-router-dom'
import Card from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader'
import CardContent from '@mui/material/CardContent'
import Link from '@mui/material/Link'

export function LatestBlocks() {
  return (
    <Card>
      <CardHeader
        disableTypography
        component="h3"
        title="Latest Blocks"
        action={
          <Link component={RouterLink} to="blocks">
            View all
          </Link>
        }
      />
      <CardContent></CardContent>
    </Card>
  )
}
