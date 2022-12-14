import { Link } from 'react-router-dom'
import logotype from '../../../../public/logo192.png'

export function Header() {
  return (
    <header>
      <Link to="/">
        <img src={logotype} alt="Logo" height={40} width={40} />
        Oasis Blockchain Explorer
      </Link>

      <div>
        paratime selection
        <input placeholder="Search"></input>
      </div>
      <hr />
    </header>
  )
}
