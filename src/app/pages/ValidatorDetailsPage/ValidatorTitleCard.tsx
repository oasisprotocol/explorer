import { FC } from 'react'
import Typography from '@mui/material/Typography'
import Box from '@mui/material/Box'
import { CopyToClipboard } from '../../components/CopyToClipboard'
import { Validator } from '../../../oasis-nexus/api'
import { COLORS } from 'styles/theme/colors'
import { ValidatorImage } from 'app/components/Validators/ValidatorImage'
import { TitleCard } from 'app/components/PageLayout/TitleCard'
import { Network } from '../../../types/network'
import { ValidatorStatusBadge } from './ValidatorStatusBadge'
import { AccountLink } from '../../components/Account/AccountLink'
import { HighlightedText, HighlightPattern } from '../../components/HighlightedText'
import { AdaptiveHighlightedText } from '../../components/HighlightedText/AdaptiveHighlightedText'
import { useScreenSize } from '../../hooks/useScreensize'

type ValidatorTitleCardProps = {
  isLoading: boolean
  network: Network
  validator?: Validator
  highlightPattern?: HighlightPattern
}

export const ValidatorTitleCard: FC<ValidatorTitleCardProps> = ({
  isLoading,
  network,
  validator,
  highlightPattern,
}) => {
  const { isTablet } = useScreenSize()
  return (
    <TitleCard
      details={
        <>
          {validator && (
            <Box sx={{ display: 'flex' }}>
              <ValidatorStatusBadge active={validator.active} inValidatorSet={validator?.in_validator_set} />
              &nbsp;&nbsp;&nbsp;
              <AccountLink
                scope={{ network, layer: 'consensus' }}
                address={validator.entity_address}
                showOnlyAddress
              />
              <CopyToClipboard value={validator.entity_address} />
            </Box>
          )}
        </>
      }
      isLoading={isLoading}
      title={
        <>
          {validator && (
            <>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <ValidatorImage
                  address={validator.entity_address}
                  name={validator.media?.name}
                  logotype={validator.media?.logoUrl}
                />
                &nbsp;&nbsp;
                {isTablet ? (
                  <AdaptiveHighlightedText text={validator?.media?.name} pattern={highlightPattern} />
                ) : (
                  <HighlightedText text={validator?.media?.name} pattern={highlightPattern} />
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
              </Box>
            </>
          )}
        </>
      }
    />
  )
}
