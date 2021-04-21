export const COLUMNDEF = [
    { field: '0', headerName: 'Currency Pair', filter: true },
    { field: '1', headerName: 'Instrument', filter: true },
    { field: '2', headerName: 'FX Business Date', filter: true },
    { field: '3', headerName: 'London Date', filter: true },
    { field: '4', headerName: 'Hour', filter: true },
    { field: '5', headerName: 'Volume', filter: true },
    { field: '6', headerName: 'Trades', filter: true },
];

export enum EVENTLIST {
    REQUEST_FOR_NEW_DATA = 'request-for-data',
    INCOMING_DATA = 'incoming-data',
    CONNECT_STATUS = 'connect-status',
    DISCONNECT_SOC = 'disconnect_soc'
}