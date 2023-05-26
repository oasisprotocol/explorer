import { FC, ReactNode } from 'react'
import { styled } from '@mui/material/styles'
import List from '@mui/material/List'
import ListItem from '@mui/material/ListItem'
import { COLORS } from '../../../styles/theme/colors'

type TextListProps = {
  children: ReactNode
}

const StyledList = styled(List)(() => ({
  listStyleType: 'disc',
  listStylePosition: 'inside',
  color: COLORS.brandExtraDark,
  fontSize: '12px',
  '& ul': {
    paddingTop: 0,
  },
}))

export const TextList: FC<TextListProps> = ({ children }) => <StyledList>{children}</StyledList>

const StyledListItem = styled(ListItem)(({ theme }) => ({
  display: 'list-item',
  paddingTop: 0,
  paddingBottom: theme.spacing(1),
}))

export const TextListItem: FC<TextListProps> = ({ children }) => <StyledListItem>{children}</StyledListItem>
