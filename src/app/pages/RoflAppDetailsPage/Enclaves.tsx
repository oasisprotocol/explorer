import { FC } from 'react'
import { useTranslation } from 'react-i18next'
import { RoflAppPolicy } from '../../../oasis-nexus/api'
import { CopyToClipboard } from 'app/components/CopyToClipboard'

type EnclavesProps = {
  policy: RoflAppPolicy
}

export const Enclaves: FC<EnclavesProps> = ({ policy }) => {
  const { t } = useTranslation()

  if (!policy.enclaves || policy.enclaves.length === 0) {
    return <>{t('common.missing')}</>
  }

  return (
    <table>
      <tbody>
        {policy.enclaves.map((enclave: string) => (
          <tr key={enclave}>
            <td>
              <span className="font-medium">{enclave}</span>
            </td>
            <td>
              <CopyToClipboard value={enclave} />
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}
