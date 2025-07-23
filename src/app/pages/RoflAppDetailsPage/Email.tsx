import { FC } from 'react'

export const Email: FC<{ email: string }> = ({ email }) => {
  if (!email.includes('@')) return email
  return (
    <span>
      {email.split('@')[0]}
      {email
        .split('@')
        .slice(1)
        .map((part, index) => (
          //  data-nosnippet should hide it from google
          <span data-nosnippet key={index}>
            <span />
            &#64;
            <span />
            <div style={{ display: 'none' }}>hello</div>
            {part}
          </span>
        ))}
    </span>
  )
}
