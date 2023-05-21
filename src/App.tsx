import { useSyncExternalStore } from 'react';

import { Client } from './api/base';

function App() {
  const client = new Client();
  const data = useSyncExternalStore(
    client.subscribe.bind(client),
    () => client.data
  );

  return <div>{data}</div>;
}

export default App;
