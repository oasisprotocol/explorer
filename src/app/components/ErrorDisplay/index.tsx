import { FC, ReactNode } from 'react'
import { Trans, useTranslation } from 'react-i18next'
import { isRouteErrorResponse } from 'react-router-dom'
import { EmptyState } from '../EmptyState'
import { AppError, AppErrors, ErrorPayload } from '../../../types/errors'
import { TFunction } from 'i18next'
import { GoToFirstPageLink } from '../Table/GoToFirstPageLink'

type FormattedError = { title: string; message: ReactNode }

const errorMap: Record<AppErrors, (t: TFunction, error: ErrorPayload) => FormattedError> = {
  [AppErrors.Unknown]: (t, error) => ({ title: t('errors.unknown'), message: error.message }),
  [AppErrors.InvalidAddress]: t => ({ title: t('errors.invalidAddress'), message: t('errors.validateURL') }),
  [AppErrors.InvalidRoflAppId]: t => ({
    title: t('errors.invalidRoflAppId'),
    message: t('errors.validateURL'),
  }),
  [AppErrors.InvalidBlockHeight]: t => ({
    title: t('errors.invalidBlockHeight'),
    message: t('errors.validateURL'),
  }),
  [AppErrors.InvalidTxHash]: t => ({ title: t('errors.invalidTxHash'), message: t('errors.validateURL') }),
  [AppErrors.InvalidProposalId]: t => ({
    title: t('errors.invalidProposalId'),
    message: t('errors.validateURL'),
  }),
  [AppErrors.InvalidPageNumber]: t => ({
    title: t('errors.invalidPageNumber'),
    message: (
      <Trans
        t={t}
        i18nKey="errors.validateURLOrGoToFirstPage"
        components={{
          FirstPageLink: <GoToFirstPageLink />,
        }}
      />
    ),
  }),
  [AppErrors.PageDoesNotExist]: t => ({
    title: t('errors.pageDoesNotExist'),
    message: (
      <Trans
        t={t}
        i18nKey="errors.validateURLOrGoToFirstPage"
        components={{
          FirstPageLink: <GoToFirstPageLink />,
        }}
      />
    ),
  }),
  [AppErrors.NotFoundBlockHeight]: t => ({
    title: t('errors.notFoundBlockHeight'),
    message: t('errors.validateURL'),
  }),
  [AppErrors.NotFoundTxHash]: t => ({ title: t('errors.notFoundTx'), message: t('errors.validateURL') }),
  [AppErrors.NotFoundRoflApp]: t => ({
    title: t('errors.notFoundRoflApp'),
    message: t('errors.validateURL'),
  }),
  [AppErrors.NotFoundRoflAppInstance]: t => ({
    title: t('errors.notFoundRoflAppReplica'),
    message: t('errors.validateURL'),
  }),
  [AppErrors.NotFoundProposalId]: t => ({
    title: t('errors.notFoundProposal'),
    message: t('errors.validateURL'),
  }),
  [AppErrors.InvalidUrl]: t => ({ title: t('errors.invalidUrl'), message: t('errors.validateURL') }),
  [AppErrors.UnsupportedLayer]: t => ({
    title: t('errors.error'),
    message: t('errors.unsupportedLayer'),
  }),
  [AppErrors.UnsupportedNetwork]: t => ({
    title: t('errors.error'),
    message: t('errors.unsupportedNetwork'),
  }),
  [AppErrors.Storage]: t => ({
    title: t('errors.error'),
    message: t('errors.storage'),
  }),
  [AppErrors.InvalidVote]: t => ({ title: t('errors.invalidVote'), message: null }),
}

export const errorFormatter = (t: TFunction, error: ErrorPayload) => {
  return errorMap[error.code](t, error)
}

export const ErrorDisplay: FC<{ error: unknown; light?: boolean }> = ({ error, light }) => {
  const { t } = useTranslation()

  let errorPayload: ErrorPayload
  if (isRouteErrorResponse(error)) {
    errorPayload = { code: AppErrors.Unknown, message: error.statusText }
  } else if (error instanceof AppError) {
    errorPayload = { code: error.type, message: error.message }
  } else if (error instanceof Error) {
    errorPayload = { code: AppErrors.Unknown, message: error.message }
  } else if (typeof error === 'string' && errorMap[error as AppErrors]) {
    errorPayload = { code: error as AppErrors, message: 'oops' }
  } else {
    errorPayload = { code: AppErrors.Unknown, message: error as string }
  }

  const { title, message } = errorFormatter(t, errorPayload)

  return <EmptyState title={title} description={message} light={light} />
}
