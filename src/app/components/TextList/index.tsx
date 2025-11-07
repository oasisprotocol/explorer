import { FC, ReactNode } from 'react'

type TextListProps = {
  children: ReactNode
}

export const TextList: FC<TextListProps> = ({ children }) => (
  <ul className="list-disc list-outside text-sm pl-4 pb-1 [&_ul]:pt-0 [&_ul]:pb-0">{children}</ul>
)

export const TextListItem: FC<TextListProps> = ({ children }) => (
  <li className="list-item pb-1">{children}</li>
)
