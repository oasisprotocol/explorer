import { FC } from 'react'
import Box from '@mui/material/Box'
import { styled } from '@mui/material/styles'
import ImageNotSupportedIcon from '@mui/icons-material/ImageNotSupported'
import { hasValidProtocol } from '../../utils/url'
import { COLORS } from 'styles/theme/colors'
import { Circle } from '../Circle'

const StyledImage = styled('img')({
  width: '28px',
  height: '28px',
  borderRadius: 5,
})

type ValidatorImageProps = {
  address: string
  name: string | undefined
  logotype: string | undefined
}

export const ValidatorImage: FC<ValidatorImageProps> = ({ address, name, logotype }) => {
  return (
    <Box sx={{ display: 'flex', alignItems: 'center' }} gap={3}>
      {logotype && hasValidProtocol(logotype) ? (
        <StyledImage alt={name || address} src={logotype} />
      ) : (
        <Circle color={COLORS.grayMedium2} size={5}>
          <ImageNotSupportedIcon sx={{ color: COLORS.grayMedium, fontSize: 18 }} />
        </Circle>
      )}
      {name || address}
    </Box>
  )
}