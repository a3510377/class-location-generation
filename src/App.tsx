import { useState, useMemo } from 'react';

import { Client } from './api/base';
import Grid from '@mui/material/Unstable_Grid2';
import { Box, Stack } from '@mui/material';

function App() {
  const client = useMemo(() => new Client(), []);
  const [data, setData] = useState(() => [...client.data]);

  client.on('change', (data) => setData([...data]));

  return (
    <Grid container>
      {data.map((s, i) => (
        <Grid>
          <Stack key={i}>
            {(s || []).map((d, i) => (
              <Box height={10} key={i}>
                {d}
              </Box>
            ))}
          </Stack>
        </Grid>
      ))}
    </Grid>
  );
}

export default App;
