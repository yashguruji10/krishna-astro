/**
 * Builds a free wa.me WhatsApp link pre-filled with a message.
 * No paid WhatsApp Business API required - opens WhatsApp app/web
 * with the message ready to send.
 */
export function buildWhatsAppLink(phoneDigitsOnly, message) {
  const phone = (phoneDigitsOnly || '').replace(/[^0-9]/g, '');
  const text = encodeURIComponent(message || '');
  return `https://wa.me/${phone}?text=${text}`;
}

export function buildOrderWhatsAppMessage(order, serviceTitle) {
  return [
    `New Service Enquiry - Jay Durga Jyotish`,
    `Service: ${serviceTitle}`,
    `Name: ${order.name}`,
    `Phone: ${order.phone}`,
    order.email ? `Email: ${order.email}` : null,
    order.dob ? `DOB: ${order.dob}` : null,
    order.birthTime ? `Birth Time: ${order.birthTime}` : null,
    order.birthPlace ? `Birth Place: ${order.birthPlace}` : null,
    order.message ? `Message: ${order.message}` : null
  ]
    .filter(Boolean)
    .join('\n');
}
