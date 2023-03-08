import { Unstable_Grid2 as Grid, Box } from '@mui/material';

export default function Home() {
  return (
    <>
      <Box flex="flex">
        <h1>座位分配</h1>
        <Grid container spacing={7}>
          {Array.from({ length: 10 }).map((_, i) => (
            <Box key={i}>test</Box>
          ))}
        </Grid>
      </Box>
    </>
  );
}
