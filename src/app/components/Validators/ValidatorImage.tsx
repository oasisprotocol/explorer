import { FC } from 'react'
import { ImageOff } from 'lucide-react'
import { isUrlSafe } from '../../utils/url'
import { COLORS } from 'styles/theme/colors'

type ValidatorImageProps = {
  address: string
  name: string | undefined
  logotype: string | undefined
}

export const ValidatorImage: FC<ValidatorImageProps> = ({ address, name, logotype }) => {
  return (
    <>
      {logotype && isUrlSafe(logotype) ? (
        <img alt={name || address} src={logotype} className="w-7 h-7 rounded-md" />
      ) : (
        <div className="w-8 h-8 flex justify-center items-center text-inherit rounded-full bg-gray-200">
          <ImageOff color={COLORS.grayMedium} size={18} />
        </div>
      )}
    </>
  )
}
