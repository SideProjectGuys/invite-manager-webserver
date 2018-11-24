import * as compose from "koa-compose";

const RequestTimeLogger: compose.Middleware<any> = async (ctx, next) => {
  const requestStartTime = process.hrtime();
  await next();
  console.log(`URL: ${ctx.url}`);
  console.log(
    (process.hrtime()[1] - requestStartTime[1]) / 1000000 + " milliseconds"
  );
};

const middlewares: compose.ComposedMiddleware<any> = compose([
  RequestTimeLogger
]);

export default middlewares;
