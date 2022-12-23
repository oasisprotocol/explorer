import { FC } from 'react'
import { Link } from 'react-router-dom'
import Typography from '@mui/material/Typography'
import { COLORS } from '../../../styles/theme/colors'

export const HomePage: FC = () => (
  <div>
    <Typography variant="h1" color={COLORS.white}>
      home
    </Typography>
    <div>
      <Link to="/emerald/blocks">blocks</Link>
    </div>
    <div>
      <Link to="/emerald">dashboard</Link>
    </div>
  </div>
)
