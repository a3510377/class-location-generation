import { Unstable_Grid2 as Grid, Box } from '@mui/material';

export default function Home() {
  const x = 7;
  const y = 7;

  return (
    <>
      <Box
        display="flex"
        width="100%"
        minHeight="100%"
        alignItems="center"
        justifyContent="center"
        flexDirection="column"
      >
        <h1>座位分配</h1>
        <Grid container columns={x} width="100%" height="100%">
          {Array.from({ length: x }).map((_, i) => (
            <Grid xs={1} key={i} columns={y}>
              {Array.from({ length: y }).map((_, i) => (
                <Box key={i} textAlign="center" sx={{}}>
                  test
                </Box>
              ))}
            </Grid>
          ))}
        </Grid>
      </Box>
    </>
  );
}
