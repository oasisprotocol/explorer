export function ExpectEnvToHaveStrictType() {
  process.env.REACT_APP_SHOW_BUILD_BANNERS = 'false'
  process.env.REACT_APP_SHOW_BUILD_BANNERS = 'true'
  process.env.REACT_APP_API = 'https://'

  // @ts-expect-error Expect typescript to detect unsupported value
  process.env.REACT_APP_SHOW_BUILD_BANNERS = 'unsupported_value'
  // @ts-expect-error Expect typescript to detect required field
  process.env.REACT_APP_API = undefined
}
