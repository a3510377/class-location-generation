import { EventEmitter } from 'eventemitter3';

export interface PosData {
  id: number;
  name: string;
}

export class Client extends EventEmitter<EventMap> {
  conn: EventSource;
  data: (PosData | undefined)[][] = [];

  constructor() {
    super();

    this.conn = new EventSource('/api/message');

    this.conn.addEventListener('open', () => this.emit('connect'));
    this.conn.addEventListener('set', this._onSetPos.bind(this));
  }

  _onSetPos({ data }: MessageEvent<string>) {
    this.data = JSON.parse(data);
    this.emit('change', this.data);
  }
}

export interface EventMap {
  connect: [];
  change: [(PosData | undefined)[][]];
}
