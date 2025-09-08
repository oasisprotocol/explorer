import { FC } from 'react'
import { Link as RouterLink } from 'react-router-dom'
import { Link } from '@oasisprotocol/ui-library/src/components/link'
import { ArrowRight } from 'lucide-react'

type AnchorCircleProps = {
  url: string
}

export const AnchorCircle: FC<AnchorCircleProps> = ({ url }) => {
  return (
    <Link
      href={url}
      rel="noopener noreferrer"
      target="_blank"
      className="
        ml-auto flex size-11 items-center justify-center rounded-md bg-primary text-primary-foreground border border-zinc-200 hover:text-primary-foreground hover:bg-primary/90"
    >
      <ArrowRight className="size-4" />
    </Link>
  )
}

type RouterLinkCircleProps = {
  to: string
}

export const RouterLinkCircle: FC<RouterLinkCircleProps> = ({ to }) => {
  return (
    <RouterLink
      to={to}
      className="
        ml-auto flex size-11 items-center justify-center rounded-md bg-primary text-primary-foreground border border-zinc-200 hover:text-primary-foreground hover:bg-primary/90"
    >
      <ArrowRight className="size-4" />
    </RouterLink>
  )
}
