import { Meta, StoryFn, StoryObj } from '@storybook/react'
import { withRouter } from 'storybook-addon-react-router-v6'
import { EmptyState } from '../app/components/EmptyState'
import { PageLayout } from '../app/components/PageLayout'
import { Network } from '../types/network'
import { Layer } from '../oasis-nexus/api'
import { statusApiFailureHandler } from '../../internals/mocks/msw-handlers'

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

export const Desktop: Story = {
  render: Template,
  parameters: {
    layout: 'fullscreen',
    reactRouter: sapphireRoute,
  },
}

export const Ipad: Story = {
  render: Template,
  parameters: {
    layout: 'fullscreen',
    viewport: { defaultViewport: 'ipad' },
    reactRouter: sapphireRoute,
  },
}

export const Mobile: Story = {
  render: Template,
  parameters: {
    layout: 'fullscreen',
    viewport: { defaultViewport: 'iphone6' },
    reactRouter: sapphireRoute,
  },
}

export const ApiError: Story = {
  render: Template,
  parameters: {
    layout: 'fullscreen',
    reactRouter: sapphireRoute,
    msw: {
      handlers: statusApiFailureHandler,
    },
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
