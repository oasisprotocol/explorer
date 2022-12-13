import { ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { Footer } from './Footer'
import logotype from '../../../../public/logo192.png'

export function ResultPageLayout({ children }: { children: ReactNode }) {
  return (
    <div>
      <header>
        <Link to="/">
          <img src={logotype} alt="Logo" height={40} width={40} />
          Oasis Blockchain Explorer
        </Link>

        <div>
          paratime selection
          <input placeholder='Search'></input>
        </div>
      </header>
      <hr />

      <main>{children}</main>

      <Footer></Footer>
    </div>
  )
}
