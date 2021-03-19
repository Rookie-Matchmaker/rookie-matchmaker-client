import { render, RenderResult } from '@testing-library/react';
import { NextRouter } from 'next/router';
import client, { Session } from 'next-auth/client';
import { Ticket, TicketProvider } from '@/contexts/ticketContext';
import { Dispatch, SetStateAction } from 'react';
import { RenderResult as ReactHookRenderResult } from '@testing-library/react-hooks';

export const mockRouter: NextRouter & { isLocaleDomain: boolean } = {
  basePath: '',
  pathname: '/',
  route: '/',
  asPath: '/',
  query: {},
  push: jest.fn(),
  replace: jest.fn(),
  reload: jest.fn(),
  back: jest.fn(),
  prefetch: jest.fn(),
  beforePopState: jest.fn(),
  events: {
    on: jest.fn(),
    off: jest.fn(),
    emit: jest.fn(),
  },
  isFallback: false,
  isReady: true,
  isLocaleDomain: false,
  isPreview: false,
};
export const mockAuthenticate = ({
  sessionState = true,
  loading = false,
}: {
  sessionState?: boolean;
  loading?: boolean;
} = {}): void => {
  if (sessionState === false) {
    client.useSession = jest.fn().mockReturnValueOnce([false, loading]);
    return;
  }
  const mockSession: Session = {
    expires: '1',
    user: { email: 'a', name: 'Delta', image: 'c' },
  };
  client.useSession = jest.fn().mockReturnValueOnce([mockSession, false]);
};
export * from '@testing-library/react';

export const renderWithTicket = (
  Component: React.FunctionComponent,
  ticketState: ReactHookRenderResult<[Ticket, Dispatch<SetStateAction<Ticket>>]>
): RenderResult => {
  const ticketProviderValue = {
    ticket: ticketState.current[0],
    setTicket: ticketState.current[1],
  };
  return render(
    <TicketProvider value={ticketProviderValue}>
      <Component />
    </TicketProvider>
  );
};
