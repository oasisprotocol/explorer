import { FC } from 'react'
import { useTranslation } from 'react-i18next'
import { isRouteErrorResponse, useRouteError } from 'react-router-dom'
import { EmptyState } from '../EmptyState'
import { AppError, AppErrors, ErrorPayload } from '../../../types/errors'
import { TFunction } from 'i18next'

export const errorFormatter = (t: TFunction, error: ErrorPayload) => {
  const errorMap: { [code in AppErrors]: { title: string; message: string } } = {
    [AppErrors.Unknown]: { title: t('errors.unknown'), message: error.message },
    [AppErrors.InvalidAddress]: { title: t('errors.invalidAddress'), message: t('errors.validateURL') },
    [AppErrors.InvalidBlockHeight]: {
      title: t('errors.invalidBlockHeight'),
      message: t('errors.validateURL'),
    },
    [AppErrors.InvalidTxHash]: { title: t('errors.invalidTxHash'), message: t('errors.validateURL') },
  }

  return errorMap[error.code]
}

export const ErrorBoundary: FC = () => {
  const { t } = useTranslation()
  const error = useRouteError()

  let errorPayload: ErrorPayload
  if (isRouteErrorResponse(error)) {
    errorPayload = { code: AppErrors.Unknown, message: error.statusText }
  } else if (error instanceof AppError) {
    errorPayload = { code: error.type, message: error.message }
  } else if (error instanceof Error) {
    errorPayload = { code: AppErrors.Unknown, message: error.message }
  } else {
    errorPayload = { code: AppErrors.Unknown, message: error as string }
  }

  const { title, message } = errorFormatter(t, errorPayload)

  return <EmptyState title={title} description={message} />
}
