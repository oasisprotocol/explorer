import { useLocalSettings } from '../../hooks/useLocalSettings'
import { useTranslation } from 'react-i18next'
import { ChevronsDownIcon, ChevronsUpIcon } from 'lucide-react'
import { Button } from '@oasisprotocol/ui-library/src/components/ui/button'

export function ToggleAdvancedFields() {
  const { t } = useTranslation()
  const {
    settings: { showAdvancedFields },
    changeSetting,
  } = useLocalSettings()

  return (
    <div className="flex items-center gap-3">
      <hr className="grow" />
      <Button
        variant="link"
        className="hover:no-underline"
        onClick={() => changeSetting('showAdvancedFields', !showAdvancedFields)}
      >
        {showAdvancedFields ? (
          <>
            {t('advancedFields.hideAdvancedFields')}
            <ChevronsUpIcon size={'1.3em'} />
          </>
        ) : (
          <>
            {t('advancedFields.showAdvancedFields')}
            <ChevronsDownIcon size={'1.3em'} />
          </>
        )}
      </Button>
      <hr className="grow" />
    </div>
  )
}
