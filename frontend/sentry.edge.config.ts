import * as Sentry from "@sentry/nextjs";

Sentry.init({
  dsn: "https://ed9ef4c4e6bdf43bb4c908a5ebfa475f@o4512379949023232.ingest.us.sentry.io/4512379973664768",

  tracesSampleRate: process.env.NODE_ENV === "development" ? 1 : 0.1,

  dataCollection: {
    userInfo: false,
    cookies: false,
    graphQL: { document: false, variables: false },
    genAI: { inputs: false, outputs: false },
    databaseQueryData: false,
    queues: false,
    httpBodies: [],
    httpHeaders: {
      request: false,
      response: false,
    },
    urlQueryParams: false,
  },
});