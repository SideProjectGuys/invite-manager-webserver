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
