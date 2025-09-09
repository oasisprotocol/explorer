import { FC } from 'react'

type CardHeaderWithCounterProps = {
  label: string | undefined
  totalCount: number | undefined
  isTotalCountClipped: boolean | undefined
}

export const CardHeaderWithCounter: FC<CardHeaderWithCounterProps> = ({
  label,
  totalCount,
  isTotalCountClipped,
}) => {
  return (
    <div className="flex gap-1">
      <span>{label}</span>
      {!!totalCount && (
        <span className="font-normal text-muted-foreground">
          ({`${isTotalCountClipped ? '>' : ''}${totalCount}`})
        </span>
      )}
    </div>
  )
}
