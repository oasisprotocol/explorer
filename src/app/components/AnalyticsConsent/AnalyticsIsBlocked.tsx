import { Button } from '@oasisprotocol/ui-library/src/components/ui/button'
import { Link } from '@oasisprotocol/ui-library/src/components/link'
import { Trans, useTranslation } from 'react-i18next'
import { AnalyticsDialogLayout } from './AnalyticsDialogLayout'

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
          <Button onClick={() => props.onReload()} variant="outline" size="lg">
            {t('analyticsConsent.reloadButtonLabel')}
          </Button>
          <Button onClick={() => props.onClose()} variant="outline" size="lg">
            {t('analyticsConsent.closeButtonLabel')}
          </Button>
        </>
      }
    />
  )
}
