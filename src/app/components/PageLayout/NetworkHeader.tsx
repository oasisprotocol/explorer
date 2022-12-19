import { useLocation } from 'react-router-dom'
import { styled } from '@mui/material/styles'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import blockchainImage from './images/blockchain.svg'
import { emeraldRoute } from '../../../routes'
import { AppTypography } from '../AppTypography/AppTypography'
import { AppBox } from '../AppBox/AppBox'

const StyledCircle = styled(AppBox)(({ theme }) => ({
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
    <AppBox sx={{ display: 'flex' }}>
      <StyledCircle>
        <img src={blockchainImage} alt={label} />
      </StyledCircle>
      <AppBox>
        <AppBox
          sx={{
            display: 'flex',
            alignItems: 'center',
          }}
        >
          <AppTypography variant="h2" sx={{ pr: 4 }}>
            {label}
          </AppTypography>

          <AppBox
            sx={{
              display: 'flex',
              alignItems: 'center',
            }}
          >
            <AppTypography sx={{ fontSize: 10, color: '#8f8cdf', mr: 3 }} component="span">
              ParaTime Online
            </AppTypography>
            <CheckCircleIcon color="success" sx={{ fontSize: 16 }} />
          </AppBox>
        </AppBox>
        <AppTypography sx={{ fontSize: 11, color: '#fff' }}>
          The official confidential EVM Compatible ParaTime providing a smart contract development
          environment.
        </AppTypography>
      </AppBox>
    </AppBox>
  )
}
