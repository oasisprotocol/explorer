import { Link } from 'react-router-dom'

export function HomePage() {
  return (
    <div>
      <h1>home</h1>
      <div>
        <Link to="/emerald/blocks">blocks</Link>
      </div>
      <div>
        <Link to="/emerald/dashboard">dashboard</Link>
      </div>
    </div>
  )
}
