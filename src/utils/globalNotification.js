export default function globanNotification(title, body) {
  const icon = '/favicon.ico';
  if ('Notification' in window) {
    // 用户拒绝通知弹窗后，是不能再requestPermission的，导致无限递归。8说了，问就是菜
    if (Notification.permission === 'denied') return;
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
