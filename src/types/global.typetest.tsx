export function ExpectEnvToHaveStrictType() {
  import.meta.env.REACT_APP_SHOW_BUILD_BANNERS = 'false'
  import.meta.env.REACT_APP_SHOW_BUILD_BANNERS = 'true'
  import.meta.env.REACT_APP_API = 'https://'

  // @ts-expect-error Expect typescript to detect unsupported value
  import.meta.env.REACT_APP_SHOW_BUILD_BANNERS = 'unsupported_value'
  // @ts-expect-error Expect typescript to detect required field
  import.meta.env.REACT_APP_API = undefined
}
