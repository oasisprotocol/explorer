import { FC } from 'react'

type VerticalListProps = {
  children: React.ReactNode
}

export const VerticalList: FC<VerticalListProps> = ({ children }) => (
  <div className="flex flex-col gap-2 bg-theme-surface">{children}</div>
)
