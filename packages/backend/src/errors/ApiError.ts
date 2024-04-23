import { Response } from "express";

export default class ApiError extends Error {
  constructor(
    message: string,
    protected status: number,
  ) {
    super(message);
  }

  public applyToResponse(res: Response): void {
    res.status(this.status).json({ message: this.message });
  }

  public static handleError(res: Response, error: Error): void {
    if (error instanceof ApiError) {
      error.applyToResponse(res);
    } else {
      console.error(error);
      res.status(500).json({ message: "An unexpected error occurred" });
    }
  }
}
