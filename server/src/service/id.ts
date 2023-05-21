// id summon
// 111111111111111111111111111111111111111111 ------1111
// 46                                       5 4        0
//                           timestamp(42bit) step(4bit)

export const EpochDate = new Date('2023-05-01 00:00:00Z');
export const Epoch = EpochDate.getTime();

export const TimeShift = 4n;
export const MaxStep = 1n << TimeShift;
export const IDBit = 46;

export class ID {
  protected static _step = 0n;
  protected static _time: Date = new Date();

  public readonly id: bigint;
  constructor(id?: string | bigint) {
    this.id = BigInt(id || ID.create().id);
  }

  toString(radix?: number): string {
    return this.id.toString(radix);
  }

  get step() {
    return this.id & (MaxStep - 1n);
  }

  get time() {
    return new Date(Number(this.id >> TimeShift) + Epoch);
  }

  static create(time?: Date): ID {
    let now = time || new Date();

    if (now.getTime() - this._time.getTime() === 0) {
      ID._step = ++ID._step > MaxStep - 1n ? 0n : ID._step;

      if (ID._step === 0n) {
        ID._time = now;

        while (now <= ID._time) now = new Date();
      }
    } else ID._step = 0n;
    ID._time = now;

    return new ID((BigInt(now.getTime() - Epoch) << TimeShift) | ID._step);
  }
}

export default ID;
