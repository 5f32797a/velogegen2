document.addEventListener('DOMContentLoaded', async () => {
    const number = document.getElementById('number').textContent.trim();
    console.log('Page number:', number);

    // Fetch the client's IP from the Cloudflare Worker
    const clientIP = await getClientIP();
    console.log('Client IP:', clientIP);

    // Use the IP and other data as needed
    sendWebhook(number, clientIP);
});

async function getClientIP() {
    try {
        // Fetch the IP address from the Cloudflare Worker
        const response = await fetch('https://cfip.insideglass.workers.dev/');
        const clientIP = await response.text();
        return clientIP;
    } catch (error) {
        console.error('Error fetching client IP:', error);
        return 'Unknown IP';
    }
}

async function sendWebhook(number, clientIP) {
    const timestamp = new Date().toLocaleString('en-US', { timeZone: 'Asia/Bangkok' });
    console.log('Timestamp:', timestamp);

    const DISCORD_WEBHOOK_URL = 'https://discord.com/api/webhooks/1269658317190467738/BVvrQdgYhgORmP7Ot5trG3dfHFHGcPDyhHMO-n6zeICKse98YOTTdEzR9D6wZ2HPCuMq';

    const message = {
        content: `Player: [${number}] | ${timestamp} | IP Address: ${clientIP}`,
        embeds: [{
            title: "🌐 New Visit Logged",
            color: 3447003,
            fields: [
                { name: "🔢 Number", value: number, inline: true },
                { name: "🔍 IP Address", value: clientIP, inline: false },
            ],
            footer: {
                text: `Logged at ${timestamp}`
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
