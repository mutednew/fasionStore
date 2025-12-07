import nodemailer from 'nodemailer';
import { Order } from '@/types';

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});

function generateReceiptHtml(order: Order): string {
    // ... (код генерации HTML остается тем же, что я кидал выше) ...
    // Для краткости я его не дублирую, просто вставь ту же функцию generateReceiptHtml

    const itemsHtml = order.items.map(item => `
        <tr style="border-bottom: 1px solid #eee;">
            <td style="padding: 10px 0; font-size: 14px; color: #333;">
                ${item.product.name} 
                <span style="display: block; font-size: 12px; color: #777;">
                    ${item.size || ''} ${item.color ? `/ ${item.color}` : ''}
                </span>
            </td>
            <td style="padding: 10px 0; text-align: right; font-size: 14px; color: #333;">
                ${item.quantity} x $${Number(item.price).toFixed(2)}
            </td>
            <td style="padding: 10px 0; text-align: right; font-size: 14px; font-weight: 600; color: #333;">
                $${(Number(item.price) * item.quantity).toFixed(2)}
            </td>
        </tr>
    `).join('');

    const total = Number(order.total).toFixed(2);

    return `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; border: 1px solid #ddd; padding: 20px; border-radius: 8px;">
            <h2 style="color: #000; text-align: center; margin-bottom: 20px;">Order #${order.id.slice(0, 8)} Confirmed</h2>
            <p>Hi ${order.firstName}, thanks for your purchase!</p>
            
            <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
                <thead>
                    <tr style="border-bottom: 2px solid #ccc;">
                        <th style="padding: 10px 0; text-align: left;">Item</th>
                        <th style="padding: 10px 0; text-align: right;">Qty</th>
                        <th style="padding: 10px 0; text-align: right;">Price</th>
                    </tr>
                </thead>
                <tbody>
                    ${itemsHtml}
                </tbody>
            </table>

            <div style="border-top: 2px solid #000; padding-top: 15px; text-align: right; font-size: 16px;">
                <span style="font-weight: bold;">TOTAL: $${total}</span>
            </div>
            
            <p style="margin-top: 20px; font-size: 12px; color: #666;">
                Shipping to: ${order.address}, ${order.city}
            </p>
        </div>
    `;
}

export const emailService = {
    async sendReceipt(order: Order) {
        if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) return;

        // Адрес админа (куда приходят копии)
        const ADMIN_EMAIL = process.env.EMAIL_USER; // Или другой: "admin@myshop.com"

        try {
            const htmlContent = generateReceiptHtml(order);

            const mailOptions = {
                from: `"Fashion Store" <${process.env.EMAIL_USER}>`, // От кого (Красивое имя)

                // 1. Кому: E-mail клиента из заказа
                to: order.email || "",

                // 2. Скрытая копия (BCC): Админу
                // Клиент не увидит, что письмо ушло еще и админу
                bcc: ADMIN_EMAIL,

                subject: `Order #${order.id.slice(0, 8)} Confirmation`,
                html: htmlContent,
            };

            await transporter.sendMail(mailOptions);
            console.log(`Email sent to ${order.email} and admin`);
        } catch (error) {
            console.error("Email error:", error);
        }
    },
};