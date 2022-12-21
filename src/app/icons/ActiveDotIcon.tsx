import { FC, memo } from 'react'
import { DotProps } from 'recharts'

const ActiveDotIcon: FC<DotProps> = ({ cx, cy }) => {
  if (!cx || !cy) {
    return null;
  }

  return (
    <svg
      x={cx - 16}
      y={cy - 16}
      width="30"
      height="30"
      viewBox="0 0 33 33"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <circle
        cx="16.9161"
        cy="16.5362"
        r="5"
        transform="rotate(-4.17053 16.9161 16.5362)"
        fill="#000062"
      />
      <circle
        opacity="0.1"
        cx="16.916"
        cy="16.5362"
        r="16"
        transform="rotate(-4.17053 16.916 16.5362)"
        fill="#000062"
      />
    </svg>
  )
}

export default memo(ActiveDotIcon)
