export interface TextProps extends React.ComponentPropsWithoutRef<'p'> {}

/**
 * @deprecated just use plain text
 *
 * @version 1.0.0
 */
export const Text = (props: TextProps) => <p {...props} />;
