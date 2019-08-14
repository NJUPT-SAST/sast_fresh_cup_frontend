export default function globanNotification(title, body) {
  const icon = '/favicon.ico';
  if ('Notification' in window) {
    if (Notification.permission !== 'granted') {
      Notification.requestPermission(() => {
        globanNotification(title, body);
      });
    }
    const myNotification = new Notification(title, {
      body,
      icon,
    });
  }
}
