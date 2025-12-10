import nodemailer from 'nodemailer';
import { Order } from '@/types';

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});

// Форматер цены
const formatPrice = (price: number | string) => {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
    }).format(Number(price));
};

// Генерация HTML для чека (Receipt)
function generateReceiptHtml(order: Order): string {
    // Генерируем строки товаров
    const itemsHtml = order.items.map(item => {
        const productImage = (item.product as any).images?.[0] || (item.product as any).imageUrl || 'https://via.placeholder.com/80?text=No+Image';
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
    const shipping = total - subtotal;

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
                                &copy; ${new Date().getFullYear()} LookLab. All rights reserved.
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
    // 1. Отправка чека
    async sendReceipt(order: Order) {
        if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
            console.error("Email credentials missing");
            return;
        }

        try {
            const htmlContent = generateReceiptHtml(order);

            const mailOptions = {
                from: `"LookLab" <${process.env.EMAIL_USER}>`,
                to: order.email || undefined,
                bcc: process.env.EMAIL_USER,
                subject: `Order Confirmation #${order.id.slice(0, 8).toUpperCase()}`,
                html: htmlContent,
            };

            if (!mailOptions.to) {
                console.warn(`Order ${order.id} has no email, sending only to Admin (BCC).`);
                mailOptions.to = process.env.EMAIL_USER;
                mailOptions.bcc = '';
            }

            await transporter.sendMail(mailOptions as any);
            console.log(`✅ Email sent for order ${order.id}`);
        } catch (error) {
            console.error("❌ Email error:", error);
        }
    },

    // 2. Отправка подтверждения почты
    async sendVerificationEmail(email: string, token: string) {
        if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) return;

        // ФИКС: Добавлен запасной вариант, если .env не прочитался
        const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

        // Ссылка ведет на API для авто-логина
        const confirmLink = `${baseUrl}/api/auth/verify?token=${token}`;

        const htmlContent = `
        <!DOCTYPE html>
        <html>
        <body style="margin: 0; padding: 0; background-color: #f4f4f4; font-family: Arial, sans-serif;">
            <table width="100%" border="0" cellspacing="0" cellpadding="0" style="padding: 40px 0;">
                <tr>
                    <td align="center">
                        <table width="600" border="0" cellspacing="0" cellpadding="0" style="background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 12px rgba(0,0,0,0.1);">
                            <tr>
                                <td style="background-color: #111; padding: 30px; text-align: center;">
                                    <h1 style="color: #fff; margin: 0; font-size: 24px; letter-spacing: 1px;">LookLab</h1>
                                </td>
                            </tr>
                            <tr>
                                <td style="padding: 40px; text-align: center;">
                                    <h2 style="margin: 0 0 20px; color: #111; font-size: 24px;">Verify your email address</h2>
                                    <p style="color: #666; font-size: 16px; line-height: 1.6; margin-bottom: 30px;">
                                        Please confirm your email address to activate your account.
                                    </p>
                                    
                                    <a href="${confirmLink}" style="background-color: #000; color: #fff; padding: 14px 28px; text-decoration: none; border-radius: 4px; font-weight: bold; display: inline-block;">
                                        Confirm Email
                                    </a>

                                    <p style="margin-top: 30px; font-size: 12px; color: #999;">
                                        Or copy link:<br>
                                        <a href="${confirmLink}" style="color: #666;">${confirmLink}</a>
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

        await transporter.sendMail({
            from: `"LookLab" <${process.env.EMAIL_USER}>`,
            to: email,
            subject: "Verify your email address",
            html: htmlContent,
        });
    }
};