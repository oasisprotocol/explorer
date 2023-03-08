import { ComponentMeta, Story } from '@storybook/react'
import { SearchButton } from '../app/components/Search'
import { SuggestionButton } from '../app/components/Search/SearchSuggestionsButtons'
import { Select } from '../app/components/Select'
import { ExploreBtn, ZoomOutBtn } from '../app/pages/HomePage/Graph/ParaTimeSelector'
import { GetStartedBtn } from '../app/pages/HomePage/Graph/HelpScreen'

export default {
  title: 'Example/ButtonsShowroom',
} satisfies ComponentMeta<any>

const Template: Story = () => {
  return (
    <div>
      <SearchButton searchVariant="button">SearchButton</SearchButton>
      <SuggestionButton>SuggestionButton</SuggestionButton>
      <br />
      <br />

      <Select options={[{ label: 'Select', value: 'Select' }]} />
      <br />
      <br />

      <GetStartedBtn>GetStartedBtn</GetStartedBtn>
      <ExploreBtn>ExploreBtn</ExploreBtn>
      <ZoomOutBtn>ZoomOutBtn</ZoomOutBtn>
    </div>
  )
}

export const Showroom = Template.bind({})
Showroom.args = {}
