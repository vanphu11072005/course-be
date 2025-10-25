import nodemailer from "nodemailer";

// ⚙️ Tạo transporter (bạn có thể đổi cấu hình tùy email provider)
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER, // ví dụ: yourgmail@gmail.com
    pass: process.env.EMAIL_PASS, // app password (không phải mật khẩu Gmail thường)
  },
});

/**
 * Gửi email
 * @param {string} to - Địa chỉ người nhận
 * @param {string} subject - Tiêu đề email
 * @param {string} html - Nội dung HTML của email
 */
export const sendMail = async (to, subject, html) => {
  try {
    await transporter.sendMail({
      from: `"Hoc de thoi" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      html,
    });
    console.log(`📧 Email sent to ${to}`);
  } catch (err) {
    console.error("❌ Send mail failed:", err);
    throw err;
  }
};
