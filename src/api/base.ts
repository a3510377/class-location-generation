import { EventEmitter } from 'eventemitter3';

export class Client extends EventEmitter<EventMap> {
  conn: EventSource;
  data: (number | undefined)[][] = [];

  constructor() {
    super();

    this.conn = new EventSource('/api/message');

    this.conn.addEventListener('open', () => this.emit('connect'));
    this.conn.addEventListener('setPos', this._onSetPos.bind(this));
  }

  _onSetPos({ data }: MessageEvent<string>) {
    const [, x, y, , userID] = data.match(/(\d+)-(\d+)(:(\d+))?/) || [];

    if (x && y) {
      this.data[+x] ||= [];
      this.data[+x][+y] = userID ? +userID : void 0;

      this.emit('change', this.data);
    }
  }
}

export interface EventMap {
  connect: [];
  change: [(number | undefined)[][]];
}
