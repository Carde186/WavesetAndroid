// In sviluppo, con un device Android collegato via USB, il backend locale è
// raggiungibile su "localhost" facendo girare:
//   adb reverse tcp:3000 tcp:3000
// così il device inoltra le richieste su localhost:3000 alla macchina host.
export const URL_BASE = 'http://localhost:3000/api';
