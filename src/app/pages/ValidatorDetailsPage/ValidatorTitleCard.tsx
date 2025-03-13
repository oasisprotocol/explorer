import { FC } from 'react'
import Typography from '@mui/material/Typography'
import Box from '@mui/material/Box'
import { CopyToClipboard } from '../../components/CopyToClipboard'
import { Layer, Validator } from '../../../oasis-nexus/api'
import { COLORS } from 'styles/theme/colors'
import { ValidatorImage } from 'app/components/Validators/ValidatorImage'
import { TitleCard } from 'app/components/PageLayout/TitleCard'
import { Network } from '../../../types/network'
import { ValidatorStatusBadge } from './ValidatorStatusBadge'
import { AccountLink } from '../../components/Account/AccountLink'

type ValidatorTitleCardProps = {
  isLoading: boolean
  network: Network
  validator?: Validator
}

export const ValidatorTitleCard: FC<ValidatorTitleCardProps> = ({ isLoading, network, validator }) => {
  return (
    <TitleCard
      details={
        <>
          {validator && (
            <Box sx={{ display: 'flex' }}>
              <ValidatorStatusBadge active={validator.active} inValidatorSet={validator?.in_validator_set} />
              <Box sx={{ paddingLeft: 4 }}>
                <AccountLink
                  scope={{ network, layer: Layer.consensus }}
                  address={validator.entity_address}
                  showOnlyAddress
                />
              </Box>
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
              <Box sx={{ display: 'flex', alignItems: 'center' }} gap={4}>
                <ValidatorImage
                  address={validator.entity_address}
                  name={validator.media?.name}
                  logotype={validator.media?.logoUrl}
                />
                {validator?.media?.name}
              </Box>
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
            </>
          )}
        </>
      }
    />
  )
}
