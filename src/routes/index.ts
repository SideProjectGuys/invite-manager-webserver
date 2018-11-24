import * as Router from "koa-router";
import { sendWebhook } from "../functions";
import * as config from "../../config.json";

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

export interface SellyWebhookCustomAttribute {}

export interface SellyWebhook {
  id: string;
  product_id: string;
  email: string;
  ip_address: string;
  country_code: string;
  product_title: string;
  user_agent: string;
  value: string;
  quantity: number;
  currency: string;
  gateway: string;
  risk_level: number;
  status: number;
  delivered?: any;
  crypto_value?: any;
  crypto_address?: any;
  crypto_channel?: any;
  crypto_received: number;
  crypto_confirmations: number;
  referral?: any;
  usd_value: string;
  exchange_rate: string;
  custom: SellyWebhookCustomAttribute;
  created_at: Date;
  updated_at: Date;
  webhook_type: number;
}

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

// Fallback for unknown URLs
invManRouter.get("/*", async ctx => {
  ctx.redirect(config.links.catchAllRedirect);
});

export default invManRouter.routes();
