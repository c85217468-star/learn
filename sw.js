/* Service Worker لتطبيق مِداد — مسؤول فقط عن استقبال إشعارات الدفع (Push)
   وعرضها كإشعار نظام، حتى لو كان المتصفح مغلقًا تمامًا (طالما الجهاز مسجَّل
   بالخدمة ومزوّد push الخاص بالنظام يعمل، مثل FCM على أندرويد). */
 
self.addEventListener('install', (event) => {
  self.skipWaiting();
});
 
self.addEventListener('activate', (event) => {
  event.waitUntil(self.clients.claim());
});
 
self.addEventListener('push', (event) => {
  let data = {};
  try { data = event.data ? event.data.json() : {}; } catch (e) { data = { title: 'مِداد', body: event.data ? event.data.text() : '' }; }
 
  const title = data.title || 'مِداد';
  const options = {
    body: data.body || '',
    tag: data.tag || 'midad-message',
    icon: undefined,
    data: { conversation_id: data.conversation_id || null },
    dir: 'rtl',
    lang: 'ar',
  };
 
  event.waitUntil(self.registration.showNotification(title, options));
});
 
/* عند الضغط على الإشعار: نحاول التركيز على تبويب مفتوح للتطبيق، وإلا نفتح واحدًا جديدًا. */
self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  event.waitUntil(
    self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clientsArr) => {
      for (const client of clientsArr) {
        if ('focus' in client) return client.focus();
      }
      if (self.clients.openWindow) return self.clients.openWindow('./');
    })
  );
});
 
