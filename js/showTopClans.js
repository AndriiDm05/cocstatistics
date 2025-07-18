// Show top clans in Ukraine / Показати топ кланів України
async function showTopClans() {
  const res = await fetch('https://cocstatistics.onrender.com/api/rankings/clans/32000246'); // UA
  const clans = await res.json();
  const output = document.getElementById('output');

  output.innerHTML = `
    <h3>${translations[currentLang].topClansUkraine}</h3>
    <table border="1" cellspacing="0">
      <tr><th>#</th><th>${translations[currentLang].namee}</th><th>${translations[currentLang].trophies}</th><th>${translations[currentLang].participants}</th></tr>
      ${clans.map((c, i) => `
        <tr>
          <td>${i + 1}</td>
          <td><img id="cl" src="${c.badgeUrls?.small || ''}" alt="Clan logo" /> ${c.name}</td>
          <td>${c.clanPoints} <img id="trophy" src="trophy.jpg" alt="trophies"/></td>
          <td>${c.members}</td>
        </tr>
      `).join('')}
    </table>
  `;
}
// Show top clans in the world / Показати топ кланів світу
async function showTopClansGlobal() {
  const res = await fetch('https://cocstatistics.onrender.com/api/rankings/clans/global');
  const clans = await res.json();
  const output = document.getElementById('output');

  output.innerHTML = `
    <h3>${translations[currentLang].topClansGl}</h3>
    <table border="1" cellspacing="0">
      <tr><th>#</th><th>${translations[currentLang].namee}</th><th>${translations[currentLang].trophies}</th><th>${translations[currentLang].participants}</th></tr>
      ${clans.map((c, i) => `
        <tr>
          <td>${i + 1}</td>
          <td><img id="cl" src="${c.badgeUrls?.small || ''}" alt="Clan logo" /> ${c.name}</td>
          <td>${c.clanPoints} <img id="trophy" src="trophy.jpg" alt="trophies"/></td>
          <td>${c.members}</td>
        </tr>
      `).join('')}
    </table>
  `;
}