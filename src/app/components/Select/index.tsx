import SelectUnstyled, { SelectProps, selectClasses, SelectRootSlotProps } from '@mui/base/Select'
import Option, { optionClasses } from '@mui/base/Option'
import Popper from '@mui/base/Popper'
import { styled } from '@mui/material/styles'
import Box from '@mui/material/Box'
import {
  ForwardedRef,
  forwardRef,
  memo,
  ReactElement,
  useCallback,
  useId,
  RefAttributes,
  MouseEvent,
  KeyboardEvent,
  FocusEvent,
} from 'react'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
import ExpandLessIcon from '@mui/icons-material/ExpandLess'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import { COLORS } from '../../../styles/theme/colors'
import { useTranslation } from 'react-i18next'

const StyledButton = styled(Button)(({ theme }) => ({
  height: '36px',
  minWidth: '135px',
  padding: `0 ${theme.spacing(4)}`,
  borderRadius: '36px',
  color: COLORS.white,
  textTransform: 'none',
  justifyContent: 'space-between',
  [`&.${selectClasses.focusVisible}`]: {
    backgroundColor: COLORS.brandExtraDark,
  },
}))

const StyledListbox = styled('ul')(({ theme }) => ({
  boxSizing: 'border-box',
  padding: theme.spacing(0),
  margin: `${theme.spacing(3)} ${theme.spacing(0)}`,
  minWidth: '135px',
  borderRadius: '12px',
  overflow: 'auto',
  outline: 0,
  background: theme.palette.tertiary.main,
  filter: 'drop-shadow(0px 4px 4px rgba(0, 0, 0, 0.25))',
}))

const StyledOption = styled(Option)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  boxSizing: 'border-box',
  listStyle: 'none',
  height: '36px',
  padding: `0 ${theme.spacing(4)}`,
  cursor: 'default',
  color: COLORS.white,
  [`&:hover:not(.${optionClasses.disabled})`]: {
    cursor: 'pointer',
  },
  [`&:hover:not(.${optionClasses.disabled}),
  &.${optionClasses.highlighted}`]: {
    backgroundColor: COLORS.brandExtraDark,
  },
  [`&.${optionClasses.disabled}`]: {
    backgroundColor: COLORS.lavenderGray,
  },
  [`&&.${optionClasses.selected}`]: {
    opacity: 0.5,
    backgroundColor: 'transparent',
  },
  transition: 'background-color 250ms cubic-bezier(0.4, 0, 0.2, 1) 0ms',
}))

const StyledPopper = styled(Popper)`
  z-index: 1;
`

const TertiaryButton = forwardRef(
  (
    { children, ownerState, ...restProps }: SelectRootSlotProps<object, false>,
    ref: ForwardedRef<HTMLButtonElement>,
  ) => {
    const { t } = useTranslation()

    return (
      <StyledButton {...restProps} ref={ref} color="tertiary">
        <Typography variant="select">{children ? children : t('select.placeholder')}</Typography>
        {ownerState.open ? <ExpandLessIcon /> : <ExpandMoreIcon />}
      </StyledButton>
    )
  },
)

const CustomSelect = forwardRef(function CustomSelect<TValue extends string | number>(
  props: SelectProps<TValue, false>,
  ref: ForwardedRef<HTMLButtonElement>,
) {
  const slots: SelectProps<TValue, false>['slots'] = {
    root: TertiaryButton,
    listbox: StyledListbox,
    popper: StyledPopper,
    ...props.slots,
  }

  return <SelectUnstyled {...props} ref={ref} slots={slots} />
}) as <TValue extends string | number>(
  props: SelectProps<TValue, false> & RefAttributes<HTMLButtonElement>,
) => JSX.Element

export interface SelectOptionBase {
  label: string | number
  value: string | number
}

interface SelectCmpProps<T extends SelectOptionBase> {
  label?: string
  options: T[]
  defaultValue?: T['value']
  handleChange?: (selectedOption: T['value'] | null) => void
}

const SelectCmp = <T extends SelectOptionBase>({
  label,
  options,
  defaultValue,
  handleChange,
}: SelectCmpProps<T>): ReactElement => {
  const selectId = useId()

  const onChange = useCallback(
    (_: MouseEvent | KeyboardEvent | FocusEvent | null, selectedValue: T['value'] | null) => {
      handleChange?.(selectedValue)
    },
    [handleChange],
  )

  return (
    <Box>
      {label && (
        <label htmlFor={selectId}>
          <Typography variant="body2">{label}</Typography>
        </label>
      )}
      <CustomSelect<T['value']> id={selectId} defaultValue={defaultValue} onChange={onChange}>
        {options.map(({ label, value }) => (
          <StyledOption key={value} value={value}>
            <Typography variant="select">{label}</Typography>
          </StyledOption>
        ))}
      </CustomSelect>
    </Box>
  )
}

export const Select = memo(SelectCmp) as typeof SelectCmp
