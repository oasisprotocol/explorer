import SelectUnstyled, { SelectProps, selectClasses, SelectRootSlotProps } from '@mui/base/Select'
import Option, { optionClasses } from '@mui/base/Option'
import Popper, { PopperPlacementType } from '@mui/base/Popper'
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
  ReactNode,
} from 'react'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
import ExpandLessIcon from '@mui/icons-material/ExpandLess'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import { COLORS } from '../../../styles/theme/colors'
import { useTranslation } from 'react-i18next'
import { WithOptionalOwnerState } from '@mui/base/utils'
import { SelectPopperSlotProps, SelectSlots } from '@mui/base/Select/Select.types'
import * as React from 'react'

export const StyledSelectButton = styled(Button)(({ theme }) => ({
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

export const StyledSelectListbox = styled('ul')(({ theme }) => ({
  boxSizing: 'border-box',
  padding: theme.spacing(0),
  margin: theme.spacing(3, 0),
  minWidth: '135px',
  borderRadius: '12px',
  overflow: 'auto',
  outline: 0,
  background: theme.palette.tertiary.main,
  filter: 'drop-shadow(0px 4px 4px rgba(0, 0, 0, 0.25))',
}))

export const StyledSelectOption = styled(Option)(({ theme }) => ({
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
      <StyledSelectButton {...restProps} ref={ref} color="tertiary">
        <Typography variant="select">{children ? children : t('select.placeholder')}</Typography>
        {ownerState.open ? <ExpandLessIcon /> : <ExpandMoreIcon />}
      </StyledSelectButton>
    )
  },
)

const CustomSelect = forwardRef(function CustomSelect<TValue extends string | number>(
  {
    root,
    listbox,
    popper,
    placement,
    ...restProps
  }: SelectProps<TValue, false> & SelectSlots<TValue, false> & Partial<SelectPopperSlotProps<TValue, false>>,
  ref: ForwardedRef<HTMLButtonElement>,
) {
  const slots: SelectProps<TValue, false>['slots'] = {
    root,
    listbox,
    popper,
    ...restProps.slots,
  }

  return (
    <SelectUnstyled
      {...restProps}
      ref={ref}
      slots={slots}
      slotProps={{
        popper: {
          placement,
        },
      }}
    />
  )
}) as <TValue extends string | number>(
  props: SelectProps<TValue, false> &
    SelectSlots<TValue, false> &
    Partial<SelectPopperSlotProps<TValue, false>> &
    RefAttributes<HTMLButtonElement>,
) => JSX.Element

export interface SelectOptionBase {
  label: string | number
  value: string | number
}

const SelectOption = <T extends SelectOptionBase>({ value, label }: T): ReactElement => (
  <StyledSelectOption key={value} value={value}>
    <Typography variant="select">{label}</Typography>
  </StyledSelectOption>
)

interface SelectCmpProps<T extends SelectOptionBase> {
  label?: ReactNode
  options: T[]
  defaultValue?: T['value']
  handleChange?: (selectedOption: T['value'] | null) => void
  placement?: PopperPlacementType
  className?: string
  root?: React.ElementType
  Option?: typeof SelectOption<T> | undefined
  listbox?: React.ElementType
  popper?: React.ComponentType<WithOptionalOwnerState<SelectPopperSlotProps<T['value'], false>>>
}

const SelectCmp = <T extends SelectOptionBase>({
  label,
  options,
  defaultValue,
  handleChange,
  placement = 'bottom-start',
  className,
  root = TertiaryButton,
  listbox = StyledSelectListbox,
  popper = StyledPopper,
  Option = SelectOption,
}: SelectCmpProps<T>): ReactElement => {
  const selectId = useId()

  const onChange = useCallback(
    (_: MouseEvent | KeyboardEvent | FocusEvent | null, selectedValue: T['value'] | null) => {
      handleChange?.(selectedValue)
    },
    [handleChange],
  )

  return (
    <Box className={className}>
      {label && <label htmlFor={selectId}>{label}</label>}
      <CustomSelect<T['value']>
        id={selectId}
        defaultValue={defaultValue}
        onChange={onChange}
        root={root}
        listbox={listbox}
        popper={popper}
        placement={placement}
      >
        {options.map((props: T) => (
          <Option key={props.value.toString()} {...props} />
        ))}
      </CustomSelect>
    </Box>
  )
}

export const Select = memo(SelectCmp) as typeof SelectCmp
