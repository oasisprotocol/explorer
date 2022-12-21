import { FC } from 'react'
import { Link } from 'react-router-dom'

export const HomePage: FC = () => (
  <div>
    <h1>home</h1>
    <div>
      <Link to="/emerald/blocks">blocks</Link>
    </div>
    <div>
      <Link to="/emerald">dashboard</Link>
    </div>
  </div>
)
