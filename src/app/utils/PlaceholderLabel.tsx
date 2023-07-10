import { FC } from 'react'

/**
 * Placeholder label to be used for i18next's trans
 *
 * For some reason, Trans will accept neither simple strings,
 * nor on-the-fly constructed DOM nodes for components.
 * You can use this as a thin wrapper to fix this.
 */
export const PlaceholderLabel: FC<{ label: string }> = ({ label }) => <>{label}</>
