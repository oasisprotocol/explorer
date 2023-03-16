import { ComponentMeta, ComponentStory } from '@storybook/react'
import { withRouter } from 'storybook-addon-react-router-v6'
import { EmptyState } from '../app/components/EmptyState'
import { PageLayout } from '../app/components/PageLayout'

export default {
  title: 'Example/PageLayout',
  component: PageLayout,
  decorators: [withRouter],
} satisfies ComponentMeta<typeof PageLayout>

const Template: ComponentStory<typeof PageLayout> = args => (
  <PageLayout {...args}>
    <EmptyState title="EmptyState" description="EmptyState"></EmptyState>
  </PageLayout>
)

const emeraldRoute = {
  routePath: '/:layer',
  routeParams: { layer: 'emerald' },
}

export const Emerald = Template.bind({})
Emerald.parameters = {
  layout: 'fullscreen',
  reactRouter: emeraldRoute,
}

export const EmeraldIpad = Template.bind({})
EmeraldIpad.parameters = {
  layout: 'fullscreen',
  viewport: { defaultViewport: 'ipad' },
  reactRouter: emeraldRoute,
}

export const EmeraldMobile = Template.bind({})
EmeraldMobile.parameters = {
  layout: 'fullscreen',
  viewport: { defaultViewport: 'iphone6' },
  reactRouter: emeraldRoute,
}

const searchRoute = {
  routePath: '/search',
}

export const Search = Template.bind({})
Search.parameters = {
  layout: 'fullscreen',
  reactRouter: searchRoute,
}

export const SearchIpad = Template.bind({})
SearchIpad.parameters = {
  layout: 'fullscreen',
  viewport: { defaultViewport: 'ipad' },
  reactRouter: searchRoute,
}

export const SearchMobile = Template.bind({})
SearchMobile.parameters = {
  layout: 'fullscreen',
  viewport: { defaultViewport: 'iphone6' },
  reactRouter: searchRoute,
}
