declare global {
  namespace NodeJS {
    interface ProcessEnv {
      NODE_ENV: 'development' | 'production' | 'test'
      REACT_APP_BUILD_DATETIME: string
      REACT_APP_BUILD_SHA: string
      REACT_APP_BUILD_VERSION: string
      REACT_APP_PRIVACY_POLICY: string
      /** Access it through {@link window.REACT_APP_ENABLE_OASIS_MATOMO_ANALYTICS} instead, to support overriding it in e2e tests */
      REACT_APP_ENABLE_OASIS_MATOMO_ANALYTICS: never
      REACT_APP_API: string
      REACT_APP_TESTNET_API: string
      REACT_APP_SHOW_BUILD_BANNERS: 'true' | 'false'
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
      REACT_APP_SKIP_GRAPH?: string
      REACT_APP_SHOW_FIAT_VALUES: 'true' | 'false'
      REACT_APP_LOCALNET_CONSENSUS: 'true' | 'false'
      REACT_APP_LOCALNET_SAPPHIRE: 'true' | 'false'
      REACT_APP_LOCALNET_EMERALD: 'true' | 'false'
    }
  }

  interface Window {
    REACT_APP_ENABLE_OASIS_MATOMO_ANALYTICS: 'true' | 'false'
  }
}

export {}
