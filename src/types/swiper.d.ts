import Swiper from 'swiper/types/swiper-class'

export interface SlideChangeEvent extends Event {
  detail: [Swiper]
}

declare global {
  namespace JSX {
    interface IntrinsicElements {
      'swiper-container': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement>
      'swiper-slide': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement>
    }
  }

  interface ElementEventMap {
    slidechange: SlideChangeEvent
  }
}

export {}
