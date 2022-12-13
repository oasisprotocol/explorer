import { Link } from 'react-router-dom'

export function HomePage() {
  return (
    <div>
      <h1>home</h1>
      <div><Link to="/blocks">blocks</Link></div>
    </div>
  )
}
