//shader source: https://www.shadertoy.com/view/MtdXzr

var autosaveStarted = false
//Sets all variables to their base values
function reset() {
	game = {
    XP: 0,
    level: 1,
    XPButtonsUnlocked: 1,
    XPButtonCooldowns: [],
    chestButtonsUnlocked: 1,
    chestButtonCooldowns: [],
    potions: [[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[]],
    potionTypesDiscovered: [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    potionsOpened: [0,0],
    bestPotionRarity: 1,
    XPPotionMultiplier: 1,
    backgroundDisabled: false,
    lastSave: Date.now(),
    timeOfLastUpdate: Date.now(),
    timePlayed: 0,
  };
  potionListCurrentRarity = 0;
}
reset();

//If the user confirms the hard reset, resets all variables, saves and refreshes the page
function hardReset() {
  if (confirm("Are you sure you want to reset? You will lose everything!")) {
    reset();
    save();
    location.reload();
  }
}

function save() {
  //console.log("saving")
  game.lastSave = Date.now();
  localStorage.setItem("infiniterDescenterSave", JSON.stringify(game));
}

function setAutoSave() {
  setInterval(save, 5000);
  autosaveStarted = true;
}
//setInterval(save, 5000)

function load() {
	reset();
	let loadgame = JSON.parse(localStorage.getItem("infiniterDescenterSave"));
	if (loadgame != null) {loadGame(loadgame);}
}

load();

function exportGame() {
  save();
  navigator.clipboard.writeText(btoa(JSON.stringify(game))).then(function() {
    alert("Copied to clipboard!");
  }, function() {
    alert("Error copying to clipboard, try again...");
  });
}

function importGame() {
  loadgame = JSON.parse(atob(prompt("Input your save here:")));
  if (loadgame && loadgame != null && loadgame != "") {
    reset();
    loadGame(loadgame);
    save();
    location.reload();
  }
  else {
    alert("Invalid input.");
  }
}

function loadGame(loadgame) {
  //Sets each variable in 'game' to the equivalent variable in 'loadgame' (the saved file)
  let loadKeys = Object.keys(loadgame);
  for (let i=0; i<loadKeys.length; i++) {
    if (loadgame[loadKeys[i]] != "undefined") {
      let thisKey = loadKeys[i];
      if (game[thisKey] == undefined) {continue} //Skip if the variable in the save file doesn't exist in the game
      if (Array.isArray(loadgame[thisKey])) { //Check if the current variable is an array
        //Check if the array in the save file is shorter than the array in the game
        if (loadgame[thisKey].length < game[thisKey].length) {
          game[loadKeys[i]] = game[thisKey].map((x, index) => {
            return loadgame[thisKey][index] !== undefined ? loadgame[thisKey][index] : x;
          });
        } else {
          game[loadKeys[i]] = loadgame[thisKey].map((x) => {
            return x;
          });
        }
      }
      //else {game[Object.keys(game)[i]] = loadgame[loadKeys[i]]}
      else {game[loadKeys[i]] = loadgame[loadKeys[i]]}
    }
  }
}

function XPToLevel(x) {return Math.floor((x / 50) ** 0.6) + 1;}
function levelToXP(x) {return Math.ceil((x-1) ** (1/0.6) * 50);}
function numberToTime(x) {
  xCeil = Math.ceil(x)
  result = ""
  if (xCeil>=3600) result += Math.floor(xCeil/3600) + "h ";
  if (Math.floor(xCeil/60)%60 != 0) result += (Math.floor(xCeil/60)%60) + "m ";
  if (xCeil%60 != 0) result += Math.floor(xCeil%60) + "s ";
  return result;
}
function numberToRomanNumerals(x) {
  if (x < 1) return "";
  if (x > 5000) return "MMMMM+";
  let result = "";
  for (let [numeral, value] of romanNumerals) {
    while (x >= value) {
      result += numeral;
      x -= value;
    }
  }
  return result;
}

function gainXP(x, collectAll=false) {
  if (collectAll) { //Collect all XP button
    for (let i=0;i<game.XPButtonsUnlocked;i++) {
      if (game.XPButtonCooldowns[i] > 0) continue;
      game.XP += Math.floor(XPButtonGains[i] * game.XPPotionMultiplier);
      game.XPButtonCooldowns[i] = XPButtonCooldowns[i];
    }
  }
  else { //Individual XP button
    if (game.XPButtonCooldowns[x] > 0) return;
    game.XP += Math.floor(XPButtonGains[x] * game.XPPotionMultiplier);
    game.XPButtonCooldowns[x] = XPButtonCooldowns[x];
  }
  game.level = XPToLevel(game.XP);
  //Adding new XP buttons
  while (game.level >= XPButtonUnlockLevels[game.XPButtonsUnlocked]) {
    game.XPButtonsUnlocked++;
    updateXPButtons();
  }
  //Adding new chest buttons
  while (game.level >= chestButtonUnlockLevels[game.chestButtonsUnlocked]) {
    game.chestButtonsUnlocked++;
    updateChestButtons();
  }
  
  updateRank();
  updateVisuals();
}

//Outside of visual update to reduce the frquency this function is called
//Updates rank text
function updateRank() {
  if (game.level >= 2000) {
    document.getElementById("rank").innerText = "Omega-" + numberToRomanNumerals(Math.floor(game.level/50) - 39);
  }
  else {
    let currentRank = 0;
    while (game.level >= ranks[currentRank][0]) currentRank++;
    document.getElementById("rank").innerText = ranks[currentRank-1][1];
  }
}
updateRank();

function updateVisuals() {
  //Sets the "XP to next level" text
  XPToNextLevel = levelToXP(game.level + 1) - levelToXP(game.level);
  let progressToNextLevel = Math.floor(game.XP - levelToXP(game.level));
  document.getElementById("XPToNextLevel").innerHTML = format(progressToNextLevel) + "/" + format(XPToNextLevel);
  document.getElementById("XPBarBack").style.width = Math.min(progressToNextLevel / XPToNextLevel * 100, 100) + "%";
  document.getElementById("level").innerHTML = format(game.level);
  document.getElementById("nextButtonLevel").innerText = XPButtonUnlockLevels[game.XPButtonsUnlocked];
  document.getElementById("nextChestLevel").innerText = chestButtonUnlockLevels[game.chestButtonsUnlocked];
  document.getElementById("XPPotionMultiplier").innerHTML = format(game.XPPotionMultiplier);
  if (document.getElementById("optionsMenu").style.display == "inline-block") {
    document.getElementById("timePlayed").innerText = numberToTime(game.timePlayed);
    document.getElementById("potionsOpened").innerText = game.potionsOpened[0];
    document.getElementById("alreadyDiscoveredPotions").innerText = game.potionsOpened[1];
  }

  //XP button cooldown visuals
  for (let i=0;i<game.XPButtonsUnlocked;i++) {
    if (game.XPButtonCooldowns[i] > 0) {
      document.getElementsByClassName("XPButton")[i].innerText = numberToTime(game.XPButtonCooldowns[i]);
      document.getElementsByClassName("XPButton")[i].style.color = "#aaa";
      document.getElementsByClassName("XPButton")[i].style.border = "4px solid #888";
    }
    else {
      document.getElementsByClassName("XPButton")[i].innerHTML = "Gain " + format(Math.floor(XPButtonGains[i] * game.XPPotionMultiplier)) + " XP";
      document.getElementsByClassName("XPButton")[i].style.color = XPButtonColors[i % 12];
      document.getElementsByClassName("XPButton")[i].style.border = "4px solid " + XPButtonColors[i % 12];
    }
  }

  //Chest button cooldown visuals
  for (let i=0;i<game.chestButtonsUnlocked;i++) {
    if (game.chestButtonCooldowns[i] > 0) {
      document.getElementsByClassName("chestButton")[i].innerText = numberToTime(game.chestButtonCooldowns[i]);
      document.getElementsByClassName("chestButton")[i].style.border = "4px solid #888";
    }
    else {
      document.getElementsByClassName("chestButton")[i].innerHTML = "<img class='chestImage' src='img/chest" + (i+1) + ".png'>Open " + rarityNames[i] + " chest";
      document.getElementsByClassName("chestButton")[i].style.border = "4px solid " + rarityColors[i];
    }
  }

  //Potion medals
  for (let i=0;i<20;i++) {
    document.getElementsByClassName("potionMedal")[19-i].style.backgroundPosition = (Math.floor(game.potionTypesDiscovered[i] / 4) * -20) + "px 0px";
  }
}

//Updates cooldowns
function updateLarge() {
  //XP button cooldowns
  for (i=0;i<game.XPButtonsUnlocked;i++) {
    if (game.XPButtonCooldowns[i] > 0) game.XPButtonCooldowns[i] -= ((Date.now() - game.timeOfLastUpdate) / 1000);
    if (game.XPButtonCooldowns[i] < 0) game.XPButtonCooldowns[i] = 0;
  }
  //Chest button cooldowns
  for (i=0;i<game.chestButtonsUnlocked;i++) {
    if (game.chestButtonCooldowns[i] > 0) game.chestButtonCooldowns[i] -= ((Date.now() - game.timeOfLastUpdate) / 1000);
    if (game.chestButtonCooldowns[i] < 0) game.chestButtonCooldowns[i] = 0;
  }
  game.timePlayed += (Date.now() - game.timeOfLastUpdate) / 1000;
  game.timeOfLastUpdate = Date.now();
  updateVisuals();
}
setInterval(updateLarge, 100) //Runs the update ~10 times per second

function updateXPButtons() {
  while (document.getElementsByClassName("XPButton").length < game.XPButtonsUnlocked) {
    //Create a new button with the "XPButton" class for each unlocked XP button not already created
    let newButton = document.createElement("button");
    newButton.setAttribute("data-id", document.getElementsByClassName("XPButton").length);
    newButton.className = "XPButton";
    newButton.innerText = "Gain " + Math.floor(XPButtonGains[newButton.dataset.id] * game.XPPotionMultiplier) + " XP";
    newButton.onclick = function() {gainXP(newButton.dataset.id);};
    document.getElementById("XPButtonDiv").appendChild(newButton);
  }
  while (document.getElementsByClassName("XPButton").length > game.XPButtonsUnlocked) {
    //Removing extra buttons if for some reason there are too many
    document.getElementById("XPButtonDiv").removeChild(document.getElementsByClassName("XPButton")[document.getElementsByClassName("XPButton").length-1]);
  }
  updateVisuals();
}

function updateChestButtons() {
  while (document.getElementsByClassName("chestButton").length < game.chestButtonsUnlocked) {
    //Create a new button with the "chestButton" class for each unlocked XP button not already created
    let newButton = document.createElement("button");
    newButton.setAttribute("data-id", document.getElementsByClassName("chestButton").length);
    newButton.className = "chestButton";
    newButton.innerHTML = "<img class='chestImage' src='img/chest" + (document.getElementsByClassName("chestButton").length+1) + ".png'>Open " + rarityNames[document.getElementsByClassName("chestButton").length] + " chest";
    newButton.onclick = function() {openChest(newButton.dataset.id);};
    document.getElementById("chestButtonDiv").appendChild(newButton);
  }
  while (document.getElementsByClassName("chestButton").length > game.chestButtonsUnlocked) {
    //Removing extra buttons if for some reason there are too many
    document.getElementById("chestButtonDiv").removeChild(document.getElementsByClassName("chestButton")[document.getElementsByClassName("chestButton").length-1]);
  }
}
updateChestButtons();
updateXPButtons();

function openChest(x) {
  if (game.chestButtonCooldowns[x] > 0) return;

  //Choosing a rarity
  let adjustedRarityChances = rarityChances.map((chance, index) => index === x ? chance * 2 : chance); // Rarity x has double the chance
  let totalRarityChance = adjustedRarityChances.reduce((acc, rarity) => acc + rarity, 0); // Sum of all adjusted rarity probabilities
  let randomChest = Math.random() * totalRarityChance; //Random number between 0 and the sum
  let checkedProbability = 0;
  let rarityIndex = 0;
  while (randomChest > checkedProbability) { //Checks each index by adding its corresponding rarity until the checked probability is greater than the random number
    checkedProbability += adjustedRarityChances[rarityIndex];
    rarityIndex++;
  }
  let probability = adjustedRarityChances[rarityIndex-1] / totalRarityChance;
  if (rarityIndex > game.bestPotionRarity) {game.bestPotionRarity = rarityIndex}

  //Choosing a potion
  let totalPotionChance = potionChances.reduce((acc, rarity) => acc + rarity, 0); //Sum of all potion probabilities
  let randomPotion = Math.random() * totalPotionChance; //Random number between 0 and the sum
  checkedProbability = 0;
  let potionIndex = 0;
  while (randomPotion > checkedProbability) {
    checkedProbability += potionChances[potionIndex];
    potionIndex++;
  }
  probability *= potionChances[potionIndex-1] / totalPotionChance;

  game.chestButtonCooldowns[x] = chestButtonCooldowns[x]; //Set chest cooldown

  //Adding potion to list
  if (!game.potions[rarityIndex-1][potionIndex-1]) {game.potions[rarityIndex-1][potionIndex-1] = 1}
  else {game.potions[rarityIndex-1][potionIndex-1]++};
  //Updating stats
  game.potionsOpened[0]++;
  if (game.potions[rarityIndex-1][potionIndex-1] > 1) game.potionsOpened[1]++;

  document.getElementById("potionGainText").innerHTML = "Gained a " + potionNames[potionIndex-1] + " <span style='color:" + rarityColors[rarityIndex-1] + "'>" + rarityNames[rarityIndex-1] + "</span> potion!<br>" + (game.potions[rarityIndex-1][potionIndex-1] > 1 ? "Already discovered - " : "") + "1 in " + Math.round(1/probability) + (probability < 0.001 ? "!!" : "");
  document.getElementById("potionGainImage").style.display = "block";
  document.getElementById("potionGainImage").style.backgroundPosition = (potionIndex-1) * -96 + "px " + (rarityIndex-1) * -96 + "px";

  save();
  updatePotionTypesDiscovered();
  calculateXPPotionMultiplier();
  updateXPButtons();
  if (document.getElementById("potionListDiv").style.display == "inline-block") updatePotionListVisuals();
}

function openAllChests() {
  for (let i=0;i<game.chestButtonsUnlocked;i++) {
    openChest(i);
  }
}

function updatePotionTypesDiscovered() {
  for (let i=0;i<game.bestPotionRarity;i++) {
    game.potionTypesDiscovered[i] = game.potions[i].filter(x => x > 0).length;
  }
}

function calculateXPPotionMultiplier() {
  let multiplier = 1;
  for (let i=0;i<game.potionTypesDiscovered.length;i++) {
    multiplier *= (1 + potionXPGains[game.potionTypesDiscovered[i]] * potionRarityXPMultipliers[i]);
  }
  game.XPPotionMultiplier = multiplier;
  document.getElementById("XPPotionMultiplier").innerText = game.XPPotionMultiplier.toFixed(2);
}
calculateXPPotionMultiplier()

function openClosePotionList() {
  if (document.getElementById("potionListDiv").style.display != "inline-block") {
    document.getElementById("potionListDiv").style.display = "inline-block";
    updatePotionListVisuals();
  }
  else {
    document.getElementById("potionListDiv").style.display = "none";
  }
}

function updatePotionListVisuals() {
  //Darkening left/right buttons
  document.getElementById("potionListLeftButton").style.filter = (potionListCurrentRarity == 0 ? "brightness(0.7)" : "none");
  document.getElementById("potionListRightButton").style.filter = (potionListCurrentRarity == game.bestPotionRarity - 1 ? "brightness(0.7)" : "none");

  let titleString = rarityNames[potionListCurrentRarity] + " potions";
  titleString = titleString.charAt(0).toUpperCase() + titleString.slice(1); //Capitalize first letter
  document.getElementById("potionListTitle").innerText = titleString;
  //document.getElementById("potionListTitle").style.color = rarityColors[potionListCurrentRarity];
  let subtitleString = game.potionTypesDiscovered[potionListCurrentRarity] + " of 12 discovered - ";
  if (game.potionTypesDiscovered[potionListCurrentRarity] == 12) {subtitleString += "<span style='color: #ffd700'>x" + (1 + potionXPGains[game.potionTypesDiscovered[potionListCurrentRarity]] * potionRarityXPMultipliers[potionListCurrentRarity]).toFixed(2) + " XP gain</span>"}
  else {subtitleString += "x" + (1 + potionXPGains[game.potionTypesDiscovered[potionListCurrentRarity]] * potionRarityXPMultipliers[potionListCurrentRarity]).toFixed(2) + " XP gain"}
  document.getElementById("potionListSubtitle").innerHTML = subtitleString

  for (let i=0;i<12;i++) { //Setting icons and darkening for undiscovered potions
    document.getElementsByClassName("potionListItem")[i].style.backgroundPosition = (i * -96) + "px " + (potionListCurrentRarity * -96) + "px";
    if (game.potions[potionListCurrentRarity][i] > 0) {
      document.getElementsByClassName("potionListItem")[i].style.filter = "none"
    }
    else {
      document.getElementsByClassName("potionListItem")[i].style.filter = "brightness(0.5)"
    }
  }
}

function nextPotionListRarity() {
  potionListCurrentRarity = Math.min(potionListCurrentRarity + 1, game.bestPotionRarity - 1);
  updatePotionListVisuals();
}

function previousPotionListRarity() {
  potionListCurrentRarity = Math.max(potionListCurrentRarity - 1, 0);
  updatePotionListVisuals();
}

function displayPotionInfo(x) {
  let potionInfoTitleString = potionNames[x-1] + " <span style='color: " + rarityColors[potionListCurrentRarity] + "'>" + rarityNames[potionListCurrentRarity] + "</span> potion";
  potionInfoTitleString = potionInfoTitleString.charAt(0).toUpperCase() + potionInfoTitleString.slice(1); //Capitalize first letter
  document.getElementById("potionInfoTitle").innerHTML = potionInfoTitleString
  document.getElementById("potionInfo").innerText = "You have " + (game.potions[potionListCurrentRarity][x-1] ? game.potions[potionListCurrentRarity][x-1] : 0);
}

function openCloseOptionsMenu() {
  if (document.getElementById("optionsMenu").style.display != "inline-block") {
    document.getElementById("optionsMenu").style.display = "inline-block";
    updateVisuals();
  }
  else {document.getElementById("optionsMenu").style.display = "none";}
}

function format(x,forceLargeFormat=false) {
	if (x==Infinity) {return "Infinity"}
	else if (forceLargeFormat || x>=1e12) {
		let exponent = Math.floor(Math.log10(x))
		return (Math.floor(x/(10**exponent)*100)/100).toFixed(2) + "e" + exponent
	}
	else {return Math.floor(x).toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,')}
}