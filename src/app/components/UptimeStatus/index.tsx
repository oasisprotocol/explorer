import { FC } from 'react'
import Box from '@mui/material/Box'
import { styled } from '@mui/material/styles'
import { COLORS } from '../../../styles/theme/colors'
import { PercentageValue } from '../PercentageValue'

const getUptimeItemColor = (value: number | undefined) => {
  if (!value) {
    return COLORS.grayMediumLight
  }

  if (value > 90) {
    return COLORS.eucalyptus
  }

  return COLORS.errorIndicatorBackground
}

type UptimeItem = {
  small?: boolean
  value?: number
}

const StyledBox = styled(Box)<UptimeItem>(({ small, value }) => ({
  background: getUptimeItemColor(value),
  width: small ? '3px' : '7px',
  minWidth: small ? '3px' : '7px',
  height: small ? '15px' : '45px',
  borderRadius: small ? '2px' : '4px',
  color: COLORS.white,
  marginRight: small ? 1 : 2,
}))

export const ensureTwelveElements = (inputArray: number[] = []) => {
  return [...inputArray, ...new Array(12).fill(undefined)].slice(0, 12)
}

type UptimeStatusProps = {
  percentage?: number
  small?: boolean
  status?: number[]
}

export const UptimeStatus: FC<UptimeStatusProps> = ({ percentage, status, small }) => {
  const adjustedStatus = ensureTwelveElements(status)

  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: small ? 4 : 5 }}>
      <Box sx={{ display: 'flex' }}>
        {adjustedStatus?.map((value, index) => (
          <StyledBox small={small} key={`${value}-${index}`} value={value} />
        ))}
      </Box>
      {percentage && (
        <Box>
          <PercentageValue value={percentage} />
        </Box>
      )}
    </Box>
  )
}
