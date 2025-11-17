export class CustomError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.status = statusCode;
  }
}

const { COOKIE_NAME } = process.env

export const cookieExtractor = (req) => req?.signedCookies?.[COOKIE_NAME || "currentUser"] || req?.cookies?.[COOKIE_NAME || "currentUser"] || null;