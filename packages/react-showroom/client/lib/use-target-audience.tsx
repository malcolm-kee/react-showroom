import { createNameContext, usePersistedState } from '@showroomjs/ui';
import * as React from 'react';
import { audienceDefault } from './config';

export type Audience = 'developer' | 'designer';

const TargetAudienceContext = createNameContext<Audience>(
  'TargetAudienceContext',
  'developer'
);
const TargetAudienceDispatch = createNameContext<(audience: Audience) => void>(
  'AudienceDispatch',
  () => {}
);

export const TargetAudienceProvider = (props: {
  children: React.ReactNode;
}) => {
  const [audience, setAudience] = usePersistedState<Audience>(
    audienceDefault && audienceDefault === 'design' ? 'designer' : 'developer',
    'audience'
  );

  return (
    <TargetAudienceContext.Provider value={audience}>
      <TargetAudienceDispatch.Provider value={setAudience}>
        {props.children}
      </TargetAudienceDispatch.Provider>
    </TargetAudienceContext.Provider>
  );
};

export const useTargetAudience = () => React.useContext(TargetAudienceContext);

export const useTargetAudienceDispatch = () =>
  React.useContext(TargetAudienceDispatch);
