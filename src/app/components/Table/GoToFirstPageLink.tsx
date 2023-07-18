import { FC } from 'react'
import { useTranslation } from 'react-i18next'
import { useSearchParams, useHref } from 'react-router-dom'
import Link from '@mui/material/Link'

/**
 * Link to attempt to jump to the first page (in pagination)
 *
 * This is only a best-effort attempts, because we can't really know the name of the 'page' parameter
 * used for pagination. The best we can do is to test the trivial option ("page"), but if it's not there,
 * then we can't really do anything.
 *
 * Please note that to get to an invalid / non-existent page, the user probably had to do some manual URL hacking,
 * so hopefully it's not terrible that he gets a full reload as the result of that.
 */
export const GoToFirstPageLink: FC = () => {
  const { t } = useTranslation()
  const [searchParams] = useSearchParams()
  const wantedParamName = searchParams.has('page') ? 'page' : undefined
  const label = t('errors.loadFirstPage')
  const newSearchParams = new URLSearchParams(searchParams)
  if (wantedParamName) {
    newSearchParams.delete(wantedParamName)
  }
  const href = useHref({
    search: newSearchParams.toString(),
  })
  // Ideally, we should use a router link here, but even if we change the URL without a reload,
  // I can't get the error boundary to recover from the error state.
  // when jumping to the first page, the ErrorBoundary component stays in place, only the internals change.
  // But to show the first page, the Error Boundary component would need to switch back from the "error" state
  // to the "normal" state, which doesn't happen automatically.
  // In needs a manual `setState()` for recovering, which is hard to channel through,
  // but even if we do it (which I did as an experiment), we find that
  // the data around the ErrorBoundary is somewhat weird, and the updated URL is not reflected right away,
  // so we just end up running into the same exception again...
  // Apparently the solution is to umount and rerender the component outside the error boundary.
  // But that's hard to do selectively, so it's easier to just do a full refresh.
  return wantedParamName ? (
    <Link href={href} sx={{ cursor: 'pointer' }}>
      {label}
    </Link>
  ) : (
    <span>{label}</span>
  )
}
