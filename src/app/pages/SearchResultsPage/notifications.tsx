import { styled } from '@mui/material/styles'
import Box from '@mui/material/Box'
import { FC } from 'react'
import { Theme } from '@mui/material/styles/createTheme'
import ZoomOut from '@mui/icons-material/ZoomOut'
import { Trans, useTranslation } from 'react-i18next'
import ZoomIn from '@mui/icons-material/ZoomIn'

const NotificationBox = styled(Box)(({ theme }) => ({
  marginTop: 30,
  marginBottom: 30,
  marginLeft: '5%',
  marginRight: '5%',

  boxSizing: 'border-box',
  display: 'flex',
  flexDirection: 'row',
  justifyContent: 'center',
  alignItems: 'center',
  padding: '5px 10px',
  gap: 10,

  minHeight: 50,

  background: theme.palette.layout.secondary,
  color: theme.palette.layout.titleOnBackground,
  cursor: 'pointer',
  borderRadius: 50,
}))

export const HideMoreResults: FC<{ theme: Theme; onHide: () => void }> = ({ theme, onHide }) => {
  return (
    <NotificationBox theme={theme} onClick={onHide}>
      <ZoomOut />
      <span>
        <Trans i18nKey="search.otherResults.clickToHide" />
      </span>
    </NotificationBox>
  )
}

export const ShowMoreResults: FC<{
  theme: Theme
  onShow: () => void
  hasWantedResults: boolean
  otherResultsCount: number
}> = ({ theme, onShow, hasWantedResults, otherResultsCount }) => {
  const { t } = useTranslation()
  return (
    <NotificationBox theme={theme} onClick={onShow}>
      <ZoomIn />
      <span>
        <Trans
          t={t}
          i18nKey={
            hasWantedResults ? 'search.otherResults.clickToShowMore' : 'search.otherResults.clickToShowThem'
          }
          values={{
            countLabel: t(hasWantedResults ? 'search.results.moreCount' : 'search.results.count', {
              count: otherResultsCount,
            }),
          }}
        />
      </span>
    </NotificationBox>
  )
}
