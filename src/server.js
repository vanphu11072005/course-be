import express from "express";
import { createServer } from "http";
import cors from "cors";
import dotenv from "dotenv";
import { stripeWebhook } from "./controllers/payment.controller.js";
import paymentRoutes from "./routes/payments.js";
dotenv.config();

import passport from "passport";
import cookieParser from "cookie-parser";
import { Strategy, ExtractJwt } from "passport-jwt";
import { Server } from "socket.io";

import db from "./database/models/index.js";
import AppConfig from "./config/index.js";
import ApiRouter from "./routes/index.js";

const app = express();
const server = createServer(app);
const port = AppConfig.port;

// ===== Socket.IO =====
const io = new Server(server, {
  cors: "https://webcoure-fe.vercel.app", // replace with your React app URL
});

db.sequelize.sync({ force: false });
app.use(
  cors({
    origin: "https://webcoure-fe.vercel.app", // replace with your React app URL
    credentials: true,
  })
); // Enable CORS for all routes
// console.log('req.cookies:', req.cookies);
// console.log('req.body:', req.body);

app.use(express.json()); // Middleware to parse JSON bodies
app.use(cookieParser());
// app.use(`/api/${AppConfig.apiVersion}/payments`, paymentRoutes);
app.post(
  `/api/v1/payments/webhook`,
  express.raw({ type: "application/json" }),
  stripeWebhook
);

// Các route payments khác vẫn dùng json
app.use(`/api/v1/payments`, express.json(), paymentRoutes);
// ===== PASSPORT JWT STRATEGY =====
const jwtFromRequest = ExtractJwt.fromExtractors([
  ExtractJwt.fromAuthHeaderAsBearerToken(),
  (req) => req.cookies.accessToken,
]);
passport.use(
  new Strategy(
    {
      jwtFromRequest,
      secretOrKey: AppConfig.jwt.JWT_SECRET,
    },
    async (payload, done) => {
      const user = await db.User.findByPk(payload.sub);
      if (!user) return done(null, false);
      return done(null, user);
    }
  )
);
app.use(passport.initialize());
// ===== PASSPORT JWT STRATEGY =====

// ===== SocketIO =====
// io.on("connection", (socket) => {
//   console.log("a user connected");
//   // socket.broadcast.emit("broadcast");
//   socket.on("foo", (msg) => {
//     // socket.emit("bar", `server send: ${msg}`);
//     // io.emit("bar", "sent to all clients");
//   });
//   socket.on("disconnect", () => {
//     console.log("user disconnected");
//   });
// });
// ===== SocketIO =====

// cho phép truy cập thư mục uploads
app.use("/uploads", express.static("uploads"));

app.use(`/api/${AppConfig.apiVersion}`, ApiRouter[AppConfig.apiVersion]);

// ===== Error handler (catch all) =====
// ===== Error handler (catch all) =====
app.use((err, req, res, next) => {
  console.error("❌ Error:", err);

  res.status(500).json({
    error: "Internal Server Error",
    message: err.message, // show message để debug
    stack: err.stack, // show stack trace để biết ở đâu lỗi
  });
});

server.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});

process.on("uncaughtException", function (exception) {
  console.log(exception); // to see your exception details in the console
  // if you are on production, maybe you can send the exception details to your
  // email as well ?
});
