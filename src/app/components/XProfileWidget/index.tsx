import React from 'react'
import classes from './XProfileWidget.module.css'
import XIcon from '@mui/icons-material/X'

export const XProfileWidget: React.FC<{ handle: string }> = ({ handle }) => {
  // Clean the handle (remove '@' if present)
  const cleanHandle = handle.startsWith('@') ? handle.slice(1) : handle

  // Construct X profile URL
  const profileUrl = `https://x.com/${encodeURIComponent(cleanHandle)}`

  // Construct profile picture URL using unavatar.io
  const profilePicUrl = `https://unavatar.io/x/${cleanHandle}`

  return (
    <a href={profileUrl} target="_blank" rel="noopener noreferrer" className={classes.xProfileWidget}>
      <div className={classes.xProfileLink}>
        <div className={classes.xProfileCard}>
          <img
            src={profilePicUrl}
            alt={`${cleanHandle}'s profile`}
            className={classes.xProfilePicture}
            referrerPolicy="no-referrer"
          />
          <div className={classes.xProfileInfo}>
            <span className={classes.xHandle}>@{cleanHandle}</span>
          </div>
        </div>
        at
        <XIcon />
      </div>
    </a>
  )
}
