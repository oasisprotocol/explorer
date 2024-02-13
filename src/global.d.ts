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
      REACT_APP_TITLE: string
      REACT_APP_DESC: string
      REACT_APP_SOCIAL_TELEGRAM?: string
      REACT_APP_SOCIAL_TWITTER?: string
      REACT_APP_SOCIAL_DISCORD?: string
      REACT_APP_SOCIAL_YOUTUBE?: string
      REACT_APP_SOCIAL_REDDIT?: string
      READ_APP_SOCIAL_LINKEDIN?: string
      READ_APP_SOCIAL_DOCS?: string
      READ_APP_SOCIAL_HOME?: string
      REACT_APP_PROD_URL: string
      REACT_APP_STAGING_URL?: string
    }
  }
}
