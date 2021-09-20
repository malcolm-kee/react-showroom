import { Div } from './base';

export const StandalonePageContainer = (props: {
  children: React.ReactNode;
}) => {
  return (
    <Div
      css={{
        flex: 1,
      }}
    >
      {props.children}
    </Div>
  );
};
