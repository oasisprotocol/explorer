import { Tabs, TabsList, TabsTrigger } from '@oasisprotocol/ui-library/src/components/tabs'

type FilterButtonsProps<T extends string> = {
  options: { label: string; value: T }[]
  onSelect: (value: T) => void
  value?: NoInfer<T>
}

export const FilterButtons = <T extends string>({ options, onSelect, value }: FilterButtonsProps<T>) => {
  return (
    <Tabs defaultValue={value} className="inline-flex w-auto">
      <TabsList>
        {options.map(option => (
          <TabsTrigger key={option.value} value={option.value} onClick={() => onSelect(option.value)}>
            {option.label}
          </TabsTrigger>
        ))}
      </TabsList>
    </Tabs>
  )
}
