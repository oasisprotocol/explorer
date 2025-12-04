import { FC } from 'react'
import { Trans, useTranslation } from 'react-i18next'
import { ZoomIn, ZoomOut } from 'lucide-react'

export const HideMoreResults: FC<{ onHide: () => void }> = ({ onHide }) => {
  return (
    <div
      className="w-[90%] mx-auto md:w-full flex justify-center items-center gap-1 p-4 leading-tight my-8 rounded-md box-border bg-[#F4F4F5] hover:bg-[#DDDDDE] cursor-pointer"
      onClick={onHide}
    >
      <ZoomOut size={18} />
      <span>
        <Trans i18nKey="search.otherResults.clickToHide" />
      </span>
    </div>
  )
}

export const ShowMoreResults: FC<{
  onShow: () => void
  hasWantedResults: boolean
  otherResultsCount: number
}> = ({ onShow, hasWantedResults, otherResultsCount }) => {
  const { t } = useTranslation()
  return (
    <div
      className="w-[90%] mx-auto md:w-full flex justify-center items-center gap-1 p-4 leading-tight my-8 rounded-md box-border bg-[#F4F4F5] hover:bg-[#DDDDDE] cursor-pointer"
      onClick={onShow}
    >
      <ZoomIn size={18} />
      <span>
        <Trans
          t={t}
          i18nKey={
            hasWantedResults ? 'search.otherResults.clickToShowMore' : 'search.otherResults.clickToShowThem'
          }
          values={{
            countLabel: t(hasWantedResults ? 'search.results.moreCount' : 'search.results.count', {
              count: otherResultsCount,
            }),
          }}
        />
      </span>
    </div>
  )
}
