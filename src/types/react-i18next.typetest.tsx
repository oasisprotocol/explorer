import { Trans, useTranslation } from 'react-i18next'

export function ExpectTranslationsToHaveStrictType() {
  const { t } = useTranslation()
  return (
    <>
      {t('account.title')}
      <Trans i18nKey="account.title" t={t} />
      {t('menu.does_not_exist_but_has_a_default', 'Default')}
      {/* @ts-expect-error Expect typescript to detect incorrect key */}
      {t('menu.does_not_exist')}
      {/* @ts-expect-error Expect typescript to detect incorrect key */}
      <Trans i18nKey="menu.does_not_exist" t={t} />
    </>
  )
}
