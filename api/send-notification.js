// Vercel সার্ভারলেস ফাংশন
const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

// আপনার App ID এবং REST API Key সরাসরি কোডে বসানো হয়েছে
// সতর্কতা: এই পদ্ধতিটি অনিরাপদ এবং শুধুমাত্র টেস্টের জন্য ব্যবহার করুন।
const ONESIGNAL_APP_ID = "527dee17-feec-4ffb-bfd6-6d3bb72ed984";
const ONESIGNAL_REST_API_KEY = "os_v2_app_kj664f765rh7xp6wnu53olwzqs6n7jcxyageiuuql6cb6kte7donl2nnnge5eauvc34bpdtpbeerxio2mwzrs366yul4yfllpxxdcsy";


export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }

  try {
    const { message } = req.body;

    if (!message) {
      return res.status(400).json({ error: 'Message cannot be empty.' });
    }

    const response = await fetch("https://onesignal.com/api/v1/notifications", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Basic ${ONESIGNAL_REST_API_KEY}`
      },
      body: JSON.stringify({
        app_id: ONESIGNAL_APP_ID,
        included_segments: ["Subscribed Users"],
        contents: { en: message },
        headings: { en: "New Message" }
      })
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