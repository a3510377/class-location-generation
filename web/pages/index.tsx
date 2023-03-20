import { Table, Box, TableBody, TableRow, TableCell } from '@mui/material';
import {
  Add as AddIcon,
  Fullscreen as FullscreenIcon,
} from '@mui/icons-material';

export default function Home() {
  const x = 7;
  const y = 7;
  const users: { name: string }[] = [{ name: '你好' }, { name: '我很好' }];

  const data: (number | undefined)[][] = Array.from({ length: x }).map(() =>
    Array.from({ length: y })
  ); // Array<Array<number>(y)>(x)

  data[1][1] = 1;

  return (
    <Box
      sx={{ '--seating-table-x': x, '--seating-table-y': y }}
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      maxWidth="1800px"
      width={1}
      fontSize= {20}
      >
      <h1>座位分配</h1>

      <Box
        sx={{
          p: 2,
          width: '80%',
          height: 1,
          flexDirection: 'column',
          '&,>div': { display: 'flex', alignItems: 'center' },
        }}
      fontSize=   {20}
      >
        <Box
      fontSize= {20}
      sx={{
            width: '90%',
            height: 50,
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
                {XD.map((data, YI) => (
                  <TableCell
                    key={YI}
                    sx={{
                      p: '5px 1em',
                      width: '100px',
                      textAlign: 'center',
                      lineHeight: '2em',
                      '>div': { minHeight: '2em', margin: 'auto' },
                    }}
                  >
                    <Box>{`${XI + 1}-${y - YI}`}</Box>
                    {data === -1 ? (
                      <Box>無效位置</Box>
                    ) : data === void 0 ? (
                      <Box>空</Box>
                    ) : (
                      <Box>{users?.[data].name}</Box>
                    )}
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
