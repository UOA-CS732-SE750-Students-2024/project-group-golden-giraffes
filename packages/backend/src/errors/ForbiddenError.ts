import ApiError from "./ApiError";

export default class ForbiddenError extends ApiError {
  constructor(message: string) {
    super(message, 403);
  }
}
