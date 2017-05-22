var http = require('http');

// SESSION should pass equation; score; streak
exports.handler = function (req, context) {
  /* =============================================
     CONTROL VARIABLES
  ============================================= */
  var alexa_response = {
    version: "1.0",
    response: {
      outputSpeech: { type: "PlainText", text: "Hello" },
      card: { type: "Simple", title: "Fubnub", content: "A simple voice driven adventue game." },
      reprompt: { outputSpeech: { type: "PlainText", text: "Hello" } },
      shouldEndSession: false
    },
    sessionAttributes: {
      'story':{},
      'saved':{}
    }
  };

  var intent = '';
  try { var intent = req.request.intent.name; } catch (err) { intent = 'unknown'; }
  var request_type = '';
  try { var request_type = req.request.type; } catch (err) { }
  var alexa_session = '';
  try { alexa_session = req.session; alexa_response['response']['session'] = alexa_session; } catch (err) { }
  try { if ('attributes' in alexa_session && alexa_session['attributes'] != null) { alexa_response['sessionAttributes'] = alexa_session['attributes']; } } catch (err) {  }

  var story = {};
  var story_loaded = false;
  try {
    story = alexa_response['sessionAttributes']['saved'];
    var plot = story['plot'];
    if (typeof(plot) != 'undefined' && plot != null) {
      story['loaded'] = true;
      story_loaded = true;
    }
  } catch (ex) {
  }
  if (!story_loaded) {
    story = {
      "plot":"The red troll.",
      "missions":[
        {
          "name":"hunt for the red troll",
          "status":"unresolved",
          "detail":"Find and kill the red troll.",
          "point_value":100,
          "puzzles":[
            {"cmd":"build", "solution":"poison sword", "detail":"create a special weapon.", "status":"unresolved"}
          ]
        }
      ],
      "character": {
        "name":"Falicon","karma":0,
        "x":4,"y":6,"z":1,"lives":1,
        "score":0,"health":100,"max_health":100,
        "magic":10,"max_magic":10,
        "coins":20,"power_range":[0,10],
        "items":[],
        "spells":["heal"],
        "equiped":["candle"]
      },
      "spells":[
        {"name":"heal","detail":"With proper mental focus you are able to heal yourself a bit.","magic_cost":2,"adjust_health":25},
      ],
      "enemies": [
        {"name":"troll","type":"fixed","disposition":"aggressive","x":2,"y":2,"z":1,"power_range":[1,25],"health":25,"point_value":5,"detail":"A foul, smelly creature.","items":[]},
        {"name":"troll","type":"fixed","disposition":"aggressive","x":4,"y":3,"z":1,"power_range":[1,25],"health":25,"point_value":5,"detail":"A foul, smelly creature.","items":[]},
        {"name":"troll","type":"fixed","spawn":{"x":3,"y":5,"z":1,"health":10},"x":3,"y":5,"z":1,"power_range":[1,25],"health":25,"point_value":5,"detail":"A foul, smelly creature.","items":[]},
        {"name":"troll","type":"fixed","spawn":{"x":4,"y":5,"z":1,"health":10},"x":4,"y":5,"z":1,"power_range":[1,25],"health":25,"point_value":5,"detail":"A foul, smelly creature.","items":["candy bar"]},
        {"name":"red troll","type":"fixed","x":1,"y":4,"z":1,"power_range":[5,50],"health":50,"point_value":50,"detail":"a red, foul, smelly creature. It looks like it might take something special to defeat this troll.","items":[],"required":["poison sword"]}
      ],
      "friendlies": [
        {"name":"old man","x":4,"y":6,"z":1,"type":"fixed","detail":"a wise looking old man.","conversation":{"default":"There is a red troll wreaking havoc nearby. Please help rid him of our land! You should be able to find a sword to help west of here."},"puzzles":[
          {"cmd":"pray","solution":"old man","items":["poison sword"],"detail":"Thanks! Take this for your efforts!"}
        ]},
        {"name":"woman","x":4,"y":2,"z":1,"type":"fixed","detail":"a friendly looking woman.","conversation":{"default":"I used to make posion from just water, poison ivy, and a rotten apple!"}},
        {"name":"boy","x":2,"y":4,"z":1,"type":"fixed","detail":"a happy looking boy.","conversation":{"default":"They say that the red troll can only be defeated by a sword dipped in poison!"},"items":["candy bar"]},
        {"name":"inn keeper","x":6,"y":3,"z":1,"type":"fixed","detail":"a friendly looking chap.","conversation":{"default":"You should use our bed. I promise you'll feel great when you are done!"}},
        {"name":"wanderer","x":4,"y":4,"z":1,"type":"fixed","detail":"a well traveled looking fellow.","conversation":{"default":"I hear there is an inn somewhere to the east of here that can help you recover health!"},"puzzles":[
          {"cmd":"location","solution":"4, 6, 1","detail":"The wanderer runs to greet the old man!","type_change":"fixed","items":["rotten apple"]}
        ]}
      ],
      "objects": [
        {"name":"water","type":"consumable","detail":"A small bottle of water. I wonder if you can combine this with something?","health_bump":0},
        {"name":"poison ivy","type":"consumable","detail":"A leaf of poison ivy. I wonder if you can combine this with something?","health_bump":-5},
        {"name":"rotten apple","type":"consumable","detail":"A half-rotten, disgusting, apple. I wonder if you can combine this with something?","health_bump":-1},
        {"name":"candy bar","type":"consumable","detail":"a tasty treat!","health_bump":-10},
        {"name":"sword","type":"weapon","detail":"a fine weapon for a warrior","power_range":[10,20]},
        {"name":"bed","type":"recovery","detail":"A cozy looking bed. Perhaps you should rest for a bit?","health_bump":100},
        {"name":"lever","type":"item","detail":"A simple lever. Maybe you should try pulling it?"},
        {"name":"bush","type":"item","detail":"A very dry looking bunch of tumbleweed."},
        {"name":"poison","type":"consumable","detail":"a deadly concotion","health_bump":-30,"build_with":["water","rotten apple","poison ivy"]},
        {"name":"poison sword","type":"weapon","detail":"an awesome weapon for a warrior","power_range":[10,30],"build_with":["sword","poison"]}
      ],
      "map": [
        {"name":"3-1","x":3,"y":1,"z":1,"type":"jail","description":"","items":["water"],"exits":["east","south"]},
        {"name":"4-1","x":4,"y":1,"z":1,"description":"","exits":["west","south"]},
        {"name":"2-2","x":2,"y":2,"z":1,"description":"","exits":["east","south"]},
        {"name":"3-2","x":3,"y":2,"z":1,"description":"","exits":["north","south","east","west"]},
        {"name":"4-2","x":4,"y":2,"z":1,"description":"","exits":["north","south","east","west"]},
        {"name":"5-2","x":5,"y":2,"z":1,"description":"","items":["poison ivy"],"exits":["west","south"]},
        {"name":"3-1","x":1,"y":3,"z":1,"description":"","exits":["east","south"]},
        {"name":"3-2","x":2,"y":3,"z":1,"description":"","exits":["north","south","east","west"]},
        {"name":"3-3","x":3,"y":3,"z":1,"description":"","exits":["north","south","east","west"]},
        {"name":"4-3","x":4,"y":3,"z":1,"description":"","exits":["north","south","east","west"]},
        {"name":"5-3","x":5,"y":3,"z":1,"description":"","exits":["north","south","east","west"]},
        {"name":"6-3","x":6,"y":3,"z":1,"description":"","objects":["bed"],"exits":["west","south"]},
        {"name":"1-4","x":1,"y":4,"z":1,"description":"","exits":["north","east"]},
        {"name":"2-4","x":2,"y":4,"z":1,"description":"","exits":["north","south","east","west"]},
        {"name":"3-4","x":3,"y":4,"z":1,"description":"","exits":["north","south","east","west"]},
        {"name":"4-4","x":4,"y":4,"z":1,"description":"","exits":["north","south","east","west"]},
        {"name":"5-4","x":5,"y":4,"z":1,"description":"","exits":["north","south","east","west"]},
        {"name":"6-4","x":6,"y":4,"z":1,"description":"","items":["rotten apple"],"exits":["north","west"]},
        {"name":"2-5","x":2,"y":5,"z":1,"description":"","exits":["north","east"]},
        {"name":"3-5","x":3,"y":5,"z":1,"description":"","exits":["north","south","east","west"]},
        {"name":"4-5","x":4,"y":5,"z":1,"description":"","exits":["north","south","east","west"]},
        {"name":"5-5","x":5,"y":5,"z":1,"description":"","exits":["north","west"]},
        {"name":"3-6","x":3,"y":6,"z":1,"description":"","objects":["lever"],"exits":["north","east"],"puzzles":[{"cmd":"pull","solution":"lever","detail":"A small section of the wall slides down revealing a compartment.","items":["sword"]}]},
        {"name":"4-6","x":4,"y":6,"z":1,"description":"","objects":["bush"],"exits":["north"],"puzzles":[
          {"cmd":"burn","solution":"bush","detail":"You burn the bush.","destroy":["bush"],"hidden_exits":["west"]}
        ]}
      ]
    }
  }
  var spawn = [];
  var saved = {};
  try {
    saved = JSON.parse(JSON.stringify(story));
  } catch (ex) {
  }

  /**************************
  *** AVAILABLE COMMANDS
  **************************/
  var commands = [
    {'cmd':'attack','help':{'syntax':'attack [enemy] --OR-- attack [enemy] with [item]','detail':'Attack an enemy. If you specify a weapon from your inventory, attack an enemy with the weapon from your inventory.'}},
    {'cmd':'build','help':{'syntax':'build [item]','detail':'Attempts to build the item from items in your inventory'}},
    {'cmd':'burn','help':{'syntax':'burn [object]','detail':'Attempts to burn object. Requires a candle in your inventory.'}},
    {'cmd':'buy','help':{'syntax':'buy [item]','detail':'Buy an item that is for sale in current location. Must have enough coin to purcahse item.'}},
    {'cmd':'cast','help':{'syntax':'cast [spell]','detail':'Cast a given spell.'}},
    {'cmd':'consume','help':{'syntax':'consume [item]','detail':'Consume an item from your inventory for a quick health bump'}},
    {'cmd':'dig','help':{'syntax':'dig','detail':'Attempts to dig for hidden items in your current location. Requires a shovel in your inventory.'}},
    {'cmd':'disassemble','help':{'syntax':'disassemble [item]','detail':'Disassemble item back into the parts it was built from.'}},
    {'cmd':'drink','help':{'syntax':'drink [item]','detail':'Consume an item from your inventory for a quick health bump'}},
    {'cmd':'drop','help':{'syntax':'drop [item]','detail':'Drops an item from your inventory and leaves it at your current location.'}},
    {'cmd':'eat','help':{'syntax':'eat [item]','detail':'Consume an item from your inventory for a quick health bump'}},
    {'cmd':'equip','help':{'syntax':'equip [item]','detail':'Equip yourself with the given item. Future attacks will use the equiped item when no weapon is specified.'}},
    {'cmd':'erase','help':{'syntax':'erase tag','detail':'Erase any tags you have placed on your current location of the map.'}},
    {'cmd':'examine','help':{'syntax':'examine [item] --OR-- examine location','detail':'Provides the detailed description of an item or your current location.'}},
    {'cmd':'exit','help':{'syntax':'exit [direction]','detail':'If possible, moves you in the specified direction on the map.'}},
    {'cmd':'give','help':{'syntax':'give [item] to [friendly]','detail':'Give an item to a friendly.'}},
    {'cmd':'go','help':{'syntax':'go [direction]','detail':'If possible, moves you in the specified direction.'}},
    {'cmd':'help','help':{'syntax':'help [cmd]','detail':'Provides the sytnax and related help for a given command.'}},
    {'cmd':'inventory','help':{'syntax':'inventory','detail':'Displays the list of items currently in your inventory.'}},
    {'cmd':'kill','help':{'syntax':'kill [enemy] --OR-- kill [enemy] with [item]','detail':'Attack an enemy. If you specify a weapon from your inventory, attack an enemy with the weapon from your inventory.'}},
    {'cmd':'l','help':{'syntax':'l --OR-- l at [object]','detail':'Shortcut for look. Provides the quick details of your location. If you specify an object, provides the detailed description of the object.'}},
    {'cmd':'look','help':{'syntax':'look --OR-- look at [object]','detail':'Provides the quick details of your location. If you specify an object, provides the detailed description of the object.'}},
    {'cmd':'m','help':{'syntax':'m [direction]','detail':' Shortcut for move. If possible, moves you in the specified direction.'}},
    {'cmd':'make','help':{'syntax':'make [item]','detail':'Attempts to make the item from items in your inventory'}},
    {'cmd':'missions','help':{'syntax':'missions','detail':'Displays the details about all available game missions.'}},
    {'cmd':'move','help':{'syntax':'move [direction]','detail':'If possible, moves you in the specified direction.'}},
    {'cmd':'place','help':{'syntax':'place [object]','detail':'Places an object in location.'}},
    {'cmd':'pray','help':{'syntax':'pray OR pray to [object]','detail':'Address a solemn request or expression of thanks to a deity or other object of worship.'}},
    {'cmd':'pull','help':{'syntax':'pull [object]','detail':'if possible, pulls object.'}},
    {'cmd':'push','help':{'syntax':'push [object]','detail':'if possible, pushes object.'}},
    {'cmd':'read','help':{'syntax':'read [item]','detail':'Provides the detailed description of an item.'}},
    {'cmd':'say','help':{'syntax':'say [statement]','detail':'Talk to friendlies in the room (or to yourself when you\'re alone.'}},
    {'cmd':'sell','help':{'syntax':'sell [item]','detail':'Sell an item back to store (if item is available for sale in current location). You will be credited with sell price coin.'}},
    {'cmd':'status','help':{'syntax':'status','detail':'Provides the current details about your character including your current score, health, and mission.'}},
    {'cmd':'steal','help':{'syntax':'steal [item]','detail':'Attempt to steal an item. If caught in the act, you will suffer a karma hit and be thrown in jail!'}},
    {'cmd':'tag','help':{'syntax':'tag [statement]','detail':'Tags the current map location with whatever statement you provide (requires that you have a sharpie in your inventory). So much better than stale breadcrumbs!'}},
    {'cmd':'take','help':{'syntax':'take [item]','detail':'Takes the item from the current lcoation and puts it in your inventory.'}},
    {'cmd':'throw','help':{'syntax':'throw [item] at [enemy]','detail':'Throw an item from your inventory at an enemy.'}},
    {'cmd':'unequip','help':{'syntax':'unequip [item]','detail':'Removes the item from your equiped list. Item remains in inventory.'}},
    {'cmd':'use','help':{'syntax':'use [item]','detail':'Attempt to use an item from your inventory.'}},
  ];

  /* =============================================
     SUPPORT FUNCTIONS
  ============================================= */

  function format_response(response) {
    var text = '';
    for (var i = 0; i < response.length; i++) {
      // text += response[i]['title'].toUpperCase();
      // text += ' ';
      for (var j = 0; j < response[i]['lines'].length; j++) {
        if (response[i]['lines'][j].trim() != '') {
          text += response[i]['lines'][j] + ' ';
        }
      }
    }
    return text;
  }

  /**************************
  *** ATTACK
  **************************/
  function attack(attacker, attacked, weapon, attack_type) {
    var results = [];
    var enemies_in_room = story['enemies'].filter(function(enemies){ return enemies.x == story['character']['x'] && enemies.y == story['character']['y'] && enemies.z == story['character']['z'] });
    var map_location = story['map'].filter(function (map) { return map.x == story['character']['x'] && map.y == story['character']['y'] && map.z == story['character']['z'] });
    // make sure the enemy and character are actually in the same room
    enemy_found = false;
    can_attack = true;
    for (var i = 0; i < enemies_in_room.length; i++) {
      if (enemies_in_room[i]['name'] == attacked || enemies_in_room[i]['name'] == attacker) {
        // OK to attempt attack!
        enemy_found = true;
        var min_damage = 0;
        var max_damage = 0;
        if (attacker == 'character') {
          // determine damage
          min_damage = story['character']['power_range'][0];
          max_damage = story['character']['power_range'][1];
          if (weapon == '' && 'equiped' in story['character']) {
            // no weapon specified, so determine if the character is equiped with a weapon (if yes, use by default)
            for (var j = 0; j < story['character']['equiped'].length; j++) {
              // use the first 'weapon' we encounter
              var object_detail = story['objects'].filter(function(objects){return objects.name == story['character']['equiped'][j] && objects.type == 'weapon'});
              if (object_detail.length > 0) {
                weapon = object_detail[0]['name'];
                break;
              }
            }
          }
          if (weapon != '') {
            // make sure the attacker has the weapon to use
            if (story['character']['items'].indexOf(weapon) > -1) {
              // use the weapon range instead of the character power range
              var object_detail = story['objects'].filter(function(objects){return objects.name == weapon && objects.type == 'weapon'});
              if (object_detail.length > 0) {
                min_damage = object_detail[0]['power_range'][0];
                max_damage = object_detail[0]['power_range'][1];
                if (attack_type == 'throw') {
                  // boost the attack because it's a throw
                  min_damage += Math.floor(min_damage / 2);
                  max_damage += Math.floor(max_damage / 2);
                }
              } else {
                // not a weapon, but allow to throw at attacked for power of one
                min_damage = 0;
                max_damage = 1;
                attack_type = 'throw';
              }
              if (attack_type == 'throw') {
                // also drop the item from the character inventory (and add to the room);
                var slot = story['character']['items'].indexOf(weapon);
                story['character']['items'].splice(slot, 1);
                if ('equiped' in story['character']) {
                  var slot2 = story['character']['equiped'].indexOf(weapon);
                  if (slot2 > -1) {
                    story['character']['equiped'].splice(slot2, 1);
                  }
                }
                // add to room items
                if ('items' in map_location[0]) {
                  map_location[0]['items'] = map_location[0]['items'].concat([weapon]);
                } else {
                  map_location[0]['items'] = [weapon];
                }
              }
            } else {
              // you don't have this weapon in your inventory!
              can_attack = false;
            }
          }
          if (can_attack) {
            // check if this enemy requires specific weapon to be attacked with
            if ('required' in enemies_in_room[i] && enemies_in_room[i]['required'].length > 0) {
              var using_required_weapon = false;
              for (var j = 0; j < enemies_in_room[i]['required'].length; j++) {
                if (enemies_in_room[i]['required'][j].trim() == weapon.trim()) {
                  // using required weapon
                  using_required_weapon = true;
                }
              }
              if (!using_required_weapon) {
                // attacking without required weapon; can not do damage
                min_damage = 0;
                max_damage = 0;
              }
            }
          }
        } else {
          // enemy attacking character
          min_damage = enemies_in_room[i]['power_range'][0];
          max_damage = enemies_in_room[i]['power_range'][1];
        }
        var damage_detail = {'damage':0, 'detail':''};

        // determine damage
        damage_detail['damage'] = Math.floor((Math.random()*(max_damage-min_damage+1))+min_damage);
        if (damage_detail['damage'] == 0) {
          damage_detail['detail'] = 'caused no damage';
          if (weapon != '') { damage_detail['detail'] += ' with the ' + weapon; }
        } else if (damage_detail['damage'] > 0 && damage_detail['damage'] < 3) {
          damage_detail['detail'] = 'landed a weak blow';
          if (weapon != '') { damage_detail['detail'] += ' with the ' + weapon; }
          damage_detail['detail'] += ' causing ' + damage_detail['damage'] + ' damage';
        } else {
          damage_detail['detail'] = 'struck a solid blow';
          if (weapon != '') { damage_detail['detail'] += ' with the ' + weapon; }
          damage_detail['detail'] += ' causing ' + damage_detail['damage'] + ' damage';
        }

        if (attacker == 'character') {
          if (can_attack) {
            // move the health down of the enemy
            enemies_in_room[i]['health'] -= damage_detail['damage'];
            if (enemies_in_room[i]['health'] < 1) {
              // killed the enemy!
              // update the character score
              story['character']['score'] += enemies_in_room[i]['point_value'];
              // if the enemy had items; drop them into the room
              var rec = {};
              rec['title'] = 'ATTACK ' + attacked.toUpperCase();
              rec['lines'] = [];
              if ('items' in enemies_in_room[i] && enemies_in_room[i]['items'].length > 0) {
                rec['lines'].push(attacked + ' dropped ' + enemies_in_room[i]['items'].join(', ') + '.');
                if ('items' in map_location[0]) {
                  map_location[0]['items'] = map_location[0]['items'].concat(enemies_in_room[i]['items']);
                } else {
                  map_location[0]['items'] = enemies_in_room[i]['items'];
                }
              }
              // if enemy had a coin value; give to character
              if ('coins' in enemies_in_room[i]) {
                story['character']['coins'] += enemies_in_room[i]['coins'];
              }
              // unlock any gates this enemy was blocking
              if ('unlock_gates' in enemies_in_room[i]) {
                for (var j = 0; j < enemies_in_room[i]['unlock_gates'].length; j++) {
                  var this_room = story['map'].filter(function (map) { return map.x == enemies_in_room[i]['unlock_gates'][j]['x'] && map.y == enemies_in_room[i]['unlock_gates'][j]['y'] && map.z == enemies_in_room[i]['unlock_gates'][j]['z'] });
                  if ('exits' in this_room[0]) {
                    this_room[0]['exits'] = this_room[0]['exits'].concat(enemies_in_room[i]['unlock_gates'][j]['exits']);
                  } else {
                    this_room[0]['exits'] = this_room[i]['unlock_gates'][j]['exits'];
                  }
                  for (var k = 0; k < enemies_in_room[i]['unlock_gates'][j]['exits'].length; k++) {
                    var slot = this_room[0]['locked_exits'].indexOf(enemies_in_room[i]['unlock_gates'][j]['exits'][k]);
                    if (slot > -1) {
                      this_room[0]['locked_exits'].splice(slot,1);
                    }
                  }
                }
              }
              // lock any gates this enemy was keeping open
              if ('lock_gates' in enemies_in_room[i]) {
                for (var j = 0; j < enemies_in_room[i]['lock_gates'].length; j++) {
                  var this_room = story['map'].filter(function (map) { return map.x == enemies_in_room[i]['lock_gates'][j]['x'] && map.y == enemies_in_room[i]['lock_gates'][j]['y'] && map.z == enemies_in_room[i]['lock_gates'][j]['z'] });
                  if ('exits' in this_room[0]) {
                    // remove lock gates from these exits
                    var rems = enemies_in_room[i]['lock_gates'][j]['exits'];
                    for (var y = 0; y < rems.length; y++) {
                      var ts = this_room[0]['exits'].indexOf(rems[y]);
                      this_room[0]['exits'].splice(ts, 1);
                    }
                  }
                }
              }
              rec['lines'].push('YOU HAVE KILLED ' + attacked.toUpperCase() + '!');
              results.push(rec);
              // remove the enemy from the game!
              for (var j = 0; j < story['enemies'].length; j++) {
                if (story['enemies'][j]['x'] == story['character']['x'] && story['enemies'][j]['y'] == story['character']['y'] && story['enemies'][j]['z'] == story['character']['z'] && story['enemies'][j]['name'] == enemies_in_room[i]['name']) {
                  story['enemies'].splice(j, 1);
                  break;
                }
              }
              // if need be, spawn a new enemy somewhere on the map
              if ('spawn' in enemies_in_room[i]) {
                spawn.push(enemies_in_room[i]);
              }
              results = results.concat(check_puzzles('kill',attacked));
            } else {
              // enemy attacked, but is still alive!
              var rec = {};
              rec['title'] = 'ATTACK ' + attacked.toUpperCase();
              rec['lines'] = ['You ' + damage_detail['detail'] + ' to ' + attacked + '.'];
              results.push(rec);
              // have the enemy immediately attack back!
              results = results.concat(attack(attacked,'character',''));
            }
          } else {
            var rec = {};
            rec['title'] = 'ATTACK ' + attacked.toUpperCase();
            rec['lines'] = ['You don\'t have a ' + weapon + ' to attack with!'];
            results.push(rec);
          }
        } else {
          // move the health down of the character
          story['character']['health'] -= damage_detail['damage'];
          if (story['character']['health'] < 1) {
            // character has been killed!
            if ('lives' in story['character']) {
              story['character']['lives'] += 1;
            }
            results = [];
            var rec = {};
            rec['title'] = 'YOU DIED!';
            rec['lines'] = ['YOU HAVE BEEN KILLED!','The game has been reset to your last save.'];
            results.push(rec);
            // reset to the last save
            story = JSON.parse(JSON.stringify(saved));
          } else {
            // user is still alive, but took some damage!
            var rec = {};
            rec['title'] = '' + attacker.toUpperCase() + ' ATTACKED!';
            rec['lines'] = [attacker + ' ' + damage_detail['detail'] + ' damage on you.'];
            results.push(rec);
          }
        }
        break;
      }
    }
    if (!enemy_found) {
      // check if attacked is in 'friendlies' list (if so, say that's not cool)
      var friendly_detail = story['friendlies'].filter(function(friendlies){ return friendlies.name == attacked && friendlies.x == story['character']['x'] && friendlies.y == story['character']['y'] && friendlies.z == story['character']['z'] });
      if (friendly_detail.length > 0) {
        var rec = {};
        rec['title'] = 'ATTACK ' + attacked.toUpperCase();
        rec['lines'] = ['That is so NOT COOL!'];
        results.push(rec);
      } else {
        var rec = {};
        rec['title'] = 'ATTACK ' + attacked.toUpperCase();
        rec['lines'] = ['There is no ' + attacked + ' here!'];
        results.push(rec);
      }
    }
    return results;
  }

  /**************************
  *** BOARD MOVEMENT (adjust locations for enemies and friendlies)
  **************************/
  function board_movement() {
    var results = [];
    for (var i = 0; i < story['friendlies'].length; i++) {
      if (story['friendlies'][i]['type'] == 'roaming' || story['friendlies'][i]['type'] == 'run' || story['friendlies'][i]['type'] == 'skittish') {
        var move_character = 0;
        var runaway = false;
        if (story['friendlies'][i]['type'] == 'roaming') {
          // one in ten chance to move the character
          move_character = Math.floor(Math.random() * 10) + 1;
        } else if (story['friendlies'][i]['type'] == 'run' && story['friendlies'][i]['x'] == story['character']['x'] && story['friendlies'][i]['y'] == story['character']['y'] && story['friendlies'][i]['z'] == story['character']['z']) {
          // one in three chance of having the character run away
          move_character = Math.floor(Math.random() * 3) + 4;
          runaway = true;
        } else if (story['friendlies'][i]['type'] == 'skittish') {
          var enemies_in_room = story['enemies'].filter(function(enemies){return enemies.x == story['friendlies'][i]['x'] && enemies.y == story['friendlies'][i]['y'] && enemies.z == story['friendlies'][i]['z']});
          if (enemies_in_room.length > 0) {
            // enemy in room of friendly so they should run!
            move_character = 5;
          }
        }
        if (move_character == 5) {
          // move character through available exit
          var check_map = story['map'].filter(function(map){ return map.x == story['friendlies'][i]['x'] && map.y == story['friendlies'][i]['y'] && map.z == story['friendlies'][i]['z']});
          if (check_map.length > 0 && 'exits' in check_map[0] && check_map[0]['exits'].length > 0) {
            var slot = Math.floor((Math.random()*check_map[0]['exits'].length));
            var direction = check_map[0]['exits'][slot].toLowerCase();
            if (runaway) {
              var rec = {};
              rec['title'] = 'HEAD\'S UP';
              rec['lines'] = [story['friendlies'][i]['name'] + ' ran to the ' + direction];
              results.push(rec);
            }
            switch (direction) {
              case "north":story['friendlies'][i]['y'] -= 1;break;
              case "south":story['friendlies'][i]['y'] += 1;break;
              case "east":story['friendlies'][i]['x'] += 1;break;
              case "west":story['friendlies'][i]['x'] -= 1;break;
              case "northeast":story['friendlies'][i]['x'] += 1;story['friendlies'][i]['y'] -= 1;break;
              case "northwest":story['friendlies'][i]['x'] -= 1;story['friendlies'][i]['y'] -= 1;break;
              case "southeast":story['friendlies'][i]['x'] += 1;story['friendlies'][i]['y'] += 1;break;
              case "southwest":story['friendlies'][i]['x'] -= 1;story['friendlies'][i]['y'] += 1;break;
              case "up":story['friendlies'][i]['z'] += 1;break;
              case "down":story['friendlies'][i]['z'] -= 1;break;
            }
          }
        }
      }
    }
    for (var i = 0; i < story['enemies'].length; i++) {
      if (story['enemies'][i]['type'] == 'roaming' || story['enemies'][i]['type'] == 'run') {
        var move_character = 0;
        var runaway = false;
        if (story['enemies'][i]['type'] == 'roaming') {
          // one in ten chance to move the enemy
          move_character = Math.floor(Math.random() * 10) + 1;
        } else if (story['enemies'][i]['type'] == 'run' && story['enemies'][i]['x'] == story['character']['x'] && story['enemies'][i]['y'] == story['character']['y'] && story['enemies'][i]['z'] == story['character']['z']) {
          // one in two chance of having the enemy run away
          move_character = Math.floor(Math.random() * 3) + 4;
          runaway = true;
        }
        if (move_character == 5) {
          // move character through available exit
          var check_map = story['map'].filter(function(map){ return map.x == story['enemies'][i]['x'] && map.y == story['enemies'][i]['y'] && map.z == story['enemies'][i]['z']});
          if (check_map.length > 0 && 'exits' in check_map[0] && check_map[0]['exits'].length > 0) {
            var slot = Math.floor((Math.random()*check_map[0]['exits'].length));
            var direction = check_map[0]['exits'][slot].toLowerCase();
            if (runaway) {
              var rec = {};
              rec['title'] = 'HEAD\'S UP';
              rec['lines'] = [story['enemies'][i]['name'] + ' ran to the ' + direction];
              results.push(rec);
            }
            switch (direction) {
              case "north":story['enemies'][i]['y'] -= 1;break;
              case "south":story['enemies'][i]['y'] += 1;break;
              case "east":story['enemies'][i]['x'] += 1;break;
              case "west":story['enemies'][i]['x'] -= 1;break;
              case "northeast":story['enemies'][i]['x'] += 1;story['enemies'][i]['y'] -= 1;break;
              case "northwest":story['enemies'][i]['x'] -= 1;story['enemies'][i]['y'] -= 1;break;
              case "southeast":story['enemies'][i]['x'] += 1;story['enemies'][i]['y'] += 1;break;
              case "southwest":story['enemies'][i]['x'] -= 1;story['enemies'][i]['y'] += 1;break;
              case "up":story['enemies'][i]['z'] += 1;break;
              case "down":story['enemies'][i]['z'] -= 1;break;
            }
          }
        }
      }
    }
    // spawn enemies if need be
    if (spawn.length > 0) {
      for (var i = 0; i < spawn.length; i++) {
        // one in five chance to spawn the enemy
        var spawn_character = Math.floor(Math.random() * 5) + 1;
        if (spawn_character == 3) {
          // let's spawn this character
          for (var j = 0; j < story['map'].length; j++) {
            if (story['map'][j]['x'] == spawn[i]['spawn']['x'] && story['map'][j]['y'] == spawn[i]['spawn']['y'] && story['map'][j]['z'] == spawn[i]['spawn']['z']) {
              // add this enemy to this room
              var enemy = JSON.parse(JSON.stringify(spawn[i]));
              enemy['x'] = spawn[i]['spawn']['x'];
              enemy['y'] = spawn[i]['spawn']['y'];
              enemy['z'] = spawn[i]['spawn']['z'];
              enemy['health'] = spawn[i]['spawn']['health'];
              if ('items' in spawn[i]['spawn']) {
                enemy['items'] = spawn[i]['spawn']['items'];
              }
              story['enemies'].push(enemy);
              spawn.splice(i,1);
              break;
            }
          }
        }
      }
    }
    return results;
  }

  /**************************
  *** BUILD AN ITEM
  **************************/
  function build(object_name) {
    var results = [];
    var rec = {};
    rec['title'] = 'BUILD ' + object_name.toUpperCase();
    rec['lines'] = [];
    var object_detail = story['objects'].filter(function(objects){ return objects.name == object_name });
    if (object_detail.length > 0 && 'build_with' in object_detail[0]) {
      // determine if you have the proper inventory to build this item
      var has_items = true;
      var required_items = object_detail[0]['build_with'];
      var char_items = JSON.parse(JSON.stringify(story['character']['items']));
      for (var i = 0; i < required_items.length; i++) {
        if (char_items.indexOf(required_items[i]) == -1) {
          // missing a required item
          has_items = false;
          rec['lines'].push('You need ' + required_items[i] + ' to build ' + object_name + '.');
          break;
        } else {
          char_items.splice(char_items.indexOf(required_items[i]), 1);
        }
      }
      if (has_items) {
        // OK to build this item
        // start by taking the items out of the character inventory
        for (var i = 0; i < required_items.length; i++) {
          // remove this item from inventory
          var slot = story['character']['items'].indexOf(required_items[i]);
          story['character']['items'].splice(slot, 1);
          var slot2 = story['character']['equiped'].indexOf(required_items[i]);
          if (slot2 > -1) {
            story['character']['equiped'].splice(slot2, 1);
          }
        }
        // now put the newly built item into inventory
        story['character']['items'].push(object_name);
        rec['lines'].push('You have successfully built ' + object_name + ' and added it to your inventory.');
        results = results.concat(check_puzzles('build', object_name));
      }
    } else {
      rec['lines'].push('You can\'t build ' + object_name + '.');
    }
    results.push(rec);
    return results;
  }

  /**************************
  *** BURN OBJECT
  **************************/
  function burn(object_name) {
    var results = [];
    // make sure character has a candle
    if (new RegExp(story['character']['items'].join("|")).test('candle')) {
      // player has candle, make sure object is in room
      var map_location = story['map'].filter(function (map) { return map.x == story['character']['x'] && map.y == story['character']['y'] && map.z == story['character']['z'] });
      if (
        ('objects' in map_location[0] && map_location[0]['objects'].indexOf(object_name) > -1)
        ||
        ('items' in map_location[0] && map_location[0]['items'].indexOf(object_name) > -1)
      ) {
        // attempt puzzle
        results = results.concat(check_puzzles(cmd, object_name));
        if (results.length == 0) {
          var rec = {};
          rec['title'] = 'BURN ' + object_name.toUpperCase();
          rec['lines'] = [object_name + ' doesn\'t seem to catch fire.'];
          results.push(rec);
        }
      } else {
        var rec = {};
        rec['title'] = 'BURN ' + object_name.toUpperCase();
        rec['lines'] = [object_name + ' is not here.'];
        results.push(rec);
      }
    } else {
      var rec = {};
      rec['title'] = 'BURN ' + object_name.toUpperCase();
      rec['lines'] = ['You need a candle to try that!'];
      results.push(rec);
    }
    return results;
  }

  /**************************
  *** BUY ITEM
  **************************/
  function buy(object_name) {
    var results = [];
    var map_location = story['map'].filter(function (map) { return map.x == story['character']['x'] && map.y == story['character']['y'] && map.z == story['character']['z'] });
    // make sure there are items for sale at this location
    if ('for_sale' in map_location[0]) {
      // determine if requested item is actually for sale (and in stock)
      var item_for_sale = false;
      var buy_price = 0;
      var stock = map_location[0]['for_sale'];
      for (var i = 0; i < stock.length; i++) {
        // stock available of -1 means unlimited supply!
        if (stock[i]['name'] == object_name && (stock[i]['available'] > 0 || stock[i]['available'] == -1)) {
          item_for_sale = true;
          buy_price = stock[i]['buy_price'];
          break;
        }
      }
      if (item_for_sale && story['character']['coins'] >= buy_price) {
        // take buy_price away from coin
        story['character']['coins'] -= buy_price;
        // add item to the character inventory
        story['character']['items'].push(object_name);
        // lower the stock in this room
        for (var j = 0; j < map_location[0]['for_sale'].length; j++) {
          if (map_location[0]['for_sale'][j]['name'] == object_name) {
            if (map_location[0]['for_sale'][j]['available'] > 0) {
              map_location[0]['for_sale'][j]['available'] -= 1;
            }
            break;
          }
        }
        var rec = {};
        rec['title'] = 'BUY ' + object_name.toUpperCase();
        rec['lines'] = ['You have bought ' + object_name + ' for ' + buy_price + ' coin.'];
        results.push(rec);
      } else if (item_for_sale && story['character']['coins'] < buy_price) {
        var rec = {};
        rec['title'] = 'BUY ' + object_name.toUpperCase();
        rec['lines'] = ['You don\'t have enough coin for ' + object_name + '. The price is currently ' + buy_price + ' coin.'];
        results.push(rec);
      } else {
        var rec = {};
        rec['title'] = 'BUY ' + object_name.toUpperCase();
        rec['lines'] = [object_name + ' is not available for sale here right now.'];
        results.push(rec);
      }
    } else {
      var rec = {};
      rec['title'] = 'NOTHING FOR SALE';
      rec['lines'] = ['There are no items for sale here.'];
      results.push(rec);
    }
    return results;
  }

  /**************************
  *** DISPLAY CHARACTER STATUS
  **************************/
  function character_status() {
    var results = [];
    var rec = {};
    rec['title'] = 'BASIC DATA';
    rec['lines'] = [
      'You have ' + story['character']['health'].toString() + ' health, ' + story['character']['magic'].toString() + ' magic, ' + story['character']['coins'].toString() + ' coins, and ' + story['character']['score'].toString() + ' points.',
    ];
    results.push(rec);
    var rec = {};
    rec['title'] = 'EQUIPED';
    rec['lines'] = [];
    if (!('equiped' in story['character']) || story['character']['equiped'].length == 0) {
      rec['lines'].push('none');
    } else {
      rec['lines'].push(story['character']['equiped'].join(', '));
    }
    results.push(rec);
    var rec = {};
    rec['title'] = 'ITEMS';
    rec['lines'] = [];
    if (story['character']['items'].length == 0) {
      rec['lines'].push('none');
    } else {
      rec['lines'].push(story['character']['items'].join(', '));
    }
    results.push(rec);
    var rec = {};
    rec['title'] = 'KNOWN SPELLS';
    rec['lines'] = [];
    if ('spells' in story['character'] && story['character']['spells'].length == 0) {
      rec['lines'].push('none');
    } else {
      rec['lines'].push(story['character']['spells'].join(', '));
    }
    results.push(rec);
    var friendlies_met = 0;
    for (var i = 0; i < story['friendlies'].length; i++) {
      if ('met' in story['friendlies'][i] && story['friendlies'][i]['met']) {
        friendlies_met += 1;
      }
    }
    var met_percent = Math.floor((friendlies_met / story['friendlies'].length) * 100);
    var rec = {};
    rec['title'] = 'FRIENDLIES MET';
    rec['lines'] = ['You have met ' + friendlies_met + ' of ' + story['friendlies'].length + ' total friendlies in the game (' + met_percent + '%).'];
    results.push(rec);
    var resolved_count = 0;
    for (var i = 0; i < story['missions'].length; i++) {
      if (story['missions'][i]['status'] == 'resolved') {
        resolved_count += 1;
      }
    }
    var completion_percent = Math.floor((resolved_count / story['missions'].length) * 100);
    var rec = {};
    rec['title'] = 'MISSIONS';
    rec['lines'] = ['You have completed ' + resolved_count + ' of ' + story['missions'].length + ' total missions (' + completion_percent + '%).'];
    results.push(rec);
    var room_visit_count = 0;
    for (var i = 0; i < story['map'].length; i++) {
      if ('seen' in story['map'][i] && story['map'][i]['seen']) {
        room_visit_count += 1;
      }
    }
    var explore_percent = Math.floor((room_visit_count / story['map'].length) * 100);
    var rec = {};
    rec['title'] = 'MAP';
    rec['lines'] = ['You have explored ' + room_visit_count + ' of ' + story['map'].length + ' total locations of the map (' + explore_percent + '%).'];
    results.push(rec);
    return results;
  }

  function puzzle_solved_room_items(puzzle, map_location, rec) {
    if ('items' in puzzle && puzzle['items'].length > 0) {
      // add this puzzle's items to the room
      if ('items' in map_location[0]) {
        map_location[0]['items'] = map_location[0]['items'].concat(puzzle['items']);
      } else {
        map_location[0]['items'] = puzzle['items'];
      }
      for (var k = 0; k < puzzle['items'].length; k++) {
        rec['lines'].push('A ' + puzzle['items'][k] + ' is here.');
      }
    }
    return rec;
  }

  function puzzle_solved_friendly_items(puzzle, map_location, friendlies, rec) {
    if ('items' in puzzle && puzzle['items'].length > 0) {
      // add this puzzle's items to the room
      if ('items' in map_location[0]) {
        map_location[0]['items'] = map_location[0]['items'].concat(puzzle['items']);
      } else {
        map_location[0]['items'] = puzzle['items'];
      }
      for (var k = 0; k < puzzle['items'].length; k++) {
        rec['lines'].push('A ' + puzzle['items'][k] + ' is here.');
      }
    }
    return rec;
  }

  function puzzle_solved_room_destroy(puzzle, map_location) {
    // destroy any objects/items that need to be destroyed
    if ('destroy' in puzzle && puzzle['destroy'].length > 0) {
      if ('objects' in map_location[0]) {
        for (var k = 0; k < puzzle['destroy'].length; k++) {
          var slot = map_location[0]['objects'].indexOf(puzzle['destroy'][k]);
          map_location[0]['objects'].splice(slot, 1);
        }
      }
      if ('items' in map_location[0]) {
        for (var k = 0; k < puzzle['destroy'].length; k++) {
          var slot = map_location[0]['items'].indexOf(puzzle['destroy'][k]);
          map_location[0]['items'].splice(slot, 1);
        }
      }
    }
    return;
  }

  function puzzle_solved_adjust_health(puzzle, rec) {
    // adjust health if needed
    if ('adjust_health' in puzzle) {
      story['character']['health'] += puzzle['adjust_health'];
      if (story['character']['health'] > story['character']['max_health']) {
        story['character']['health'] = story['character']['max_health'];
      }
      rec['lines'].push('Your health has been adjusted to ' + story['character']['health']);
    }
    return rec;
  }

  function puzzle_solved_health_boost(puzzle, rec) {
    // apply any health boost (and give character full health)
    if ('health_boost' in puzzle) {
      story['character']['max_health'] += puzzle['health_boost'];
      story['character']['health'] = story['character']['max_health'];
      rec['lines'].push('Your max health has been boosted ' + puzzle['health_boost'] + '.');
    }
    return rec;
  }

  function puzzle_solved_adjust_magic(puzzle, rec) {
    // adjust magic if needed
    if ('adjust_magic' in puzzle) {
      story['character']['magic'] += puzzle['adjust_magic'];
      if (story['character']['magic'] > story['character']['max_magic']) {
        story['character']['magic'] = story['character']['max_magic'];
      }
      rec['lines'].push('Your magic has been adjusted to ' + story['character']['magic'] + '.');
    }
    return rec;
  }

  function puzzle_solved_magic_boost(puzzle, rec) {
    // apply any magic boost (and give character full magic)
    if ('magic_boost' in puzzle) {
      story['character']['max_magic'] += puzzle['magic_boost'];
      story['character']['magic'] = story['character']['max_magic'];
      rec['lines'].push('Your max magic has been boosted ' + puzzle['magic_boost'] + '.');
    }
    return rec;
  }

  function puzzle_solved_coins(puzzle, rec) {
    // award any coins
    if ('coins' in puzzle) {
      story['character']['coins'] += puzzle['coins'];
      rec['lines'].push('You are given ' + puzzle['coins'] + ' coins.');
    }
    return rec;
  }

  function puzzle_solved_power_min_boost(puzzle, rec) {
    // apply any power boost
    if ('power_min_boost' in puzzle) {
      story['character']['power_range'][0] += puzzle['power_min_boost'];
      rec['lines'].push('Your min power has been boosted ' + puzzle['power_min_boost'] + '.');
    }
    return rec;
  }

  function puzzle_solved_power_max_boost(puzzle, rec) {
    if ('power_max_boost' in puzzle) {
      story['character']['power_range'][1] += puzzle['power_max_boost'];
      rec['lines'].push('Your max power has been boosted ' + puzzle['power_max_boost'] + '.');
    }
    return rec;
  }

  function puzzle_solved_karma_boost(puzzle, rec) {
    // apply any karma boost
    if ('karma_boost' in puzzle) {
      story['character']['karma'] += puzzle['karma_boost'];
      rec['lines'].push('Your karma has been boosted ' + puzzle['karma_boost'] + '.');
    }
    return rec;
  }

  function puzzle_solved_learn_spells(puzzle, rec) {
    // learn any spells if need be
    if ('learn_spells' in puzzle) {
      if ('spells' in story['character']) {
        story['character']['spells'] = story['character']['spells'].concat(puzzle['learn_spells']);
      } else {
        story['character']['spells'] = puzzle['learn_spells'];
      }
      rec['lines'].push('You have learned ' + puzzle['learn_spells'].join(', ') + '.');
    }
    return rec;
  }

  function puzzle_solved_room_reveal_hidden(puzzle, map_location, rec) {
    // reveal hidden exits if need be
    if ('hidden_exits' in puzzle && puzzle['hidden_exits'].length > 0) {
      if ('exits' in map_location[0]) {
        map_location[0]['exits'] = map_location[0]['exits'].concat(puzzle['hidden_exits']);
      } else {
        map_location[0]['exits'] = puzzle['hidden_exits'];
      }
      rec['lines'].push('Exit to the ' + puzzle['hidden_exits'].join(', ') + ' revealed!');
    }
    return rec;
  }

  function puzzle_solved_unlock_gates(puzzle, results) {
    // unlock any gates around the map associated to this puzzle
    if ('unlock_gates' in puzzle) {
      for (var k = 0; k < puzzle['unlock_gates'].length; k++) {
        var this_room = story['map'].filter(function (map) { return map.x == puzzle['unlock_gates'][k]['x'] && map.y == puzzle['unlock_gates'][k]['y'] && map.z == puzzle['unlock_gates'][k]['z'] });
        if ('exits' in this_room[0]) {
          this_room[0]['exits'] = this_room[0]['exits'].concat(puzzle['unlock_gates'][k]['exits']);
        } else {
          this_room[0]['exits'] = puzzle['unlock_gates'][k]['exits'];
        }
        for (var l = 0; l < puzzle['unlock_gates'][k]['exits'].length; l++) {
          var slot = this_room[0]['locked_exits'].indexOf(puzzle['unlock_gates'][k]['exits'][l]);
          if (slot > -1) {
            this_room[0]['locked_exits'].splice(slot,1);
          }
        }
        var rec = {};
        rec['title'] = 'GATES UNLOCKED';
        rec['lines'] = ['You sense that a new area has opened up somewhere!'];
        results.push(rec);
      }
    }
    return results;
  }

  function puzzle_solved_lock_gates(puzzle, results) {
    // lock any gates around the map associated to this puzzle
    if ('lock_gates' in puzzle) {
      for (var k = 0; k < puzzle['lock_gates'].length; k++) {
        var this_room = story['map'].filter(function (map) { return map.x == puzzle['lock_gates'][k]['x'] && map.y == puzzle['lock_gates'][k]['y'] && map.z == puzzle['lock_gates'][k]['z'] });
        if ('exits' in this_room[0]) {
          // remove lock gates from these exits
          var rems = puzzle['lock_gates'][k]['exits'];
          for (var y = 0; y < rems.length; y++) {
            var ts = this_room[0]['exits'].indexOf(rems[y]);
            this_room[0]['exits'].splice(ts, 1);
          }
          if ('locked_exits' in this_room[0]) {
            this_room[0]['locked_exits'] = this_room[0]['locked_exits'].concat(rems);
          } else {
            this_room[0]['locked_exits'] = rems;
          }
        }
        var rec = {};
        rec['title'] = 'GATES LOCKED';
        rec['lines'] = ['You sense that a gate has closed somewhere!'];
        results.push(rec);
      }
    }
    return results;
  }

  function puzzle_solved_place_items(puzzle, results) {
    // place items on map if need be
    if ('place' in puzzle && 'items' in puzzle['place'] && 'x' in puzzle['place'] && 'y' in puzzle['place'] && 'z' in puzzle['place']) {
      var map_location_2 = story['map'].filter(function (map) { return map.x == puzzle['place']['x'] && map.y == puzzle['place']['y'] && map.z == puzzle['place']['z'] });
      if ('items' in map_location_2[0]) {
        map_location_2[0]['items'] = map_location_2[0]['items'].concat(puzzle['place']['items']);
      } else {
        map_location_2[0]['items'] = puzzle['place']['items'];
      }
      var rec = {};
      rec['title'] = 'ITEMS AVAILABLE';
      rec['lines'] = ['You sense that an item has become available somewhere!'];
      results.push(rec);
    }
    return results;
  }

  function puzzle_solved_place_puzzles(puzzle, results) {
    // place puzzles on map if need be
    if ('sequence' in puzzle && 'puzzles' in puzzle['sequence'] && 'x' in puzzle['sequence'] && 'y' in puzzle['sequence'] && 'z' in puzzle['sequence']) {
      var map_location_2 = story['map'].filter(function (map) { return map.x == puzzle['sequence']['x'] && map.y == puzzle['sequence']['y'] && map.z == puzzle['sequence']['z'] });
      if ('puzzles' in map_location_2[0]) {
        map_location_2[0]['puzzles'] = map_location_2[0]['puzzles'].concat(puzzle['sequence']['puzzles']);
      } else {
        map_location_2[0]['puzzles'] = puzzle['sequence']['puzzles'];
      }
      var rec = {};
      rec['title'] = 'PARTIALLY SOLVED';
      rec['lines'] = ['You have solved a small part of a bigger puzzle!'];
      results.push(rec);
    }
    return results;
  }

  function puzzle_solved_transport(puzzle, results) {
    // transport the character if need be
    if ('transport' in puzzle && 'x' in puzzle['transport'] && 'y' in puzzle['transport'] && 'z' in puzzle['transport']) {
      story['character']['x'] = puzzle['transport']['x'];
      story['character']['y'] = puzzle['transport']['y'];
      story['character']['z'] = puzzle['transport']['z'];
      var rec = {};
      rec['title'] = 'TRANSPORTED';
      rec['lines'] = ['You have been transported to a new location on the map!'];
      results.push(rec);
    }
    return results;
  }

  function puzzle_solved_room_repeatable(puzzle, map_location) {
    if ('repeatable' in puzzle) {
      // you can solve this puzzle over and over!
    } else {
      // remove this puzzle since it's been solved
      var temp = [];
      for (var k = 0; k < map_location[0]['puzzles'].length; k++) {
        if (map_location[0]['puzzles'][k]['cmd'] != puzzle['cmd'] || map_location[0]['puzzles'][k]['solution'] != puzzle['solution']) {
          temp.push(map_location[0]['puzzles'][k]);
        }
      }
      map_location[0]['puzzles'] = temp;
    }
    return;
  }

  function puzzle_solved_friendly_repeatable(puzzle, friendlies) {
    if ('repeatable' in puzzle) {
      // you can solve this puzzle over and over!
    } else {
      // remove this puzzle since it's been solved
      var temp = [];
      for (var k = 0; k < friendlies['puzzles'].length; k++) {
        if (friendlies['puzzles'][k]['cmd'] != puzzle['cmd'] || friendlies['puzzles'][k]['solution'] != puzzle['solution']) {
          temp.push(friendlies['puzzles'][k]);
        }
      }
      friendlies['puzzles'] = temp;
    }
    return;
  }

  function puzzle_solved_room_hidden_exits(map_location, results) {
    // if all puzzles are solved reveal any hidden exits
    if (map_location[0]['puzzles'].length == 0 && 'hidden_exits' in map_location[0] && map_location[0]['hidden_exits'].length > 0) {
      var rec = {};
      rec['title'] = 'EXITS';
      rec['lines'] = [map_location[0]['hidden_exits'].join(', ')];
      results.push(rec);
      if ('exits' in map_location[0]) {
        map_location[0]['exits'] = map_location[0]['exits'].concat(map_location[0]['hidden_exits']);
      } else {
        map_location[0]['exits'] = map_location[0]['hidden_exits'];
      }
      map_location[0]['hidden_exits'] = [];
    }
    return results;
  }

  /**************************
  *** CHECK PUZZLES
  **************************/
  function check_puzzles(cmd, solution) {
    var results = [];
    // check if any puzzles were solved for the current room
    var map_location = story['map'].filter(function (map) { return map.x == story['character']['x'] && map.y == story['character']['y'] && map.z == story['character']['z'] });
    if ('puzzles' in map_location[0]) {
      var puzzles = map_location[0]['puzzles'];
      for (var j = 0; j < puzzles.length; j++) {
        if (
          (puzzles[j]['cmd'] == 'has' && story['character']['items'].indexOf(puzzles[j]['solution']) > -1) || 
          (puzzles[j]['cmd'] == cmd && solution.search(puzzles[j]['solution']) > -1)
        ) {
          // this puzzle is solved!
          var rec = {};
          rec['title'] = cmd.toUpperCase(); + ' ' + solution.toUpperCase();
          rec['lines'] = [puzzles[j]['detail']];
          rec = puzzle_solved_room_items(puzzles[j], map_location, rec);
          puzzle_solved_room_destroy(puzzles[j], map_location);
          rec = puzzle_solved_adjust_health(puzzles[j], rec);
          rec = puzzle_solved_health_boost(puzzles[j], rec);
          rec = puzzle_solved_adjust_magic(puzzles[j], rec);
          rec = puzzle_solved_magic_boost(puzzles[j], rec);
          rec = puzzle_solved_coins(puzzles[j], rec);
          rec = puzzle_solved_power_min_boost(puzzles[j], rec);
          rec = puzzle_solved_power_max_boost(puzzles[j], rec);
          rec = puzzle_solved_karma_boost(puzzles[j], rec);
          rec = puzzle_solved_learn_spells(puzzles[j], rec);
          rec = puzzle_solved_room_reveal_hidden(puzzles[j], map_location, rec);
          results.push(rec);
          results = puzzle_solved_unlock_gates(puzzles[j], results);
          results = puzzle_solved_lock_gates(puzzles[j], results);
          results = puzzle_solved_place_items(puzzles[j], results);
          results = puzzle_solved_place_puzzles(puzzles[j], results);
          results = puzzle_solved_transport(puzzles[j], results);
          puzzle_solved_room_repeatable(puzzles[j], map_location);
          results = puzzle_solved_room_hidden_exits(map_location, results);
        }
      }
    }

    var friendlies_in_room = story['friendlies'].filter(function(friendlies){return friendlies.x == story['character']['x'] && friendlies.y == story['character']['y'] && friendlies.z == story['character']['z']});
    // check if any puzzles were solved for friendlies in room
    for (var z = 0; z < friendlies_in_room.length; z++) {
      if (friendlies_in_room.length > 0 && 'puzzles' in friendlies_in_room[z]) {
        var puzzles = friendlies_in_room[z]['puzzles'];
        for (var j = 0; j < puzzles.length; j++) {
          if (puzzles[j]['cmd'] == 'place') {
            // add the x, y, z coordinates to the solution
            solution += ' in ' + story['character']['x'] + ', ' + story['character']['y'] + ', ' + story['character']['z'];
          }
          if (puzzles[j]['cmd'] == cmd && solution.search(puzzles[j]['solution']) > -1) {
            if (puzzles[j]['cmd'] == 'location') {
              cmd = 'bring ' + friendlies_in_room[z]['name'] + ' to';
              solution = 'location';
            }
            if (puzzles[j]['cmd'] == 'place') {
              // clean up the solution
              solution = solution.substr(0,solution.indexOf(' in '));
            }
            if (puzzles[j]['cmd'] == 'say') {
              // clean up the solution
              solution = solution.substr(solution.indexOf(' '));
            }
            // this puzzle is solved!
            var rec = {};
            rec['title'] = cmd.toUpperCase() + ' ' + solution.toUpperCase();
            rec['lines'] = [puzzles[j]['detail']];

            rec = puzzle_solved_friendly_items(puzzles[j], map_location, friendlies_in_room[z], rec);
            rec = puzzle_solved_adjust_health(puzzles[j], rec);
            rec = puzzle_solved_health_boost(puzzles[j], rec);
            rec = puzzle_solved_adjust_magic(puzzles[j], rec);
            rec = puzzle_solved_magic_boost(puzzles[j], rec);
            rec = puzzle_solved_coins(puzzles[j], rec);
            rec = puzzle_solved_power_min_boost(puzzles[j], rec);
            rec = puzzle_solved_power_max_boost(puzzles[j], rec);
            rec = puzzle_solved_karma_boost(puzzles[j], rec);
            rec = puzzle_solved_learn_spells(puzzles[j], rec);
            // change available conversation if need be
            if ('conversation' in puzzles[j]) {
              friendlies_in_room[z]['conversation'] = puzzles[j]['conversation'];
            }
            // change friendly type if need be
            if ('type_change' in puzzles[j]) {
              friendlies_in_room[z]['type'] = puzzles[j]['type_change'];
              if (puzzles[j]['type_change'] == 'fixed') {
                rec['lines'].push(friendlies_in_room[z]['name'] + ' has stopped following you!');
              } else if (puzzles[j]['type_change'] == 'chase') {
                rec['lines'].push(friendlies_in_room[z]['name'] + ' has started following you!');
              } else if (puzzles[j]['type_change'] == 'run') {
                rec['lines'].push(friendlies_in_room[z]['name'] + ' has become skiddish!');
              } else if (puzzles[j]['type_change'] == 'roaming') {
                rec['lines'].push(friendlies_in_room[z]['name'] + ' has become restless!');
              }
            }
            results.push(rec);
            results = puzzle_solved_unlock_gates(puzzles[j], results);
            results = puzzle_solved_lock_gates(puzzles[j], results);
            results = puzzle_solved_place_items(puzzles[j], results);
            results = puzzle_solved_place_puzzles(puzzles[j], results);
            results = puzzle_solved_transport(puzzles[j], results);
            puzzle_solved_friendly_repeatable(puzzles[j], friendlies_in_room[z]);
          }
        }
      }
    }

    // check if any puzzles were solved for missions
    var all_missions_resolved = true;
    for (var i = 0; i < story['missions'].length; i++) {
      if (story['missions'][i]['status'] == 'unresolved') {
        all_missions_resolved = false;
        for (var j = 0; j < story['missions'][i]['puzzles'].length; j++) {
          var this_mission_resolved = false;
          if (story['missions'][i]['puzzles'][j]['cmd'] == 'place') {
            // add the x, y, z coordinates to the solution
            solution += ' in ' + story['character']['x'] + ',' + story['character']['y'] + ',' + story['character']['z'];
          }
          if (story['missions'][i]['puzzles'][j]['cmd'] == 'location') {
            for (var k = 0; k < friendlies_in_room.length; k++) {
              solution = friendlies_in_room[k]['name'] + ' to ' + story['character']['x'] + ',' + story['character']['y'] + ',' + story['character']['z'];
              if (story['missions'][i]['puzzles'][j]['cmd'] == cmd && solution.search(story['missions'][i]['puzzles'][j]['solution']) > -1) {
                this_mission_resolved = true;
              }
            }
          }
          if (story['missions'][i]['puzzles'][j]['cmd'] == 'has' && story['character']['items'].indexOf(story['missions'][i]['puzzles'][j]['solution']) > -1) {
            this_mission_resolved = true;
          } else if (story['missions'][i]['puzzles'][j]['cmd'] == cmd && solution.search(story['missions'][i]['puzzles'][j]['solution']) > -1) {
            this_mission_resolved = true;
          }
          if (this_mission_resolved && story['missions'][i]['puzzles'][j]['status'] == 'unresolved') {
            story['missions'][i]['puzzles'][j]['status'] = 'resolved';
            var rec = {};
            rec['title'] = 'PUZZLE RESOLVED';
            rec['lines'] = [story['missions'][i]['puzzles'][j]['detail']];
            if ('items' in story['missions'][i]['puzzles'][j] && story['missions'][i]['puzzles'][j]['items'].length > 0) {
              rec['lines'].push('You are given ' + story['missions'][i]['puzzles'][j]['items'].join(', ') + '.');
              story['character']['items'] = story['character']['items'].concat(story['missions'][i]['puzzles'][j]['items']);
              // remove the items from this puzzle (so we don't accidentily double reward)
              story['missions'][i]['puzzles'][j]['items'] = [];
            }

            rec = puzzle_solved_adjust_health(story['missions'][i]['puzzles'][j], rec);
            rec = puzzle_solved_health_boost(story['missions'][i]['puzzles'][j], rec);
            rec = puzzle_solved_adjust_magic(story['missions'][i]['puzzles'][j], rec);
            rec = puzzle_solved_magic_boost(story['missions'][i]['puzzles'][j], rec);
            rec = puzzle_solved_coins(story['missions'][i]['puzzles'][j], rec);
            rec = puzzle_solved_power_min_boost(story['missions'][i]['puzzles'][j], rec);
            rec = puzzle_solved_power_max_boost(story['missions'][i]['puzzles'][j], rec);
            rec = puzzle_solved_karma_boost(story['missions'][i]['puzzles'][j], rec);
            rec = puzzle_solved_learn_spells(story['missions'][i]['puzzles'][j], rec);
            results.push(rec);
            results = puzzle_solved_unlock_gates(story['missions'][i]['puzzles'][j], results);
            results = puzzle_solved_lock_gates(story['missions'][i]['puzzles'][j], results);
            results = puzzle_solved_place_items(story['missions'][i]['puzzles'][j], results);
            results = puzzle_solved_place_puzzles(story['missions'][i]['puzzles'][j], results);
            results = puzzle_solved_transport(story['missions'][i]['puzzles'][j], results);
            results = puzzle_solved_hidden_exits(map_location, results);

          } else if (story['missions'][i]['puzzles'][j]['status'] == 'unresolved') {
            all_missions_resolved = false;
            this_mission_resolved = false;
          }
        }
      }
    }

    if (all_missions_resolved) {
      var rec = {};
      rec['title'] = 'CONGRATULATIONS';
      rec['lines'] = ['You have completed all available missions for this game.'];
      results.push(rec);
    }
    return results;
  }

  /**************************
  *** CAST SPELL
  **************************/
  function cast(spell_name) {
    var results = [];
    // make sure character knows this spell
    if ('spells' in story['character'] && story['character']['spells'].indexOf(spell_name) > -1) {
      // check if there are specific effects for this spell
      var spell_detail = story['spells'].filter(function (spells) { return spells.name == spell_name });
      if (spell_detail.length > 0) {
        // make sure the user has enough magic to cast this spell
        if (story['character']['magic'] >= spell_detail[0]['magic_cost']) {
          // use the magic
          story['character']['magic'] -= spell_detail[0]['magic_cost'];
          var rec = {};
          rec['title'] = 'CAST ' + spell_name.toUpperCase();
          rec['lines'] = [spell_detail[0]['detail']];
          // award any needed items
          if ('items' in spell_detail[0]) {
            story['character']['items'] = story['character']['items'].concat(spell_detail[0]['items']);
            for (var k = 0; k < spell_detail[0]['items'].length; k++) {
              rec['lines'].push('A ' + spell_detail[0]['items'][k] + ' is here.');
            }
          }
          // award any needed coins
          if ('coins' in spell_detail[0]) {
            story['character']['coins'] += spell_detail[0]['coins'];
            rec['lines'].push('You are given ' + spell_detail[0]['coins'] + ' coins.');
          }
          // adjust health as needed
          if ('adjust_health' in spell_detail[0]) {
            story['character']['health'] += spell_detail[0]['adjust_health'];
            rec['lines'].push('Your health has been adjusted ' + spell_detail[0]['adjust_health']);
          }
          // adjust karama as needed
          if ('adjust_karma' in spell_detail[0]) {
            if (spell_detail[0]['adjust_karma'] == 0) {
              story['character']['karma'] = 0;
              rec['lines'].push('Your karma has been reset to neutral.');
            } else {
              story['character']['karma'] += spell_detail[0]['adjust_karma'];
              rec['lines'].push('Your karma has been adjusted ' + spell_detail[0]['adjust_karma'] + '.');
            }
          }
          results.push(rec);
          // transport the user if need be
          if ('transport' in spell_detail[0] && 'x' in spell_detail[0]['transport'] && 'y' in spell_detail[0]['transport'] && 'z' in spell_detail[0]['transport']) {
            story['character']['x'] = spell_detail[0]['transport']['x'];
            story['character']['y'] = spell_detail[0]['transport']['y'];
            story['character']['z'] = spell_detail[0]['transport']['z'];
            var rec = {};
            rec['title'] = 'TRANSPORTED';
            rec['lines'] = ['You have been transported to a new location on the map!'];
            results.push(rec);
          }
          // check if casting this spell solves any puzzles
          results = results.concat(check_puzzles(cmd, spell_name));
          if (results.length == 0) {
            var rec = {};
            rec['title'] = 'CAST ' + spell_name.toUpperCase();
            rec['lines'] = ['You properly conjure the spell, but nothing much seems to happen.'];
            results.push(rec);
          }
        } else {
          var rec = {};
          rec['title'] = 'CAST ' + spell_name.toUpperCase();
          rec['lines'] = ['You don\'t have enough magic power to cast this right now'];
          results.push(rec);
        }
      }
    } else {
      var rec = {};
      rec['title'] = 'CAST ' + spell_name.toUpperCase();
      rec['lines'] = ['You don\'t seem to know this spell.'];
      results.push(rec);
    }
    return results;
  }

  /**************************
  *** CONSUME ITEM
  **************************/
  function consume(object_name) {
    var results = [];
    // make sure the character has the item in inventory
    if (story['character']['items'].indexOf(object_name) > -1) {
      // make sure the item is a consumable
      var object_detail = story['objects'].filter(function (objects) { return objects.name == object_name && objects.type == 'consumable' });
      if (object_detail.length > 0) {
        // available and OK to consume; apply health bump and remove from inventory
        var slot = story['character']['items'].indexOf(object_name);
        story['character']['items'].splice(slot, 1);
        var slot2 = story['character']['equiped'].indexOf(object_name);
        if (slot2 > -1) {
          story['character']['equiped'].splice(slot2, 1);
        }
        var boost = object_detail[0]['health_bump'];
        story['character']['health'] += boost;
        var rec = {};
        rec['title'] = 'CONSUME ' + object_name.toUpperCase();
        var text = 'You consume a tasty ' + object_name + ' and get a quick health bump of ';
        if (story['character']['health'] > story['character']['max_health']) {
          text += (boost - (story['character']['health'] - story['character']['max_health']));
          story['character']['health'] = story['character']['max_health'];
        } else {
          text += boost;
        }
        rec['lines'] = [text + '.'];
        results.push(rec);
      } else {
        var rec = {};
        rec['title'] = 'CONSUME ' + object_name.toUpperCase();
        rec['lines'] = ['As hard as you try, you just can\'t seem to put the ' + object_name + ' in your mouth!'];
        results.push(rec);
      }
    } else {
      var rec = {};
      rec['title'] = 'CONSUME ' + object_name.toUpperCase();
      rec['lines'] = ['You don\'t have any ' + object_name + ' to consume!'];
      results.push(rec);
    }
    return results;
  }

  /**************************
  *** DIG
  **************************/
  function dig() {
    var results = [];
    // make sure character has a shovel
    var rec = {};
    rec['title'] = 'DIG';
    if (new RegExp(story['character']['items'].join("|")).test('shovel')) {
      // character has shovel; reveal hidden objects
      var map_location = story['map'].filter(function (map) { return map.x == story['character']['x'] && map.y == story['character']['y'] && map.z == story['character']['z'] });
      if ('hidden_items' in map_location[0] && map_location[0]['hidden_items'].length > 0) {
        // add these items to the room!
        if ('items' in map_location[0]) {
          map_location[0]['items'] = map_location[0]['items'].concat(map_location[0]['hidden_items']);
        } else {
          map_location[0]['items'] = map_location[0]['hidden_items'];
        }
        rec['lines'] = ['Eureka! You found ' + map_location[0]['hidden_items'].join(', ') + '.'];
        map_location[0]['hidden_items'] = [];
      } else if ('hidden_coins' in map_location[0] && map_location[0]['hidden_coins'] > 0) {
        rec['lines'] = ['Hot dog! You found ' + map_location[0]['hidden_coins'] + ' coins.'];
        story['character']['coins'] += map_location[0]['hidden_coins'];
        map_location[0]['hidden_coins'] = 0;
      } else {
        rec['lines'] = ['After digging for a bit, you find nothing.'];
      }
    } else {
      rec['lines'] = ['You need a shovel to dig.'];
    }
    results.push(rec);
    return results;
  }

  /**************************
  *** DISASSEMBLE AN ITEM FROM INVENTORY
  **************************/
  function disassemble(object_name) {
    var results = [];
    // make sure character has item in inventory
    var slot = story['character']['items'].indexOf(object_name);
    if (slot > -1) {
      var object_detail = story['objects'].filter(function (objects) { return objects.name == object_name });
      if (object_detail.length > 0) {
        // take the item out of the character items
        story['character']['items'].splice(slot, 1);
        var slot2 = story['character']['equiped'].indexOf(object_name);
        if (slot2 > -1) {
          // take the item out of the character equiped since we dropped it as well
          story['character']['equiped'].splice(slot2, 1);
        }
        // add the 'build_with' items to character inventory
        story['character']['items'] = story['character']['items'].concat(object_detail[0]['build_with']);
        var rec = {};
        rec['title'] = 'DISASSEMBLE ' + object_name.toUpperCase();
        rec['lines'] = ['You disassemble ' + object_name + ' into ' + object_detail[0]['build_with'].join(', ') + '.'];
        results.push(rec);
      } else {
        var rec = {};
        rec['title'] = 'DISASSEMBLE ' + object_name.toUpperCase();
        rec['lines'] = ['You can\'t disassemble ' + object_name + '.'];
        results.push(rec);
      }
    } else {
      var rec = {};
      rec['title'] = 'DISASSEMBLE ' + object_name.toUpperCase();
      rec['lines'] = ['You do not have ' + object_name + ' to disassemble.'];
      results.push(rec);
    }
    return results;
  }

  /**************************
  *** DROP AN ITEM FROM CHARACTER ITEMS (LEAVE IN CURRENT LOCATION)
  **************************/
  function drop(object_name, adj, required_object) {
    var results = [];
    // make sure the item is available in the character items
    if (object_name == 'coin') {
      // take coin out of character coin amounts
      if (story['character']['coins'] > 1) {
        // add a coin to character items;
        story['character']['coins'] -= 1;
        story['character']['items'].push('coin');
      }
    }
    var slot = story['character']['items'].indexOf(object_name);
    if (slot > -1) {
      var map_location = story['map'].filter(function (map) { return map.x == story['character']['x'] && map.y == story['character']['y'] && map.z == story['character']['z'] });
      // if required_object is not empty, make sure it's an object in the room
      can_drop = true;
      if (required_object != '') {
        // make sure obect is in room
        if ('objects' in map_location[0] && map_location[0]['objects'].indexOf(required_object) > -1) {
          can_drop = true;
        } else {
          can_drop = false;
        }
      }
      if (can_drop) {
        // take the item out of the character items
        story['character']['items'].splice(slot, 1);
        // add item to this room
        if ('items' in map_location[0]) {
          map_location[0]['items'].push(object_name);
        } else {
          map_location[0]['items'] = [object_name];
        }
        var slot2 = story['character']['equiped'].indexOf(object_name);
        if (slot2 > -1) {
          // take the item out of the character equiped since we dropped it as well
          story['character']['equiped'].splice(slot2, 1);
        }
        var rec = {};
        rec['title'] = adj.toUpperCase() + ' ' + object_name.toUpperCase();
        rec['lines'] = ['You ' + adj + ' ' + object_name + '.'];
        results.push(rec);
        results = results.concat(check_puzzles(cmd, object_name));
      } else {
        var rec = {};
        rec['title'] = adj.toUpperCase() + ' ' + object_name.toUpperCase();
        rec['lines'] = ['You can not ' + adj + ' ' + object_name + ' there!'];
        results.push(rec);
      }
    } else {
      var rec = {};
      rec['title'] = adj.toUpperCase() + ' ' + object_name.toUpperCase();
      rec['lines'] = ['You do not have ' + object_name + ' to ' + adj + '!'];
      results.push(rec);
    }
    return results;
  }

  /**************************
  *** EQUIP AN ITEM
  **************************/
  function equip(object_name) {
    var results = [];
    // attempt to equip character with a given item;
    // character needs to have the item in inventory
    var has_item_to_equip = false;
    for (var i = 0; i < story['character']['items'].length; i++) {
      if (story['character']['items'][i] == object_name) {
        has_item_to_equip = true;
      }
    }
    if (has_item_to_equip) {
      if ('equiped' in story['character']) {
        // make sure we take out any existing weapon
        for (var i = 0; i < story['character']['equiped'].length; i++) {
          var object_detail = story['objects'].filter(function (objects) { return objects.name == story['character']['equiped'][i] && objects.type == 'weapon' });
          if (object_detail.length > 0) {
            story['character']['equiped'].splice(i, 1);
            break;
          }
        }
        // now add the weapon to the equiped list
        story['character']['equiped'].push(object_name);
      } else {
        story['character']['equiped'] = [object_name];
      }
      var rec = {};
      rec['title'] = 'EQUIP ' + object_name.toUpperCase();
      rec['lines'] = ['You equip yourself with ' + object_name + '.'];
      results.push(rec);
    } else {
      var rec = {};
      rec['title'] = 'SORRY';
      rec['lines'] = ['You don\'t have ' + object_name + ' to equip.'];
      results.push(rec);
    }
    return results;
  }

  /**************************
  *** EXAMINE AN OBJECT
  **************************/
  function examine(object_name) {
    var results = [];
    var can_examine = false;
    // make sure the object is in the room with the character or in the character inventory
    var map_location = story['map'].filter(function (map) { return map.x == story['character']['x'] && map.y == story['character']['y'] && map.z == story['character']['z'] });
    if (('items' in map_location[0] && map_location[0]['items'].indexOf(object_name) > -1) || story['character']['items'].indexOf(object_name) > -1) {
      var object_detail = story['objects'].filter(function (objects) { return objects.name == object_name });
      if (object_detail.length > 0) {
        can_examine = true;
        var rec = {};
        rec['title'] = object_detail[0]['name'].toUpperCase();
        rec['lines'] = [object_detail[0]['detail']];
        if ('items' in story['character'] && story['character']['items'].indexOf(object_name) > -1 && 'inventory_detail' in object_detail[0]) {
          rec['lines'].push(object_detail[0]['inventory_detail']);
        }
        if ('health_bump' in object_detail[0]) {
          var boost = object_detail[0]['health_bump'];
          if (boost == 0) {
            boost = story['character']['max_health'];
          }
          rec['lines'].push('Provides a health bump of ' + boost + '.');
        }
        if ('power_range' in object_detail[0]) {
          rec['lines'].push('Can cause damange from ' + object_detail[0]['power_range'][0] + ' to ' +  + object_detail[0]['power_range'][1] + '.');
        }
        if ('build_with' in object_detail[0]) {
          rec['lines'].push('Built from ' + object_detail[0]['build_with'].join(', ') + '.');
        }
        if ('for_sale' in map_location[0]) {
          if (map_location[0]['for_sale'].length > 0) {
            for (var i = 0; i < map_location[0]['for_sale'].length; i++) {
              if (map_location[0]['for_sale'][i]['name'] == object_name && map_location[0]['for_sale'][i]['available'] > 0) {
                sale_adj = 'are';
                if (map_location[0]['for_sale'][i]['available'] == 1) {
                  sale_adj = 'is';
                }
                rec['lines'].push('You can buy ' + map_location[0]['for_sale'][i]['name'] + ' for ' + map_location[0]['for_sale'][i]['buy_price'] + ' coin and sell it for ' + map_location[0]['for_sale'][i]['sell_price'] + ' coin here. There ' + sale_adj + ' currently ' + map_location[0]['for_sale'][i]['available'] + ' in stock.');
              }
            }
          }
        }
        results.push(rec);
      }
    }
    // check if this is an enemy in the room
    var enemies_in_room = story['enemies'].filter(function(enemies){return enemies.x == story['character']['x'] && enemies.y == story['character']['y'] && enemies.z == story['character']['z']});
    if (enemies_in_room.length > 0) {
      for (var i = 0; i < enemies_in_room.length; i++) {
        if (enemies_in_room[i]['name'] == object_name) {
          can_examine = true;
          var rec = {};
          rec['title'] = enemies_in_room[i]['name'].toUpperCase();
          rec['lines'] = [enemies_in_room[i]['detail']];
          if ('items' in enemies_in_room[i] && enemies_in_room[i]['items'].length > 0) {
            rec['lines'].push('Has ' + enemies_in_room[i]['items'].join(', ') + '.');
          }
          rec['lines'].push('Looks to have a health of about ' + enemies_in_room[i]['health'] + '.');
          results.push(rec);
        }
      }
    }
    // check if this is a friendly in the room
    var friendly_detail = story['friendlies'].filter(function(friendlies){ return friendlies.x == story['character']['x'] && friendlies.y == story['character']['y'] && friendlies.z == story['character']['z'] });
    if (friendly_detail.length > 0) {
      for (var i = 0; i < friendly_detail.length; i++) {
        if (friendly_detail[i]['name'] == object_name) {
          can_examine = true;
          var rec = {};
          rec['title'] = friendly_detail[i]['name'].toUpperCase();
          rec['lines'] = [friendly_detail[i]['detail']];
          if ('items' in friendly_detail[i] && friendly_detail[i]['items'].length > 0) {
            rec['lines'].push('Has ' + friendly_detail[i]['items'].join(', ') + '.');
          }
          results.push(rec);
        }
      }
    }
    // check if this is an object in the room
    if ('objects' in map_location[0]) {
      for (var i = 0; i < map_location[0]['objects'].length; i++) {
        if (map_location[0]['objects'][i] == object_name) {
          var object_detail = story['objects'].filter(function (objects) { return objects.name == object_name });
          if (object_detail.length > 0) {
            var rec = {};
            rec['title'] = object_detail[0]['name'].toUpperCase();
            rec['lines'] = [object_detail[0]['detail']];
            results.push(rec);
          }
          can_examine = true;
          break;
        }
      }
    }
    // check if this is an item for sale in this room
    if ('for_sale' in map_location[0]) {
      for (var i = 0; i < map_location[0]['for_sale'].length; i++) {
        if (map_location[0]['for_sale'][i]['name'] == object_name && map_location[0]['for_sale'][i]['available'] > 0) {
          var object_detail = story['objects'].filter(function (objects) { return objects.name == object_name });
          if (object_detail.length > 0) {
            sale_adj = 'are';
            if (map_location[0]['for_sale'][i]['available'] == 1) {
              sale_adj = 'is';
            }
            var rec = {};
            rec['title'] = object_detail[0]['name'].toUpperCase();
            rec['lines'] = [object_detail[0]['detail'], 'You can buy ' + object_detail[0]['name'] + ' for ' + map_location[0]['for_sale'][i]['buy_price'] + ' coin and sell it for ' + map_location[0]['for_sale'][i]['sell_price'] + ' coin here. There ' + sale_adj + ' currently ' + map_location[0]['for_sale'][i]['available'] + ' in stock.'];
            results.push(rec);
          }
          can_examine = true;
          break;
        }
      }
    }
    if (!can_examine) {
      var rec = {};
      rec['title'] = object_name.toUpperCase();
      rec['lines'] = ['There is no ' + object_name + ' here!'];
      results.push(rec);
    }
    results = results.concat(check_puzzles('look', object_name));
    return results;
  }

  /**************************
  *** GIVE ITEM TO FRIENDLY
  **************************/
  function give(give_to, object_name) {
    var results = [];
    // determine if there are friendlies in the current room
    var friendly_detail = story['friendlies'].filter(function(friendlies){ return friendlies.name == give_to && friendlies.x == story['character']['x'] && friendlies.y == story['character']['y'] && friendlies.z == story['character']['z'] });
    if (friendly_detail.length > 0) {
      // make sure the character has the item to give
      var slot = story['character']['items'].indexOf(object_name);
      if (slot > -1) {
        // seems OK; accept gift if puzzle solution, otherwise refuse gift
        results = results.concat(check_puzzles('give', object_name));
        if (results.length > 0) {
          // user appears to have solved a puzzle!
          // since we have given away the item, remove it from character inventory
          story['character']['items'].splice(slot, 1);
          // also remove from equiped if need be
          var slot3 = story['character']['equiped'].indexOf(object_name);
          if (slot3 > -1) {
            story['character']['equiped'].splice(slot3, 1);
          }
        } else {
          var rec = {};
          rec['title'] = 'BUMMER';
          rec['lines'] = [give_to + ' humbly denies your gift.'];
          results.push(rec);
        }
      } else {
        var rec = {};
        rec['title'] = 'BUMMER';
        rec['lines'] = ['You don\'t have ' + object_name + ' to give.'];
        results.push(rec);
      }
    } else {
      var rec = {};
      rec['title'] = 'BUMMER';
      rec['lines'] = [give_to + ' is not here.'];
      results.push(rec);
    }
    return results;
  }

  /**************************
  *** DISPLAY HELP
  **************************/
  function help(cmd) {
    var results = [];
    if (cmd == '') {
      // if available, show the game story
      if ('plot' in story) {
        var rec = {};
        rec['title'] = 'THE GAME';
        rec['lines'] = [story['plot']];
        results.push(rec);
      }
      var rec = {};
      rec['title'] = 'HOW TO PLAY';
      rec['lines'] = ['This is a free-roaming, text-only, game of imagination.','There are ' + story['missions'].length + ' total missions to solve.','Each mission may include many unique and challenging objectives.','There are ' + commands.length + ' commands you can use as you attempt your missions.'];
      results.push(rec);
      // 'Details on each follows.'
      // show the list of commands you can get help with
      // for (var i = 0; i < commands.length; i++) {
      //   var rec = {};
      //   rec['title'] = commands[i]['cmd'].toUpperCase();
      //   rec['lines'] = [commands[i]['help']['detail']];
      //   rec['lines'].push(commands[i]['help']['syntax']);
      //   results.push(rec);
      // }
    } else {
      var command_detail = commands.filter(function (commands) { return commands.cmd == cmd });
      if (command_detail.length > 0) {
        var rec = {};
        rec['title'] = cmd.toUpperCase();
        rec['lines'] = [command_detail[0]['help']['detail']];
        results.push(rec);
        // var rec = {};
        // rec['title'] = 'USAGE';
        // rec['lines'] = [command_detail[0]['help']['syntax']];
        // results.push(rec);
      } else {
        var rec = {};
        rec['title'] = 'BUMMER';
        rec['lines'] = ['I cannot help with ' + cmd + '.'];
        results.push(rec);
      }
    }
    return results;
  }

  /**************************
  *** SHOW WHAT ITEMS CHARACTER HAS
  **************************/
  function inventory() {
    var results = [];
    if (story['character']['items'].length > 0) {
      var rec = {};
      rec['title'] = 'ITEMS';
      rec['lines'] = [story['character']['items'].join(', ')];
      results.push(rec);
    } else {
      var rec = {};
      rec['title'] = 'BUMMER';
      rec['lines'] = ['You have no items in your possession.'];
      results.push(rec);
    }
    return results;
  }

  /**************************
  *** DISPLAY DETAILS ABOUT MISSIONS
  **************************/
  function missions() {
    // show the basic details of all missions
    var results = [];
    for (var i = 0; i < story['missions'].length; i++) {
      var resolved_count = 0;
      for (var j = 0; j < story['missions'][i]['puzzles'].length; j++) {
        if (story['missions'][i]['puzzles'][j]['status'] == 'resolved') {
          resolved_count += 1;
        }
      }
      //var completion_percent = Math.floor((resolved_count / story['missions'][i]['puzzles'].length) * 100);
      var rec = {};
      rec['title'] = story['missions'][i]['name'].toUpperCase();
      rec['lines'] = [story['missions'][i]['detail']];
      results.push(rec);
    }
    return results;
  }

  /**************************
  *** MOVE A CHARACTER AROUND THE MAP
  **************************/
  function move(direction) {
    // attempt to move the character
    var results = [];
    var x = story['character']['x'];
    var y = story['character']['y'];
    var z = story['character']['z'];
    var initial_x = x;
    var initial_y = y;
    var initial_z = z;
    switch (direction.toLowerCase()) {
      case "north":direction = 'north';break;
      case "south":direction = 'south';break;
      case "east":direction = 'east';break;
      case "west":direction = 'west';break;
      case "northeast":direction = 'northeast';break;
      case "northwest":direction = 'northwest';break;
      case "southeast":direction = 'southeast';break;
      case "southwest":direction = 'southwest';break;
      case "up":direction = 'up';break;
      case "down":direction = 'down';break;
    }
    // make sure the exit is available from the current location
    var map_location = story['map'].filter(function (map) { return map.x == x && map.y == y && map.z == z });
    if (map_location.length > 0 && 'exits' in map_location[0] && map_location[0]['exits'].indexOf(direction) > -1) {
      // we can move this direction
      switch (direction.toLowerCase()) {
        case "north":y -= 1;break;
        case "south":y += 1;break;
        case "east":x += 1;break;
        case "west":x -= 1;break;
        case "northeast":x += 1;y -= 1;break;
        case "northwest":x -= 1;y -= 1;break;
        case "southeast":x += 1;y += 1;break;
        case "southwest":x -= 1;y += 1;break;
        case "up":z += 1;break;
        case "down":z -= 1;break;
      }
      // attempt to get the new location on the map
      var new_map_location = story['map'].filter(function (map) { return map.x == x && map.y == y && map.z == z });
      if (new_map_location.length == 0) {
        // can't make this move because it's not on the map!
        var rec = {};
        rec['title'] = 'SORRY';
        rec['lines'] = ['The location you are attempting to get to is not on the map!'];
        results.push(rec);
      } else {
        // update the character's location
        story['character']['x'] = x;
        story['character']['y'] = y;
        story['character']['z'] = z;
        results = results.concat(view_map_location());
        var enemies_in_room = story['enemies'].filter(function(enemies){return enemies.x == x && enemies.y == y && enemies.z == z});
        // deal with any friendlies that should chase
        for (var i = 0; i < story['friendlies'].length; i++) {
          if (story['friendlies'][i]['x'] == initial_x && story['friendlies'][i]['y'] == initial_y && story['friendlies'][i]['z'] == initial_z) {
            if (story['friendlies'][i]['type'] == 'chase' || (story['friendlies'][i]['type'] == 'skittish' && enemies_in_room.length == 0)) {
              story['friendlies'][i]['x'] = x;
              story['friendlies'][i]['y'] = y;
              story['friendlies'][i]['z'] = z;
              var rec = {};
              rec['title'] = 'HEADS UP';
              rec['lines'] = [story['friendlies'][i]['name'] + ' followed you to this location!'];
              results.push(rec);
            }
          }
        }
        // deal with any ememies that should chase (or attack)
        for (var i = 0; i < story['enemies'].length; i++) {
          // enemies that should chase
          if (story['enemies'][i]['x'] == initial_x && story['enemies'][i]['y'] == initial_y && story['enemies'][i]['z'] == initial_z && story['enemies'][i]['type'] == 'chase') {
            story['enemies'][i]['x'] = x;
            story['enemies'][i]['y'] = y;
            story['enemies'][i]['z'] = z;
            var rec = {};
            rec['title'] = 'YIKES';
            rec['lines'] = [story['enemies'][i]['name'] + ' chased you to this location!'];
            results.push(rec);
          }
          // enemies that should attack
          if (story['enemies'][i]['x'] == x && story['enemies'][i]['y'] == y && story['enemies'][i]['z'] == z && 'disposition' in story['enemies'][i] && story['enemies'][i]['disposition'] == 'aggressive') {
            results = results.concat(attack(story['enemies'][i]['name'],'character',''));
          }
        }
        results = results.concat(check_puzzles('location', story['character']['x'] + ', ' + story['character']['y'] + ', ' + story['character']['z']));
      }
    } else if (map_location.length > 0 && 'locked_exits' in map_location[0] && map_location[0]['locked_exits'].indexOf(direction) > -1) {
      // that exit is currently locked
      var rec = {};
      rec['title'] = 'SORRY';
      rec['lines'] = ['That exit is currently locked!'];
      results.push(rec);
    } else {
      // that exit is not availabe from this location
      var rec = {};
      rec['title'] = 'SORRY';
      rec['lines'] = ['That exit is not available from this location!'];
      results.push(rec);
    }
    return results;
  }

  /**************************
  *** PRAY
  **************************/
  function pray(object_name) {
    var results = [];
    if (object_name != '') {
      // attempt to pray to object
      results = results.concat(check_puzzles('pray',object_name));
    } else {
      // just general praying (possible karma bump)
      if ('karma' in story['character'] && story['character']['karma'] < 0) {
        var karma_bump = Math.floor((Math.random()*(5))+1);
        story['character']['karma'] += karma_bump;
        var rec = {};
        rec['title'] = 'PRAY';
        rec['lines'] = ['As you humbly pray, you feel as though your karma has slightly improved.'];
        results.push(rec);
      }
    }
    if (results.length == 0) {
      // praying didn't seem to do anything
      var rec = {};
      rec['title'] = 'PRAY';
      rec['lines'] = ['You humbly pray not knowing if anyone is truly listening right now.'];
      results.push(rec);
    }
    return results;
  }

  /**************************
  *** PULL AN OBJECT
  **************************/
  function pull(object_name) {
    var results = [];
    // determine if object is in the current room
    var map_location = story['map'].filter(function (map) { return map.x == story['character']['x'] && map.y == story['character']['y'] && map.z == story['character']['z'] });
    var object_in_room = false;
    if ('objects' in map_location[0]) {
      var objects_in_room = map_location[0]['objects'];
      for (var i = 0; i < objects_in_room.length; i++) {
        if (objects_in_room[i] == object_name) {
          object_in_room = true;
          break;
        }
      }
    }
    if (object_in_room) {
      // object is in the room; check for pull puzzle
      results = results.concat(check_puzzles('pull',object_name));
      if (results.length == 0) {
        var rec = {};
        rec['title'] = 'PULL ' + object_name.toUpperCase();
        rec['lines'] = ['Try as you might, you are unable to pull ' + object_name + '.'];
        results.push(rec);
      }
    } else {
      var rec = {};
      rec['title'] = 'PULL ' + object_name.toUpperCase();
      rec['lines'] = ['There is no ' + object_name + ' to pull here.'];
      results.push(rec);
    }
    return results;
  }

  /**************************
  *** PUSH AN OBJECT
  **************************/
  function do_push(object_name) {
    var results = [];
    // determine if object is in the current room
    var map_location = story['map'].filter(function (map) { return map.x == story['character']['x'] && map.y == story['character']['y'] && map.z == story['character']['z'] });
    var object_in_room = false;
    if ('objects' in map_location[0]) {
      var objects_in_room = map_location[0]['objects'];
      for (var i = 0; i < objects_in_room.length; i++) {
        if (objects_in_room[i] == object_name) {
          object_in_room = true;
          break;
        }
      }
    }
    if (object_in_room) {
      // object is in the room; check for push puzzle
      results = results.concat(check_puzzles('push',object_name));
      if (results.length == 0) {
        var rec = {};
        rec['title'] = 'PUSH ' + object_name.toUpperCase();
        rec['lines'] = ['Try as you might, you are unable to push ' + object_name + '.'];
        results.push(rec);
      }
    } else {
      var rec = {};
      rec['title'] = 'PUSH ' + object_name.toUpperCase();
      rec['lines'] = ['There is no ' + object_name + ' to push here.'];
      results.push(rec);
    }
    return results;
  }

  /**************************
  *** SAY SOMETHING OUTLOUD
  **************************/
  function say(statement) {
    var results = [];
    var puzzle_statement = story['character']['x'] + ',' + story['character']['y'] + ',' + story['character']['z'] + ' ' + statement;
    results = results.concat(check_puzzles('say',puzzle_statement));
    if (results.length == 0) {
      var friendly_detail = story['friendlies'].filter(function(friendlies){ return friendlies.x == story['character']['x'] && friendlies.y == story['character']['y'] && friendlies.z == story['character']['z'] });
      if (friendly_detail.length > 0) {
        // there are friendlies in the room; see if any are programed to respond to the specific statement
        friendly_detail[0]['met'] = true;
        for (var i = 0; i < friendly_detail.length; i++) {
          for (var key in friendly_detail[i]['conversation']) {
            if (statement.indexOf(key) > -1) {
              // show this response
              var rec = {};
              rec['title'] = 'CONVERSATION';
              rec['lines'] = ["You say '" + statement + "' to " + friendly_detail[i]['name'] + '.'];
              results.push(rec);
              var rec = {};
              rec['title'] = friendly_detail[i]['name'] + ' RESPONDS';
              rec['lines'] = [friendly_detail[i]['conversation'][key]];
              results.push(rec);
              break;
            }
          }
        }
        if (results.length == 0) {
          // didn't find a specific thing to respond to; so show the default for the first friendly in the room
          var rec = {};
          rec['title'] = 'CONVERSATION';
          rec['lines'] = ["You say '" + statement + "' to " + friendly_detail[0]['name'] + '.'];
          results.push(rec);
          var rec = {};
          rec['title'] = friendly_detail[0]['name'] + ' RESPONDS';
          rec['lines'] = [friendly_detail[0]['conversation']['default']];
          results.push(rec);
        }
      } else {
        // you are alone in this room; so just speak it outloud
        var rec = {};
        rec['title'] = 'CONVERSATION';
        rec['lines'] = ["You mumble '" + statement + "' to yourself."];
        results.push(rec);
      }
    }
    return results;
  }

  /**************************
  *** SELL AN ITEM
  **************************/
  function sell(object_name) {
    var results = [];
    var map_location = story['map'].filter(function (map) { return map.x == story['character']['x'] && map.y == story['character']['y'] && map.z == story['character']['z'] });
    if ('for_sale' in map_location[0]) {
      // make sure user has item in inventory
      var slot = story['character']['items'].indexOf(object_name);
      if (slot > -1) {
        // determine if this item can be sold here
        var stock = map_location[0]['for_sale'];
        var item_can_sell = false;
        var sell_price = 0;
        for (var i = 0; i < stock.length; i++) {
          if (stock[i]['name'] == object_name && 'sell_price' in stock[i]) {
            item_can_sell = true;
            sell_price = stock[i]['sell_price'];
            break;
          }
        }
        if (item_can_sell) {
          results = results.concat(check_puzzles('sell',object_name));
          // take the item out of the character items
          story['character']['items'].splice(slot, 1);
          var slot2 = story['character']['equiped'].indexOf(object_name);
          if (slot2 > -1) {
            // take the item out of the character equiped since we sold it
            story['character']['equiped'].splice(slot2, 1);
          }
          // award character the proper coin
          story['character']['coins'] += sell_price;
          // increase the stock in this room
          for (var j = 0; j < map_location[0]['for_sale'].length; j++) {
            if (map_location[0]['for_sale'][j]['name'] == object_name) {
              map_location[0]['for_sale'][j]['available'] += 1;
              break;
            }
          }
          var rec = {};
          rec['title'] = 'SELL ' + object_name.toUpperCase();
          rec['lines'] = ['You have sold ' + object_name + ' for ' + sell_price + ' coin.'];
          results.push(rec);
        } else {
          var rec = {};
          rec['title'] = 'SELL ' + object_name.toUpperCase();
          rec['lines'] = ['You can not sell ' + object_name + ' here.'];
          results.push(rec);
        }
      } else {
        var rec = {};
        rec['title'] = 'SELL ' + object_name.toUpperCase();
        rec['lines'] = ['You do not have ' + object_name + ' to sell!'];
        results.push(rec);
      }
    } else {
      var rec = {};
      rec['title'] = 'SELL ' + object_name.toUpperCase();
      rec['lines'] = ['You can not sell ' + object_name + ' here.'];
      results.push(rec);
    }
    return results;
  }

  /**************************
  *** STEAL AN ITEM
  **************************/
  function steal(object_name) {
    var results = [];
    var item_available = false;
    var stolen = false;
    // check if object is in the room
    var map_location = story['map'].filter(function (map) { return map.x == story['character']['x'] && map.y == story['character']['y'] && map.z == story['character']['z'] });
    // if item is in room, just let the player 'take' it;.
    if ('items' in map_location[0] && map_location[0]['items'].indexOf(object_name)) {
      // let the character take the item
      results = results.concat(take(object_name));
      stolen = true;
      item_available = true;
    }
    var karma_multiplier = 0;
    if ('karma' in story['character'] && story['character']['karma'] < 10) {
      karma_multiplier = story['character']['karma'];
    }
    var chance = Math.floor((Math.random()*(10-karma_multiplier+1))+karma_multiplier);
    if (!stolen && 'for_sale' in map_location[0]) {
      // lower the stock in this room
      for (var j = 0; j < map_location[0]['for_sale'].length; j++) {
        if (map_location[0]['for_sale'][j]['name'] == object_name) {
          if (map_location[0]['for_sale'][j]['available'] > 0) {
            // only a chance over 5 is a success
            if (chance > 5) {
              map_location[0]['for_sale'][j]['available'] -= 1;
              // add item to the character inventory
              story['character']['items'].push(object_name);
              stolen = true;
            }
            item_available = true;
          }
          break;
        }
      }
    }
    if (!stolen) {
      // check if there is a friendly in the room with the item
      for (var i = 0; i < story['friendlies'].length; i++) {
        if (story['friendlies'][i]['x'] == story['character']['x'] && story['friendlies'][i]['y'] == story['character']['y'] && story['friendlies'][i]['z'] == story['character']['z'] && 'items' in story['friendlies'][i] && story['friendlies'][i]['items'].indexOf(object_name) > -1) {
          item_available = true;
          // only chance over 5 is a success
          if (chance > 5) {
            story['friendlies'][i]['items'].splice(story['friendlies'][i]['items'].indexOf(object_name),1);
            // add item to the character inventory
            story['character']['items'].push(object_name);
            stolen = true;
          }
        }
      }
    }
    if (item_available) {
      // if fail, hit karma and relocate to jail
      if (stolen) {
        var rec = {}
        rec['title'] = 'STEAL ' + object_name.toUpperCase();
        rec['lines'] = ['You sneakily swipe ' + object_name + ' without getting caught!'];
        results.push(rec);
      } else {
        var rec = {}
        rec['title'] = 'YIKES';
        rec['lines'] = ['You were caught trying to steal ' + object_name + '.'];
        if ('karma' in story['character']) {
          story['character']['karma'] -= 1;
          rec['lines'].push('You karma has certainly taken a hit!');
        }
        results.push(rec);
        // attempt to relocate the user to jail
        var has_jail = false;
        var jail_location = story['map'].filter(function (map) { return map.type == 'jail' });
        if ('x' in jail_location[0]) {
          // relocate to the last save spot
          story['character']['x'] = jail_location[0]['x'];
          story['character']['y'] = jail_location[0]['y'];
          story['character']['z'] = jail_location[0]['z'];
          var rec = {};
          rec['title'] = 'TRANSPORTED';
          rec['lines'] = ['You have been transported to a new location on the map!'];
          results.push(rec);
          has_jail = true;
        }
        if (!has_jail) {
          // relocate to the last save spot
          story['character']['x'] = saved['character']['x'];
          story['character']['y'] = saved['character']['y'];
          story['character']['z'] = saved['character']['z'];
          var rec = {};
          rec['title'] = 'TRANSPORTED';
          rec['lines'] = ['You have been transported to a new location on the map!'];
          results.push(rec);
        }
      }
    } else {
      var rec = {}
      rec['title'] = 'STEAL ' + object_name.toUpperCase();
      rec['lines'] = ['It just doesn\'t seem possible right now.'];
      results.push(rec);
    }
    return results;
  }

  /**************************
  *** TAG A MAP LOCATION
  **************************/
  function tag(statement) {
    var results = [];
    // must have the sharpie in their inventory
    if (story['character']['items'].indexOf('sharpie') > -1) {
      var map_location = story['map'].filter(function (map) { return map.x == story['character']['x'] && map.y == story['character']['y'] && map.z == story['character']['z'] });
      if (statement != '') {
        map_location[0]['notes'] = statement;
        var rec = {};
        rec['title'] = 'TAG MAP LOCATION';
        rec['lines'] = ['You pull out your handy sharpie and tag this location with: ' + statement];
        results.push(rec);
      } else {
        delete map_location[0]['notes'];
        var rec = {};
        rec['title'] = 'ERASE TAG';
        rec['lines'] = ['You scrub your tag from this map location.'];
        results.push(rec);
      }
    } else {
      var rec = {};
      rec['title'] = 'SORRY';
      rec['lines'] = ['You need to have a sharpie before you can tag map locations!'];
      results.push(rec);
    }
    return results;
  }

  /**************************
  *** TAKE AN ITEM FROM MAP LOCATION (PLACE in story['character'] ITEMS)
  **************************/
  function take(object_name) {
    var results = [];
    var bucket = [];
    // make sure item is available in the room
    var map_location = story['map'].filter(function (map) { return map.x == story['character']['x'] && map.y == story['character']['y'] && map.z == story['character']['z'] });
    if (object_name == 'all' && 'items' in map_location[0]) {
      bucket = bucket.concat(map_location[0]['items']);
    } else {
      bucket.push(object_name);
    }
    var rec = {};
    rec['title'] = 'TAKE ' + object_name.toUpperCase();
    rec['lines'] = [];
    for (var j = 0; j < bucket.length; j++) {
      if (map_location.length > 0 && 'items' in map_location[0] && map_location[0]['items'].indexOf(bucket[j]) > -1) {
        results = results.concat(check_puzzles('take',object_name));
        // item appears to be available; remove it from the room
        // remove item from this room
        var slot = map_location[0]['items'].indexOf(bucket[j]);
        map_location[0]['items'].splice(slot, 1);
        // add it to the character items
        story['character']['items'].push(bucket[j]);
        rec['lines'].push('You take ' + bucket[j] + '.');
      } else {
        rec['lines'].push(bucket[j] + ' is not available from here.');
      }
    }
    results.push(rec);
    return results;
  }

  /**************************
  *** UNEQUIP AN ITEM
  **************************/
  function unequip(object_name) {
    var results = [];
    if ('equiped' in story['character']) {
      var slot = story['character']['equiped'].indexOf(object_name);
      if (slot > -1) {
        // take the item out of the character equiped
        story['character']['equiped'].splice(slot, 1);
        var rec = {};
        rec['title'] = 'UNEQUIP ' + object_name.toUpperCase();
        rec['lines'] = ['You unequip ' + object_name + '.'];
        results.push(rec);
      } else {
        var rec = {};
        rec['title'] = 'SORRY';
        rec['lines'] = ['You were not equipped with ' + object_name + '.'];
        results.push(rec);
      }
    } else {
      story['character']['equiped'] = [];
      var rec = {};
      rec['title'] = 'SORRY';
      rec['lines'] = ['You were not equipped with ' + object_name + '.'];
      results.push(rec);
    }
    return results;
  }

  /**************************
  *** USE AN ITEM (from inventory or in room)
  **************************/
  function use(object_name) {
    var results = [];
    // make sure the object is in inventory
    var slot = story['character']['items'].indexOf(object_name);
    if (slot > -1) {
      results = results.concat(check_puzzles('use', object_name));
      if (results.length > 0) {
        story['character']['items'].splice(slot, 1);
        var slot2 = story['character']['equiped'].indexOf(object_name);
        if (slot2 > -1) {
          story['character']['equiped'].splice(slot2, 1);
        }
      } else {
        var rec = {};
        rec['title'] = 'SORRY';
        rec['lines'] = ['You can not use ' + object_name + ' here.'];
        results.push(rec);
      }
    } else {
      // check if object is in the room
      var map_location = story['map'].filter(function (map) { return map.x == story['character']['x'] && map.y == story['character']['y'] && map.z == story['character']['z'] });
      var object_in_room = false;
      if ('objects' in map_location[0]) {
        var objects_in_room = map_location[0]['objects'];
        for (var i = 0; i < objects_in_room.length; i++) {
          if (objects_in_room[i] == object_name) {
            object_in_room = true;
            var object_usable = false;
            var object_detail = story['objects'].filter(function (objects) { return objects.name == object_name });
            if (object_detail.length > 0) {
              results = results.concat(check_puzzles('use',object_name));
              if (results.length > 0) {
                object_usable = true;
              } else if (object_detail[0]['type'] == 'recovery') {
                object_usable = true;
                var rec = {};
                rec['title'] = 'USE ' + object_name.toUpperCase();
                rec['lines'] = [];
                // character can use this item to recover health
                var boost = object_detail[0]['health_bump'];
                if (boost == 0) {
                  boost = story['character']['max_health'];
                }
                story['character']['health'] += boost;
                if ((boost - (story['character']['health'] - story['character']['max_health'])) == 0) {
                  rec['lines'].push('You are currently at max health.');
                } else if (story['character']['health'] > story['character']['max_health']) {
                  rec['lines'].push('Your health is adjusted ' + (boost - (story['character']['health'] - story['character']['max_health'])) + '.');
                  story['character']['health'] = boost;
                } else {
                  rec['lines'].push('Your health is adjusted ' + object_detail[0]['health_bump'] + '.');
                }
                results.push(rec);
              }
            }
            if (!object_usable) {
              var rec = {};
              rec['title'] = 'SORRY';
              rec['lines'] = ['You are not able to use ' + object_name + '.'];
              results.push(rec);
            }
          }
        }
      }
      if (!object_in_room) {
        var rec = {};
        rec['title'] = 'SORRY';
        rec['lines'] = ['You don\'t have ' + object_name + ' in your inventory right now.'];
        results.push(rec);
      }
    }
    return results;
  }

  /**************************
  *** VIEW LOCATION ON THE MAP
  **************************/
  function view_map_location() {
    var results = [];
    var map_location = story['map'].filter(function (map) { return map.x == story['character']['x'] && map.y == story['character']['y'] && map.z == story['character']['z'] });
    if (map_location.length > 0) {
      var rec = {};
      rec['title'] = map_location[0]['name'].toUpperCase();
      rec['lines'] = [map_location[0]['description']];
      if ('items' in map_location[0] && map_location[0]['items'].length > 0) {
        for (var i = 0; i < map_location[0]['items'].length; i++) {
          rec['lines'].push('A ' + map_location[0]['items'][i].toLowerCase() + ' is here.');
        }
      }
      var enemies_in_room = story['enemies'].filter(function(enemies){return enemies.x == story['character']['x'] && enemies.y == story['character']['y'] && enemies.z == story['character']['z']});
      if (enemies_in_room.length > 0) {
        for (var i = 0; i < enemies_in_room.length; i++) {
          rec['lines'].push(toTitleCase(enemies_in_room[i]['name']) + ' is here.');
        }
      }
      var friendlies_in_room = story['friendlies'].filter(function(friendlies){return friendlies.x == story['character']['x'] && friendlies.y == story['character']['y'] && friendlies.z == story['character']['z']});
      if (friendlies_in_room.length > 0) {
        for (var i = 0; i < friendlies_in_room.length; i++) {
          rec['lines'].push(toTitleCase(friendlies_in_room[i]['name']) + ' is here.');
        }
      }
      if ('objects' in map_location[0] && map_location[0]['objects'].length > 0) {
        for (var i = 0; i < map_location[0]['objects'].length; i++) {
          rec['lines'].push('A ' + map_location[0]['objects'][i].toLowerCase() + ' is here.');
        }
      }
      results.push(rec);
      var obvious_exits = false;
      if ('exits' in map_location[0] && map_location[0]['exits'].length > 0) {
        // list what exists are available;
        var rec = {};
        rec['title'] = 'EXITS';
        rec['lines'] = [map_location[0]['exits'].join(', ').toUpperCase()];
        results.push(rec);
        obvious_exits = true;
      }
      if ('locked_exits' in map_location[0] && map_location[0]['locked_exits'].length > 0) {
        var locked = [];
        for (var i = 0; i < map_location[0]['locked_exits'].length; i++) {
          locked.push(map_location[0]['locked_exits'][i].toUpperCase());
        }
        var rec = {};
        rec['title'] = 'LOCKED EXITS';
        rec['lines'] = [locked.join(', ')];
        results.push(rec);
        obvious_exits = true;
      }
      if (!obvious_exits) {
        var rec = {};
        rec['title'] = 'EXITS';
        rec['lines'] = ['There are no obvious exits!'];
        results.push(rec);
      }
      if ('for_sale' in map_location[0] && map_location[0]['for_sale'].length > 0) {
        var available_to_buy = [];
        for (var i = 0; i < map_location[0]['for_sale'].length; i++) {
          if (map_location[0]['for_sale'][i]['available'] > 0) {
            available_to_buy.push(map_location[0]['for_sale'][i]['name'] + ' (' + map_location[0]['for_sale'][i]['buy_price'] + ' coins)');
          }
        }
        if (available_to_buy.length > 0) {
          var rec = {}
          rec['title'] = 'FOR SALE';
          rec['lines'] = [available_to_buy.join(', ') + '.'];
          results.push(rec);
        }
      }
      // display tags if they exist
      if ('notes' in map_location[0] && map_location[0]['notes'] != '') {
        var rec = {}
        rec['title'] = 'TAGGED: ';
        rec['lines'] = [map_location[0]['notes']];
        results.push(rec);
      }
      // mark the room as seen
      map_location[0]['seen'] = true;
    } else {
      var rec = {};
      rec['title'] = 'NO WAY';
      rec['lines'] = ['You\'re so cool that you\'re off the map!'];
      results.push(rec);
    }
    return results;
  }

  /**************************
  *** PARSE COMMAND LINE
  **************************/
  function attempt_command(raw_text) {
    // if the initial character is a slash, remove it
    raw_text = raw_text.replace(/^[\\|\/]/, '');
    var bits = raw_text.toLowerCase().split(' ');
    var results = [];
    // check that the initial command is valid
    cmd = bits.reverse().pop();
    bits = bits.reverse();
    // remove empty items from bits array
    var temp = [];
    for (var i = 0; i < bits.length; i++) {
      if (bits[i].trim() != '') {
        temp.push(bits[i]);
      }
    }
    bits = temp;
    var rest_of_line = bits.join(' ').trim();
    var command_detail = commands.filter(function (commands) { return commands.cmd == cmd });
    if (command_detail.length > 0) {
      // seems like a valid command; attempt it
      // start by removing the command from the line;
      switch (cmd) {
        case 'attack':
        case 'kill':
          if (bits.length > 1) {
            var attacked = '';
            var weapon = '';
            if (rest_of_line.search(' with ') > -1) {
              var bits = rest_of_line.split(' with ');
              attacked = bits[0].trim();
              weapon = bits[1].trim();
            } else {
              attacked = rest_of_line;
            }
            results = results.concat(attack('character',attacked,weapon,''));
          } else {
            results = results.concat(attack('character',rest_of_line,'',''));
          }
          break;
        case 'build':
        case 'make':
          if (rest_of_line != '') {
            results = results.concat(build(rest_of_line));
          }
          break;
        case 'burn':
          if (rest_of_line != '') {
            results = results.concat(burn(rest_of_line));
          }
          break;
        case 'buy':
          if (rest_of_line != '') {
            results = results.concat(buy(rest_of_line));
          }
          break;
        case 'cast':
          if (rest_of_line != '') {
            results = results.concat(cast(rest_of_line));
          }
          break;
        case 'consume':
        case 'drink':
        case 'eat':
          if (rest_of_line != '') {
            results = results.concat(consume(rest_of_line));
          }
          break;
        case 'dig':
          results = results.concat(dig());
          break;
        case 'disassemble':
          if (rest_of_line != '') {
            results = results.concat(disassemble(rest_of_line));
          }
          break;
        case 'drop':
        case 'place':
          if (rest_of_line != '') {
            var slot = -1;
            var required_object = '';
            if (rest_of_line.indexOf(' on ') > -1) {slot = rest_of_line.indexOf(' on ');}
            if (rest_of_line.indexOf(' at ') > -1) {slot = rest_of_line.indexOf(' at ');}
            if (rest_of_line.indexOf(' in ') > -1) {slot = rest_of_line.indexOf(' in ');}
            if (slot > -1) {
              required_object = rest_of_line.substr(slot + 4, rest_of_line.length - slot);
              rest_of_line = rest_of_line.substr(0,slot);
            }
            results = results.concat(drop(rest_of_line, cmd, required_object));
          }
          break;
        case 'equip':
          if (rest_of_line != '') {
            results = results.concat(equip(rest_of_line));
          }
          break;
        case 'examine':
        case 'l':
        case 'look':
        case 'read':
          if (bits.length > 1) {
            if (rest_of_line == 'location' || rest_of_line == 'room') {
              results = results.concat(view_map_location());
            } else {
              results = results.concat(examine(rest_of_line.replace('at ','')));
            }
          } else if (rest_of_line != '') {
            if (rest_of_line == 'location' || rest_of_line == 'room') {
              results = results.concat(view_map_location());
            } else {
              results = results.concat(examine(rest_of_line.replace('at ','')));
            }
          } else {
            results = results.concat(view_map_location());
          }
          break;
        case 'give':
          if (bits.length > 1) {
            var give_to = bits.pop();
            var item_text = bits.join(' ') + ' ';
            var item = item_text.replace(' to ',' ').trim();
            results = results.concat(give(give_to, item));
            var map_location = story['map'].filter(function (map) { return map.x == story['character']['x'] && map.y == story['character']['y'] && map.z == story['character']['z'] });
            if ('items' in map_location[0] && map_location[0]['items'].length > 0) {
              results = results.concat(take('all'));
            }
          }
          break;
        case 'help':
          results = results.concat(help(rest_of_line));
          break;
        case 'inventory':
          results = results.concat(inventory());
          break;
        case 'm':
        case 'move':
        case 'exit':
        case 'go':
          if (rest_of_line != '') {
            results = results.concat(move(rest_of_line));
          }
          break;
        case 'missions':
          results = results.concat(missions());
          break;
        case 'pray':
          rest_of_line = rest_of_line.replace('at ', '').replace('for ','').replace('to ','');
          results = results.concat(pray(rest_of_line));
          break;
        case 'pull':
          if (rest_of_line != '') {
            results = results.concat(pull(rest_of_line));
          }
          break;
        case 'push':
          if (rest_of_line != '') {
            results = results.concat(do_push(rest_of_line));
          }
          break;
        case 'say':
          results = results.concat(say(rest_of_line));
          break;
        case 'sell':
          if (rest_of_line != '') {
            results = results.concat(sell(rest_of_line));
          }
          break;
        case 'status':
          results = results.concat(character_status());
          break;
        case 'steal':
          if (rest_of_line != '') {
            results = results.concat(steal(rest_of_line));
          }
          break;
        case 'tag':
        case 'erase':
          if (rest_of_line == 'tag') {
            results = results.concat(tag(''));
          } else if (rest_of_line != '') {
            results = results.concat(tag(rest_of_line));
          }
          break;
        case 'take':
          if (rest_of_line != '') {
            results = results.concat(take(rest_of_line));
          }
          break;
        case 'throw':
          var attacked = '';
          var weapon = '';
          if (rest_of_line.search(' at ') > -1) {
            var bits = rest_of_line.split(' at ');
            weapon = bits[0].trim();
            attacked = bits[1].trim();
            results = results.concat(attack('character',attacked,weapon,'throw'));
          } else {
            if (rest_of_line != '') {
              results = results.concat(drop(rest_of_line, 'throw', ''));
            }
          }
          break;
        case 'unequip':
          if (rest_of_line != '') {
            results = results.concat(unequip(rest_of_line));
          }
          break;
        case 'use':
          if (rest_of_line != '') {
            results = results.concat(use(rest_of_line));
          }
          break;
      }
      if (results.length == 0) {
        var rec = {};
        rec['title'] = 'SORRY';
        rec['lines'] = ['I don\'t understand what "' + raw_text + '" means?!'];
        results.push(rec);
      }
    } else if (cmd == 'debug') {
      var rec = {};
      rec['title'] = 'DEBUG';
      rec['lines'] = [JSON.stringify(story)];
      results.push(rec);
    } else {
      // check against user defined puzzle commands
      results = results.concat(check_puzzles(cmd, rest_of_line));
      if (results.length == 0) {
        var rec = {};
        rec['title'] = raw_text.toUpperCase();
        rec['lines'] = ['Nothing much happens.'];
        results.push(rec);
      }
    }
    // make any required board adjustments
    results = results.concat(board_movement());
    // make sure we have saved values (for resets)
    if ('character' in saved) {
    } else {
      saved = JSON.parse(JSON.stringify(story));
    }
    return results;
  }

  function toTitleCase(str) {
    return str.replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();});
  }

  /* =============================================
     INTENTS
  ============================================= */
  var intent_resolved = false;
  if (intent == 'CommandIntent') {
    /* ===========================================
       COMMAND INTENT
       ------------------------------------------
       User has provided an command.
    =========================================== */
    var game_command = req.request.intent.slots.GameCommand.value || '';
    var game_object = req.request.intent.slots.GameObject.value || '';
    if (game_object.trim() != '') {
      game_command += ' ' + game_object;
    }

    var response = format_response(attempt_command(game_command));
    alexa_response['response']['outputSpeech']['text'] = response;
    alexa_response['response']['card']['content'] = response;
    alexa_response['response']['reprompt']['outputSpeech']['text'] = response;

    alexa_response['sessionAttributes']['saved'] = JSON.parse(JSON.stringify(story));;

    context.succeed(alexa_response);

  } else if (intent == 'GameHelpIntent' || intent == 'AMAZON.HelpIntent') {
    /* ===========================================
       HELP INTENT
       ----------------------------------------
    =========================================== */
    var help_command = req.request.intent.slots.GameCommand.value || '';

    var response = format_response(attempt_command('help ' + help_command));
    alexa_response['response']['outputSpeech']['text'] = response;
    alexa_response['response']['card']['content'] = response;
    alexa_response['response']['reprompt']['outputSpeech']['text'] = response;

    context.succeed(alexa_response);

  } else if (request_type == 'LaunchRequest') {
    /* ===========================================
       LAUNCH REQUEST
       ----------------------------------------
       Generic request; give the user instrctuions on how to get a game started.
    =========================================== */
    alexa_response['sessionAttributes']['saved'] = {};
    alexa_response['response']['outputSpeech']['text'] = 'Welcome to red troll! If you have a saved game, say continue game to pick up where you left off or say start new game to start a new game.';
    alexa_response['response']['card']['content'] = 'Welcome to red troll! If you have a saved game, say "continue game" to pick up where you left off or say, "start new game" to start a new game.';
    alexa_response['response']['reprompt']['outputSpeech']['text'] = 'Please say start new game to start a new game.';
    context.succeed(alexa_response);

  } else if (intent == 'StopIntent' || intent == 'AMAZON.StopIntent') {
    /* ===========================================
       STOP INTENT
       ------------------------------------------
       User wants to end the game.
    =========================================== */
    // TODO save game stats alexa_response['sessionAttributes']['saved']
    alexa_response['response']['outputSpeech']['text'] = 'Thank you for playing!';
    alexa_response['response']['shouldEndSession'] = true;
    context.succeed(alexa_response);

  } else if (intent == 'ContinueGameIntent') {
    /* ==========================================
       CONTINUE GAME INTENT
       ------------------------------------------
       User wants to continue a saved game.
    ========================================== */
    // TODO load saved game details for this account
    alexa_response['sessionAttributes']['saved'] = JSON.parse(JSON.stringify({}));;

  } else if (intent == 'SaveGameIntent') {
    /* ==========================================
       SAVE GAME INTENT
       ------------------------------------------
       User wants to save game at current state.
    ========================================== */
    // TODO save game stats alexa_response['sessionAttributes']['saved']

  } else if (intent == 'StartGameIntent' || intent == 'AMAZON.StartOverIntent') {
    /* ==========================================
       START GAME INTENT
       ------------------------------------------
       User wants to start a new game.
    ========================================== */
    var command = 'look';
    var response = format_response(attempt_command(command));
    alexa_response['response']['outputSpeech']['text'] = response;
    alexa_response['response']['card']['content'] = response;
    alexa_response['response']['reprompt']['outputSpeech']['text'] = response;

    alexa_response['sessionAttributes']['saved'] = JSON.parse(JSON.stringify(story));;

    context.succeed(alexa_response);

  }
};
