if(localStorage.stored_counters_json) {
	var the_counter_dict = JSON.parse(localStorage.stored_counters_json);
  } else {
	  var the_counter_dict = JSON.parse(counter_json);
  }

var editMode = 'None';

var heroCounteredByDict = the_counter_dict['counteredBy'];
var heroCounterToDict = the_counter_dict['counterTo'];
var heroSynergyDict = the_counter_dict['synergizesWith'];

var modeToDictDict = {};
modeToDictDict['synergizesWith'] = heroSynergyDict;
modeToDictDict['counteredBy'] = heroCounteredByDict;
modeToDictDict['counterTo'] = heroCounterToDict;

var dictNameToImage = {};

var heroSelectorList = document.createElement("datalist");
heroSelectorList.id = "heroList";

var heroes = JSON.parse(hero_data);
var sorted_heroes = heroes["heroes"].sort(function(a,b) {return a["localized_name"].localeCompare(b["localized_name"]);});

var tableWidth = 20;

var body = document.getElementsByTagName("body")[0];
var table = document.createElement("table");

var heroCount = heroes["heroes"].length;
var i = 0;

function heroClicked() {
	if (editMode != 'None') {
		if (heroSelector.value in dictNameToImage){
			this.classList.toggle(editMode);

			if (this.classList.contains("synergizesWith") || this.classList.contains("counteredBy") || this.classList.contains("counterTo")) {
				this.classList.remove('unimportant');		
			} else {
				this.classList.add('unimportant');		
			}

			if(modeToDictDict[editMode][heroSelector.value].includes(this.id)) {
				modeToDictDict[editMode][heroSelector.value].splice(modeToDictDict[editMode][heroSelector.value].indexOf(this.id),1);
			} else {
				modeToDictDict[editMode][heroSelector.value].push(this.id);
			}
		}
	}
}

while(i<heroCount) {
	var row = document.createElement("tr");
	for (j=0; j<tableWidth; j++) {
		if(i<heroCount) {
			var cell = document.createElement("td");
			var img = document.createElement("img");
			img.src = sorted_heroes[i]["url_small_portrait"];
			img.id = sorted_heroes[i]["localized_name"];
			img.onclick = heroClicked;
			cell.appendChild(img);
			row.appendChild(cell);

			var heroName = sorted_heroes[i]["localized_name"];
			dictNameToImage[heroName] = sorted_heroes[i]["url_small_portrait"];

			var option = document.createElement("option");
			option.value = sorted_heroes[i]["localized_name"];
			heroSelectorList.appendChild(option);

			i++;
		}
	}
	table.appendChild(row);
}

body.appendChild(table);

body.appendChild(document.createElement('br'));

var heroSelector = document.createElement("input");
heroSelector.type = "text";
heroSelector.setAttribute("list","heroList");


var text = document.createElement('div');
text.textContent = 'Select a Hero to Edit Counters/Synergies:';
body.appendChild(text);

body.appendChild(heroSelectorList);
body.appendChild(heroSelector);

var selectedHero = document.createElement('img');


body.appendChild(document.createElement('br'));
body.appendChild(selectedHero);


function HeroSelected() {
	var heroName = heroSelector.value;
	if (heroName in dictNameToImage){
		selectedHero.src = dictNameToImage[heroName];

		for(i=0;i<heroCount;i++) {
			document.getElementById(heroes["heroes"][i]["localized_name"]).classList.remove("counteredBy");
			document.getElementById(heroes["heroes"][i]["localized_name"]).classList.remove("counterTo");
			document.getElementById(heroes["heroes"][i]["localized_name"]).classList.remove("synergizesWith");
			document.getElementById(heroes["heroes"][i]["localized_name"]).classList.add("unimportant");
		}		

		for (j=0; j<modeToDictDict["counteredBy"][heroName].length; j++) {
			var tmpHeroName = modeToDictDict["counteredBy"][heroName][j];
			document.getElementById(tmpHeroName).classList.add("counteredBy");
			document.getElementById(tmpHeroName).classList.remove("unimportant");

		}

		for (j=0; j<modeToDictDict["counterTo"][heroName].length; j++) {
			var tmpHeroName = modeToDictDict["counterTo"][heroName][j];
			document.getElementById(tmpHeroName).classList.add("counterTo");
			document.getElementById(tmpHeroName).classList.remove("unimportant");
		}

		for (j=0; j<modeToDictDict["synergizesWith"][heroName].length; j++) {
			var tmpHeroName = modeToDictDict["synergizesWith"][heroName][j];
			document.getElementById(tmpHeroName).classList.add("synergizesWith");	
			document.getElementById(tmpHeroName).classList.remove("unimportant");
		}
 
	} else {
		selectedHero.src = '';
	}

	removeEditButtonClasses();
	editMode = 'None';
}

heroSelector.oninput = HeroSelected;

var modeToClassDict = {};
modeToClassDict['synergizesWith'] = 'btn-primary';
modeToClassDict['counterTo'] = 'btn-success';
modeToClassDict['counteredBy'] = 'btn-danger';

function removeButtonClass(aClass) {
	Array.from(document.getElementsByClassName(aClass)).forEach(function(aButton) {
				aButton.classList.remove(aClass);
			});
}

function removeEditButtonClasses() {
	removeButtonClass('btn-success');
	removeButtonClass('btn-danger');
	removeButtonClass('btn-primary');
}

function editButtonPressed() {
	if (heroSelector.value in dictNameToImage) {
		if (editMode != this.id) {
			editMode = this.id;
			removeEditButtonClasses();
			this.classList.add(modeToClassDict[this.id]);
		}
		else {
			editMode = 'None';
			removeEditButtonClasses();
		}
	} 
	else {
		editMode = 'None';
		removeEditButtonClasses();
	}
}

var editCountersTo = document.createElement("button");
editCountersTo.textContent = 'Edit Heroes this hero is good against';
editCountersTo.id = 'counterTo';
editCountersTo.classList.add('btn-default');
editCountersTo.classList.add('btn');
editCountersTo.onclick = editButtonPressed;

var editCounteredBy = document.createElement("button");
editCounteredBy.textContent = 'Edit Heroes this hero is bad against';
editCounteredBy.id = 'counteredBy';
editCounteredBy.classList.add('btn-default');
editCounteredBy.classList.add('btn');
editCounteredBy.onclick = editButtonPressed;

var editSynergies = document.createElement("button");
editSynergies.textContent = 'Edit heroes that synergizes with this hero';
editSynergies.id = 'synergizesWith';
editSynergies.classList.add('btn-default');
editSynergies.classList.add('btn');
editSynergies.onclick = editButtonPressed;

body.appendChild(document.createElement('br'));
body.appendChild(document.createElement('br'));

body.appendChild(editCountersTo);
body.appendChild(editCounteredBy);
body.appendChild(editSynergies);

var saveButton = document.createElement('button');
saveButton.textContent = 'Save';
saveButton.id = 'saveButton';
saveButton.classList.add('btn-default');
saveButton.classList.add('btn');
saveButton.onclick = () => {localStorage.stored_counters_json = JSON.stringify(modeToDictDict);};

var backButton = document.createElement('button');
backButton.textContent = 'Back';
backButton.id = 'backButton';
backButton.classList.add('btn-default');
backButton.classList.add('btn');
backButton.onclick = () => {location.href = location.href.replace("countersEditPage.html","") + 'index.html';};

var resetCountersButton = document.createElement('button');
resetCountersButton.textContent = 'Reset to Defaults';
resetCountersButton.id = 'resetCountersButton';
resetCountersButton.classList.add('btn-default');
resetCountersButton.classList.add('btn');
resetCountersButton.onclick = () => {localStorage.clear(); location.reload()};

body.appendChild(document.createElement('br'));
body.appendChild(document.createElement('br'));
body.appendChild(saveButton);
body.appendChild(backButton);
body.appendChild(resetCountersButton);