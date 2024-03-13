import Snackbar from '@mui/material/Snackbar'
import Typography from '@mui/material/Typography'
import { styled } from '@mui/material/styles'
import Button from '@mui/material/Button'
import Link from '@mui/material/Link'
import { Trans, useTranslation } from 'react-i18next'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import CardActions from '@mui/material/CardActions'
import { useScreenSize } from 'app/hooks/useScreensize'
import { legalDocuments } from '../../utils/externalLinks'

const StyledButton = styled(Button)(({ theme }) => ({
  paddingLeft: theme.spacing(5),
  paddingRight: theme.spacing(5),
}))

export const AnalyticsIsBlocked = (props: { isOpen: boolean; onReload: () => void; onClose: () => void }) => {
  const { t } = useTranslation()
  const { isMobile } = useScreenSize()
  return (
    <>
      <Snackbar
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        sx={{
          maxWidth: '450px',
        }}
        open={props.isOpen}
      >
        <Card elevation={4}>
          <CardContent>
            <Typography
              fontSize="14px"
              sx={{
                paddingBottom: '12px',
                lineHeight: '1.25',
              }}
              align="center"
            >
              <Trans
                i18nKey="analyticsConsent.blockedText"
                t={t}
                components={{
                  PrivacyPolicyLink: (
                    <Link
                      href={legalDocuments.privacyPolicy}
                      target="_blank"
                      sx={{ fontWeight: 400, textDecoration: 'underline' }}
                    />
                  ),
                }}
              />
            </Typography>
          </CardContent>
          <CardActions sx={{ justifyContent: 'center', paddingBottom: isMobile ? '16px' : '32px' }}>
            <StyledButton onClick={() => props.onReload()} color="secondary" variant="outlined">
              {t('analyticsConsent.reloadButtonLabel')}
            </StyledButton>
            <StyledButton onClick={() => props.onClose()} color="secondary" variant="outlined">
              {t('analyticsConsent.closeButtonLabel')}
            </StyledButton>
          </CardActions>
        </Card>
      </Snackbar>
    </>
  )
}
