import { FC, PropsWithChildren, ReactNode } from 'react'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import { Typography } from '@oasisprotocol/ui-library/src/components/typography'
import { useScreenSize } from '../../hooks/useScreensize'
import { styled, css } from '@mui/material/styles'
import { Skeleton } from '@oasisprotocol/ui-library/src/components/ui/skeleton'
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

const StyledCard = styled(Card, {
  shouldForwardProp: prop => prop !== 'featured' && prop !== 'noPadding',
})<StyledComponentProps>(
  ({ featured, noPadding, theme }) => css`
    ${noPadding && {
      '&&': {
        padding: 0,
      },
    }}
    ${featured && {
      [theme.breakpoints.up('sm')]: {
        paddingRight: theme.spacing(6),
        paddingLeft: theme.spacing(6),
      },
    }};
  `,
)

const StyledCardContent = styled(CardContent, {
  shouldForwardProp: prop => prop !== 'noPadding',
})<Pick<StyledComponentProps, 'noPadding'>>(({ noPadding }) => ({
  '&&': noPadding
    ? {
        padding: 0,
      }
    : {},
}))

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
          <Typography variant={mainTitle ? 'h2' : 'h3'} className="inline text-[--title-on-background]">
            {isLoadingTitle ? <TitleSkeleton /> : title}
          </Typography>
          <Typography variant="p" className="inline ml-2 italic leading-6">
            {subheader}
          </Typography>
          {action && <div className="ml-auto my-auto">{action}</div>}
        </div>
      )}
      {title2 && <div className="mb-4 mx-4">{title2}</div>}
      <StyledCard featured={featured} noPadding={noPadding}>
        {!isMobile && (
          <div className={cn(featured && 'pb-4')}>
            <div className="flex items-start justify-between">
              <div className="flex gap-1 items-center">
                <Typography variant={mainTitle ? 'h2' : 'h3'}>
                  {isLoadingTitle ? <TitleSkeleton /> : title}
                </Typography>

                {subheader && (
                  <Typography variant="p" className="inline ml-2 italic">
                    {subheader}
                  </Typography>
                )}
              </div>

              {action && <div className="ml-4 shrink-0">{action}</div>}
            </div>
          </div>
        )}
        <StyledCardContent noPadding={noPadding}>{children}</StyledCardContent>
      </StyledCard>
    </div>
  )
}
