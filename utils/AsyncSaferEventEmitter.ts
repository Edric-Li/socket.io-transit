import * as ErrorStackParser from 'error-stack-parser';
import P2mLogger from 'p2m-common-logger';
// eslint-disable-next-line no-unused-vars
import { Namespace } from 'socket.io';

const logger = new P2mLogger('promise');

const nameCache: {[name: string]: number} = {};

export default class AsyncSaferEventEmitter {
  constructor(io: any, name?: string) {
    let n: string;
    if (!name) {
      const stack = ErrorStackParser.parse(new Error('get stack'));
      const caller = stack[1]; // 0 is current constructor, 1 is caller of this func.
      n = `${caller.functionName}_LN_${caller.lineNumber}_COL_${caller.columnNumber}`;
      if (nameCache[n]) {
        n = `${n}_${nameCache[n]}`;
        nameCache[n]++;
      } else {
        nameCache[n] = 1;
      }
    } else {
      n = name;
    }

    this.io = io;
    this.name = n;
    this.to = (room:string) => io.to(room);
  }

  private readonly io:Namespace;

  private readonly name: string;

  public readonly to:Function;

  on(event: string, func: (...args: any[]) => void | PromiseLike<void>, funcName?: string) {
    const funcName2 = funcName || func.name || 'anonymous function';
    // @ts-ignore
    this.io.on(event, (...args) => {
      logger.log(`Emitter "${this.name}" fire event "${event}" to "${funcName2}".`);
      try {
        const r = func(...args);
        if (r) {
          return r.then(() => {
            logger.log(`Event handler "${funcName2}" for event "${this.name}.${event}" is done.`);
          }, (err) => {
            logger.error(`Event handler "${funcName2}" for event "${this.name}.${event}" throw an error: ${err}.`);
          });
        }
        logger.log(`Event handler "${funcName2}" for event "${this.name}.${event}" is done.`);
      } catch (err2) {
        logger.error(`Event handler "${funcName2}" for event "${this.name}.${event}" throw an error: ${err2}.`);
      }
    });
  }
}
