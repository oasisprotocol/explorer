import { useLocation } from 'react-router-dom'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import { styled } from '@mui/material/styles'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import blockchainImage from './images/blockchain.svg'
import { emeraldRoute } from '../../../routes'

const StyledCircle = styled(Box)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  width: theme.spacing(6),
  minWidth: theme.spacing(6),
  height: theme.spacing(6),
  backgroundColor: '#fff',
  borderRadius: theme.spacing(5),
  marginRight: theme.spacing(4),
}))

const getLabel = (pathname: string) => {
  if (pathname.startsWith(emeraldRoute)) {
    return 'Emerald'
  }
}

export function NetworkHeader() {
  const { pathname } = useLocation()
  const label = getLabel(pathname)

  return (
    <Box sx={{ display: 'flex' }}>
      <StyledCircle>
        <img src={blockchainImage} alt={label} />
      </StyledCircle>
      <Box>
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
          }}
        >
          <Typography variant="h2" sx={{ pr: 4 }}>
            {label}
          </Typography>

          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
            }}
          >
            <Typography sx={{ fontSize: 10, color: '#8f8cdf', mr: 3 }} component="span">
              ParaTime Online
            </Typography>
            <CheckCircleIcon color="success" sx={{ fontSize: 16 }} />
          </Box>
        </Box>
        <Typography sx={{ fontSize: 11, color: '#fff' }}>
          The official confidential EVM Compatible ParaTime providing a smart contract development
          environment.
        </Typography>
      </Box>
    </Box>
  )
}
