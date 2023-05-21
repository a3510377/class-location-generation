import { useState, useEffect, useMemo } from 'react';

import { Client } from './api/base';

function App() {
  const client = useMemo(() => new Client(), []);
  const [data, setData] = useState(() => [...client.data]);

  client.on('change', (data) => setData([...data]));

  return (
    <div>
      {data.map((s, i) => (
        <div key={i}>
          {(s || []).map((d, i) => (
            <div key={i}>{d}</div>
          ))}
        </div>
      ))}
    </div>
  );
}

export default App;
