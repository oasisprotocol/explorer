import { Select, SelectOption } from '@oasisprotocol/ui-library/src/components/select'

type FilterByTypeProps<T extends string = string> = {
  options: SelectOption<T>[]
  handleChange?: (value: T) => void
  value: T
}

export const FilterByType = <T extends string = string>({
  handleChange,
  options,
  value,
}: FilterByTypeProps<T>) => {
  return (
    <div className="flex gap-2 items-center">
      <div className="text-muted-foreground text-sm font-medium">Filter by type</div>
      <Select className="min-w-[150px]" options={options} value={value} handleChange={handleChange} />
    </div>
  )
}
