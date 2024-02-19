import { FC } from 'react'
import { useTranslation } from 'react-i18next'
import { StyledBox, statusIcon } from '../StatusIcon'

type RuntimeStatusIconProps = {
  hasStatus: boolean
}

export const RuntimeStatusIcon: FC<RuntimeStatusIconProps> = ({ hasStatus }) => {
  const { t } = useTranslation()

  return (
    <StyledBox gap={2} success={hasStatus} error={undefined} withText={true}>
      {hasStatus ? t('paratimes.active') : t('paratimes.inactive')}
      {hasStatus ? statusIcon.success : statusIcon.failure}
    </StyledBox>
  )
}
