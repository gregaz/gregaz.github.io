Vue.component('v-select', VueSelect.VueSelect);

if(localStorage.stored_counters_json) {
  var the_counter_dict = JSON.parse(localStorage.stored_counters_json);
} else {
	var the_counter_dict = JSON.parse(counter_json);
}

if(localStorage.default_player_hero_position_pairs) {
	var default_player_hero_position_pairs = JSON.parse(localStorage.default_player_hero_position_pairs);
} else {
	var default_player_hero_position_pairs = {
		'Are Tea Sea?': [
				{ id:0, hero: 'Shadow Fiend', position:'2' },
				{ id:0, hero: 'Lycan', position:'1' },
				{ id:0, hero: 'Outworld Devourer', position:'2' },
			],
			'SeaCiety' : [
				{ id:0, hero: 'Phantom Lancer', position:'1' },
				{ id:0, hero: 'Sven', position:'1' },
				{ id:0, hero: 'Queen of Pain', position:'2' }
			],
			'Bulldawg' : [
				{ id:0, hero: 'Natures Prophet', position:'3' },
				{ id:0, hero: 'Broodmother', position:'3' },
				{ id:0, hero: 'Lone Druid', position:'3' }
			],
			'owee200' : [
				{ id:0, hero: 'Techies', position:'4' },
				{ id:0, hero: 'Naga Siren', position:'4' },
				{ id:0, hero: 'Chen', position:'4' }
			],
			'peepeedee' : [
				{ id:0, hero: 'Crystal Maiden', position:'5' },
				{ id:0, hero: 'Vengeful Spirit', position:'5' },
				{ id:0, hero: 'Treant Protector', position:'5' }
			],
			'TPK' : [
				{ id:0, hero: 'Antimage', position:'1' }
			],
	};
}
if(localStorage.default_selected_players) {
	var default_selected_players = JSON.parse(localStorage.default_selected_players);
} else {
	var default_selected_players = ['Are Tea Sea?', 'SeaCiety', 'Bulldawg', 'owee200', 'peepeedee'];
}

Vue.component('hero-and-position-item', {
  props: ['hero-and-position', 'edit_team_allowed_prop', 'selected_heroes_prop'],
  template: '<li v-bind:class="classObject" v-on:click="selectHeroPosition">\
	  	{{ heroAndPosition.hero + " - " + heroAndPosition.position }}\
	  	<button v-on:click="sendRemoveSelfEvent"\
	  		class="btn btn-xs btn-danger right"\
	  		v-bind:class="{hidden: !this.edit_team_allowed_prop}">\
	  		X</button>\
 	</li>\
  ',
  methods: {
  	sendRemoveSelfEvent: function() {
  		if (this.isSelected) {
  			this.selectHeroPosition();
  		}
  		this.$emit('remove', this.heroAndPosition);
  	},
  	selectHeroPosition: function() {
  		this.isSelected = !this.isSelected;
  		this.$emit('select_hero', [this.heroAndPosition.hero, this.isSelected])
  	}
  },
  computed: {
  	shouldMarkAsCounterTo: function() {
  		//green
  		if(this.isSelected || this.selected_heroes_prop.length == 0) {
  			return false
  		} else {
  			for (i=0; i<this.selected_heroes_prop.length;i++) {
  				if (!the_counter_dict['counterTo'][this.selected_heroes_prop[i]].includes(this.heroAndPosition['hero'])) {
  					return false
  				}
  			}
  			return true
  		} 
  	},
  	shouldMarkAsCounteredBy: function() {
  		//red
  		if(this.isSelected || this.selected_heroes_prop.length == 0) {
  			return false
  		} else {
			for (i=0; i<this.selected_heroes_prop.length;i++) {
  				if (!the_counter_dict['counteredBy'][this.selected_heroes_prop[i]].includes(this.heroAndPosition['hero'])) {
  					return false
  				}
  			}
  			return true
  		}
  	},
  	shouldMarkAsSynergyWith: function() {
  		//blue
  		if(this.isSelected || this.selected_heroes_prop.length == 0) {
  			return false
  		} else {
		for (i=0; i<this.selected_heroes_prop.length;i++) {
  				if (!the_counter_dict['synergizesWith'][this.selected_heroes_prop[i]].includes(this.heroAndPosition['hero'])) {
  					return false
  				}
  			}
  			return true
  		}
  	},
  	classObject: function() {
  		return {
  			no_bullets: true,
  			'text-arial': true,
  			hero_position: true,
  			selected_hero: this.isSelected,
  			counterTo: this.shouldMarkAsCounterTo,
  			counteredBy: this.shouldMarkAsCounteredBy,
  			synergizesWith: this.shouldMarkAsSynergyWith,
  			hero_position_neutral: (!this.isSelected && !this.shouldMarkAsCounterTo && !this.shouldMarkAsCounteredBy && !this.shouldMarkAsSynergyWith),
  		}
  	}
  },
  data: function() {
  	return {
  		isSelected: false
  	}
  }
});

Vue.component('player-hero-options', {
	template: '<td>\
	<select v-model="player_name" v-on:change="selectedPlayerChanged" :disabled="!edit_team_allowed_prop" class="btn btn-default btn-sm">\
		<option v-for="player in player_name_options">{{ player }}</option>\
	</select>\
  <ol class="hero_list">\
  	<hero-and-position-item\
      v-for="(item, index) in heroPositionPairs"\
      v-bind:hero-and-position="item"\
      v-bind:key="item.id"\
      v-bind:edit_team_allowed_prop="edit_team_allowed_prop"\
      v-bind:selected_heroes_prop="selected_heroes_prop"\
      v-on:remove="removeHeroAndPosition"\
      v-on:select_hero="selectHero">\
    </hero-and-position-item>\
  </ol>\
  <table>\
  	<tr>\
  		<td>\
		  <div class="fixed_size_div">\
			  <v-select v-model="new_hero_name" \
			  	:options="hero_name_list"\
			  	:placeholder="\'Hero Name\'"\
			  	v-bind:class="{ redshadow: hero_error, hidden: shouldHideAddHeroButton }">\
			  	v-on:keyup.enter="addNewHeroAndPosition"\
			  	</v-select>\
		  </div>\
		  <input v-model="new_player_name"\
			  v-on:keyup.enter="addNewPlayer"\
			  type="text" \
			  placeholder="Player Name"\
			  v-bind:class="{ hidden: shouldHideAddPlayerButton }">\
		</td>\
		<td>\
		  <select class="btn btn-default btn-sm btn-pos" v-model="new_hero_position" \
		  	v-bind:class="{ redshadow: position_error, hidden: shouldHideAddHeroButton }"\
		  	v-on:keyup.enter="addNewHeroAndPosition">\
		     <option value="1">1</option>\
		     <option value="2">2</option>\
		     <option value="3">3</option>\
		     <option value="4">4</option>\
		     <option value="5">5</option>\
			</select>\
			</td>\
			<td>\
		  <button v-on:click="addNewHeroAndPosition" v-bind:class="{ hidden: shouldHideAddHeroButton }" class="btn btn-xs btn-success">&#10133;</button>\
		  <button v-on:click="addNewPlayer" v-bind:class="{ hidden: shouldHideAddPlayerButton }" class="btn btn-xs btn-success">&#10133;</button>\
		 </td>\
	  </tr>\
  </table>\
  </td>',
  props: ['player_names', 'player_name_prop', 'player_to_hero_position_pairs', 'selected_player_names', 'player_index', 'edit_team_allowed_prop', 'selected_heroes_prop'],
  data: function() {
  	return {
  		player_name: this.player_name_prop,
  		new_hero_name: '',
  		new_hero_position: '',
  		position_error: false,
  		hero_error: false,
  		add_player_mode: false,
  		new_player_name: ''
  	}
  },
  methods: {
  	addNewHeroAndPosition: function() {
  		this.$emit('add_new_hero_and_position', [this.new_hero_name, this.new_hero_position, this.player_name, this.player_to_hero_position_pairs.length]);
  		this.position_error = this.newValidPosition();
  		this.hero_error = this.newValidHero();
  		if( !this.hero_error && !this.position_error) {this.new_hero_name = '';}
  	},
  	newValidPosition: function() {
  		return this.new_hero_position == ''
  	},
  	newValidHero: function() {
  		return !(this.new_hero_name in hero_dict)
  	},
  	removeHeroAndPosition: function(heroAndPostionToRemove) {
  		this.$emit('remove_hero_and_position_for_player', [this.player_name, heroAndPostionToRemove])
  	},
  	selectedPlayerChanged: function(){
  		if(this.player_name == this.addPlayerString) {
  			this.add_player_mode = true;
  		} else {
  			this.add_player_mode = false;	
  		}
  		this.$emit('selected_player_changed', {playerIndex: this.player_index, playerName: this.player_name})
  	},
  	addNewPlayer: function() {
  		this.add_player_mode = false;
  		this.player_name = this.new_player_name;
		this.$emit('add_new_player', [this.new_player_name, this.player_index]);
  		this.new_player_name = '';
  	},
  	selectHero: function(hero_and_selection) {
  		this.$emit('select_hero', hero_and_selection);
  	}
  },
  created() {
  		this.selectedPlayerChanged();
  },
  computed: {
    heroPositionPairs: function() {
   		return this.player_to_hero_position_pairs[this.player_name]
  	},
  	player_name_options: function() {
  		the_selected_player_names = this.selected_player_names;
  		this_player_name = this.player_name;
  		player_name_list = this.player_names.filter(function(a_player_name) { 
  			return !(the_selected_player_names.includes(a_player_name)) || a_player_name == this_player_name
  		});
  		player_name_list.push(this.addPlayerString);
  		return player_name_list
  	},
  	addPlayerString: function() {
  		return 'Add Player'
  	},
  	shouldHideAddPlayerButton: function() {
  		return !this.add_player_mode || !this.edit_team_allowed_prop
  	},
  	shouldHideAddHeroButton: function() {
  		return this.add_player_mode || !this.edit_team_allowed_prop
  	},
	hero_name_list: function() {
		return hero_name_list
	}
  }
});


Vue.component('ban-item', {
	template: '<li class="no_bullets">\
		<div class="fixed_size_div auto_margins"> \
			<v-select v-model="hero_name" :options="hero_name_list" :placeholder="\'Hero Name\'"\
				v-on:optionClicked="selectHero"\
				v-bind:is_selected="isSelected"\
			 	v-bind:should_mark_as_counter_to="shouldMarkAsCounterTo"\
			 	v-bind:should_mark_as_countered_by="shouldMarkAsCounteredBy"\
			 	@input="changedHero"\
			 	v-bind:should_mark_as_synergy_with="shouldMarkAsSynergyWith"></v-select>\
		</div>\
  	</li>',
	props: ['hero_name_prop', 'top_or_bottom_prop', 'selected_heroes_prop', 'ban_index','chosen_heroes_prop'],
	methods: {
		selectHero: function() {
			//i could make this better if i could build vue-select :(
			if (this.$children[0].open) {
				if(this.isSelected) {
					this.$emit('select_hero', [this.hero_name, false]);
				}
				this.isSelected = false;
			} else {
				this.isSelected = !this.isSelected;
				this.$emit('select_hero', [this.hero_name, this.isSelected]);
			}

		},
		changedHero: function() {
			this.$emit('hero_chosen', [this.hero_name, this.top_or_bottom_prop, this.ban_index, 'ban'])
		}
	},
	data: function() {return {
		hero_name: this.hero_name_prop,
		isSelected: false
	}},
	computed: {
		hero_name_list: function() {
			return hero_name_list.filter(hero_name => !this.chosen_heroes_prop.includes(hero_name))
		},	
		shouldMarkAsCounterTo: function() {
	  		//green
	  		if(this.isSelected || this.selected_heroes_prop.length == 0) {
	  			return false
	  		} else {
	  			for (i=0; i<this.selected_heroes_prop.length;i++) {
	  				if (!the_counter_dict['counterTo'][this.selected_heroes_prop[i]].includes(this.hero_name)) {
	  					return false
	  				}
	  			}
	  			return true
	  		} 
	  	},
	  	shouldMarkAsCounteredBy: function() {
	  		//red
	  		if(this.isSelected || this.selected_heroes_prop.length == 0) {
	  			return false
	  		} else {
				for (i=0; i<this.selected_heroes_prop.length;i++) {
	  				if (!the_counter_dict['counteredBy'][this.selected_heroes_prop[i]].includes(this.hero_name)) {
	  					return false
	  				}
	  			}
	  			return true
	  		}
	  	},
	  	shouldMarkAsSynergyWith: function() {
	  		//blue
	  		if(this.isSelected || this.selected_heroes_prop.length == 0) {
	  			return false
	  		} else {
			for (i=0; i<this.selected_heroes_prop.length;i++) {
	  				if (!the_counter_dict['synergizesWith'][this.selected_heroes_prop[i]].includes(this.hero_name)) {
	  					return false
	  				}
	  			}
	  			return true
	  		}
	  	},
		classObject: function() {
	  		return {
	  			selected_pick_or_ban: this.isSelected,
	  			pick_or_ban: true,
	  			counterTo: this.shouldMarkAsCounterTo,
	  			counteredBy: this.shouldMarkAsCounteredBy,
	  			synergizesWith: this.shouldMarkAsSynergyWith
	  		}
  		}
	}
});

Vue.component('pick-item', {
	template: '<td class="text-arial">\
		{{pick_index == 0 ? "Picks:" : ""}}\
		</br>\
		<div class="fixed_size_div"> \
			<v-select v-model="hero_name" :options="hero_name_list" :placeholder="\'Hero Name\'"\
			 v-on:optionClicked="selectHero"\
			 v-bind:is_selected="isSelected"\
			 v-bind:should_mark_as_counter_to="shouldMarkAsCounterTo"\
			 v-bind:should_mark_as_countered_by="shouldMarkAsCounteredBy"\
			 v-bind:should_mark_as_synergy_with="shouldMarkAsSynergyWith"\
			 @input="changedHero"></v-select>\
		</div>\
  	</td>',
	props: ['hero_name_prop', 'pick_index', 'top_or_bottom_prop', 'selected_heroes_prop', 'chosen_heroes_prop'],
	methods: {
		selectHero: function() {
			//i could make this better if i could build vue-select :(
			if (this.$children[0].open) {
				if(this.isSelected) {
					this.$emit('select_hero', [this.hero_name, false]);
				}
				this.isSelected = false;
			} else {
				this.isSelected = !this.isSelected;
				this.$emit('select_hero', [this.hero_name, this.isSelected]);
			}

		},
		changedHero: function() {
			this.$emit('hero_chosen', [this.hero_name, this.top_or_bottom_prop, this.pick_index, 'pick'])
		}
	},
	data: function() {return {
		hero_name: this.hero_name_prop,
		isSelected: false
	}},
	computed: {
		hero_name_list: function() {
			return hero_name_list.filter(hero_name => !this.chosen_heroes_prop.includes(hero_name))
		},
		shouldMarkAsCounterTo: function() {
	  		//green
	  		if(this.isSelected || this.selected_heroes_prop.length == 0) {
	  			return false
	  		} else {
	  			for (i=0; i<this.selected_heroes_prop.length;i++) {
	  				if (!the_counter_dict['counterTo'][this.selected_heroes_prop[i]].includes(this.hero_name)) {
	  					return false
	  				}
	  			}
	  			return true
	  		} 
	  	},
	  	shouldMarkAsCounteredBy: function() {
	  		//red
	  		if(this.isSelected || this.selected_heroes_prop.length == 0) {
	  			return false
	  		} else {
				for (i=0; i<this.selected_heroes_prop.length;i++) {
	  				if (!the_counter_dict['counteredBy'][this.selected_heroes_prop[i]].includes(this.hero_name)) {
	  					return false
	  				}
	  			}
	  			return true
	  		}
	  	},
	  	shouldMarkAsSynergyWith: function() {
	  		//blue
	  		if(this.isSelected || this.selected_heroes_prop.length == 0) {
	  			return false
	  		} else {
			for (i=0; i<this.selected_heroes_prop.length;i++) {
	  				if (!the_counter_dict['synergizesWith'][this.selected_heroes_prop[i]].includes(this.hero_name)) {
	  					return false
	  				}
	  			}
	  			return true
	  		}
	  	},
		classObject: function() {
	  		return {
	  			selected_pick_or_ban: this.isSelected,
	  			pick_or_ban: true,
	  			counterTo: this.shouldMarkAsCounterTo,
	  			counteredBy: this.shouldMarkAsCounteredBy,
	  			synergizesWith: this.shouldMarkAsSynergyWith
	  		}
  		}
	}
});

Vue.component('picks-and-bans', {
	template: '	<table class="center">\
		<tbody class="left">\
			<tr>\
				<td>\
					<div class="text-arial">Bans:</div>\
					<table>\
						<tr>\
							<td>\
								<ban-item \
								    v-bind:hero_name_prop="bans_prop[0]"\
			      					v-bind:key="0"\
			      					v-bind:ban_index="0"\
			      					v-on:select_hero="selectHero"\
			      					v-bind:selected_heroes_prop="selected_heroes_prop"\
			      					v-on:hero_chosen="heroChosen"\
			      					v-bind:chosen_heroes_prop=chosen_heroes_prop\
			      					v-bind:top_or_bottom_prop=top_or_bottom_prop>\
			      				</ban-item>\
			      			</td>\
			      			<td>\
			      				<ban-item \
								    v-bind:hero_name_prop="bans_prop[1]"\
			      					v-bind:key="1"\
			      					v-bind:ban_index="1"\
			      					v-on:select_hero="selectHero"\
			      					v-bind:selected_heroes_prop="selected_heroes_prop"\
			      					v-on:hero_chosen="heroChosen"\
			      					v-bind:chosen_heroes_prop=chosen_heroes_prop\
			      					v-bind:top_or_bottom_prop=top_or_bottom_prop>\
			      				</ban-item>\
			      			</td>\
			      		</tr>\
			      		<tr>\
							<td>\
								<ban-item \
								    v-bind:hero_name_prop="bans_prop[2]"\
			      					v-bind:key="2"\
			      					v-bind:ban_index="2"\
			      					v-on:select_hero="selectHero"\
			      					v-bind:selected_heroes_prop="selected_heroes_prop"\
			      					v-on:hero_chosen="heroChosen"\
			      					v-bind:chosen_heroes_prop=chosen_heroes_prop\
			      					v-bind:top_or_bottom_prop=top_or_bottom_prop>\
			      				</ban-item>\
			      			</td>\
			      			<td>\
			      				<ban-item \
								    v-bind:hero_name_prop="bans_prop[3]"\
			      					v-bind:key="3"\
			      					v-bind:ban_index="3"\
			      					v-on:select_hero="selectHero"\
			      					v-bind:selected_heroes_prop="selected_heroes_prop"\
			      					v-on:hero_chosen="heroChosen"\
			      					v-bind:chosen_heroes_prop=chosen_heroes_prop\
			      					v-bind:top_or_bottom_prop=top_or_bottom_prop>\
			      				</ban-item>\
			      			</td>\
			      		</tr>\
							<tr>\
								<td>\
									<ban-item\
											v-bind:hero_name_prop="bans_prop[4]"\
												v-bind:key="4"\
												v-bind:ban_index="4"\
												v-on:select_hero="selectHero"\
												v-bind:selected_heroes_prop="selected_heroes_prop"\
												v-on:hero_chosen="heroChosen"\
												v-bind:chosen_heroes_prop=chosen_heroes_prop\
												v-bind:top_or_bottom_prop=top_or_bottom_prop>\
												</ban-item>\
										</td>\
										<td>\
										<ban-item\
										v-bind:hero_name_prop="bans_prop[5]"\
											v-bind:key="5"\
											v-bind:ban_index="5"\
											v-on:select_hero="selectHero"\
											v-bind:selected_heroes_prop="selected_heroes_prop"\
											v-on:hero_chosen="heroChosen"\
											v-bind:chosen_heroes_prop=chosen_heroes_prop\
											v-bind:top_or_bottom_prop=top_or_bottom_prop>\
											</ban-item>\
									</td>\
								</tr>\
							</table>\
							</div>\
				</td>\
				<td>\
					<table>\
						<tbody>\
							<tr>\
								<pick-item v-for="(pick, index) in picks_prop"\
									v-bind:hero_name_prop="pick"\
									v-bind:pick_index="index"\
									v-bind:key="index"\
									v-on:select_hero="selectHero"\
									v-bind:selected_heroes_prop="selected_heroes_prop"\
									v-bind:top_or_bottom_prop=top_or_bottom_prop\
									v-bind:chosen_heroes_prop=chosen_heroes_prop\
									v-on:hero_chosen="heroChosen">\
									</pick-item>\
							</tr>\
						</tbody>\
					</table>\
				</td>\
			</tr>\
		</tbody>\
	</table>',
	props: ['picks_prop', 'bans_prop', 'top_or_bottom_prop', 'selected_heroes_prop', 'chosen_heroes_prop'],
	methods: {
		selectHero: function(hero_and_selection) {
			this.$emit('select_hero', hero_and_selection);
		},
		heroChosen: function(hero_pick_ban_index) {
			this.$emit('hero_chosen', hero_pick_ban_index);
		}
	},
	data: function() {return {}},
	computed: {}
});


Vue.component('available-hero-item', {
	template: '<td> \
		<div v-if="isTextMode" v-bind:class="classObject" v-on:click="selectHero"> {{ hero_name_prop }} </div>\
		<img v-if="isImgMode" class = "available_hero_img" v-bind:src="hero_image_url_prop" v-bind:class="classObject" v-on:click="selectHero">\
	</td>',
	props: ['hero_name_prop', 'selected_heroes_prop', 'hero_image_url_prop', 'text_or_img_mode_prop'],
	methods: {
		selectHero: function() {
			this.isSelected = !this.isSelected;
			this.$emit('select_hero', [this.hero_name_prop, this.isSelected]);
		}
	},
	data: function() {
		return {
			isSelected: false
	}},
	computed: {
		isTextMode: function() {
			return this.text_or_img_mode_prop == 'text'
		},
		isImgMode: function() {
			return !this.isTextMode
		},
		shouldMarkAsCounterTo: function() {
			if(this.isSelected || this.selected_heroes_prop.length == 0) {
	  			return false
	  		} else {
	  			for (i=0; i<this.selected_heroes_prop.length;i++) {
	  				if (!the_counter_dict['counterTo'][this.selected_heroes_prop[i]].includes(this.hero_name_prop)) {
	  					return false
	  				}
	  			}
	  			return true
	  		} 
		},
		shouldMarkAsCounteredBy: function() {
			if(this.isSelected || this.selected_heroes_prop.length == 0) {
	  			return false
	  		} else {
	  			for (i=0; i<this.selected_heroes_prop.length;i++) {
	  				if (!the_counter_dict['counteredBy'][this.selected_heroes_prop[i]].includes(this.hero_name_prop)) {
	  					return false
	  				}
	  			}
	  			return true
	  		} 
		},
		shouldMarkAsSynergyWith: function() {
			if(this.isSelected || this.selected_heroes_prop.length == 0) {
	  			return false
	  		} else {
	  			for (i=0; i<this.selected_heroes_prop.length;i++) {
	  				if (!the_counter_dict['synergizesWith'][this.selected_heroes_prop[i]].includes(this.hero_name_prop)) {
	  					return false
	  				}
	  			}
	  			return true
	  		} 
		},
		classObject: function() {
			return {
				cell_padding: true,
				available_hero: true,
				selected_hero: this.isSelected,
	  			counterTo: this.shouldMarkAsCounterTo,
	  			counteredBy: this.shouldMarkAsCounteredBy,
	  			synergizesWith: this.shouldMarkAsSynergyWith,
	  			hero_position_neutral: (!this.isSelected && !this.shouldMarkAsCounterTo && !this.shouldMarkAsCounteredBy && !this.shouldMarkAsSynergyWith)
			}
		}
	}
});

Vue.component('available-hero-row', {
	template: '<tr>\
		<available-hero-item v-for="(the_hero_name,index) in hero_names_prop"\
			v-bind:hero_name_prop="the_hero_name[\'name\']"\
			v-bind:hero_image_url_prop="the_hero_name[\'img\']"\
			v-bind:selected_heroes_prop = "selected_heroes_prop"\
			v-bind:text_or_img_mode_prop="text_or_img_mode_prop"\
			v-on:select_hero="selectHero"\
			v-bind:key="index">\
		</available-hero-item>\
	 </tr>',
	props: ['hero_names_prop', 'selected_heroes_prop', 'text_or_img_mode_prop'],
	methods: {  	
		selectHero: function(hero_and_selection) {
  			this.$emit('select_hero', hero_and_selection);
  		}
  	},
	data: function() {return {}},
	computed: {}
});

Vue.component('available-hero-table', {
	template: '<div class="center">\
		<button v-on:click="toggleTextImgMode" class="btn btn-default btn-xs right">{{ textOrImageMode }}</button>\
		<table class="center">\
				<tbody class="center">\
					<available-hero-row v-for="(a_row, index) in hero_rows_prop"\
						v-bind:hero_names_prop="a_row"\
						v-bind:selected_heroes_prop = "selected_heroes_prop"\
						v-on:select_hero="selectHero"\
						v-bind:text_or_img_mode_prop="text_or_img_mode"\
						v-bind:key="index">\
					</available-hero-row>\
				</tbody>\
			</table>\
		</div>',
	props: ['hero_rows_prop', 'selected_heroes_prop'],
	methods: {		
		selectHero: function(hero_and_selection) {
  			this.$emit('select_hero', hero_and_selection);
  		},
  		toggleTextImgMode: function() {
  			if(this.text_or_img_mode == 'text') {
  				this.text_or_img_mode = 'img';
  			} else {
  				this.text_or_img_mode = 'text';
  			}
  		}
  	},
	data: function() {return {text_or_img_mode: 'text'}},
	computed: {
		textOrImageMode: function() {
			return this.text_or_img_mode == 'text' ? "Text" : "Img"
		}
	}
});



var vm = new Vue({
  el: '#team-hero-options',
  data: {
  	selectedPlayerNames: default_selected_players,
  	playerToHeroPositionPairs: default_player_hero_position_pairs,
    picks: {
    	'top' : ['', '', '', '', ''],
    	'bottom' : ['', '', '', '', '']
    },
    bans: {
    	'top' : ['', '', '', '', '', ''],
    	'bottom' : ['', '', '', '', '', '']
    },
    hero_matrix: hero_matrix,
    edit_team_allowed: true,
    selected_heroes: []
  },
  methods: {
  	addNewHeroAndPositionForPlayer: function(new_hero_and_position) {
  		new_hero_name = new_hero_and_position[0];
  		new_position = new_hero_and_position[1];
  		player_name = new_hero_and_position[2];
  		next_id = new_hero_and_position[3];
  		if (this.newValidPosition(new_position) && this.newValidHero(new_hero_name)) {
  			already_exists = this.playerToHeroPositionPairs[player_name].some( function(a_hero_and_position_pair) {
  				return a_hero_and_position_pair.hero == new_hero_name && a_hero_and_position_pair.position == new_position
  			});
  			if(!already_exists) {
  				this.playerToHeroPositionPairs[player_name].push({id:next_id, hero: new_hero_name, position: new_position});	
  			}
  		}
  	},
  	newValidPosition: function(new_position) {
  		return new_position != ''
  	},
  	newValidHero: function(new_hero_name) {
  		return new_hero_name in hero_dict
  	},
  	removeHeroAndPositionForPlayer: function(player_and_hero_and_position) {
  		player_name = player_and_hero_and_position[0];
  		hero_and_position = player_and_hero_and_position[1];
  		this.playerToHeroPositionPairs[player_name] = this.playerToHeroPositionPairs[player_name].filter(function(a_hero_and_position_pair) {
  			return a_hero_and_position_pair.hero != hero_and_position.hero || a_hero_and_position_pair.position != hero_and_position.position
  		})
  	},
  	selectedPlayerChanged: function(player_and_index) {
  		this.selectedPlayerNames[player_and_index.playerIndex] = player_and_index.playerName;
  	},
  	addNewPlayer: function(new_player_name_and_index) {
  		new_player_name = new_player_name_and_index[0];
  		new_player_index = new_player_name_and_index[1];
  		if(!(new_player_name in this.playerToHeroPositionPairs)) {
  			this.$set(this.playerToHeroPositionPairs,new_player_name,[]);
  			//this.playerToHeroPositionPairs[new_player_name] = [{id:0, hero: 'Antimage', position:'1'}]; //this doesn't trigger a recompute, stupid vue
  		}
  		this.selectedPlayerNames[new_player_index] = new_player_name;
  	},
  	toggleEditTeamAllowed: function() {
  		this.edit_team_allowed = !this.edit_team_allowed;
  	},
  	selectHero: function(a_hero_and_selection) {
  		if(a_hero_and_selection[1]) {
  			this.selected_heroes.push(a_hero_and_selection[0]);	
  		} else {
  			the_index = this.selected_heroes.indexOf(a_hero_and_selection[0]);
  			this.selected_heroes.splice(the_index,1);
  		}  		
  	},
  	saveTeam: function() {	
			localStorage.default_player_hero_position_pairs = JSON.stringify(default_player_hero_position_pairs);
			localStorage.default_selected_players = JSON.stringify(default_selected_players);
  	},
  	goToCounterEditPage: function() {
  		location.href = location.href.replace("index.html","") + 'countersEditPage.html';
  	},
  	heroChosen: function(hero_pick_ban_index) {
  		if(hero_pick_ban_index == 'pick') {
  			this.picks[hero_pick_ban_index[1]].splice(hero_pick_ban_index[2], 1, hero_pick_ban_index[0]);
  		} else {
  			this.bans[hero_pick_ban_index[1]].splice(hero_pick_ban_index[2], 1, hero_pick_ban_index[0]);
  		}
  		
		//this.picks[hero_pick_ban_index[1]][hero_pick_ban_index[2]] = hero_pick_ban_index[0]; //this doesn't trigger a compute :(
  	}
  },
  computed: {
  	playerNames: function() {
  		return Object.keys(this.playerToHeroPositionPairs)
  	},
  	topBans: function() {
  		return this.bans['top']
  	},
  	topPicks: function() {
  		return this.picks['top']
  	},
  	bottomBans: function() {
  		return this.bans['bottom']
  	},
  	bottomPicks: function() {
  		return this.picks['bottom']
  	},
  	allPicksAndBans: function() {
  		return this.picks['top'].concat(this.bans['top']).concat(this.picks['top']).concat(this.bans['bottom'])
  	},
  }
})