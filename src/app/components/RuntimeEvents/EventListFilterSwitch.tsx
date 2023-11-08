import { FC } from 'react'
import Chip from '@mui/material/Chip'
import CheckIcon from '@mui/icons-material/Check'
import { useTranslation } from 'react-i18next'
import { COLORS } from '../../../styles/theme/colors'
import { TFunction } from 'i18next'
import Box from '@mui/material/Box'

export const EventFilterMode = {
  All: 'all',
  NonTX: 'nonTX',
} as const

const eventFilterModes: EventFilterMode[] = [EventFilterMode.All, EventFilterMode.NonTX]

const getEventFilterModeName = (t: TFunction, mode: EventFilterMode): string => {
  switch (mode) {
    case 'all':
      return t('runtimeEvent.filter.all')
    case 'nonTX':
      return t('runtimeEvent.filter.nonTx')
  }
}

const Pill: FC<{ label: string; selected: boolean; onSelect: () => void }> = ({
  label,
  selected,
  onSelect,
}) => {
  return (
    <Chip
      icon={selected ? <CheckIcon htmlColor={'#FFFFFF'} /> : undefined}
      label={label}
      onClick={onSelect}
      sx={{
        display: 'flex',
        height: 30,
        padding: '3px 10px',
        alignItems: 'center',
        borderRadius: 9,
        border: `1px solid ${COLORS.brandMedium}`,
        background: selected ? COLORS.brandMedium : COLORS.brandLightBlue,
        color: selected ? 'white' : 'black',
      }}
    />
  )
}

// eslint-disable-next-line @typescript-eslint/no-redeclare
export type EventFilterMode = (typeof EventFilterMode)[keyof typeof EventFilterMode]

type EventFilterSwitchProps = {
  selected?: EventFilterMode
  onSelectionChange: (selection: EventFilterMode) => void
}

export const EventFilterSwitch: FC<EventFilterSwitchProps> = ({ selected, onSelectionChange }) => {
  const { t } = useTranslation()
  return (
    <Box sx={{ display: 'flex', gap: 3 }}>
      {eventFilterModes.map(mode => (
        <Pill
          key={mode}
          label={getEventFilterModeName(t, mode)}
          selected={selected === mode}
          onSelect={() => onSelectionChange(mode)}
        />
      ))}
    </Box>
  )
}
