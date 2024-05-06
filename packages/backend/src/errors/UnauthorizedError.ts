import ApiError from "./ApiError";

export default class UnauthorizedError extends ApiError {
  constructor(message: string) {
    super(message, 401);
  }
}
