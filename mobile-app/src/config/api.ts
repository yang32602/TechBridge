import Constants from 'expo-constants';
function configurarApiBaseUrl(): string {
  const LOCAL_IP_LIST = ['192.168.0.5', '172.29.39.94', '172.29.6.70', '172.20.10.3']; // Lista de IPs locales permitidos
  const DEFAULT_PORT = '3000'; // Puerto por defecto

  const debuggerHost = (Constants as any).expoConfig?.hostUri;
    if (debuggerHost) {
        const [currentIp] = debuggerHost.split(':');
        if (LOCAL_IP_LIST.includes(currentIp)) {
            return `http://${currentIp}:${DEFAULT_PORT}`;
        }
    }
    console.warn('IP no reconocida o no permitida. Usando URL por defecto.');
    return 'http://192.168.0.5:3000'; // URL por defect
}
export const API_BASE_URL = configurarApiBaseUrl();

//export const API_BASE_URL = process.env.API_URL_BASE || 'http://192.168.0.5:3000';