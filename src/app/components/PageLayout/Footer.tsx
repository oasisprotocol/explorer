export function Footer() {
  return (
    <footer>
      {process.env.REACT_APP_BUILD_SHA}
      Oasis Protocol Foundation | 2022
    </footer>
  )
}
