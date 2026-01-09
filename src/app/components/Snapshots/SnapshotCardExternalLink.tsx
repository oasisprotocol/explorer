import { FC, ReactNode } from 'react'
import { Button } from '@oasisprotocol/ui-library/src/components/button'
import { Typography } from '@oasisprotocol/ui-library/src/components/typography'
import { SnapshotCard } from '../../components/Snapshots/SnapshotCard'
import { isUrlSafe } from 'app/utils/url'

type SnapshotCardExternalLinkProps = {
  description: string
  label?: ReactNode
  title: string
  url?: string
}

export const SnapshotCardExternalLink: FC<SnapshotCardExternalLinkProps> = ({
  description,
  label,
  title,
  url,
}) => {
  return (
    <SnapshotCard title={title} withContentPadding={false}>
      <div className="flex flex-col items-stretch justify-between gap-4">
        <Typography textColor="muted" variant="xsmall">
          {description}
        </Typography>
        {url && isUrlSafe(url) && (
          <Button asChild variant="outline" size="lg" className="shadow-none">
            <a href={url} target="_blank" rel="noopener noreferrer">
              {label}
            </a>
          </Button>
        )}
      </div>
    </SnapshotCard>
  )
}
