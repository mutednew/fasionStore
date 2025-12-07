import nodemailer from 'nodemailer';
import { Order } from '@/types'; // Убедись, что в типах product есть поле images или image

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});

// Форматер цены для красоты
const formatPrice = (price: number | string) => {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
    }).format(Number(price));
};

function generateReceiptHtml(order: Order): string {
    const orderDate = new Date().toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    });

    // Генерируем строки товаров
    const itemsHtml = order.items.map(item => {
        // Пытаемся достать картинку. Если у тебя в базе массив images, берем первую.
        // Если поле называется иначе (например imageUrl), поправь это свойство.
        const productImage = (item.product as any).images?.[0] || (item.product as any).imageUrl || 'https://via.placeholder.com/80?text=No+Image';

        const itemTotal = Number(item.price) * item.quantity;

        return `
        <tr>
            <td style="padding: 20px 0; border-bottom: 1px solid #f0f0f0; vertical-align: top; width: 80px;">
                <img src="${productImage}" alt="${item.product.name}" style="width: 80px; height: auto; border-radius: 8px; display: block;">
            </td>
            <td style="padding: 20px 0 20px 15px; border-bottom: 1px solid #f0f0f0; vertical-align: top;">
                <p style="margin: 0; font-size: 14px; font-weight: 600; color: #111; line-height: 1.4;">
                    ${item.product.name}
                </p>
                <p style="margin: 4px 0 0; font-size: 12px; color: #888;">
                    Size: ${item.size || 'OS'} <span style="margin: 0 5px;">|</span> Color: ${item.color || 'N/A'}
                </p>
                <p style="margin: 4px 0 0; font-size: 12px; color: #888;">
                    Qty: ${item.quantity}
                </p>
            </td>
        </tr>
        `;
    }).join('');

    const subtotal = order.items.reduce((acc, item) => acc + (Number(item.price) * item.quantity), 0);
    const total = Number(order.total);
    const shipping = total - subtotal; // Вычисляем доставку, если она не хранится отдельно

    return `
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Order Confirmation</title>
</head>
<body style="margin: 0; padding: 0; background-color: #f7f7f7; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;">
    
    <table width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color: #f7f7f7; padding: 40px 0;">
        <tr>
            <td align="center">
                
                <table width="600" border="0" cellspacing="0" cellpadding="0" style="background-color: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 12px rgba(0,0,0,0.05);">
                    
                    <tr>
                        <td style="background-color: #111111; padding: 40px; text-align: center;">
                            <h1 style="margin: 0; color: #ffffff; font-size: 24px; font-weight: 300; letter-spacing: 1px; text-transform: uppercase;">
                                LookLab
                            </h1>
                        </td>
                    </tr>

                    <tr>
                        <td style="padding: 40px 40px 20px 40px; text-align: center;">
                            <h2 style="margin: 0 0 10px; color: #111; font-size: 20px; font-weight: 600;">
                                Thanks for your order, ${order.firstName}!
                            </h2>
                            <p style="margin: 0; color: #666; font-size: 14px;">
                                We've received your order and are getting it ready.
                            </p>
                            <div style="margin-top: 20px; display: inline-block; background: #f3f3f3; padding: 8px 16px; border-radius: 50px;">
                                <span style="font-size: 12px; color: #555; font-weight: 600;">Order #${order.id.slice(0, 8).toUpperCase()}</span>
                            </div>
                        </td>
                    </tr>

                    <tr>
                        <td style="padding: 0 40px;">
                            <table width="100%" border="0" cellspacing="0" cellpadding="0">
                                ${itemsHtml}
                            </table>
                        </td>
                    </tr>

                    <tr>
                        <td style="padding: 30px 40px;">
                            <table width="100%" border="0" cellspacing="0" cellpadding="0">
                                <tr>
                                    <td style="padding-bottom: 10px; font-size: 14px; color: #666;">Subtotal</td>
                                    <td style="padding-bottom: 10px; font-size: 14px; color: #111; text-align: right;">${formatPrice(subtotal)}</td>
                                </tr>
                                <tr>
                                    <td style="padding-bottom: 10px; font-size: 14px; color: #666;">Shipping</td>
                                    <td style="padding-bottom: 10px; font-size: 14px; color: #111; text-align: right;">
                                        ${shipping > 0 ? formatPrice(shipping) : 'Free'}
                                    </td>
                                </tr>
                                <tr>
                                    <td style="padding-top: 15px; border-top: 2px solid #111; font-size: 16px; font-weight: 700; color: #111;">Total</td>
                                    <td style="padding-top: 15px; border-top: 2px solid #111; font-size: 18px; font-weight: 700; color: #111; text-align: right;">
                                        ${formatPrice(total)}
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>

                    <tr>
                        <td style="padding: 0 40px 40px 40px;">
                            <div style="background-color: #f9f9f9; padding: 20px; border-radius: 8px;">
                                <p style="margin: 0 0 5px; font-size: 12px; font-weight: 700; color: #999; text-transform: uppercase;">Shipping Address</p>
                                <p style="margin: 0; font-size: 14px; color: #333; line-height: 1.5;">
                                    ${order.firstName} ${order.lastName}<br>
                                    ${order.address}<br>
                                    ${order.city}, ${order.zip}<br>
                                    ${order.country}
                                </p>
                            </div>
                        </td>
                    </tr>

                    <tr>
                        <td style="background-color: #111; padding: 30px; text-align: center;">
                            <p style="margin: 0; color: #666; font-size: 12px;">
                                &copy; ${new Date().getFullYear()} Fashion Store. All rights reserved.
                            </p>
                            <p style="margin: 10px 0 0; color: #666; font-size: 12px;">
                                Questions? Just reply to this email.
                            </p>
                        </td>
                    </tr>

                </table>
                </td>
        </tr>
    </table>
</body>
</html>
    `;
}

export const emailService = {
    async sendReceipt(order: Order) {
        if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
            console.error("Email credentials missing");
            return;
        }

        try {
            const htmlContent = generateReceiptHtml(order);

            const mailOptions = {
                from: `"Fashion Store" <${process.env.EMAIL_USER}>`,

                // ФИКС ЗДЕСЬ:
                // Если order.email === null, мы передаем undefined (это Nodemailer разрешает),
                // либо пустую строку. Лучше всего так:
                to: order.email || undefined,

                bcc: process.env.EMAIL_USER,
                subject: `Order Confirmation #${order.id.slice(0, 8).toUpperCase()}`,
                html: htmlContent,
            };

            // Дополнительная проверка: если email вообще нет, не пытаемся отправлять "в никуда"
            if (!mailOptions.to) {
                console.warn(`Order ${order.id} has no email, sending only to Admin (BCC).`);
                // Nodemailer может выдать ошибку, если 'to' пустой, поэтому можно переставить админа в 'to'
                mailOptions.to = process.env.EMAIL_USER;
                mailOptions.bcc = '';
            }

            await transporter.sendMail(mailOptions as any); // as any иногда нужен, если типы библиотек конфликтуют
            console.log(`✅ Email sent for order ${order.id}`);
        } catch (error) {
            console.error("❌ Email error:", error);
        }
    },
};