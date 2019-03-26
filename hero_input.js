var heroes = JSON.parse(hero_data);
var sorted_heroes = heroes["heroes"].sort(function(a,b) {return a["localized_name"].localeCompare(b["localized_name"]);});
var hero_dict = {};
var hero_name_list = [];

var table_width = 12;
var hero_matrix = [];
let count = 0;
let row = [];

for (i=0; i<sorted_heroes.length; i++) {
	if (count >= table_width) {
		hero_matrix.push(row);
		count = 0;
		row = [];
	}
	row.push({	name: sorted_heroes[i]["localized_name"], 
				img: sorted_heroes[i]["url_small_portrait"]});
	count++;

	hero_name_list.push(sorted_heroes[i]["localized_name"]);

	hero_dict[sorted_heroes[i]["localized_name"]] = sorted_heroes[i]["localized_name"];
};

if (row.length > 0) {
	hero_matrix.push(row);
}