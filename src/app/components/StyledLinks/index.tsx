import { FC } from 'react'
import { Link as RouterLink } from 'react-router-dom'
import { styled } from '@mui/material/styles'
import Link from '@mui/material/Link'
import ArrowForwardIcon from '@mui/icons-material/ArrowForward'
import { COLORS } from 'styles/theme/colors'

const styles = {
  width: '44px',
  height: '44px',
  borderRadius: '50%',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  marginLeft: 'auto',
  backgroundColor: COLORS.brandDark,
  color: COLORS.white,
  boxShadow: '0px 10px 8px rgba(117, 60, 239, 0.1)',
  '&:hover, &:focus-visible': {
    backgroundColor: COLORS.cosmicCobalt,
  },
}
const StyledAnchor = styled(Link)(() => styles)

type AnchorCircleProps = {
  url: string
}

export const AnchorCircle: FC<AnchorCircleProps> = ({ url }) => {
  return (
    <StyledAnchor href={url} rel="noopener noreferrer" target="_blank">
      <ArrowForwardIcon sx={{ fontSize: 16 }} />
    </StyledAnchor>
  )
}

const StyledRouterLink = styled(RouterLink)(() => styles)

type RouterLinkCircleProps = {
  to: string
}

export const RouterLinkCircle: FC<RouterLinkCircleProps> = ({ to }) => {
  return (
    <StyledRouterLink to={to}>
      <ArrowForwardIcon sx={{ fontSize: 16 }} />
    </StyledRouterLink>
  )
}
