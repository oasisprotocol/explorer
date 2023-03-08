import { ComponentMeta, Story } from '@storybook/react'
import { SubPageCard } from '../app/components/SubPageCard'
import { TextSkeleton } from '../app/components/Skeleton'
import { ComponentProps } from 'react'

export default {
  title: 'Example/SubPageCard',
} satisfies ComponentMeta<any>

const Template: Story<Partial<ComponentProps<typeof SubPageCard>>> = args => {
  return (
    <SubPageCard title="Title" {...args}>
      <TextSkeleton numberOfRows={3} />
    </SubPageCard>
  )
}

export const Featured = Template.bind({})
Featured.args = {
  featured: true,
}

export const NonFeatured = Template.bind({})
NonFeatured.args = {
  featured: false,
}

export const Mobile = Template.bind({})
Mobile.args = {
  featured: true,
}
Mobile.parameters = {
  layout: 'fullscreen',
  viewport: { defaultViewport: 'iphone6' },
}
