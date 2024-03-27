import { FC } from 'react'
// import { Link as RouterLink } from 'react-router-dom'
// import Link from '@mui/material/Link'
// import { useTheme } from '@mui/material/styles'

/**
 * This is extension point that can be used by 3rd parties to add custom links to the footer of the app
 */
export const CustomFooter: FC<{ tablet?: boolean }> = () => null

// export const CustomFooter: FC<{ tablet?: boolean }> = ({ tablet }) => {
//   const theme = useTheme()
//   return (
//     <>
//       {tablet && <span>| </span>}
//       <Link component={RouterLink} to={'/custom'} sx={{ color: theme.palette.layout.main }}>
//         Custom
//       </Link>
//     </>
//   )
// }
