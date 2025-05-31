import { COLORS } from '../../../styles/theme/colors'

export function SimpleJsonCode(props: { data: Record<string, any> }) {
  return (
    <textarea
      readOnly
      value={JSON.stringify(props.data, null, 2)}
      style={{
        width: '100%',
        height: '350px',
        color: COLORS.brandExtraDark,
        background: COLORS.grayLight,
        borderRadius: '5px',
        padding: '10px',
      }}
    />
  )
}
