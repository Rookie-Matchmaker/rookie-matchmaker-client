import { useReducer } from 'react';
import { actionType } from '@/components/SearchConfigButton';
import { Flex } from '@chakra-ui/react';
import SearchConfigCard from '@/layouts/SearchConfigCard';
import { Layout, PageHeading, Button } from '@/components/CustomComponents';
import withAuth from 'src/hoc/withAuthentication';
import { Session } from 'next-auth/client';
import { User } from 'next-auth';

type searchConfigType = {
  roleSelection: Record<string, boolean>;
  serverSelection: Record<string, boolean>;
};

const defaultSearchConfig = {
  roleSelection: {
    rockie: false,
    coach: false,
  },
  serverSelection: {
    us: false,
    eu: false,
    sea: false,
  },
};

const roleSelectionDictionary = ['Player', 'Coach'];
const serverSelectionDictionary = ['US', 'EU', 'SEA'];
const toggleSearchConfig = (
  state: searchConfigType,
  action: actionType
): searchConfigType => {
  const { configValue } = action;
  switch (action.configType) {
    case 'role':
      return {
        ...state,
        roleSelection: {
          ...state.roleSelection,
          [configValue]: !state.roleSelection[configValue],
        },
      };
      break;
    case 'server':
      return {
        ...state,
        serverSelection: {
          ...state.serverSelection,
          [configValue]: !state.serverSelection[configValue],
        },
      };
      break;
    default:
      throw new Error('Unexcepted Action Type');
  }
};
const postData = async ({
  id,
  steamID,
}: User): Promise<Record<string, string>> => {
  const ticketID = await fetch('https://mm.rmm-service.devinda.me/ticket', {
    method: 'POST',
    mode: 'cors',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      playerID: id,
      steamID,
    }),
  });
  return ticketID.json();
};
function Index({ session }: { session: Session }): React.ReactElement {
  const [
    { roleSelection, serverSelection },
    dispatchSearchConfigState,
  ] = useReducer(toggleSearchConfig, defaultSearchConfig);
  return (
    <Layout>
      <PageHeading>Are You Ready ?</PageHeading>
      <Flex w={['20rem', '36rem']} justifyContent="space-around">
        <SearchConfigCard
          dispatchSearchConfigState={dispatchSearchConfigState}
          dictionary={roleSelectionDictionary}
          configState={roleSelection}
          configType="role"
          configTitle="Roles"
        />
        <SearchConfigCard
          dispatchSearchConfigState={dispatchSearchConfigState}
          dictionary={serverSelectionDictionary}
          configState={serverSelection}
          configType="server"
          configTitle="Server"
        />
      </Flex>
      <Button onClick={() => postData(session.user)}>Search</Button>
    </Layout>
  );
}
export default withAuth(Index);
