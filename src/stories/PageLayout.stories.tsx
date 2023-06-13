import { Meta, StoryFn, StoryObj } from '@storybook/react'
import { withRouter } from 'storybook-addon-react-router-v6'
import { EmptyState } from '../app/components/EmptyState'
import { PageLayout } from '../app/components/PageLayout'
import { Network } from '../types/network'
import { Layer } from '../oasis-indexer/api'

export default {
  title: 'Example/PageLayout',
  component: PageLayout,
  decorators: [withRouter],
} satisfies Meta<typeof PageLayout>

const Template: StoryFn<typeof PageLayout> = args => (
  <PageLayout {...args}>
    <EmptyState title="EmptyState" description="EmptyState" />
  </PageLayout>
)

const sapphireRoute = {
  routePath: '/:network/:layer',
  routeParams: { network: Network.mainnet, layer: Layer.sapphire },
}

type Story = StoryObj<typeof PageLayout>

export const sapphire: Story = {
  render: Template,
  parameters: {
    layout: 'fullscreen',
    reactRouter: sapphireRoute,
  },
}

export const sapphireIpad: Story = {
  render: Template,
  parameters: {
    layout: 'fullscreen',
    viewport: { defaultViewport: 'ipad' },
    reactRouter: sapphireRoute,
  },
}

export const SapphireMobile: Story = {
  render: Template,
  parameters: {
    layout: 'fullscreen',
    viewport: { defaultViewport: 'iphone6' },
    reactRouter: sapphireRoute,
  },
}

const searchRoute = {
  routePath: '/search',
}

export const Search: Story = {
  render: Template,
  parameters: {
    layout: 'fullscreen',
    reactRouter: searchRoute,
  },
}

export const SearchIpad: Story = {
  render: Template,
  parameters: {
    layout: 'fullscreen',
    viewport: { defaultViewport: 'ipad' },
    reactRouter: searchRoute,
  },
}

export const SearchMobile: Story = {
  render: Template,
  parameters: {
    layout: 'fullscreen',
    viewport: { defaultViewport: 'iphone6' },
    reactRouter: searchRoute,
  },
}
