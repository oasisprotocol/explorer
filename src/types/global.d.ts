declare global {
  namespace NodeJS {
    interface ProcessEnv {
      NODE_ENV: 'development' | 'production' | 'test'
      REACT_APP_BUILD_DATETIME: string
      REACT_APP_BUILD_SHA: string
      REACT_APP_BUILD_VERSION: string
      REACT_APP_API: string
      REACT_APP_TESTNET_API: string
      REACT_APP_SHOW_BUILD_BANNERS?: 'true' | 'false'
      REACT_APP_META_TITLE: string
      REACT_APP_META_IMAGE: string
      REACT_APP_META_MANIFEST: string
      REACT_APP_META_FAVICON: string
      REACT_APP_META_DESC: string
      REACT_APP_SOCIAL_TELEGRAM?: string
      REACT_APP_SOCIAL_TWITTER?: string
      REACT_APP_SOCIAL_DISCORD?: string
      REACT_APP_SOCIAL_YOUTUBE?: string
      REACT_APP_SOCIAL_REDDIT?: string
      REACT_APP_SOCIAL_LINKEDIN?: string
      REACT_APP_SOCIAL_DOCS?: string
      REACT_APP_SOCIAL_HOME?: string
      REACT_APP_PRODUCTION_URLS: string
      REACT_APP_STAGING_URLS?: string
      REACT_APP_FIXED_NETWORK?: string
      REACT_APP_FIXED_LAYER?: string
      REACT_APP_SHOW_FIAT_VALUES?: string
      REACT_APP_SHOW_PRIVACY_POLICY?: string
    }
  }
}

export {}
