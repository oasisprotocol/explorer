import { FC } from 'react'
import Box from '@mui/material/Box'
import { styled } from '@mui/material/styles'
import { hasValidProtocol } from '../../utils/url'

const StyledImage = styled('img')({
  width: '28px',
  height: '28px',
  borderRadius: 5,
  marginRight: 15,
})

type ValidatorImageProps = {
  address: string
  name: string | undefined
  logotype: string | undefined
}

export const ValidatorImage: FC<ValidatorImageProps> = ({ address, name, logotype }) => {
  return (
    <Box sx={{ display: 'flex', alignItems: 'center' }}>
      {logotype && hasValidProtocol(logotype) && <StyledImage alt={name || address} src={logotype} />}
      {name || address}
    </Box>
  )
}
