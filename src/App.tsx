import { useEffect, useState } from 'react';

import Grid2 from '@mui/material/Unstable_Grid2/Grid2';
import { Box, Stack } from '@mui/material';
import { io } from 'socket.io-client';

export interface PosData {
  id: number;
  name: string;
}

function App() {
  const [data, setData] = useState<(PosData | undefined)[][]>(() => []);
  const baseFont = { fontSize: { sm: '14pt', md: '16pt', lg: '18pt' } };

  useEffect(() => {
    const socket = io(import.meta.env.VITE_API_URL, {
      withCredentials: true,
    });
    socket.connect();
    socket.on('set', (data) => setData(data));

    return () => {
      socket.disconnect();
    };
  }, []);

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
                <Box key={y} sx={baseFont}>
                  無
                </Box>
              )
            )}
          </Grid2>
        ))}
      </Grid2>
    </>
  );
}

export default App;
