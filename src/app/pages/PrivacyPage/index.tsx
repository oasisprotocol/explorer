import React, { FC } from 'react'
import { useTranslation } from 'react-i18next'

import { PageLayout } from '../../components/PageLayout'
import { SubPageCard } from '../../components/SubPageCard'

export const PrivacyPage: FC = () => {
  const { t } = useTranslation()

  return (
    <PageLayout>
      <SubPageCard featured title={t('privacyPolicy.title')}>
        <span>{t('common.missing')}</span>
      </SubPageCard>
    </PageLayout>
  )
}
