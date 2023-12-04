function calculateColor(value) {
    // Adjust the color based on the offense value
    const hue = (value / 100) * 120; // Scale the value to be between 0 and 120
    return `hsl(${hue}, 100%, 50%)`; // Convert to HSL format
}

class Player {
    constructor(name, skating, offense, defense, goalie, grit) {
      this.name = name;
      this.skating = skating;
      this.offense = offense;
      this.defense = defense;
      this.goalie = goalie;
      this.grit = grit;
      this.overall = (skating + offense + defense + grit) / 4;
    }
  }

  class pmove {
    constructor(obj, src) {
        this.obj = obj;
        this.src = src;
    }
  }

  class Team {
    constructor(name, players, goalie, headDivID, listDivID, goalieDivID) {
      this.name = name;
      this.players = players;
      this.goalie = goalie;
      this.headDivID = headDivID;
      this.listDivID = listDivID;
      this.goalieDivID = goalieDivID;
      this.skating = 0;
      this.off = 0;
      this.def = 0;
      this.goal = 0;
      this.grit = 0;
      this.numPlayers = 0;
    }

    recalculate() {
      if (this.players == null) return;
      this.skating = 0;
      this.off = 0;
      this.def = 0;
      this.goal = 0;
      this.grit = 0;
      this.numPlayers = 0;
      this.players.forEach(player => {
        this.skating += player.skating;
        this.off += player.offense;
        this.def += player.defense;
        this.grit += player.grit;
        this.numPlayers++;
      });
        this.skating = this.skating / this.numPlayers;
        this.off = this.off / this.numPlayers;
        this.def = this.def / this.numPlayers;
        this.grit = this.grit / this.numPlayers;
      if (this.goalie != null)
        this.goal = this.goalie.goalie;
    }
 
  }


  const players = [
    //  name, skating, offense, defense, goalie, grit
        // new Player("Fritz", 88, 84, 85, 54, 90),
        new Player("Nathan", 92, 91, 100, 51, 90),
        new Player("Spencer", 96, 93, 95, 96, 93),
        new Player("Trace", 64, 55, 41, 31, 73),
        // Missing Justis
        // new Player("Aden", 78, 78, 77, 23, 87),
        // new Player("Brock", 58, 59, 57, 39, 70),
        new Player("Caleb", 66, 65, 65, 10, 70),
        new Player("Chase", 78, 67, 85, 20, 83),
        new Player("Brandon", 34, 28, 34, 43, 40),
        new Player("Karom", 34, 28, 34, 43, 40),
        new Player("Ryan", 84, 58, 67, 66, 93),
        // Missing Adam
        new Player("Maverick", 62, 46, 41, 29, 77),
        new Player("Logan", 50, 41, 55, 20, 57),
        new Player("Geinert", 88, 76, 85, 51, 100),
        // Missing Tucker
        new Player("Jack", 52, 47, 54, 66, 53),
        new Player("Trevor", 44, 33, 39, 0, 50),
        new Player("Pifer", 24, 15, 26, 0, 17),
        new Player("Robert", 6, 3, 10, 67, 40),
        new Player("Alex", 62, 59, 51, 74, 67),
        new Player("AnaBeth", 42, 52, 48, 48, 50),
        new Player("Joe", 10, 10, 10, 60, 70),
        new Player("Alex Oh", 90, 90, 90, 60, 80)
    ];

    const teams = [
        new Team("Koalas", [], null, 'team1-header','team1-players-section', 'team1-goalie-section'),
        new Team("Chihuahuas", [], null, 'team2-header','team2-players-section', 'team2-goalie-section')
    ];

    // Populate the team sections
    teams.forEach(team => {
        const headTeamDiv = document.getElementById(team.headDivID);
        headTeamDiv.innerHTML = `<h2>${team.name}</h2><p>Offense: ${team.off.toFixed(2)}</p><p>Defense: ${team.def.toFixed(2)}</p><p>Skating: ${team.skating.toFixed(2)}</p><p>Grit: ${team.grit.toFixed(2)}</p><p>Goalie: ${team.goal.toFixed(2)}</p>`
    });

    function updateTeamDiv(team) {
        const headTeamDiv = document.getElementById(team.headDivID);
        headTeamDiv.innerHTML = `<h2>${team.name}</h2><p>Offense: ${team.off.toFixed(2)}</p><p>Defense: ${team.def.toFixed(2)}</p><p>Skating: ${team.skating.toFixed(2)}</p><p>Grit: ${team.grit.toFixed(2)}</p><p>Goalie: ${team.goal.toFixed(2)}</p>`;
    }

  // Populate the players section
  const playersSection = document.getElementById('players-section');
  players.forEach(player => {
    const playerDiv = createPlayerDiv(player, 'players-section');
    playersSection.appendChild(playerDiv);
  });

  function createPlayerDiv(player, src) {
    const playerDiv = document.createElement('div');
    playerDiv.className = 'player';
    playerDiv.id = player.name;
    playerDiv.draggable = true;
    // Calculate the color based on the offense value
    const color = calculateColor(player.overall);

    playerDiv.innerHTML = `
        <strong>${player.name}</strong>
        <div class="player-circle" style="background-color: ${color};"></div>
    `;
    // playerDiv.innerHTML = `<strong>${player.name}</strong><br>Offense: ${player.offense}<br>Defense: ${player.defense}<br>Goalie: ${player.goalie}`;
    playerDiv.ondragstart = (event) => {
      event.dataTransfer.setData('text/plain', JSON.stringify(new pmove(player, src)));
    };
    return playerDiv;
  }

  function allowDrop(event) {
    event.preventDefault();
  }

  function drop(event, targetSection) {
    event.preventDefault();
    const data = event.dataTransfer.getData('text/plain');
    const pmove = JSON.parse(data);
    const player = pmove.obj;
    const playerDiv = createPlayerDiv(player, targetSection);

    // Remove player from the source section
    const sourceSection = document.getElementById(pmove.src);
    sourceSection.removeChild(document.getElementById(player.name));

    var team = teams.find(t => t.listDivID === sourceSection.id);
    if (team) {
        const index = team.players.indexOf(player);
        if (index > -1)
            team.players.splice(index, 1);
    } 
    team = teams.find(t => t.goalieDivID === sourceSection.id);
    if (team) {
      team.goalie = null;
    }

    // Add player to the corresponding team or goalie section
    const targetElement = document.getElementById(targetSection);
    targetElement.appendChild(playerDiv);

    // Update the team values and refresh the team div
    team = teams.find(t => t.listDivID === targetSection);
    if (team) {
      team.players.push(player);
    } 
    team = teams.find(t => t.goalieDivID === targetSection);
    if (team) {
      team.goalie = player;
    }
    // update all teams
    for (var i = 0; i < teams.length; i++) {
        teams[i].recalculate();
        updateTeamDiv(teams[i]);
    }

  }