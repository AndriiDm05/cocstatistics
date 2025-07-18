// Отримати інформацію про клан / Fetch clan info
async function fetchClan() {
    const tag = document.getElementById('clanTag').value.trim();
    const output = document.getElementById('output');
    if (!tag) {
        // Перевірка на порожній тег / Check for empty tag
        output.innerHTML = `<p style="color:red;">❗️${translations[currentLang].errorEnterClanTag}</p>`;
        return;
    }
    output.innerHTML = `${translations[currentLang].loading}`; // Loading...

    try {
        // Запит до backend для отримання даних клану / Request to backend for clan data
        const res = await fetch(`http://localhost:3000/api/clan/${tag}`);
        if (!res.ok) throw new Error(await res.text());
        const data = await res.json();

        // Відображення основної інформації про клан / Display main clan info
        output.innerHTML = `
            <img src="${data.badgeUrls?.small || ''}" style="width: 200px; height:200px;" alt="Clan logo" />
            <h2>${data.name}</h2>
            <p><strong>${translations[currentLang].tag}:</strong> ${data.tag}</p>
            <p><strong>${translations[currentLang].level}:</strong> ${data.clanLevel}</p>
            <p><strong>${translations[currentLang].members}:</strong> ${data.members}</p>
            <p><strong>${translations[currentLang].clanTrophies}:</strong> ${data.clanPoints}</p>
            <p><strong>${translations[currentLang].type}:</strong> ${data.type}</p>
            <p><strong>${translations[currentLang].description}:</strong> ${data.description || "Немає опису"}</p>
            <p><strong>${translations[currentLang].location}:</strong> ${data.location?.name || "—"}</p>
            <p><strong>${translations[currentLang].requiredTrophies}:</strong> ${data.requiredTrophies}</p>
            <p><strong>${translations[currentLang].wars}:</strong> ${data.warWins} ${translations[currentLang].wins}</p>
            <p><strong>${translations[currentLang].warWinStreak}:</strong> ${data.warWinStreak}</p>
            <p><strong>${translations[currentLang].warLeague}:</strong> ${data.warLeague?.name || "—"}</p>
            <p><strong>${translations[currentLang].leader}:</strong> ${
                data.memberList?.find(member => member.role === "leader")?.name || "—"
            } (${
                data.memberList?.find(member => member.role === "leader")?.tag || ""
            })</p>
            <p><strong>${translations[currentLang].builderBaseTrophies}:</strong> ${data.clanBuilderBasePoints}</p>
            <p><strong>${translations[currentLang].clanCapitalTrophies}:</strong> ${data.clanCapitalPoints}</p>
            <p><strong>${translations[currentLang].clanCapitalLeague}:</strong> ${data.capitalLeague?.name || "—"}</p>
        `;

        // Запит до backend для отримання учасників клану / Request to backend for clan members
        const membersRes = await fetch(`http://localhost:3000/api/clan/${tag}/members`);
        if (!membersRes.ok) throw new Error(await membersRes.text());
        const members = await membersRes.json();

        // Відображення списку учасників / Display members list
        output.innerHTML += `<h3 style="margin-top:20px;">${translations[currentLang].members}:</h3>`;
        members.forEach((member, i) => {
            output.innerHTML += `
                <p>${i + 1}. ${member.name} (${member.tag}) - ${member.trophies} 
                <img id="trophy" src="trophy.jpg" alt="trophies"/></p>
            `;
        });
    } catch (err) {
        // Відображення помилки / Display error
        output.innerHTML = `<p style="color:red;">❌ Error: ${err.message}</p>`;
        console.error(err);
    }
}

// Отримати поточну війну клану / Fetch current clan war
async function fetchCurrentWar() {
    const tag = document.getElementById('clanTag').value.trim();
    const output = document.getElementById('output');
    if (!tag) {
        // Перевірка на порожній тег / Check for empty tag
        output.innerHTML = `<p style="color:red;">❗️Enter the clan tag</p>`;
        return;
    }
    output.innerHTML = `${translations[currentLang].loading}`; // Loading...

    try {
        // Запит до backend для отримання даних війни / Request to backend for current war data
        const res = await fetch(`http://localhost:3000/api/clan/${tag}/currentwar`);
        if (!res.ok) throw new Error(await res.text());
        const data = await res.json();

        if (!data.state || data.state === 'notInWar') {
            output.innerHTML = `<p>${translations[currentLang].notInWar}</p>`;
            return;
        }

        if (data.clan && data.opponent) {
            output.innerHTML = `
                <h2>${translations[currentLang].currentWar}</h2>
                <p><strong>${translations[currentLang].state}:</strong> ${data.state}</p>
                <p><strong>${translations[currentLang].teamSize}:</strong> ${data.teamSize}</p>
                <p><strong>${translations[currentLang].clan}:</strong> ${data.clan.name} (${data.clan.tag})</p>
                <p><strong>${translations[currentLang].opponent}:</strong> ${data.opponent.name} (${data.opponent.tag})</p>
                <p><strong>${translations[currentLang].clanPoints}:</strong> ${data.clan.stars}</p>
                <p><strong>${translations[currentLang].opponentPoints}:</strong> ${data.opponent.stars}</p>
                <p><strong>${translations[currentLang].destroyPercent}:</strong> ${Math.floor(data.clan.destructionPercentage)}%</p>
                <p><strong>${translations[currentLang].destroyPercentOpponent}:</strong> ${Math.floor(data.opponent.destructionPercentage)}%</p>
                <hr>
                <h4>${data.clan.name}</h4>
                <table border="1" cellpadding="5" cellspacing="0">
                    <thead>
                        <tr>
                            <th>${translations[currentLang].name}</th>
                            <th>${translations[currentLang].stars}</th>
                            <th>${translations[currentLang].destruction}</th>
                            <th>${translations[currentLang].doneAttacks}</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${data.clan.members.map(member => `
                            <tr>
                                <td>${member.name}</td>
                                <td>${member.attacks
                                    ? member.attacks.reduce((sum, attack) => sum + (attack.stars || 0), 0)
                                    : 0}
                                </td>
                                <td>${member.attacks
                                    ? member.attacks.reduce((sum, attack) => sum + (attack.destructionPercentage || 0), 0)
                                    : 0}
                                </td>
                                <td>${member.attacks ? member.attacks.length : 0}</td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
                <h4 style="margin-top:20px;">${data.opponent.name} (${translations[currentLang].opponent})</h4>
                <table border="1" cellpadding="5" cellspacing="0">
                    <thead>
                        <tr>
                            <th>${translations[currentLang].name}</th>
                            <th>${translations[currentLang].stars}</th>
                            <th>${translations[currentLang].destruction}</th>
                            <th>${translations[currentLang].doneAttacks}</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${data.opponent.members.map(member => `
                            <tr>
                                <td>${member.name}</td>
                                <td>${member.attacks
                                    ? member.attacks.reduce((sum, attack) => sum + (attack.stars || 0), 0)
                                    : 0}
                                </td>
                                <td>${member.attacks
                                    ? member.attacks.reduce((sum, attack) => sum + (attack.destructionPercentage || 0), 0)
                                    : 0}
                                </td>
                                <td>${member.attacks ? member.attacks.length : 0}</td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
            `;
        } else {
            output.innerHTML += `<p>${translations[currentLang].noMembersInfo}</p>`;
        }
    } catch (err) {
        // Відображення помилки / Display error
        output.innerHTML = `<p style="color:red;">❌ Error: ${err.message}</p>`;
        console.error(err);
    }
}

/*async function fetchWarLeague() {
    const tag = document.getElementById('clanTag').value.trim().replace('#', '%23');
    const output = document.getElementById('output');

    if (!tag) {
        output.innerHTML = `<p style="color:red;">❗️Enter clan tag</p>`;
        return;
    }

    output.innerHTML = '🔄 Loading CWL data...';

    try {
        const res = await fetch(`http://localhost:3000/api/clan/${tag}/currentwar/leaguegroup`);
        if (!res.ok) throw new Error(await res.text());
        const data = await res.json();

        if (!data.rounds || !data.clans) {
            output.innerHTML = `<p>⚠️ CWL data not available for this clan.</p>`;
            return;
        }

        // Отримуємо поточний раунд
        const currentRound = data.rounds.find(round =>
            round.warTags.some(tag => tag !== '#0')
        );

        if (!currentRound) {
            output.innerHTML = `<p>❌ No active round found in CWL.</p>`;
            return;
        }

        // Виводимо загальну інформацію про групу CWL
        output.innerHTML = `
            <h2>🏆 CWL Season: ${data.season}</h2>
            <p><strong>State:</strong> ${data.state}</p>
            <h3>Clans in League Group:</h3>
            <ul>
                ${data.clans.map(c => `
                    <li><img src="${c.badgeUrls?.small}" style="width:20px;height:20px;"> 
                    ${c.name} (${c.tag})</li>
                `).join('')}
            </ul>
            <h3>Current Round War Tags:</h3>
            <ul>
                ${currentRound.warTags.map(tag => `<li>${tag}</li>`).join('')}
            </ul>
        `;
    } catch (err) {
        output.innerHTML = `<p style="color:red;">❌ Error: ${err.message}</p>`;
        console.error(err);
    }
}
async function fetchCurrentCWLWar(clanTag) {
    const output = document.getElementById('output');
    output.innerHTML = `${translations[currentLang].loading}`;

    try {
        // Отримуємо CWL Group
        const groupRes = await fetch(`http://localhost:3000/api/clan/${clanTag}/cwl/group`);
        if (!groupRes.ok) throw new Error(await groupRes.text());
        const groupData = await groupRes.json();

        const rounds = groupData.rounds || [];
        let currentWarData = null;

        // Перебираємо всі раунди, шукаємо актуальну війну
        for (const round of rounds) {
            for (const warTag of round.warTags) {
                if (warTag === "#0") continue;

                const warRes = await fetch(`http://localhost:3000/api/clan/cwl/war/${encodeURIComponent(warTag)}`);
                if (!warRes.ok) continue;
                const war = await warRes.json();

                if (war.state === "inWar" || war.state === "preparation") {
                    currentWarData = war;
                    break;
                }
            }
            if (currentWarData) break;
        }

        if (!currentWarData) {
            output.innerHTML = `<p>❌ ${translations[currentLang].notInWar}</p>`;
            return;
        }

        // Показуємо інформацію
        const war = currentWarData;
        output.innerHTML = `
            <h2>${translations[currentLang].currentCWLWar}</h2>
            <p><strong>${translations[currentLang].state}:</strong> ${war.state}</p>
            <p><strong>${translations[currentLang].teamSize}:</strong> ${war.teamSize}</p>
            <p><strong>${translations[currentLang].clan}:</strong> ${war.clan.name} (${war.clan.tag})</p>
            <p><strong>${translations[currentLang].opponent}:</strong> ${war.opponent.name} (${war.opponent.tag})</p>
            <hr />
            <h4>${war.clan.name}</h4>
            <table border="1" cellpadding="5" cellspacing="0">
                <thead>
                    <tr>
                        <th>${translations[currentLang].name}</th>
                        <th>${translations[currentLang].stars}</th>
                        <th>${translations[currentLang].doneAttacks}</th>
                    </tr>
                </thead>
                <tbody>
                    ${war.clan.members.map(member => `
                        <tr>
                            <td>${member.name}</td>
                            <td>${member.attacks
                                ? member.attacks.reduce((sum, attack) => sum + (attack.stars || 0), 0)
                                : 0}
                            </td>
                            <td>${member.attacks ? member.attacks.length : 0}</td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
            <h4 style="margin-top:20px;">${war.opponent.name} (${translations[currentLang].opponent})</h4>
            <table border="1" cellpadding="5" cellspacing="0">
                <thead>
                    <tr>
                        <th>${translations[currentLang].name}</th>
                        <th>${translations[currentLang].stars}</th>
                        <th>${translations[currentLang].doneAttacks}</th>
                    </tr>
                </thead>
                <tbody>
                    ${war.opponent.members.map(member => `
                        <tr>
                            <td>${member.name}</td>
                            <td>${member.attacks
                                ? member.attacks.reduce((sum, attack) => sum + (attack.stars || 0), 0)
                                : 0}
                            </td>
                            <td>${member.attacks ? member.attacks.length : 0}</td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        `;
    } catch (err) {
        output.innerHTML = `<p style="color:red;">❌ ${err.message}</p>`;
        console.error(err);
    }
}
*/
