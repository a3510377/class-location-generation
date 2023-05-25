import { EventEmitter } from 'eventemitter3';

export class Client extends EventEmitter<EventMap> {
  conn: EventSource;
  data: (number | undefined)[][] = [];

  constructor() {
    super();

    this.conn = new EventSource('/api/message');

    this.conn.addEventListener('open', () => this.emit('connect'));
    this.conn.addEventListener('setPos', this._onSetPos.bind(this));
    this.conn.addEventListener('setup', ({ data }: MessageEvent<string>) => {
      const [x, y] = data.split(';');
      if (x && y) {
        Object.assign(
          this.data,
          Array.from(Array.from({ length: +x }), () =>
            Array.from({ length: +y })
          )
        );
        this.emit('change', this.data);
      }
    });
    this.conn.addEventListener('reset', this.setData.bind(null, []));
  }

  _onSetPos({ data }: MessageEvent<string>) {
    const [, x, y, , userID] = data.match(/(\d+)-(\d+)(:(\d+))?/) || [];

    if (x && y) {
      this.data[+x] ||= [];
      this.data[+x][+y] = userID ? +userID : void 0;

      this.setData(this.data);
    }
  }

  setData(data: (number | undefined)[][]) {
    this.data = data;
    this.emit('change', this.data);
  }
}

export interface EventMap {
  connect: [];
  change: [(number | undefined)[][]];
}
