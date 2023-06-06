import { useState } from 'react';

import { Client } from './base';
import Grid2 from '@mui/material/Unstable_Grid2/Grid2';
import { Box, Stack } from '@mui/material';

function App() {
  const client = new Client();
  const [data, setData] = useState<typeof client.data>(() => []);
  const baseFont = { fontSize: { sm: '14pt', md: '16pt', lg: '18pt' } };

  client.on('change', (data) => setData([...data]));

  return (
    <>
      <Box
        component="p"
        sx={{
          margin: 0,
          marginBottom: 2,
          textAlign: 'center',
          fontSize: '28pt',
          fontWeight: 'bold',
        }}
      >
        講台
      </Box>
      <Grid2
        container
        columns={7}
        sx={{
          height: '100%',
          maxHeight: '600px',
          '--Grid-borderWidth': '1px',
          borderTop: 'var(--Grid-borderWidth) solid',
          borderLeft: 'var(--Grid-borderWidth) solid',
          borderColor: 'cadetblue',
          '& > div, & > div > div': {
            height: '100%',
            borderRight: 'var(--Grid-borderWidth) solid',
            borderBottom: 'var(--Grid-borderWidth) solid',
            borderColor: 'cadetblue',
          },
          '& > div > div': {
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          },
        }}
      >
        {data.map((XData, x) => (
          <Grid2 key={x} component={Stack} xs={1}>
            {XData.map((YData, y) =>
              YData ? (
                <Stack key={y}>
                  <Box
                    sx={{ fontSize: { sm: '16pt', md: '18pt', lg: '20pt' } }}
                    paddingBottom="4px"
                  >
                    {YData?.id}
                  </Box>
                  <Box sx={baseFont}>{YData?.name}</Box>
                </Stack>
              ) : (
                <Box sx={baseFont}>無</Box>
              )
            )}
          </Grid2>
        ))}
      </Grid2>
    </>
  );
}

export default App;
