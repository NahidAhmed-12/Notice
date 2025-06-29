const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

const ONESIGNAL_APP_ID = "ca7ff1e7-35c9-473f-8042-00f5141bcef1";
const ONESIGNAL_REST_API_KEY = "os_v2_app_zj77dzzvzfdt7accad2rig6o6hq3p57lnkfewbvpxcsfyczar6dshuwhv6bx64bewye5mtjfr3vre2u2ipevfjw4rupoe5bkatb5ifa";

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