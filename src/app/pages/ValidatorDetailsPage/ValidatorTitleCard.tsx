import { FC } from 'react'
import Typography from '@mui/material/Typography'
import { CopyToClipboard } from '../../components/CopyToClipboard'
import { Validator } from '../../../oasis-nexus/api'
import { COLORS } from 'styles/theme/colors'
import { ValidatorImage } from 'app/components/Validators/ValidatorImage'
import { DetailsPageTitle } from 'app/components/PageLayout/DetailsPageTitle'
import { Network } from '../../../types/network'
import { ValidatorStatusBadge } from './ValidatorStatusBadge'
import { AccountLink } from '../../components/Account/AccountLink'
import { HighlightedText } from '../../components/HighlightedText'
import { AdaptiveHighlightedText } from '../../components/HighlightedText/AdaptiveHighlightedText'
import { useScreenSize } from '../../hooks/useScreensize'

type ValidatorTitleCardProps = {
  isLoading: boolean
  network: Network
  validator?: Validator
}

export const ValidatorTitleCard: FC<ValidatorTitleCardProps> = ({ isLoading, network, validator }) => {
  const { isTablet } = useScreenSize()
  return (
    <DetailsPageTitle
      details={
        <>
          {validator && (
            <div className="flex">
              <ValidatorStatusBadge active={validator.active} inValidatorSet={validator?.in_validator_set} />
              &nbsp;&nbsp;&nbsp;
              <AccountLink
                scope={{ network, layer: 'consensus' }}
                address={validator.entity_address}
                showOnlyAddress
              />
              <CopyToClipboard value={validator.entity_address} />
            </div>
          )}
        </>
      }
      isLoading={isLoading}
      title={
        <>
          {validator && (
            <>
              <div className="flex items-center">
                <ValidatorImage
                  address={validator.entity_address}
                  name={validator.media?.name}
                  logotype={validator.media?.logoUrl}
                />
                &nbsp;&nbsp;
                {isTablet ? (
                  <AdaptiveHighlightedText text={validator?.media?.name} />
                ) : (
                  <HighlightedText text={validator?.media?.name} />
                )}
                &nbsp;
                <Typography
                  component="span"
                  sx={{
                    color: COLORS.grayMedium,
                    fontSize: '24px',
                    fontWeight: 400,
                  }}
                >
                  ({validator.rank})
                </Typography>
              </div>
            </>
          )}
        </>
      }
    />
  )
}
