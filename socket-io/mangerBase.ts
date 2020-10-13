// eslint-disable-next-line no-unused-vars
import SocketIO, { Server as SocketIOServer, Socket } from 'socket.io';
import P2mLogger from 'p2m-common-logger';

import _ from 'lodash';

import AsyncSaferEventEmitter from '../utils/AsyncSaferEventEmitter';

export default class MangerBase {
    private readonly IOCollection = new Map();

    private readonly server: any;

    private readonly logger: P2mLogger;

    constructor(server: SocketIOServer) {
      this.server = server;
      this.logger = new P2mLogger('BASE-MANAGER');
    }

    register(nsp: string = '') {
      if (this.IOCollection.has(nsp)) {
        return;
      }
      const io: SocketIOServer = SocketIO(this.server, { path: `/${nsp}` });
      const rooms: Map<string, Map<number, Socket>> = new Map();
      // @ts-ignore
      this.IOCollection.set(nsp, new Map([
        ['io', io],
        ['rooms', rooms],
      ]));
      this.logger.log(`Register namespace ${nsp}`);

      this.initIO(new AsyncSaferEventEmitter(io, 'SOCKET-BRIDGE'), rooms);
    }

    to(rooms: Map<string, Map<number, Socket>>, room: string, uid: number, event: string, message: any) {
      const r: Map<number, Socket> | undefined = rooms.get(room);
      if (!r) {
        return;
      }
      const _socket = r.get(uid);
      if (_socket) {
        _socket.emit(event, message);
      }
    }

    joinRoom(socket: Socket, room: string): Promise<{ success: boolean, error?: Object }> {
      return new Promise(resolve => {
        socket.join(room, (err: Object) => {
          if (err) {
            resolve({ success: false, error: err });
          }
          resolve({ success: true });
        });
      });
    }

    initIO(io: AsyncSaferEventEmitter, rooms: Map<string, Map<number, Socket>>) {
      io.on('connection', (socket: Socket) => {
        this.logger.log(`A socket client connect.${socket.id}`);
        const to = this.to.bind(this, rooms);

        socket.emit('welcome', {
          message: '请通过"join"命令加入特定会议',
          now: Date.now()
        });
        socket.on('join', async (message, cb) => {
          const { room, uid, syncTime } = message;
          let timer:any;
          if (syncTime) {
            timer = setInterval(() => {
              socket.emit('sync-time', { now: Date.now() });
            }, 10 * 1000);
          }
          const r = await this.joinRoom(socket, room);
          if (!r.success) {
            cb({ success: false, error: `加入房间${room}失败，error: ${r.error || ''}` });
            socket.disconnect(true);
          }
          this.logger.log(`The user[${uid || 'Anonymous'}] join room ${room}.`);
          let users: Map<number, Socket> | undefined = rooms.get(room);
          if (!users) {
            users = new Map();
            rooms.set(room, users);
          }
          let onlineNumber = users ? users.size : 0;
          if (uid) {
            users.set(uid, socket);
            onlineNumber = users.size;
            io.to(room).emit('userJoin', {
              uid, headcount: onlineNumber
            });
          }
          socket.on('disconnect', () => {
            clearInterval(timer);
            timer = null;
            if (users) {
              users.delete(uid);
            }
            if (uid) {
              io.to(room).emit('userLeave', {
                uid,
                headcount: users ? users.size : 0
              });
            }
            socket.disconnect();
          });
          socket.on('sync-time', () => {
            socket.emit('sync-time', { now: Date.now() });
          });
          (cb || _.noop)({
            success: true,
            headcount: onlineNumber
          });
        });
        socket.on('broadcastTo', ({ room, event, message }, cb) => {
          this.logger.log(`Room ${room} broadcast ${event}`);
          io.to(room).emit(event, message);
          (cb || _.noop)();
        });
        socket.on('to', ({ room, uid, event, message }, cb) => {
          to(room, uid, event, message);
          (cb || _.noop)();
        });
        socket.on('group-sent-message', ({ commonMessage, room, event, collection }, cb) => {
          _.map(collection, item => to(item.room || room, item.uid, item.event || event,
            Object.assign(commonMessage || {}, item.message)));
          (cb || _.noop)();
        });
      });
    }
}
