import { Meta, StoryFn, StoryObj } from '@storybook/react'
import { SearchButton } from '../app/components/Search'
import { SuggestionButton } from '../app/components/Search/SearchSuggestionsButtons'
import { Select } from '../app/components/Select'
import { ExploreBtn, ZoomOutBtn } from '../app/pages/HomePage/Graph/ParaTimeSelector'
import { GetStartedBtn } from '../app/pages/HomePage/Graph/HelpScreen'
import { ViewResultButton } from '../app/pages/SearchResultsPage/ResultsGroupByType'
import { LoadMoreButton } from '../app/components/LoadMoreButton'
import { withRouter } from 'storybook-addon-react-router-v6'
import WidgetsIcon from '@mui/icons-material/Widgets'

export default {
  title: 'Example/ButtonsShowroom',
  decorators: [withRouter],
} satisfies Meta<any>

const Template: StoryFn = () => {
  return (
    <div>
      <SearchButton searchVariant="button">SearchButton</SearchButton>
      <ViewResultButton>ViewResultButton</ViewResultButton>
      <SuggestionButton>
        <WidgetsIcon sx={{ fontSize: '18px' }} /> SuggestionButton
      </SuggestionButton>
      <br />
      <br />

      <Select options={[{ label: 'Select', value: 'Select' }]} />
      <br />
      <br />

      <GetStartedBtn>GetStartedBtn</GetStartedBtn>
      <ExploreBtn>ExploreBtn</ExploreBtn>
      <ZoomOutBtn>ZoomOutBtn</ZoomOutBtn>
      <br />
      <br />

      <LoadMoreButton pagination={{ linkToPage: () => '', selectedPage: 1 }} />
    </div>
  )
}

export const Showroom: StoryObj = {
  render: Template,
  args: {},
}
