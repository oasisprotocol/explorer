import { FC, memo } from 'react'

const SearchIcon: FC = () => {
  return (
    <svg width="24" height="24" viewBox="0 0 24 21" fill="none" xmlns="http://www.w3.org/2000/svg">
      <g clipPath="url(#clip0_2060_5075)">
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M10.5 18C6.35786 18 3 14.6421 3 10.5C3 6.35786 6.35786 3 10.5 3C14.6421 3 18 6.35786 18 10.5C18 12.2269 17.4164 13.8175 16.4356 15.0852L20.3769 19.0953C20.764 19.4892 20.7586 20.1223 20.3647 20.5095C19.9708 20.8966 19.3376 20.8911 18.9505 20.4972L15.0129 16.4909C13.7572 17.4383 12.1942 18 10.5 18ZM16 10.5C16 13.5376 13.5376 16 10.5 16C7.46243 16 5 13.5376 5 10.5C5 7.46243 7.46243 5 10.5 5C13.5376 5 16 7.46243 16 10.5Z"
          fill="#E3E8ED"
        />
        <mask id="mask0_2060_5075" maskUnits="userSpaceOnUse" x="3" y="3" width="18" height="18">
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M10.5 18C6.35786 18 3 14.6421 3 10.5C3 6.35786 6.35786 3 10.5 3C14.6421 3 18 6.35786 18 10.5C18 12.2269 17.4164 13.8175 16.4356 15.0852L20.3769 19.0953C20.764 19.4892 20.7586 20.1223 20.3647 20.5095C19.9708 20.8966 19.3376 20.8911 18.9505 20.4972L15.0129 16.4909C13.7572 17.4383 12.1942 18 10.5 18ZM16 10.5C16 13.5376 13.5376 16 10.5 16C7.46243 16 5 13.5376 5 10.5C5 7.46243 7.46243 5 10.5 5C13.5376 5 16 7.46243 16 10.5Z"
            fill="white"
          />
        </mask>
        <g mask="url(#mask0_2060_5075)">
          <path fillRule="evenodd" clipRule="evenodd" d="M0 24H24V0H0V24Z" fill="#E3E8ED" />
        </g>
      </g>
      <defs>
        <clipPath id="clip0_2060_5075">
          <rect width="24" height="20.1429" fill="white" />
        </clipPath>
      </defs>
    </svg>
  )
}

export default memo(SearchIcon)
