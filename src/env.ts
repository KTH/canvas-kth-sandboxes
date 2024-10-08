// Use "declaration merging" to add extra properties to diverse objects.
// Read more: https://www.typescriptlang.org/docs/handbook/declaration-merging.html

// Declare what is returned from Canvas oAuth
declare module "openid-client" {
  interface TokenSet {
    user: {
      id: number;
    };
  }
}

// Declare what is stored in the session
declare module "express-session" {
  interface SessionData {
    tmpState: string;
    tmpCourseId: string;
    accessToken: string;
    refreshToken: string;
    expiresAt: number;
    userId: number;
  }
}

export {};
