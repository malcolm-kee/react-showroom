import { useSubRoot } from '../lib/routing';
import { Div } from './base';
import { Header } from './header';

export const StandalonePageContainer = (props: {
  children: React.ReactNode;
}) => {
  const subRoot = useSubRoot();

  return (
    <Div
      css={{
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
      }}
    >
      <Header backUrl={subRoot} />
      {props.children}
    </Div>
  );
};
