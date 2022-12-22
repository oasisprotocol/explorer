import * as React from 'react'
import SelectUnstyled, { SelectUnstyledProps, selectUnstyledClasses } from '@mui/base/SelectUnstyled'
import OptionUnstyled, { optionUnstyledClasses } from '@mui/base/OptionUnstyled'
import PopperUnstyled from '@mui/base/PopperUnstyled'
import { styled, Box } from '@mui/system'
import { ForwardedRef, forwardRef, memo, ReactElement, useId } from 'react'
import Typography from '@mui/material/Typography'
import { Button } from '@mui/material'
import { SlotComponentProps } from '@mui/base/utils'
import {
  SelectUnstyledComponentsPropsOverrides,
  SelectUnstyledOwnerState,
} from '@mui/base/SelectUnstyled/SelectUnstyled.types'
import { COLORS } from '../../../styles/theme/colors'

const StyledButton = styled(Button)(({ theme }) => ({
  height: '36px',
  minWidth: '135px',
  padding: `${theme.spacing(4)} ${theme.spacing(4)}`,
  borderRadius: '12px',
  color: COLORS.white,
  textTransform: 'none',
  justifyContent: 'space-between',
  [`&.${selectUnstyledClasses.focusVisible}`]: {
    backgroundColor: COLORS.brandExtraDark,
  },
  [`&.${selectUnstyledClasses.expanded}`]: {
    '&::after': {
      content:
        'url("data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjYiIGhlaWdodD0iMjYiIHZpZXdCb3g9IjAgMCAyNiAyNiIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZmlsbC1ydWxlPSJldmVub2RkIiBjbGlwLXJ1bGU9ImV2ZW5vZGQiIGQ9Ik0xMy43NjU5IDEwLjA3ODRMMTguNzQxNiAxNS4wNTRDMTkuMTYwNCAxNS40NzI4IDE5LjE2MDQgMTYuMTUxOCAxOC43NDE2IDE2LjU3MDdDMTguMzIyNyAxNi45ODk1IDE3LjY0MzcgMTYuOTg5NSAxNy4yMjQ5IDE2LjU3MDdMMTIuOTk5OSAxMi4zNDU3TDguNzc0ODkgMTYuNTcwN0M4LjM1NjA3IDE2Ljk4OTUgNy42NzcwNCAxNi45ODk1IDcuMjU4MjIgMTYuNTcwN0M2LjgzOTQgMTYuMTUxOCA2LjgzOTQgMTUuNDcyOCA3LjI1ODIyIDE1LjA1NEwxMi4yMzM5IDEwLjA3ODRDMTIuNjU2OSA5LjY1NTI5IDEzLjM0MjkgOS42NTUyOSAxMy43NjU5IDEwLjA3ODRaIiBmaWxsPSJ3aGl0ZSIvPgo8bWFzayBpZD0ibWFzazBfMTM2OV81NDIxNiIgc3R5bGU9Im1hc2stdHlwZTphbHBoYSIgbWFza1VuaXRzPSJ1c2VyU3BhY2VPblVzZSIgeD0iNiIgeT0iOSIgd2lkdGg9IjE0IiBoZWlnaHQ9IjgiPgo8cGF0aCBmaWxsLXJ1bGU9ImV2ZW5vZGQiIGNsaXAtcnVsZT0iZXZlbm9kZCIgZD0iTTEzLjc2NTkgMTAuMDc4NEwxOC43NDE2IDE1LjA1NEMxOS4xNjA0IDE1LjQ3MjggMTkuMTYwNCAxNi4xNTE4IDE4Ljc0MTYgMTYuNTcwN0MxOC4zMjI3IDE2Ljk4OTUgMTcuNjQzNyAxNi45ODk1IDE3LjIyNDkgMTYuNTcwN0wxMi45OTk5IDEyLjM0NTdMOC43NzQ4OSAxNi41NzA3QzguMzU2MDcgMTYuOTg5NSA3LjY3NzA0IDE2Ljk4OTUgNy4yNTgyMiAxNi41NzA3QzYuODM5NCAxNi4xNTE4IDYuODM5NCAxNS40NzI4IDcuMjU4MjIgMTUuMDU0TDEyLjIzMzkgMTAuMDc4NEMxMi42NTY5IDkuNjU1MjkgMTMuMzQyOSA5LjY1NTI5IDEzLjc2NTkgMTAuMDc4NFoiIGZpbGw9IndoaXRlIi8+CjwvbWFzaz4KPGcgbWFzaz0idXJsKCNtYXNrMF8xMzY5XzU0MjE2KSI+CjxwYXRoIGZpbGwtcnVsZT0iZXZlbm9kZCIgY2xpcC1ydWxlPSJldmVub2RkIiBkPSJNMjYgMEwwIDBMMCAyNkwyNiAyNkwyNiAwWiIgZmlsbD0id2hpdGUiLz4KPC9nPgo8L3N2Zz4K")',
    },
  },
  '&::after': {
    position: 'absolute',
    right: theme.spacing(3),
    top: 'calc(50% + 3px)',
    transform: 'translateY(-50%)',
    content:
      'url("data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjYiIGhlaWdodD0iMjYiIHZpZXdCb3g9IjAgMCAyNiAyNiIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZmlsbC1ydWxlPSJldmVub2RkIiBjbGlwLXJ1bGU9ImV2ZW5vZGQiIGQ9Ik0xMi4yMzQxIDE1LjkyMTZMNy4yNTg0NSAxMC45NDZDNi44Mzk2MyAxMC41MjcyIDYuODM5NjMgOS44NDgxNiA3LjI1ODQ1IDkuNDI5MzVDNy42NzcyNiA5LjAxMDUzIDguMzU2MyA5LjAxMDUzIDguNzc1MTEgOS40MjkzNUwxMy4wMDAxIDEzLjY1NDNMMTcuMjI1MSA5LjQyOTM1QzE3LjY0MzkgOS4wMTA1MyAxOC4zMjMgOS4wMTA1MyAxOC43NDE4IDkuNDI5MzVDMTkuMTYwNiA5Ljg0ODE2IDE5LjE2MDYgMTAuNTI3MiAxOC43NDE4IDEwLjk0NkwxMy43NjYxIDE1LjkyMTZDMTMuMzQzMSAxNi4zNDQ3IDEyLjY1NzEgMTYuMzQ0NyAxMi4yMzQxIDE1LjkyMTZWMTUuOTIxNloiIGZpbGw9IndoaXRlIi8+CjxtYXNrIGlkPSJtYXNrMF8xMzY5XzU0MjEyIiBzdHlsZT0ibWFzay10eXBlOmFscGhhIiBtYXNrVW5pdHM9InVzZXJTcGFjZU9uVXNlIiB4PSI2IiB5PSI5IiB3aWR0aD0iMTQiIGhlaWdodD0iOCI+CjxwYXRoIGZpbGwtcnVsZT0iZXZlbm9kZCIgY2xpcC1ydWxlPSJldmVub2RkIiBkPSJNMTIuMjM0MSAxNS45MjE2TDcuMjU4NDUgMTAuOTQ2QzYuODM5NjMgMTAuNTI3MiA2LjgzOTYzIDkuODQ4MTYgNy4yNTg0NSA5LjQyOTM1QzcuNjc3MjYgOS4wMTA1MyA4LjM1NjMgOS4wMTA1MyA4Ljc3NTExIDkuNDI5MzVMMTMuMDAwMSAxMy42NTQzTDE3LjIyNTEgOS40MjkzNUMxNy42NDM5IDkuMDEwNTMgMTguMzIzIDkuMDEwNTMgMTguNzQxOCA5LjQyOTM1QzE5LjE2MDYgOS44NDgxNiAxOS4xNjA2IDEwLjUyNzIgMTguNzQxOCAxMC45NDZMMTMuNzY2MSAxNS45MjE2QzEzLjM0MzEgMTYuMzQ0NyAxMi42NTcxIDE2LjM0NDcgMTIuMjM0MSAxNS45MjE2VjE1LjkyMTZaIiBmaWxsPSJ3aGl0ZSIvPgo8L21hc2s+CjxnIG1hc2s9InVybCgjbWFzazBfMTM2OV81NDIxMikiPgo8cGF0aCBmaWxsLXJ1bGU9ImV2ZW5vZGQiIGNsaXAtcnVsZT0iZXZlbm9kZCIgZD0iTTAgMjZIMjZWMEgwVjI2WiIgZmlsbD0id2hpdGUiLz4KPC9nPgo8L3N2Zz4K")',
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

const StyledOption = styled(OptionUnstyled)(({ theme }) => ({
  boxSizing: 'border-box',
  listStyle: 'none',
  height: '36px',
  padding: `${theme.spacing(3)} ${theme.spacing(4)}`,
  borderRadius: '12px',
  cursor: 'default',
  color: COLORS.white,
  [`&:hover:not(.${optionUnstyledClasses.disabled})`]: {
    cursor: 'pointer',
  },
  [`&:hover:not(.${optionUnstyledClasses.disabled}),
  &.${optionUnstyledClasses.selected},
  &.${optionUnstyledClasses.highlighted}`]: {
    backgroundColor: COLORS.brandExtraDark,
  },
  [`&.${optionUnstyledClasses.disabled}`]: {
    backgroundColor: COLORS.lavenderGray,
  },
  transition: 'background-color 250ms cubic-bezier(0.4, 0, 0.2, 1) 0ms',
}))

const StyledPopper = styled(PopperUnstyled)`
  z-index: 1;
`

const TertiaryButton = forwardRef(
  (
    {
      children,
      ...restProps
    }: SlotComponentProps<'button', SelectUnstyledComponentsPropsOverrides, SelectUnstyledOwnerState<{}>> &
      any,
    ref: ForwardedRef<HTMLButtonElement>,
  ) => {
    return (
      <StyledButton
        ref={ref}
        color={'tertiary' as any /* Type 'string' is not assignable to type */}
        {...restProps}
      >
        <Typography variant="select">{children ? children : 'Select'}</Typography>
      </StyledButton>
    )
  },
)

const CustomSelect = React.forwardRef(function CustomSelect<TValue extends {}>(
  props: SelectUnstyledProps<TValue>,
  ref: React.ForwardedRef<HTMLButtonElement>,
) {
  const slots: SelectUnstyledProps<TValue>['slots'] = {
    root: TertiaryButton,
    listbox: StyledListbox,
    popper: StyledPopper,
    ...props.slots,
  }

  return <SelectUnstyled {...props} ref={ref} slots={slots} />
}) as <TValue extends {}>(
  props: SelectUnstyledProps<TValue> & React.RefAttributes<HTMLButtonElement>,
) => JSX.Element

export interface SelectOptionBase {
  label: string | number
  value: string | number
}

interface SelectProps<T extends SelectOptionBase> {
  label?: string
  options: T[]
  defaultValue?: T['value']
}

const SelectCmp = <T extends SelectOptionBase>({
  label,
  options,
  defaultValue,
}: SelectProps<T>): ReactElement => {
  const selectId = useId()

  return (
    <Box>
      {label && (
        <label htmlFor={selectId}>
          <Typography variant="body2">{label}</Typography>
        </label>
      )}
      <CustomSelect<T['value']> defaultValue={defaultValue} id={selectId}>
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
