import { useEffect, useState } from 'react';

import Grid2 from '@mui/material/Unstable_Grid2/Grid2';
import { Box, Stack } from '@mui/material';
import { io } from 'socket.io-client';
import JSZip from 'jszip';
import axios from 'axios';
import { saveAs } from 'file-saver';

export interface PosData {
  id?: number;
  name?: string;
  simPosID?: number;
}

// 號碼 {{\d-\d}}
// 姓名 {{\d_\d}}
const config = {
  Y: '112', // {{Y}}年度
  N: '二', // 第{{N}}學期
  C: '電子二忠', // 班級: {{C}}
  L: '33', // 班級學生總人數：{{L}}員
  T: '劉美惠', // 導師：{{T}}
};

export type PosDataList = (PosData | undefined)[][];

function App() {
  const [data, setData] = useState<PosDataList>(() => []);
  const [users, setUsers] = useState<string[]>(() => []);
  const [dataUsers, setDataUsers] = useState<string[]>(() => []);
  const [catchData, setCatchData] = useState<number[]>(() => []);
  const baseFont = { fontSize: { sm: '14pt', md: '16pt', lg: '18pt' } };

  useEffect(() => {
    const socket = io(import.meta.env.VITE_API_URL);
    socket.connect();
    socket.on('set', (data) => setData(data));
    socket.on('users', (data) => setUsers(data));

    return () => {
      socket.disconnect();
    };
  }, []);
  useEffect(() => {
    if (!data.length) return;

    setCatchData(
      data
        .reduce((a, b) => a.concat(b))
        .filter(Boolean)
        .map((d) => d?.id as number)
        .filter((value, _, list) => list.filter((c) => c === value).length > 1)
    );

    setDataUsers(
      data
        .flat()
        .map((x) => x?.name)
        .filter(Boolean) as string[]
    );
  }, [data]);

  const download = async () => {
    const template = await axios
      .get(`${import.meta.env.BASE_URL}/assets/template.docx`, {
        responseType: 'blob',
      })
      .then(({ data }) => data);

    const zip = await JSZip.loadAsync(template);
    const templateDocument =
      (await zip.file('word/document.xml')?.async('string')) || '';

    let newDocument = templateDocument
      .replaceAll('{{Y}}', config.Y)
      .replaceAll('{{N}}', config.N)
      .replaceAll('{{C}}', config.C)
      .replaceAll('{{L}}', config.L)
      .replaceAll('{{T}}', config.T);

    data.forEach((list, x) => {
      x++;
      list.forEach((pos, y) => {
        if (!pos) return;
        y++;

        newDocument = newDocument
          .replaceAll(`{{${x}-${y}}}`, (pos.id ?? '').toString())
          .replaceAll(`{{${x}_${y}}}`, pos.name || '');
      });
    });

    zip.file(
      'word/document.xml',
      newDocument.replaceAll(/\{\{\d+[-_]\d+\}\}/g, '')
    );

    zip.generateAsync({ type: 'blob' }).then((content) => {
      saveAs(
        content,
        `${config.C}${config.Y}學年度第${config.N}學期班級座位表.docx`
      );
    });
  };

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
          <Grid2
            key={x}
            component={Stack}
            xs={1}
            mx={{ border: 'none!important' }}
          >
            {XData.map((YData, y) =>
              YData ? (
                <Stack
                  key={y}
                  sx={{
                    position: 'relative',
                    ...(catchData.includes(YData.id as number) && {
                      color: 'red',
                      fontWeight: 'bold',
                    }),
                  }}
                >
                  <Box
                    sx={{ fontSize: { sm: '16pt', md: '18pt', lg: '20pt' } }}
                    paddingBottom="4px"
                  >
                    {YData?.id}
                  </Box>
                  <Box sx={baseFont}>{YData?.name}</Box>
                  {YData.simPosID !== void 0 && (
                    <Box
                      sx={{
                        position: 'absolute',
                        bottom: 4,
                        right: 6,
                        fontSize: { sm: '12pt', md: '14pt', lg: '16pt' },
                      }}
                    >
                      {YData.simPosID + 1}
                    </Box>
                  )}
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
      <Box sx={{ position: 'fixed', bottom: '2em', right: '2em' }}>
        <button onClick={download}>下載</button>
      </Box>
      <Box>
        {(users.length - dataUsers.length <= 10
          ? users.filter((x) => !dataUsers.includes(x))
          : []
        ).join(', ')}
      </Box>
    </>
  );
}

export default App;
