import MangerBase from './mangerBase';


export default function (server:any, namespaces:string[]) {
  const manger = new MangerBase(server);
  namespaces.forEach(namespace => {
    manger.register(namespace);
  });
}
