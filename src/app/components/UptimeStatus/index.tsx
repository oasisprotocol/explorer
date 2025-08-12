import { FC } from 'react'
import { useTranslation } from 'react-i18next'
import { COLORS } from '../../../styles/theme/colors'
import { PercentageValue } from '../PercentageValue'
import { cn } from '@oasisprotocol/ui-library/src/lib/utils'
import { ValidatorUptime } from 'oasis-nexus/api'

const getUptimeItemColor = (value: number | undefined) => {
  if (typeof value !== 'number') {
    return COLORS.grayMediumLight
  }

  if (value > 900) {
    // 900 out of 1200 (segment_length), which is 75% availability
    return COLORS.eucalyptus
  }

  return COLORS.errorIndicatorBackground
}

export const ensureTwelveElements = (inputArray: number[] = []) => {
  return [...inputArray, ...new Array(12).fill(undefined)].slice(0, 12)
}

type UptimeStatusProps = {
  small?: boolean
  uptime?: ValidatorUptime
}

export const UptimeStatus: FC<UptimeStatusProps> = ({ uptime, small }) => {
  const { t } = useTranslation()

  if (!uptime?.segment_uptimes) {
    return <>{t('common.missing')}</>
  }

  const adjustedStatus = ensureTwelveElements(uptime?.segment_uptimes)

  return (
    <div className={cn('flex items-center gap-4 justify-between', small && 'w-[110px]')}>
      <div className="flex items-end">
        {adjustedStatus?.reverse().map((value, index) => (
          <div
            key={`${value}-${index}`}
            className={cn(
              'inline-block',
              small
                ? 'w-[3px] min-w-[3px] h-[15px] rounded-[2px] mr-[1px]'
                : 'w-[7px] min-w-[7px] rounded-[4px] mr-[2px]',
            )}
            style={{
              backgroundColor: getUptimeItemColor(value),
              color: COLORS.white,
              height: `${Math.round((value * 45) / 1200)}px`,
            }}
          />
        ))}
      </div>
      {uptime?.window_uptime && uptime?.window_length && (
        <PercentageValue
          value={(uptime.window_uptime / uptime.window_length) * 100}
          maximumFractionDigits={1}
        />
      )}
    </div>
  )
}
