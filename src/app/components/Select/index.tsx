import { Select as SelectUnstyled, SelectProps, selectClasses, SelectRootSlotProps } from '@mui/base/Select'
import { Option, optionClasses } from '@mui/base/Option'
import { styled } from '@mui/material/styles'
import Box from '@mui/material/Box'
import React, {
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
import { SelectPopupSlotProps, SelectSlots } from '@mui/base/Select/Select.types'
import { PopupProps } from '@mui/base/Unstable_Popup'
import { ButtonTypeMap } from '@mui/material/Button/Button'
import { ExtendButtonBase } from '@mui/material/ButtonBase'
import { Theme } from '@mui/material/styles/createTheme'

// Props that are not supposed to be passed to the DOM
const forbiddenProps = ['light', 'ownerState']

// Utility function for filtering out stuff that is now supposed to go to the DOM
const swallowReactProps = {
  shouldForwardProp: (prop: string) => !forbiddenProps.includes(prop),
}

export const StyledSelectButton = styled<ExtendButtonBase<ButtonTypeMap<{ light?: boolean }>>>(
  Button,
  swallowReactProps,
)(({ theme, light }) => ({
  height: '36px',
  minWidth: '135px',
  padding: `0 ${theme.spacing(4)}`,
  borderRadius: '36px',
  border: light ? '1px solid' : undefined,
  borderColor: light ? COLORS.grayMediumLight : undefined,
  color: light ? COLORS.grayDark : COLORS.white,
  backgroundColor: light ? `${COLORS.white} !important` : undefined,
  textTransform: 'none',
  justifyContent: 'space-between',
  [`&.${selectClasses.focusVisible}`]: {
    backgroundColor: light ? COLORS.white : COLORS.brandExtraDark,
  },
  span: {
    color: light ? COLORS.grayDark : undefined,
  },
}))

export const StyledSelectListbox = styled(
  'ul',
  swallowReactProps,
)(({ theme, light }: { theme: Theme; light?: boolean }) => ({
  boxSizing: 'border-box',
  padding: theme.spacing(0),
  margin: theme.spacing(3, 0),
  minWidth: '135px',
  borderRadius: '12px',
  overflow: 'auto',
  outline: 0,
  background: light ? COLORS.white : theme.palette.tertiary.main,
  filter: 'drop-shadow(0px 4px 4px rgba(0, 0, 0, 0.25))',
  maxHeight: '50vh',
}))

export const StyledSelectOption = styled(
  Option,
  swallowReactProps,
)(({ theme, light }: { theme: Theme; light?: boolean }) => ({
  display: 'flex',
  alignItems: 'center',
  boxSizing: 'border-box',
  listStyle: 'none',
  height: '36px',
  padding: `0 ${theme.spacing(4)}`,
  cursor: 'default',
  color: light ? COLORS.grayDark : COLORS.white,
  [`&:hover:not(.${optionClasses.disabled})`]: {
    cursor: 'pointer',
    backgroundColor: light ? COLORS.grayMediumLight : undefined,
  },
  [`&:hover:not(.${optionClasses.disabled}),
  &.${optionClasses.highlighted}`]: {
    backgroundColor: light ? COLORS.grayMediumLight : COLORS.brandExtraDark,
  },
  [`&.${optionClasses.disabled}`]: {
    backgroundColor: COLORS.lavenderGray,
  },
  [`&&.${optionClasses.selected}`]: {
    opacity: 0.5,
    backgroundColor: 'transparent',
  },
  transition: 'background-color 250ms cubic-bezier(0.4, 0, 0.2, 1) 0ms',
  span: {
    color: light ? COLORS.grayDark : undefined,
  },
}))

const StyledPopup = styled('div')`
  z-index: 1;
`

const TertiaryButton = forwardRef(
  (
    { children, ownerState, light, ...restProps }: SelectRootSlotProps<object, false> & { light: boolean },
    ref: ForwardedRef<HTMLButtonElement>,
  ) => {
    const { t } = useTranslation()

    return (
      <StyledSelectButton {...restProps} ref={ref} color="tertiary" light={light}>
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
    popup,
    placement,
    ...restProps
  }: SelectProps<TValue, false> & SelectSlots & Partial<SelectPopupSlotProps<TValue, false>>,
  ref: ForwardedRef<HTMLButtonElement>,
) {
  const { slotProps = {} } = restProps
  const slots: SelectProps<TValue, false>['slots'] = {
    root,
    listbox,
    popup,
    ...restProps.slots,
  }

  return (
    <SelectUnstyled
      {...restProps}
      ref={ref}
      slots={slots}
      slotProps={{
        ...slotProps,
        popup: {
          placement,
        },
      }}
    />
  )
}) as <TValue extends string | number>(
  props: SelectProps<TValue, false> &
    SelectSlots &
    Partial<SelectPopupSlotProps<TValue, false>> &
    RefAttributes<HTMLButtonElement>,
) => JSX.Element

export interface SelectOptionBase {
  label: string | number
  value: string | number
}

const SelectOption = <T extends SelectOptionBase>({
  value,
  label,
  light,
}: T & { light: boolean }): ReactElement => (
  <StyledSelectOption key={value} value={value} light={light}>
    <Typography variant="select">{label}</Typography>
  </StyledSelectOption>
)

interface SelectCmpProps<T extends SelectOptionBase> {
  label?: ReactNode
  options: T[]
  /**
   * If you want to use this component in uncontrolled mode, you can provide the detauls / initial value here.
   */
  defaultValue?: T['value']

  /**
   * You can provide a value if you want to use this component in controlled mode
   */
  value?: T['value'] | null
  handleChange?: (selectedOption: T['value'] | null) => void
  placement?: PopupProps['placement']
  className?: string
  root?: React.ElementType
  light?: boolean | undefined
  Option?: typeof SelectOption<T> | undefined
  listbox?: React.ElementType
  popup?: React.ComponentType<WithOptionalOwnerState<SelectPopupSlotProps<T['value'], false>>>
}

const SelectCmp = <T extends SelectOptionBase>({
  label,
  options,
  defaultValue,
  value,
  handleChange,
  placement = 'bottom-start',
  className,
  light = false,
  root = TertiaryButton,
  listbox = StyledSelectListbox,
  popup = StyledPopup,
  Option = SelectOption,
}: SelectCmpProps<T>): ReactElement => {
  const selectId = useId()

  const onChange = useCallback(
    (_: MouseEvent | KeyboardEvent | FocusEvent | null, selectedValue: T['value'] | null) => {
      handleChange?.(selectedValue)
    },
    [handleChange],
  )

  const withLight = { light }

  return (
    <Box className={className}>
      {label && <label htmlFor={selectId}>{label}</label>}
      <CustomSelect<T['value']>
        id={selectId}
        defaultValue={defaultValue}
        {...(value === undefined || value === null ? {} : { value })}
        onChange={onChange}
        root={root}
        listbox={listbox}
        popup={popup}
        placement={placement}
        slotProps={{
          root: withLight,
          listbox: withLight,
        }}
      >
        {options.map((props: T) => (
          <Option key={props.value.toString()} {...props} light={light} />
        ))}
      </CustomSelect>
    </Box>
  )
}

export const Select = memo(SelectCmp) as typeof SelectCmp
