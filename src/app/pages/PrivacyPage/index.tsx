import React, { FC } from 'react'
import { useTranslation } from 'react-i18next'

import { PageLayout } from '../../components/PageLayout'
import { SubPageCard } from '../../components/SubPageCard'

import Policy from '../../../docs/pontusx_privacy_2024.mdx'

export const PrivacyPage: FC = () => {
  const { t } = useTranslation()

  return (
    <PageLayout>
      <SubPageCard featured title={t('privacyPolicy.title')}>
        <Policy />
      </SubPageCard>
    </PageLayout>
  )
}
