import { FC } from 'react'
import { styled } from '@mui/material/styles'
import ImageNotSupportedIcon from '@mui/icons-material/ImageNotSupported'
import { hasValidProtocol } from '../../utils/url'
import { COLORS } from 'styles/theme/colors'
import { Circle } from '../Circle'
import { HighlightedText } from '../HighlightedText'
import Box from '@mui/material/Box'

const StyledImage = styled('img')({
  width: '28px',
  height: '28px',
  borderRadius: 5,
})

type ValidatorImageProps = {
  address: string
  name: string | undefined
  logotype: string | undefined
  highlightedPart?: string | undefined
}

export const ValidatorImage: FC<ValidatorImageProps> = ({ address, name, logotype, highlightedPart }) => {
  return (
    <>
      {logotype && hasValidProtocol(logotype) ? (
        <StyledImage alt={name || address} src={logotype} />
      ) : (
        <Circle color={COLORS.grayMedium2} size={5}>
          <ImageNotSupportedIcon sx={{ color: COLORS.grayMedium, fontSize: 18 }} />
        </Circle>
      )}
      {name ? (
        <Box sx={{ display: 'inline' }}>
          <HighlightedText text={name} pattern={highlightedPart} />
        </Box>
      ) : (
        address
      )}{' '}
    </>
  )
}
