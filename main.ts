// Deno Web Socket Demo
// Uses Oak for routing.
// Cleve Lendon  2024

import { send } from "@oak/oak/send";
import { Application } from "jsr:@oak/oak/application";
import { Router, RouterContext } from "jsr:@oak/oak/router";

const router = new Router();
const app    = new Application();
const BASE_PATH = "./public";
const port = 4000;

// Router context type.
// deno-lint-ignore no-explicit-any
type CTX = RouterContext<"/ws", Record<string | number, string | undefined>, Record<string, any>>;

// showRequest() - Prints useful information from the request.
// params:  router context
/*
function showRequest(ctx: CTX) {
  console.log('> ', ctx.request.ip);
  console.log('> ', ctx.request.userAgent.browser.name);
  console.log('> ', ctx.request.userAgent.device.model);
  console.log('> ', ctx.request.userAgent.os.name);
  console.log('> ', ctx.request.userAgent.os.version);
};
*/

// Handle web socket connections.
// This route must be before '/:path+'
router.get("/ws", (ctx: CTX) => {

  //showRequest(ctx);

  let name: string | undefined = ctx.request.userAgent.browser.name;
  if (!name) name = 'Somebody'; 

  if (!ctx.isUpgradable) {
    console.log('Cannot upgrade to web socket.');
    ctx.throw(501);
  };
  const ws = ctx.upgrade();

  ws.onopen = () => {
    console.log(name + " connected.");
    ws.send("Welcome!");
  };

  ws.onmessage = (m) => {
    const msg = JSON.parse(m.data).message;
    console.log('Received from ' + name + ': ' + msg);
    ws.send("You said: " + msg);
  };

  ws.onclose = () => console.log(name + " disconnected.");

  /*

    If the user navigates away from the client web page, an
    error will occur (Unexpected EOF), and the web socket will
    close automatically. For this app, we don't need to see
    the error.

  // deno-lint-ignore no-explicit-any
  ws.onerror = (e: any) => {
    console.dir('Error: ' + e.message);
  }
  */

});

// '/' routes to index.html
router.get('/', async (ctx) => {
  await send(ctx, ctx.request.url.pathname, {
    root: BASE_PATH,
    index: 'index.html'
  });
});

// Serve all static files.
router.get('/:path+', async (ctx) => {
  const path = ctx.request.url.pathname;
  await send(ctx, path, { root: BASE_PATH });
});

app.use(router.routes());
app.use(router.allowedMethods());
app.listen({ port: port });

// For main_test.ts
export const testFunction = (): string => { return "test" };
