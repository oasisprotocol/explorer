import React from 'react'
import './XProfileWidget.css'
import XIcon from '@mui/icons-material/X'

export const XProfileWidget: React.FC<{ handle: string }> = ({ handle }) => {
  // Clean the handle (remove '@' if present)
  const cleanHandle = handle.startsWith('@') ? handle.slice(1) : handle

  // Construct X profile URL
  const profileUrl = `https://x.com/${cleanHandle}`

  // Construct profile picture URL using unavatar.io
  const profilePicUrl = `https://unavatar.io/x/${cleanHandle}?fallback=https://via.placeholder.com/50`

  return (
    <a href={profileUrl} target="_blank" rel="noopener noreferrer" className="x-profile-widget">
      <div className={'x-profile-link'}>
        <div className="x-profile-card">
          <img src={profilePicUrl} alt={`${cleanHandle}'s profile`} className="x-profile-picture" />
          <div className="x-profile-info">
            <span className="x-handle">@{cleanHandle}</span>
          </div>
        </div>
        at
        <XIcon />
      </div>
    </a>
  )
}
