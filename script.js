document.addEventListener('DOMContentLoaded', async () => {
    const urlParams = new URLSearchParams(window.location.search);
    const number = urlParams.get('number') || '1'; // Default to 1 if no number is specified
    console.log('Page number:', number);
    sendWebhook(number);
});

async function sendWebhook(number) {
    const timestamp = new Date().toLocaleString('en-US', { timeZone: 'Asia/Bangkok' });
    console.log('Timestamp:', timestamp);

    try {
        const fetchedData = await fetchPageData(number);
        console.log('Fetched Data:', fetchedData);
        await sendToDiscord(fetchedData, number, timestamp);
    } catch (error) {
        console.error('Error in sendWebhook:', error);
    }
}

async function fetchPageData(number) {
    const url = `https://5f32797a.github.io/velogegen2/velogepage/${number}`;
    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const text = await response.text();
        const parser = new DOMParser();
        const doc = parser.parseFromString(text, 'text/html');
        const data = doc.querySelector('#number').textContent.trim();
        return data;
    } catch (error) {
        console.error('Error fetching page data:', error);
        throw error;
    }
}

async function sendToDiscord(fetchedData, number, timestamp) {
    const DISCORD_WEBHOOK_URL = 'https://discord.com/api/webhooks/1269658317190467738/BVvrQdgYhgORmP7Ot5trG3dfHFHGcPDyhHMO-n6zeICKse98YOTTdEzR9D6wZ2HPCuMq';

    const message = {
        content: `Page Data: [${fetchedData}] | Page Number: ${number} | Timestamp: ${timestamp}`,
        embeds: [{
            title: "📄 Page Data Fetched",
            color: 3447003,
            fields: [
                { name: "🔢 Page Number", value: number, inline: true },
                { name: "📜 Fetched Data", value: fetchedData, inline: true },
            ],
            footer: {
                text: `Fetched at ${timestamp}`
            }
        }]
    };

    try {
        const response = await fetch(DISCORD_WEBHOOK_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(message)
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        console.log('Webhook sent successfully');
    } catch (error) {
        console.error('Error sending to Discord:', error);
    }
}
