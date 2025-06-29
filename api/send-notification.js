const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

const ONESIGNAL_APP_ID = "527dee17-feec-4ffb-bfd6-6d3bb72ed984";
const ONESIGNAL_REST_API_KEY = "os_v2_app_kj664f765rh7xp6wnu53olwzqte62ga5k2au4cmmedwzuthhrn2dtslmz5xgpza725b4pezbgnxkssdvlbmsdmuth4iqyn2xbeqbfzq";

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).end(`Method Not Allowed`);
  }

  try {
    const { title, message } = req.body;

    if (!title || !message) {
      return res.status(400).json({ error: 'Title and message are required.' });
    }

    const notificationBody = {
      app_id: ONESIGNAL_APP_ID,
      // আগের সিস্টেমে ফিরে আসা হলো
      included_segments: ["Subscribed Users"],
      headings: { en: title },
      contents: { en: message }
    };

    const response = await fetch("https://onesignal.com/api/v1/notifications", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Basic ${ONESIGNAL_REST_API_KEY}`
      },
      body: JSON.stringify(notificationBody)
    });

    const data = await response.json();

    if (data.errors) {
      return res.status(400).json({ success: false, error: data.errors });
    }

    return res.status(200).json({ success: true, data });

  } catch (error) {
    return res.status(500).json({ success: false, error: 'Internal Server Error.' });
  }
}