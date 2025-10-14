import React, { FC } from 'react'
import discord from './discord-blue.svg'

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
    <div className="flex items-center gap-2">
      <span className="font-bold text-[#5865f2]">@{cleanHandle}</span>
      at
      <img src={discord} height={24} alt="" />
      Discord
    </div>
  )
}
