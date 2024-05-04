import ApiError from "./ApiError";

export default class UnauthorisedError extends ApiError {
  constructor(message: string) {
    super(message, 401);
  }
}
