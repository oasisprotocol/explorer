import React, { FC } from 'react'
import discord from './discord-blue.svg'
import Typography from '@mui/material/Typography'
import Box from '@mui/material/Box'

export const DiscordProfileWidget: FC<{
  handle: string
}> = ({ handle }) => {
  // Clean the handle (remove '@' or 'discord:' if present)
  const cleanHandle = handle.startsWith('@')
    ? handle.slice(1)
    : handle.startsWith('discord:')
      ? handle.slice(8)
      : handle

  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        gap: 3,
      }}
    >
      <Typography
        component="span"
        sx={{
          fontWeight: 'bold',
          color: '#5865f2' /* Discord's brand color */,
          fontSize: '16px',
        }}
      >
        @{cleanHandle}
      </Typography>
      at
      <img src={discord} height={24} alt="" />
      Discord
    </Box>
  )
}
