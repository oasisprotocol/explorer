import React, { FC } from 'react'
import { useTranslation } from 'react-i18next'

import { PageLayout } from '../../components/PageLayout'
import { SubPageCard } from '../../components/SubPageCard'

import Policy from '../../../docs/pontusx_privacy_2024.mdx'
import { Network } from 'types/network'
import { ThemeByScope } from '../../components/ThemeByScope'
import { Layer } from '../../../oasis-nexus/api'

export const PontusxPrivacyPage: FC = () => {
  const { t } = useTranslation()

  return (
    <ThemeByScope isRootTheme={true} network={Network.testnet} layer={Layer.pontusxtest}>
      <PageLayout>
        <SubPageCard featured title={t('privacyPolicy.title')}>
          <Policy />
        </SubPageCard>
      </PageLayout>
    </ThemeByScope>
  )
}
