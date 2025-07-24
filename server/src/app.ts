import express, { NextFunction, Request, Response } from "express";
import authRouter from "@/routers/auth.router.js";
import z, { ZodError } from "zod";

const app = express();
app.use(express.json());

app.use("/api/auth", authRouter);

app.use(
  (error: Error, request: Request, response: Response, next: NextFunction) => {
    console.error(error);
    if (error instanceof ZodError) {
      return response
        .status(400)
        .json({ error: z.flattenError(error).fieldErrors });
    }
    response
      .status(500)
      .json({ message: error.message || "Internal Server Error" });
  }
);
const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
