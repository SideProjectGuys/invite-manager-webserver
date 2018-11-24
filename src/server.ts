import * as Koa from "koa";
import * as bodyParser from "koa-bodyparser";

const app = new Koa();
app.use(bodyParser());

import middlewares from "./middlewares/index";
import invManRoutes from "./routes/index";

app.use(middlewares);
app.use(invManRoutes);

app.listen(3000);

console.log("Server running on port 3000");
