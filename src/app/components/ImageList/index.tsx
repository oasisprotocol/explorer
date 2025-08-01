import { FC, ReactNode } from 'react'

export const ImageList: FC<{ children: ReactNode }> = ({ children }) => {
  return <div className="grid sm:grid-cols-[repeat(auto-fill,minmax(210px,auto))] gap-[10px]">{children}</div>
}

export const ImageListItem: FC<{ children: ReactNode; title: ReactNode; subtitle?: ReactNode }> = ({
  children,
  title,
  subtitle,
}) => {
  return (
    <div className="border border-solid border rounded-lg overflow-hidden transition-[border-color,box-shadow] duration-250 ease-in-out hover:shadow-[0px_8px_8px_0px_rgba(0,0,0,0.15)] hover:border-chart-4 focus-visible:shadow-[0px_8px_8px_0px_rgba(0,0,0,0.15)] focus-visible:border-chart-4">
      {children}
      <div className="flex flex-col p-2">
        <div>{title}</div>
        <div>{subtitle}</div>
      </div>
    </div>
  )
}
