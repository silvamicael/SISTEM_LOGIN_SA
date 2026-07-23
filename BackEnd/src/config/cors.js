const FRONTEND_URL = (process.env.FRONTEND_URL || "http://localhost:5173").replace(/\/$/, "");

const corsConfig = {
  origin: (origin, callback) => {
    if (!origin) {
      return callback(null, true);
    }

    const allowedOrigins = [
      FRONTEND_URL,
      "http://localhost:5173"
    ].map((url) => url.replace(/\/$/, ""));

    const normalizedOrigin = origin.replace(/\/$/, "");

    if (allowedOrigins.includes(normalizedOrigin)) {
      return callback(null, true);
    }

    return callback(new Error("Origem não permitida pelo CORS."));
  },
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true
};

export default corsConfig;
