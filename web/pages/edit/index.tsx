import { Table, Box, TableBody, TableRow, TableCell } from '@mui/material';
import { Add as AddIcon } from '@mui/icons-material';

export default function Home() {
  const x = 7;
  const y = 7;

  const data: (number | undefined | null)[][] = []; // Array<Array<number>(y)>(x)

  return (
    <Box
      sx={{ '--seating-table-x': x, '--seating-table-y': y }}
      display="flex"
      minHeight="100%"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
    >
      <h1>座位分配</h1>

      <Box
        sx={{
          p: 2,
          width: '80%',
          maxWidth: '1200px',
          height: '100%',
          flexDirection: 'column',
          '&,>div': { display: 'flex', alignItems: 'center' },
        }}
      >
        <Box
          sx={{
            width: '90%',
            height: 40,
            border: '1px solid black',
            '&, ~div': { justifyContent: 'center' },
          }}
        >
          黑板
        </Box>
        <Table sx={{ td: { border: '1px solid #e0e0e0' }, mt: 4 }}>
          <TableBody>
            {data.map((XD, XI) => (
              <TableRow key={XI}>
                {XD.map((YD, YI) => (
                  <TableCell
                    key={YI}
                    sx={{ padding: '2em 0', textAlign: 'center' }}
                  >
                    {YD ? (
                      <Box>
                        <AddIcon />
                      </Box>
                    ) : (
                      <Box></Box>
                    )}
                    {/* {XI + 1}-{YI + 1} */}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Box>
    </Box>
  );
}
