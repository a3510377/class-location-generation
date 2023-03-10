import { Unstable_Grid2 as Grid, Box } from '@mui/material';

export default function Home() {
  const x = 7;
  const y = 7;

  return (
    <>
      <Box display="flex" minHeight="100%">
        <h1>座位分配</h1>
        <Box
          width="80%"
          display="flex"
          alignItems="center"
          flexDirection="column"
        >
          <Box
            sx={{
              width: 150,
              height: 50,
              border: '1px solid black',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            黑板
          </Box>
          <Box>
            {Array.from({ length: x }).map((_, i) => (
              <Box key={i} display="flex">
                {Array.from({ length: y }).map((_, i) => (
                  <Box key={i}>test</Box>
                ))}
              </Box>
            ))}
          </Box>
        </Box>
      </Box>
    </>
  );
}
