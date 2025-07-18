// Отримати інформацію про гравця / Fetch player info
async function fetchPlayer() {
    const tag = document.getElementById('playerTag').value.trim();
    const output = document.getElementById('output');
    if (!tag) {
        // Перевірка на порожній тег / Check for empty tag
        output.innerHTML = `<p style="color:red;">❗️${translations[currentLang].errorEnterPlayerTag}</p>`;
        return;
    }
    output.innerHTML = `${translations[currentLang].loading}`; // Loading...

    try {
        // Запит до backend для отримання даних гравця / Request to backend for player data
        const res = await fetch(`https://cocstatistics.onrender.com/api/player/${tag}`);
        if (!res.ok) throw new Error(await res.text());
        const data = await res.json();

        // Відображення основної інформації про гравця / Display main player info
        output.innerHTML = `
            <h2>${data.name}</h2>
            <p><strong>${translations[currentLang].tag}:</strong> ${data.tag}</p>
            <p><strong>${translations[currentLang].thLevel}:</strong> ${data.townHallLevel}</p>
            <p><strong>${translations[currentLang].level}:</strong> ${data.expLevel}</p>
            <p><strong>${translations[currentLang].league}:</strong> ${data.league?.name || "—"}  
                <img id="ll" src="${data.league?.iconUrls?.small || ''}" alt="League logo" />
            </p>        
            <p><strong>${translations[currentLang].trophies}:</strong> ${data.trophies}</p>
            <p><strong>${translations[currentLang].bestTrophies}:</strong> ${data.bestTrophies}</p>
            <p><strong>${translations[currentLang].legendTrophies}:</strong> ${data.legendStatistics?.legendTrophies || "—"}</p>
            <p><strong>${translations[currentLang].previousSeason}:</strong> 
                ${data.legendStatistics?.previousSeason?.rank || "—"} ${translations[currentLang].rank}, 
                ${data.legendStatistics?.previousSeason?.trophies || "—"} <img id="trophy" src="trophy.jpg" alt="trophies"/>
            </p>
            <p><strong>${translations[currentLang].bestSeason}:</strong> 
                ${data.legendStatistics?.bestSeason?.rank || "—"} ${translations[currentLang].rank}, 
                ${data.legendStatistics?.bestSeason?.trophies || "—"} <img id="trophy" src="trophy.jpg" alt="trophies"/>
            </p> 
            <p><strong>${translations[currentLang].currentSeason}:</strong> 
                ${data.legendStatistics?.currentSeason?.rank || "—"} ${translations[currentLang].rank} (local), 
                ${data.legendStatistics?.currentSeason?.trophies || "—"} <img id="trophy" src="trophy.jpg" alt="trophies"/>
            </p> 
            <p><strong>${translations[currentLang].warStars}:</strong> ${data.warStars}</p>    
            <p><strong>${translations[currentLang].attackWins}:</strong> ${data.attackWins}</p>
            <p><strong>${translations[currentLang].defenseWins}:</strong> ${data.defenseWins}</p>
            <p><strong>${translations[currentLang].builderHallLevel}:</strong> ${data.builderHallLevel}</p>
            <p><strong>${translations[currentLang].builderBaseLeague}:</strong> ${data.builderBaseLeague?.name || "—"}</p>
            <p><strong>${translations[currentLang].builderBaseTrophies}:</strong> ${data.builderBaseTrophies}</p>
            <p><strong>${translations[currentLang].builderBaseBestTrophies}:</strong> ${data.bestBuilderBaseTrophies}</p> 
            <p><strong>${translations[currentLang].donations}:</strong> ${data.donations}</p>
            <p><strong>${translations[currentLang].donationsReceived}:</strong> ${data.donationsReceived}</p>       
            <p><strong>${translations[currentLang].clanCapitalContributions}:</strong> ${data.clanCapitalContributions}</p>    
        `;

        // Якщо гравець у клані, отримати дані клану / If player in clan, fetch clan info
        if (data.clan) {
            const clanTag = data.clan.tag.replace("#", "");

            // Запит до backend для отримання даних клану / Request to backend for clan data
            const clanInfoRes = await fetch(`https://cocstatistics.onrender.com/api/clan/${clanTag}`);
            if (!clanInfoRes.ok) throw new Error(await clanInfoRes.text());
            const clanInfo = await clanInfoRes.json();

            // Відображення інформації про клан / Display clan info
            output.innerHTML += `
                <h2 style="margin-top:20px;">Clan: ${clanInfo.name}</h2>
                <p><strong>${translations[currentLang].tag}:</strong> ${clanInfo.tag}</p>
                <p><strong>${translations[currentLang].level}:</strong> ${clanInfo.clanLevel}</p>
                <p><strong>${translations[currentLang].participants}:</strong> ${clanInfo.members}</p>  
                <p><strong>${translations[currentLang].clanTrophies}:</strong> ${clanInfo.clanPoints}</p>
                <p><strong>${translations[currentLang].location}:</strong> ${clanInfo.location?.name || "—"}</p>
            `;
        }
    } catch (err) {
        // Відображення помилки / Display error
        output.innerHTML = `<p style="color:red;">❌ Error: ${err.message}</p>`;
        console.error(err);
    }
}