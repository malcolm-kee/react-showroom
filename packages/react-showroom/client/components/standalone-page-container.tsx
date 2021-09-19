import { Div } from './base';

export const StandalonePageContainer = (props: {
  children: React.ReactNode;
}) => {
  return (
    <Div
      css={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {props.children}
    </Div>
  );
};
