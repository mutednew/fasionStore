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

// --- ГЕНЕРАЦИЯ КРАСИВОГО ЧЕКА ---
function generateReceiptHtml(order: Order): string {
    const itemsHtml = order.items.map(item => {
        const productImage = (item.product as any).images?.[0] || (item.product as any).imageUrl || 'https://via.placeholder.com/80?text=No+Image';
        const itemTotal = Number(item.price) * item.quantity;

        return `
        <tr>
            <td style="padding: 20px 0; border-bottom: 1px solid #f0f0f0; vertical-align: top; width: 80px;">
                <img src="${productImage}" alt="${item.product.name}" style="width: 80px; height: auto; border-radius: 8px; display: block;">
            </td>
            <td style="padding: 20px 0 20px 15px; border-bottom: 1px solid #f0f0f0; vertical-align: top;">
                <p style="margin: 0; font-size: 14px; font-weight: 600; color: #111; line-height: 1.4; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;">
                    ${item.product.name}
                </p>
                <p style="margin: 4px 0 0; font-size: 12px; color: #888; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;">
                    Size: ${item.size || 'OS'} <span style="margin: 0 5px;">|</span> Color: ${item.color || 'N/A'}
                </p>
                <p style="margin: 4px 0 0; font-size: 12px; color: #888; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;">
                    Qty: ${item.quantity}
                </p>
            </td>
            <td style="padding: 20px 0; border-bottom: 1px solid #f0f0f0; vertical-align: top; text-align: right; white-space: nowrap;">
                <p style="margin: 0; font-size: 14px; font-weight: 600; color: #111; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;">
                    ${formatPrice(itemTotal)}
                </p>
            </td>
        </tr>
        `;
    }).join('');

    const total = Number(order.total);
    // Для простоты считаем shipping обратным счетом или берем из базы, если сохраняли
    // Здесь примерный расчет для визуализации в письме:
    const itemsTotal = order.items.reduce((acc, item) => acc + (Number(item.price) * item.quantity), 0);
    const shipping = total > itemsTotal ? total - itemsTotal : 0;
    const discount = itemsTotal - total + shipping; // Если total меньше суммы товаров+доставки, значит была скидка

    // Отображаем скидку, если она есть (и положительная)
    const showDiscount = discount > 0.01;

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
                
                <!-- White Card -->
                <table width="600" border="0" cellspacing="0" cellpadding="0" style="background-color: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 12px rgba(0,0,0,0.05);">
                    
                    <!-- Header -->
                    <tr>
                        <td style="background-color: #111111; padding: 40px; text-align: center;">
                            <h1 style="margin: 0; color: #ffffff; font-size: 24px; font-weight: 300; letter-spacing: 1px; text-transform: uppercase;">
                                LookLab
                            </h1>
                        </td>
                    </tr>

                    <!-- Intro -->
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

                    <!-- Items Table -->
                    <tr>
                        <td style="padding: 0 40px;">
                            <table width="100%" border="0" cellspacing="0" cellpadding="0">
                                ${itemsHtml}
                            </table>
                        </td>
                    </tr>

                    <!-- Summary -->
                    <tr>
                        <td style="padding: 30px 40px;">
                            <table width="100%" border="0" cellspacing="0" cellpadding="0">
                                <tr>
                                    <td style="padding-bottom: 10px; font-size: 14px; color: #666;">Subtotal</td>
                                    <td style="padding-bottom: 10px; font-size: 14px; color: #111; text-align: right;">${formatPrice(itemsTotal)}</td>
                                </tr>
                                <tr>
                                    <td style="padding-bottom: 10px; font-size: 14px; color: #666;">Shipping</td>
                                    <td style="padding-bottom: 10px; font-size: 14px; color: #111; text-align: right;">
                                        ${shipping > 0 ? formatPrice(shipping) : 'Free'}
                                    </td>
                                </tr>
                                ${showDiscount ? `
                                <tr>
                                    <td style="padding-bottom: 10px; font-size: 14px; color: #16a34a;">Discount</td>
                                    <td style="padding-bottom: 10px; font-size: 14px; color: #16a34a; text-align: right;">
                                        -${formatPrice(discount)}
                                    </td>
                                </tr>` : ''}
                                <tr>
                                    <td style="padding-top: 15px; border-top: 2px solid #111; font-size: 16px; font-weight: 700; color: #111;">Total</td>
                                    <td style="padding-top: 15px; border-top: 2px solid #111; font-size: 18px; font-weight: 700; color: #111; text-align: right;">
                                        ${formatPrice(total)}
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>

                    <!-- Shipping Info -->
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

                    <!-- Footer -->
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
    // 1. Отправка ЧЕКА (Receipt)
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
                bcc: process.env.EMAIL_USER, // Копия админу
                subject: `Order Confirmed #${order.id.slice(0, 8).toUpperCase()}`,
                html: htmlContent,
            };

            // Защита от отсутствия email у юзера
            if (!mailOptions.to) {
                mailOptions.to = process.env.EMAIL_USER;
                mailOptions.bcc = '';
            }

            await transporter.sendMail(mailOptions as any);
            console.log(`✅ Receipt sent for order ${order.id}`);
        } catch (error) {
            console.error("❌ Email error:", error);
        }
    },

    // 2. Отправка ВЕРИФИКАЦИИ (Verification)
    async sendVerificationEmail(email: string, token: string) {
        if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) return;

        const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
        const confirmLink = `${baseUrl}/api/auth/verify?token=${token}`;

        const htmlContent = `
        <!DOCTYPE html>
        <html>
        <body style="margin: 0; padding: 0; background-color: #f4f4f4; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;">
            <table width="100%" border="0" cellspacing="0" cellpadding="0" style="padding: 40px 0;">
                <tr>
                    <td align="center">
                        <table width="500" border="0" cellspacing="0" cellpadding="0" style="background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 10px rgba(0,0,0,0.05);">
                            <tr>
                                <td style="background-color: #000; padding: 25px; text-align: center;">
                                    <h1 style="color: #fff; margin: 0; font-size: 20px; letter-spacing: 1px; text-transform: uppercase;">LookLab</h1>
                                </td>
                            </tr>
                            <tr>
                                <td style="padding: 40px; text-align: center;">
                                    <h2 style="margin: 0 0 15px; color: #111; font-size: 22px;">Verify your email</h2>
                                    <p style="color: #666; font-size: 15px; line-height: 1.6; margin-bottom: 30px;">
                                        Thanks for joining LookLab! Please confirm your email to activate your account.
                                    </p>
                                    
                                    <a href="${confirmLink}" style="background-color: #000; color: #fff; padding: 14px 30px; text-decoration: none; border-radius: 6px; font-weight: bold; font-size: 14px; display: inline-block;">
                                        Confirm Email
                                    </a>

                                    <p style="margin-top: 30px; font-size: 12px; color: #999;">
                                        Or paste this link into your browser:<br>
                                        <a href="${confirmLink}" style="color: #666; text-decoration: underline;">${confirmLink}</a>
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
    },

    // 3. Отправка ПРОМОКОДА (Daily Promo)
    async sendPromoEmail(email: string, name: string, code: string, type: string, value: number) {
        if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) return;

        let offerText = "";
        if (type === "PERCENT") offerText = `${value}% OFF everything!`;
        if (type === "FIXED") offerText = `$${value} OFF your order!`;
        if (type === "FREE_SHIPPING") offerText = `FREE SHIPPING for 24h!`;

        const htmlContent = `
        <!DOCTYPE html>
        <html>
        <body style="margin: 0; padding: 0; background-color: #000; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;">
            <table width="100%" border="0" cellspacing="0" cellpadding="0">
                <tr>
                    <td align="center" style="padding: 40px 0;">
                        <table width="600" border="0" cellspacing="0" cellpadding="0" style="background-color: #ffffff; border-radius: 16px; overflow: hidden;">
                            <tr>
                                <td style="background-color: #ff3b30; padding: 40px; text-align: center;">
                                    <h1 style="color: #fff; margin: 0; font-size: 32px; text-transform: uppercase; letter-spacing: 2px; font-weight: 800;">Daily Luck 🍀</h1>
                                </td>
                            </tr>
                            <tr>
                                <td style="padding: 40px; text-align: center;">
                                    <h2 style="margin: 0 0 10px; color: #111; font-size: 24px; font-weight: bold;">Hey ${name}!</h2>
                                    <p style="color: #666; font-size: 16px; margin-bottom: 30px;">
                                        Your personal daily reward is here. Use it now before it vanishes!
                                    </p>
                                    
                                    <div style="background: #fff0f0; padding: 20px; border-radius: 12px; margin-bottom: 30px; border: 2px dashed #ff3b30;">
                                        <p style="margin: 0; font-size: 12px; color: #ff3b30; text-transform: uppercase; font-weight: bold; letter-spacing: 1px;">Your Reward</p>
                                        <p style="margin: 5px 0 0; font-size: 28px; font-weight: 900; color: #111;">${offerText}</p>
                                    </div>

                                    <div style="background: #111; color: #fff; padding: 15px 30px; font-size: 24px; font-family: monospace; letter-spacing: 4px; border-radius: 8px; display: inline-block;">
                                        ${code}
                                    </div>

                                    <p style="margin-top: 25px; font-size: 12px; color: #999;">
                                        *Expires in 24 hours. Valid for one-time use.
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
            from: `"LookLab Rewards" <${process.env.EMAIL_USER}>`,
            to: email,
            subject: `🎁 Your Daily Reward: ${offerText}`,
            html: htmlContent,
        });
    }
};