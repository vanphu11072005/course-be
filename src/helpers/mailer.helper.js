// import nodemailer from "nodemailer";

// // ⚙️ Tạo transporter (bạn có thể đổi cấu hình tùy email provider)
// const transporter = nodemailer.createTransport({
//   service: "gmail",
//   auth: {
//     user: process.env.EMAIL_USER, // ví dụ: yourgmail@gmail.com
//     pass: process.env.EMAIL_PASS, // app password (không phải mật khẩu Gmail thường)
//   },
// });

// /**
//  * Gửi email
//  * @param {string} to - Địa chỉ người nhận
//  * @param {string} subject - Tiêu đề email
//  * @param {string} html - Nội dung HTML của email
//  */
// export const sendMail = async (to, subject, html) => {
//   try {
//     await transporter.sendMail({
//       from: `"Hoc de thoi" <${process.env.EMAIL_USER}>`,
//       to,
//       subject,
//       html,
//     });
//     console.log(`📧 Email sent to ${to}`);
//   } catch (err) {
//     console.error("❌ Send mail failed:", err);
//     throw err;
//   }
// };

import nodemailer from "nodemailer";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendMail(to, subject, html) {
  try {
    // 🚀 Dùng Resend nếu deploy hoặc có lỗi kết nối SMTP
    if (process.env.NODE_ENV === "production") {
      console.log("📨 Using Resend API for production...");
      const response = await resend.emails.send({
        from: "WebCourse <no-reply@webcourse.app>", // domain đã verify (hoặc mặc định resend.dev)
        to,
        subject,
        html,
      });

      if (response.error) {
        console.error("❌ Resend error:", response.error);
        throw new Error(response.error.message);
      }

      console.log("✅ Email sent via Resend:", response.data?.id || response);
      return;
    }

    // 💻 Gmail SMTP cho localhost
    console.log("📨 Using Gmail SMTP for dev...");
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    await transporter.sendMail({
      from: `"WebCourse" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      html,
    });

    console.log("✅ Email sent via Gmail");
  } catch (error) {
    console.error("❌ Send mail error:", error.message);

    // fallback: nếu Gmail lỗi, thử Resend
    if (process.env.NODE_ENV !== "production") {
      console.log("⚠️ Gmail failed, fallback to Resend...");
      await resend.emails.send({
        from: "WebCourse <no-reply@webcourse.app>",
        to,
        subject,
        html,
      });
    } else {
      throw error;
    }
  }
}
