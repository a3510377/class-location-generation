import { useImmer } from 'use-immer';
import { Table, Box, TableBody, TableRow, TableCell } from '@mui/material';
import { SyntheticEvent, useRef, useState } from 'react';

const getTouchIdentifier = (e: TouchEvent) => {
  return e.touches[0];
};

export default function Home() {
  const x = 7;
  const y = 7;

  const [state, setState] = useState<{
    dragover: string;
    dragging: string;
    ghostEl?: HTMLElement;
  }>({ dragover: '', dragging: '', ghostEl: void 0 });

  const [users, setUsers] = useState<{ name: string }[]>([
    { name: '你好' },
    { name: '我很好' },
  ]);
  const [data, setData] = useImmer<(number | undefined)[][]>(
    Array.from({ length: x }).map(() => {
      return Array.from({ length: y }).map(() => void 0);
    })
  ); // Array<Array<number>(y)>(x)

  return (
    <Box
      sx={{
        '--seating-table-x': x,
        '--seating-table-y': y,
        userSelect: 'none',
      }}
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      maxWidth="1800px"
      width={1}
      fontSize={20}
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
        fontSize={20}
      >
        <Box
          fontSize={20}
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
                {XD.map((d, YI) => {
                  const ID = `${XI}-${YI}`;
                  const current = state.dragging === ID;
                  // eslint-disable-next-line react-hooks/rules-of-hooks
                  const ref = useRef<HTMLElement>(null);

                  const ghostEl = (el: HTMLElement) => {
                    const ghostEl = el.cloneNode(true) as HTMLElement;
                    const { top, left, height, width } =
                      el.getBoundingClientRect();

                    state.ghostEl?.parentNode?.removeChild(state.ghostEl);
                    setState((state) => ({ ...state, ghostEl }));

                    const style = ghostEl.style;

                    style.boxSizing = 'border-box';
                    style.margin = '0';
                    style.top = `${top}px`;
                    style.left = `${left}px`;
                    style.width = `${width}px`;
                    style.height = `${height}px`;
                    style.opacity = '0.8';
                    style.zIndex = '1000';
                    style.pointerEvents = 'none';
                    style.transition = style.transform = '';
                    style.display = 'black';
                    style.position = 'fixed';

                    document.body.appendChild(ghostEl);
                  };

                  const handleDragStart = (e: SyntheticEvent) => {
                    setState((state) => ({ ...state, dragging: ID }));

                    if (e.type === 'touchstart') {
                      ref.current && ghostEl(ref.current);
                      e.preventDefault();
                    }

                    e.stopPropagation();
                  };
                  const clearState = (e: SyntheticEvent) => {
                    state.ghostEl?.parentNode?.removeChild(state.ghostEl);

                    setData((d) => {
                      const st = d[XI][YI];
                    });

                    setState((state) => ({
                      ...state,
                      dragging: '',
                      dragover: '',
                      ghostEl: void 0,
                    }));
                  };
                  const changeCurrent = (e: SyntheticEvent) => {
                    if (!state.dragging) return;

                    const {
                      dataset: { id },
                    } = e.target as HTMLElement;

                    if (id) setState((state) => ({ ...state, dragover: id }));

                    if (e.type === 'touchmove') {
                      const ghostEl = state.ghostEl;
                      if (!ghostEl) return;
                      const touch = getTouchIdentifier(
                        e as unknown as TouchEvent
                      );

                      const x = touch.clientX - ghostEl.offsetWidth / 2;
                      const y = touch.clientY - ghostEl.offsetHeight / 2;

                      ghostEl.style.left = `${x}px`;
                      ghostEl.style.top = `${y}px`;

                      // TODO
                      // document.elementFromPoint(x, y);
                    }
                  };

                  return (
                    <TableCell
                      key={YI}
                      data-id={ID}
                      draggable
                      ref={ref}
                      sx={{
                        p: '5px 1em',
                        width: '100px',
                        textAlign: 'center',
                        lineHeight: '2em',
                        '>div': { minHeight: '2em', margin: 'auto' },

                        transition:
                          'all .6s cubic-bezier(0.165, 0.84, 0.44, 1)',
                        opacity: current ? 0.5 : null,

                        backgroundColor:
                          (state.dragover === ID && 'purple') || void 0,
                      }}
                      // start
                      onDragStart={handleDragStart}
                      onMouseDown={handleDragStart}
                      onTouchStart={handleDragStart}
                      // move
                      onDragOver={changeCurrent}
                      onDragEnter={changeCurrent}
                      onMouseMove={changeCurrent}
                      onTouchMove={changeCurrent}
                      // end
                      onDragEnd={clearState}
                      onDrop={clearState}
                      onMouseUp={clearState}
                      onTouchEnd={clearState}
                      onTouchCancel={clearState}
                    >
                      <Box>{`${XI + 1}-${y - YI}`}</Box>
                      {d === -1 ? (
                        <Box>無效位置</Box>
                      ) : d === void 0 ? (
                        <Box>空</Box>
                      ) : (
                        <Box>{users?.[d].name}</Box>
                      )}
                    </TableCell>
                  );
                })}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Box>
    </Box>
  );
}
