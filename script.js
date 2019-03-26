//this should come from the backend eventually
var the_counter_dict = JSON.parse(counter_json);


var editMode = 'None';

var heroCounteredByDict = the_counter_dict['counteredBy'];
var heroCounterToDict = the_counter_dict['counterTo'];
var heroSynergyDict = the_counter_dict['synergizesWith'];

var modeToDictDict = {};
modeToDictDict['synergizesWith'] = heroSynergyDict;
modeToDictDict['counteredBy'] = heroCounterToDict;
modeToDictDict['counterTo'] = heroCounterToDict;

var dictNameToImage = {};

var heroSelectorList = document.createElement("datalist");
heroSelectorList.id = "heroList";

var heroes = JSON.parse(data);



var tableWidth = 10;

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

			if(modeToDictDict[editMode][heroSelector.value].includes(self.id)) {
				modeToDictDict[editMode][heroSelector.value] = modeToDictDict[editMode][heroSelector.value].filter(function(item) {
					return item !== self.id;
				})
			} else {
				modeToDictDict[editMode][heroSelector.value].push(self.id);
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
			img.src = heroes["heroes"][i]["url_small_portrait"];
			img.id = heroes["heroes"][i]["localized_name"];
			img.onclick = heroClicked;
			cell.appendChild(img);
			row.appendChild(cell);

			//heroCounteredByDict[heroes["heroes"][i]["localized_name"]]= [];
			//heroCounterToDict[heroes["heroes"][i]["localized_name"]] = [];
			//heroSynergyDict[heroes["heroes"][i]["localized_name"]] = [];

			var heroName = heroes["heroes"][i]["localized_name"];
			dictNameToImage[heroName] = heroes["heroes"][i]["url_small_portrait"];

			var option = document.createElement("option");
			option.value = heroes["heroes"][i]["localized_name"];
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

		for (j=0; j<heroCounteredByDict[heroName].length; j++) {
			var tmpHeroName = heroCounteredByDict[heroName][j];
			document.getElementById(tmpHeroName).classList.add("counteredBy");
			document.getElementById(tmpHeroName).classList.remove("unimportant");

		}

		for (j=0; j<heroCounterToDict[heroName].length; j++) {
			var tmpHeroName = heroCounterToDict[heroName][j];
			document.getElementById(tmpHeroName).classList.add("counterTo");
			document.getElementById(tmpHeroName).classList.remove("unimportant");
		}

		for (j=0; j<heroSynergyDict[heroName].length; j++) {
			var tmpHeroName = heroSynergyDict[heroName][j];
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


//Need to hook this into backend
var saveButton = document.createElement('button');
saveButton.textContent = 'Save';
saveButton.id = 'saveButton';
saveButton.classList.add('btn-default');
saveButton.classList.add('btn');


body.appendChild(document.createElement('br'));
body.appendChild(document.createElement('br'));
body.appendChild(saveButton);