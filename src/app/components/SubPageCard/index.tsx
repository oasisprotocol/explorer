import { FC, PropsWithChildren, ReactNode } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@oasisprotocol/ui-library/src/components/card'
import { Typography } from '@oasisprotocol/ui-library/src/components/typography'
import { useScreenSize } from '../../hooks/useScreensize'
import { Skeleton } from '@oasisprotocol/ui-library/src/components/skeleton'
import { cn } from '@oasisprotocol/ui-library/src/lib/utils'

type StyledComponentProps = {
  featured?: boolean
  isLoadingTitle?: boolean
  title?: ReactNode
  subheader?: ReactNode
  action?: ReactNode
  /**
   * An optional second title which will be displayed under title / subheader / action
   */
  title2?: ReactNode
  noPadding?: boolean
  mainTitle?: boolean
}
type SubPageCardProps = PropsWithChildren<StyledComponentProps>

const TitleSkeleton: FC = () => <Skeleton className="h-4" />

export const SubPageCard: FC<SubPageCardProps> = ({
  children,
  featured,
  isLoadingTitle,
  title,
  subheader,
  action,
  title2,
  noPadding = false,
  mainTitle = false,
}) => {
  const { isMobile } = useScreenSize()

  return (
    <div>
      {isMobile && (title || subheader || action) && (
        <div className="relative flex items-baseline mb-4 mx-4">
          <Typography
            variant={mainTitle ? 'h2' : 'h3'}
            className={cn('inline text-[--title-on-background]', mainTitle && 'text-xl')}
          >
            {isLoadingTitle ? <TitleSkeleton /> : title}
          </Typography>
          <Typography variant="p" className="inline ml-2 italic leading-6">
            {subheader}
          </Typography>
          {action && <div className="ml-auto my-auto">{action}</div>}
        </div>
      )}
      {title2 && <div className="mb-4 mx-4">{title2}</div>}
      <Card className={cn(featured && 'md:px-10', noPadding && 'p-0')} variant="layout">
        {!isMobile && (
          <CardHeader>
            <CardTitle>
              <div className={cn(featured && 'pb-4')}>
                <div className="flex items-start justify-between">
                  <div className="flex gap-1 items-center">
                    <Typography variant={mainTitle ? 'h2' : 'h3'} className={cn(mainTitle && 'text-xl')}>
                      {isLoadingTitle ? <TitleSkeleton /> : title}
                    </Typography>

                    {subheader && (
                      <Typography variant="p" className="inline ml-2 italic">
                        {subheader}
                      </Typography>
                    )}
                    {action && <div className="ml-4 shrink-0">{action}</div>}
                  </div>
                </div>
              </div>
            </CardTitle>
          </CardHeader>
        )}
        <CardContent className={cn(noPadding && 'p-0')}>{children}</CardContent>
      </Card>
    </div>
  )
}
