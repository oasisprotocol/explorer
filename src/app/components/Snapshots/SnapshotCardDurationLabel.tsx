import { FC } from 'react'
import { Typography } from '@oasisprotocol/ui-library/src/components/typography'

type SnapshotCardLabelProps = {
  label: string
  value: number | undefined
}
export const SnapshotCardDurationLabel: FC<SnapshotCardLabelProps> = ({ label, value }) => {
  if (!value) {
    return null
  }

  return (
    <Typography className="flex gap-2 flex justify-end items-center" asChild>
      <span>
        {label} <span className="font-semibold text-primary">{value.toLocaleString()}</span>
      </span>
    </Typography>
  )
}
