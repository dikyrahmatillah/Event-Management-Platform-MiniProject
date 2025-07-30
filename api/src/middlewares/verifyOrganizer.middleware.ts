import { NextFunction, Request, Response } from "express";

export async function verifyOrganizer(
  request: Request,
  response: Response,
  next: NextFunction
) {
  if (request.user?.role !== "ORGANIZER") {
    return response
      .status(403)
      .json({ message: "Access denied: Organizer role required" });
  }
  next();
}
