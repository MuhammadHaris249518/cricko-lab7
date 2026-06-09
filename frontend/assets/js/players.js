// ─── Lab 7 (Updated): Fetch API + Search/Filter + Flip Animations ───────────

let allPlayers = [];
let currentSearch  = "";
let currentRole    = "all";
let currentRank    = "all";

// ── Fetch players from JSON via Fetch API (localStorage cache) ────────────────
fetch((typeof BACKEND_URL !== 'undefined' ? BACKEND_URL : '') + "/api/players")
  .then(function(response) { return response.json(); })
  .then(function(players) {
    allPlayers = players;
    // Also persist to localStorage so we can re-use across refreshes
    localStorage.setItem("cricko_players", JSON.stringify(players));
    renderFiltered();
  })
  .catch(function() {
    // Fallback: try localStorage cache
    let cached = localStorage.getItem("cricko_players");
    if (cached) {
      allPlayers = JSON.parse(cached);
      renderFiltered();
    } else {
      document.getElementById("playersGrid").innerHTML =
        "<p style='color:var(--rose);text-align:center;grid-column:1/-1;padding:40px'>⚠️ Could not load players. Make sure you are using Live Server.</p>";
    }
  });

// ── Apply all active filters and render ───────────────────────────────────────
function renderFiltered() {
  let result = allPlayers.slice();

  // 1. Name search
  if (currentSearch.trim() !== "") {
    let q = currentSearch.trim().toLowerCase();
    result = result.filter(function(p) {
      return p.name.toLowerCase().includes(q);
    });
  }

  // 2. Role filter
  if (currentRole !== "all") {
    result = result.filter(function(p) { return p.role === currentRole; });
  }

  // 3. Rank filter — sort by rank ascending when a rank range is selected
  if (currentRank !== "all") {
    if (currentRank === "top3") {
      result = result.filter(function(p) { return p.rank <= 3; });
    } else if (currentRank === "top5") {
      result = result.filter(function(p) { return p.rank <= 5; });
    } else if (currentRank === "top10") {
      result = result.filter(function(p) { return p.rank <= 10; });
    }
    // Always sort by rank when rank filter is active
    result.sort(function(a, b) { return a.rank - b.rank; });
  }

  renderPlayers(result);
}

// ── Build one player card HTML ────────────────────────────────────────────────
function buildCard(p) {
  let isTop3 = p.rank <= 3;
  let isTop5 = p.rank <= 5;

  // Rank badge styles
  let rankBadge = "";
  if (p.rank === 1) {
    rankBadge = '<div class="rank-badge rank-gold"><span class="diamond-icon">💎</span>#1 DIAMOND</div>';
  } else if (p.rank === 2) {
    rankBadge = '<div class="rank-badge rank-silver"><span class="diamond-icon">💠</span>#2 ELITE</div>';
  } else if (p.rank === 3) {
    rankBadge = '<div class="rank-badge rank-bronze"><span class="diamond-icon">🔷</span>#3 TOP</div>';
  } else if (p.rank <= 5) {
    rankBadge = '<div class="rank-badge rank-normal">#' + p.rank + ' RANKED</div>';
  }

  let statsHTML = "";
  if (p.runs)  statsHTML += '<div class="pstat"><div class="pstat-num">' + p.runs  + '</div><div class="pstat-lbl">Runs</div></div>';
  if (p.avg)   statsHTML += '<div class="pstat"><div class="pstat-num">' + p.avg   + '</div><div class="pstat-lbl">Avg</div></div>';
  if (p.wkts && !p.runs) statsHTML += '<div class="pstat"><div class="pstat-num">' + p.wkts + '</div><div class="pstat-lbl">Wickets</div></div>';
  if (p.econ)  statsHTML += '<div class="pstat"><div class="pstat-num">' + p.econ  + '</div><div class="pstat-lbl">Economy</div></div>';
  if (p.wkts && p.runs)  statsHTML += '<div class="pstat"><div class="pstat-num">' + p.wkts + '</div><div class="pstat-lbl">Wickets</div></div>';

  let cardClass = "player-card" + (isTop3 ? " card-top3" : isTop5 ? " card-top5" : "");
  let avatarGlow = isTop3 ? "style='background:linear-gradient(135deg,rgba(240,165,0,0.25),rgba(232,56,90,0.2))'" : "style='background:linear-gradient(135deg,rgba(240,165,0,0.12),rgba(232,56,90,0.1))'";

  return '<div class="' + cardClass + '" data-rank="' + p.rank + '">'
    + (p.captain ? '<div class="captain-badge">Captain</div>' : '')
    + rankBadge
    + '<div class="rank-number">#' + p.rank + '</div>'
    + '<div class="player-avatar" ' + avatarGlow + '>' + p.emoji + '</div>'
    + '<div class="player-name">'  + p.name + '</div>'
    + '<div class="player-role">'  + p.role + '</div>'
    + '<div class="player-team">'  + p.team + '</div>'
    + '<div class="player-stats">' + statsHTML + '</div>'
    + '</div>';
}

// ── Render players with flip animation ───────────────────────────────────────
function renderPlayers(players) {
  let container = document.getElementById("playersGrid");

  // Get existing cards for flip-out animation
  let existing = container.querySelectorAll(".player-card");
  existing.forEach(function(card) {
    card.classList.add("flip-out");
  });

  let delay = existing.length > 0 ? 200 : 0;

  setTimeout(function() {
    container.innerHTML = "";

    if (players.length === 0) {
      container.innerHTML = "<div class='no-results'><div class='no-results-icon'>🔍</div><p>No players found matching your search.</p></div>";
      return;
    }

    players.forEach(function(p, i) {
      let wrapper = document.createElement("div");
      wrapper.innerHTML = buildCard(p);
      let card = wrapper.firstChild;
      card.classList.add("flip-in");
      card.style.animationDelay = (i * 60) + "ms";
      container.appendChild(card);
    });
  }, delay);
}

// ── Search input handler ──────────────────────────────────────────────────────
function onSearchInput(val) {
  currentSearch = val;
  renderFiltered();
}

// ── Role filter (called from HTML buttons) ────────────────────────────────────
function filterByRole(filter, btn) {
  document.querySelectorAll(".filter-btn").forEach(function(b) { b.classList.remove("active"); });
  btn.classList.add("active");
  currentRole = filter;
  renderFiltered();
}

// ── Rank filter (called from rank select) ─────────────────────────────────────
function filterByRank(val) {
  currentRank = val;
  // Highlight select if active
  let sel = document.getElementById("rankSelect");
  if (val !== "all") {
    sel.classList.add("active-filter");
  } else {
    sel.classList.remove("active-filter");
  }
  renderFiltered();
}
