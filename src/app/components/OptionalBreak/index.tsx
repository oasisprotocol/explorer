import { FC, ReactNode } from 'react'

type OptionalBreakProps = {
  children?: ReactNode
}

export const OptionalBreak: FC<OptionalBreakProps> = ({ children }) => (
  <span className="inline-block">{children}</span>
)
