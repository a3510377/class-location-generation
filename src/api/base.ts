import { EventEmitter } from 'events';

export class Client extends EventEmitter {
  conn: EventSource;
  data: (number | undefined)[][] = [];

  constructor() {
    super();
    this.conn = new EventSource(import.meta.env.API_URL);

    this.conn.addEventListener('open', this.emit.bind(null, 'connect'));
    this.conn.addEventListener('message', this._onMessage.bind(this));
  }

  _onMessage(msg: MessageEvent<RawData<keyof RawEventData>>) {
    const {
      data: { event, data },
    } = msg;

    switch (event) {
      case 'setPos': {
        const value = data as RawEventData['setPos'];

        const [, x, y, , userID] = value.match(/(\d+)-(\d+)(:(\d+))?/) || [];
        this.data[+x] ||= [];
        this.data[+x][+y] = userID ? +userID : void 0;

        break;
      }
      case 'newUser':
        break;
    }
  }
}

export interface EventMap {
  connect: [];
}

export interface RawEventData {
  setPos: `${number}-${number}:${number}` | `${number}-${number}`; // x-y:userID | x-y
  newUser: { id: string; name: string };
}

interface RawData<K extends keyof RawEventData> {
  event: K;
  data: RawEventData[K];
}

export interface Client {
  emit<K extends keyof EventMap>(eventName: K, ...args: EventMap[K]): boolean;
  addListener<K extends keyof EventMap>(
    eventName: K,
    listener: (...args: EventMap[K]) => void
  ): this;
  on<K extends keyof EventMap>(
    event: K,
    listener: (...args: EventMap[K]) => void
  ): this;
  once<K extends keyof EventMap>(
    eventName: K,
    listener: (...args: EventMap[K]) => void
  ): this;
  removeListener<K extends keyof EventMap>(
    eventName: K,
    listener: (...args: EventMap[K]) => void
  ): this;
  off<K extends keyof EventMap>(
    eventName: K,
    listener: (...args: EventMap[K]) => void
  ): this;
}
