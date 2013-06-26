// Generated by CoffeeScript 1.3.3
(function() {
  var names;

  names = ['Jack', 'Rupert', 'Iona', 'Jennie', 'Casie', 'Numbers', 'Naomi', 'Milissa', 'Janina', 'Lauren', 'Herman', 'Tawnya', 'Bernadine', 'Marjory', 'Jennell', 'Ricardo', 'Rita', 'Coreen', 'Tennille', 'Shondra', 'Donny', 'Florine'];

  $(window).ready(function() {
    var E, advanced, cx, cy, door, i, j, launchpad, name, solarpanel, suit, wrench, x, y, _i, _j, _k, _l, _m, _n, _o, _results;
    E = window.Entities.classes;
    cx = (window.Map.width * 32) / 2;
    cy = (window.Map.height * 32) / 2;
    launchpad = new E.Launchpad('Launchpad', 'launchpad', [cx, cy]);
    launchpad.sprite_size = 128;
    launchpad.sprite_offset = [-64, -64];
    wrench = new E.Thing('wrench', 'wrench', [cx - (4 * 32), cy + (0 * 32)]);
    solarpanel = new E.Thing('solarpanel', 'solarpanel', [cx - (2 * 32), cy - (8 * 32)]);
    for (i = _i = 5; _i <= 8; i = ++_i) {
      for (j = _j = 0; _j <= 1; j = ++_j) {
        door = new E.Placeable('door', 'door', [cx + ((i - 2) * 32), cy + ((j - 2) * 32)]);
      }
    }
    for (i = _k = 5; _k <= 8; i = ++_k) {
      for (j = _l = 5; _l <= 5; j = ++_l) {
        door = new E.Airtank('airtanks', 'airtanks', [cx + ((i - 2) * 32), cy + ((j - 2) * 32)]);
      }
    }
    for (i = _m = 0; _m <= 3; i = ++_m) {
      for (j = _n = 0; _n <= 1; j = ++_n) {
        suit = new E.Thing('suit', 'engineer', [cx + ((i - 2) * 32), cy + ((j - 2) * 32)]);
      }
    }
    _results = [];
    for (i = _o = 0; _o <= 7; i = ++_o) {
      x = parseInt(Math.random() * 600 + (window.Map.width * window.Map.tilesize / 2) - 300);
      y = parseInt(Math.random() * 600 + (window.Map.width * window.Map.tilesize / 2) - 300);
      name = names[parseInt(Math.random() * names.length)];
      advanced = new E.Engineer(name, 'barewalk', [x, y]);
      advanced.speed = 1.5;
      advanced.sprite_offset = [0, 0];
      _results.push(advanced.sprite_size = 32);
    }
    return _results;
  });

}).call(this);
