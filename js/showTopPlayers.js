// Show top players in Ukraine / Показати топ гравців України
async function showTopPlayers() {
  const res = await fetch('http://localhost:3000/api/rankings/players/32000246'); // UA
  const players = await res.json();
  const output = document.getElementById('output');

  output.innerHTML = `
    <h3>${translations[currentLang].topPlayersUkraine}</h3>
    <table border="1" cellspacing="0">
      <tr><th>#</th><th>${translations[currentLang].name}</th><th>${translations[currentLang].clan}</th><th>${translations[currentLang].trophies}</th></tr>
      ${players.map((p, i) => `
        <tr>
          <td>${i + 1}</td>
          <td>${p.league?.iconUrls?.small ? `<img id="ll" src="${p.league.iconUrls.small}" alt="league" style="vertical-align: middle; margin-right: 5px;">` : ''} ${p.name}</td>
          <td>${p.clan ? p.clan.name : '–'}</td>
          <td>${p.trophies} <img id="trophy" src="trophy.jpg" alt="trophies"/></td>
        </tr>
      `).join('')}
    </table>
  `;
  console.log(players);
}
// Show top players in the world / Показати топ гравців світу
async function showTopPlayersGlobal() {
  const res = await fetch('http://localhost:3000/api/rankings/players/global');
  const players = await res.json();
  const output = document.getElementById('output');

  output.innerHTML = `
    <h3>${translations[currentLang].topPlayersGl}</h3>
    <table border="1" cellspacing="0">
      <tr><th>#</th><th>${translations[currentLang].name}</th><th>${translations[currentLang].clan}</th><th>${translations[currentLang].trophies}</th></tr>
      ${players.map((p, i) => `
        <tr>
          <td>${i + 1}</td>
          <td>${p.league?.iconUrls?.small ? `<img id="ll" src="${p.league.iconUrls.small}" alt="league" style="vertical-align: middle; margin-right: 5px;">` : ''} ${p.name}</td>
          <td>${p.clan ? p.clan.name : '–'}</td>
          <td>${p.trophies} <img id="trophy" src="trophy.jpg" alt="trophies"/></td>
        </tr>
      `).join('')}
    </table>
  `;
}