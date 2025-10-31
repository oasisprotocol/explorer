import { styled } from '@mui/material/styles'
import Button from '@mui/material/Button'
import { Link } from '@oasisprotocol/ui-library/src/components/link'
import { Trans, useTranslation } from 'react-i18next'
import { AnalyticsDialogLayout } from './AnalyticsDialogLayout'

const StyledButton = styled(Button)(({ theme }) => ({
  paddingLeft: theme.spacing(5),
  paddingRight: theme.spacing(5),
}))

export const AnalyticsIsBlocked = (props: { isOpen: boolean; onReload: () => void; onClose: () => void }) => {
  const { t } = useTranslation()
  return (
    <AnalyticsDialogLayout
      isOpen={props.isOpen}
      message={
        <Trans
          i18nKey="analyticsConsent.blockedText"
          t={t}
          components={{
            PrivacyPolicyLink: (
              <Link href={import.meta.env.REACT_APP_PRIVACY_POLICY} target="_blank" className="underline" />
            ),
          }}
        />
      }
      actions={
        <>
          <StyledButton onClick={() => props.onReload()} color="secondary" variant="outlined">
            {t('analyticsConsent.reloadButtonLabel')}
          </StyledButton>
          <StyledButton onClick={() => props.onClose()} color="secondary" variant="outlined">
            {t('analyticsConsent.closeButtonLabel')}
          </StyledButton>
        </>
      }
    />
  )
}
