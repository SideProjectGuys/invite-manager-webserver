import axios from "axios";

async function sendWebhook(url: string, embed: Object) {
  try {
    const response = await axios.post(url, JSON.stringify(embed));
  } catch (e) {
    console.log(e);
  }
}

export { sendWebhook };
