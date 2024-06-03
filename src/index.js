// Modules
import express from "express";

const app = express();
app.get("/", function (req, res, next) {
  res.status(200);
  res.json({ status: "ok" });
});

export default app;
