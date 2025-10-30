import { FC } from 'react'
import { styled } from '@mui/material/styles'
import ImageNotSupportedIcon from '@mui/icons-material/ImageNotSupported'
import { isUrlSafe } from '../../utils/url'
import { COLORS } from 'styles/theme/colors'

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
    <>
      {logotype && isUrlSafe(logotype) ? (
        <StyledImage alt={name || address} src={logotype} />
      ) : (
        <div className="w-8 h-8 flex justify-center items-center text-inherit rounded-full bg-gray-200">
          <ImageNotSupportedIcon sx={{ color: COLORS.grayMedium, fontSize: 18 }} />
        </div>
      )}
    </>
  )
}
