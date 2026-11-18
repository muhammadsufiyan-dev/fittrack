import EmptyState from './EmptyState'
import PageHeader from './PageHeader'

function ComingSoon({ title, subtitle, icon }) {
  return (
    <>
      <PageHeader title={title} subtitle={subtitle} />
      <EmptyState icon={icon} title="Coming soon" text="This page is being built and will be ready in the next update." />
    </>
  )
}

export default ComingSoon
