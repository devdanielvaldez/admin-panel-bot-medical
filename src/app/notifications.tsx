import { useEffect } from 'react';

const NotificationComponent: React.FC = () => {
  useEffect(() => {
    const requestNotificationPermission = async () => {
      try {
        // Verificar si el navegador soporta notificaciones
        if (!('Notification' in window)) {
          console.log('Este navegador no soporta notificaciones');
          return;
        }

        // Solicitar permiso si no está otorgado
        if (Notification.permission !== 'granted') {
          const permission = await Notification.requestPermission();
          if (permission !== 'granted') {
            console.log('Permiso de notificaciones denegado');
            return;
          }
        }

        // Conectar al WebSocket
        const ws = new WebSocket('ws://localhost:3030');

        ws.onmessage = (event) => {
          try {
            const data = JSON.parse(event.data);
            if (Notification.permission === 'granted') {
              new Notification('Nueva Notificación', {
                body: data.message,
              });
            }
          } catch (error) {
            console.error('Error al procesar el mensaje del WebSocket:', error);
          }
        };

        ws.onerror = (error) => {
          console.error('Error en la conexión WebSocket:', error);
        };

        // Limpiar la conexión cuando el componente se desmonte
        return () => {
          if (ws.readyState === WebSocket.OPEN) {
            ws.close();
          }
        };
      } catch (error) {
        console.error('Error al configurar las notificaciones:', error);
      }
    };

    requestNotificationPermission();
  }, []); // El array vacío asegura que esto solo se ejecute una vez al montar el componente

  return null; // O retorna algún UI si lo necesitas
};

export default NotificationComponent;
