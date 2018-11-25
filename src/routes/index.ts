import * as Router from "koa-router";
import { sendWebhook } from "../functions";
import * as config from "../../config.json";
import { SellyWebhook } from "../types/Selly";
const patreonAPI = require("patreon").patreon;
const patreonAPIClient = patreonAPI(config.patreon.accessToken);

const invManRouter = new Router();
invManRouter.get("/add-bot/", async ctx => {
  const fields = [];
  if (ctx.headers.referer) {
    fields.push({
      name: "Referrer",
      value: ctx.headers.referer,
      inline: true
    });
  }
  const embeds = [];
  if (fields.length > 0) {
    embeds.push({
      fields
    });
  }
  const embed = {
    username: "Analytics",
    content: ctx.url,
    embeds
  };
  sendWebhook(config.links.webhooks.analytics, embed);
  ctx.redirect(config.links.botInviteLink);
});

invManRouter.post("/selly", async ctx => {
  const sellyRequest: SellyWebhook = ctx.request.body as SellyWebhook;
  const embed = {
    username: "Selly",
    avatar_url: "https://selly.gg/images/apple-touch-icon-180x180.png",
    content: "New purchase",
    embeds: [
      {
        fields: [
          {
            name: "ID",
            value: sellyRequest.id,
            inline: true
          },
          {
            name: "Product",
            value: `${sellyRequest.product_title} (${sellyRequest.product_id})`,
            inline: true
          },
          {
            name: "Value ($)",
            value: `${sellyRequest.usd_value} paid with ${
              sellyRequest.gateway
            }`,
            inline: true
          },
          {
            name: "Status (100 = paid)",
            value: sellyRequest.status,
            inline: true
          },
          {
            name: "Custom",
            value: JSON.stringify(sellyRequest.custom, null, 4),
            inline: true
          }
        ]
      }
    ]
  };
  sendWebhook(config.links.webhooks.selly, embed);
  console.log(sellyRequest);
});

invManRouter.get("/check/patreon", async ctx => {
  if (ctx.query.apiKey !== config.apiKey) {
    ctx.status = 401;
    return;
  }

  const query = [
    {
      key: "page[count]",
      value: "100" // 100 seems to be max
    },
    {
      key: "include",
      value: "reward.null,patron.null"
    },
    {
      key: "fields[pledge]",
      value:
        "created_at,total_historical_amount_cents,is_paused,declined_since,amount_cents"
    },
    {
      key: "fields[user]",
      value: "email,social_connections"
    },
    {
      key: "fields[reward]",
      value: "amount_cents,title"
    }
  ];

  const uriQuery = query
    .map(component => {
      return `${encodeURIComponent(component.key)}=${encodeURIComponent(
        component.value
      )}`;
    })
    .join("&");
  const { rawJson } = await patreonAPIClient(
    `/campaigns/${config.patreon.campaignID}/pledges?${uriQuery}`
  );

  const user = rawJson.included.find((obj: any) => {
    if (obj.type !== "user") {
      return false;
    }
    if (!obj.attributes.social_connections.discord) {
      return false;
    }
    return (
      obj.attributes.social_connections.discord.user_id === ctx.query.userId
    );
  });

  if (!user) {
    ctx.status = 404;
    return;
  }

  const pledge = rawJson.data.find((obj: any) => {
    if (obj.type !== "pledge") {
      return false;
    }
    return obj.relationships.patron.data.id === user.id;
  });

  if (!pledge) {
    ctx.status = 500;
    return;
  }

  ctx.body = pledge.attributes;
});

// Fallback for unknown URLs
invManRouter.get("/*", async ctx => {
  ctx.redirect(config.links.catchAllRedirect);
});

export default invManRouter.routes();
