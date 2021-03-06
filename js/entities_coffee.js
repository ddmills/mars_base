// Generated by CoffeeScript 1.3.1
(function() {
  var Entity, Hack, Hash, Thing,
    __indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; },
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; };

  Entity = (function() {

    Entity.name = 'Entity';

    function Entity(nombre, image, pos) {
      this.nombre = nombre != null ? nombre : 'thing';
      this.image = image != null ? image : 'sprite';
      this.pos = pos != null ? pos : [0, 0];
      this.EID = window.get_unique_id();
      this.props = {
        name: this.nombre
      };
      this.draw_hooks = [];
      this.tile_pos = [0, 0];
      this.debug = [];
      this.half_size = 16;
      this.no_path = false;
      this.opacity = false;
      this.sprite_size = 32;
      this.sprite_offset = [0, 0];
      this.claimed = false;
      this.placed = false;
      this.hidden = false;
      this.block_build = false;
      this.needs_draw = true;
      this.persistant_draw = true;
      this.flags = {};
      this.init();
      this.init_2();
      this.setup_1();
    }

    Entity.prototype.init = function() {};

    Entity.prototype.init_2 = function() {};

    Entity.prototype.setup_1 = function() {};

    Entity.prototype.__update = function(delta) {
      this.pos_to_tile_pos();
      this.delta_time = delta;
      this.total_time += delta;
      this.frame_count += 1;
      this.move(this.friction);
      if (!this.hidden) {
        this.draw();
      }
      this.update(delta);
      return this.update_2();
    };

    Entity.prototype.move = function() {};

    Entity.prototype.hide = function() {
      if (!this.hidden) {
        this.hidden = true;
        if (this.persistant_draw) {
          window.Draw.use_layer('objects');
          return window.Draw.clear_box(this.pos[0], this.pos[1], this.sprite_size, this.sprite_size);
        }
      }
    };

    Entity.prototype.show = function() {
      if (this.hidden) {
        this.hidden = false;
        if (this.persistant_draw) {
          return this.needs_draw = true;
        }
      }
    };

    Entity.prototype.draw = function() {
      var drawn, hook, _i, _len, _ref, _results;
      if (this.persistant_draw === true) {
        if (this.needs_draw) {
          window.Draw.use_layer('objects');
          drawn = window.Draw.image(this.image, this.pos[0] + this.sprite_offset[0], this.pos[1] + this.sprite_offset[0], this.sprite_size, this.sprite_size, this.opacity);
          if (drawn) {
            this.needs_draw = false;
          }
        }
      } else {
        window.Draw.use_layer('entities');
        drawn = window.Draw.image(this.image, this.pos[0] + this.sprite_offset[0], this.pos[1] + this.sprite_offset[0], this.sprite_size, this.sprite_size, this.opacity);
      }
      _ref = this.draw_hooks;
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        hook = _ref[_i];
        _results.push(this[hook]());
      }
      return _results;
    };

    Entity.prototype.update = function() {};

    Entity.prototype.update_2 = function() {};

    Entity.prototype.pos_to_tile_pos = function() {
      if (this.pos != null) {
        return this.tile_pos = [parseInt((this.pos[0] + this.half_size) / window.Map.tilesize), parseInt((this.pos[1] + this.half_size) / window.Map.tilesize)];
      }
    };

    Entity.prototype.__destroy = function() {
      var obj_in_map;
      console.log('destroying ', this);
      window.Entities.objects_hash.remove(this);
      window.Entities.sentient_hash.remove(this);
      if (this.no_path) {
        window.Map.set('pathfinding', this.tile_pos[0], this.tile_pos[1], 0);
      }
      console.log(__indexOf.call(window.Entities.sentient, this) >= 0);
      window.Entities.objects.remove(this);
      window.Entities.sentient.remove(this);
      if (this.persistant_draw) {
        window.Draw.clear_box(this.pos[0], this.pos[1], this.sprite_size, this.sprite_size);
      }
      obj_in_map = window.Map.get('objects', this.tile_pos[0], this.tile_pos[1]);
      if (obj_in_map) {
        obj_in_map.remove(this);
      }
      return delete this;
    };

    Entity.prototype.destroy = function() {
      return this.__destroy();
    };

    return Entity;

  })();

  Thing = (function(_super) {

    __extends(Thing, _super);

    Thing.name = 'Thing';

    function Thing() {
      return Thing.__super__.constructor.apply(this, arguments);
    }

    Thing.prototype.init = function() {
      return this.attach_to_map();
    };

    Thing.prototype.attach_to_map = function(tpos) {
      var i, j, obj_in_map, _i, _j, _ref, _ref1, _ref2, _ref3;
      if (tpos == null) {
        tpos = false;
      }
      if (tpos) {
        this.pos = [tpos[0] * 32, tpos[1] * 32];
      } else {
        this.pos = [this.pos[0], this.pos[1]];
      }
      this.pos_to_tile_pos();
      tpos = this.tile_pos;
      this.show();
      window.Entities.objects.push(this);
      window.Entities.objects_hash.add(this);
      if (this.grid_area) {
        for (i = _i = _ref = this.grid_area[0], _ref1 = this.grid_area[1]; _ref <= _ref1 ? _i <= _ref1 : _i >= _ref1; i = _ref <= _ref1 ? ++_i : --_i) {
          for (j = _j = _ref2 = this.grid_area[2], _ref3 = this.grid_area[3]; _ref2 <= _ref3 ? _j <= _ref3 : _j >= _ref3; j = _ref2 <= _ref3 ? ++_j : --_j) {
            obj_in_map = window.Map.get('objects', tpos[0] + i, tpos[1] + j);
            if (!obj_in_map) {
              window.Map.set('objects', tpos[0] + i, tpos[1] + j, [this]);
            } else {
              if (__indexOf.call(obj_in_map, this) < 0) {
                obj_in_map.push(this);
              }
            }
          }
        }
      } else {
        obj_in_map = window.Map.get('objects', tpos[0], tpos[1]);
        if (!obj_in_map) {
          window.Map.set('objects', tpos[0], tpos[1], [this]);
        } else {
          if (__indexOf.call(obj_in_map, this) < 0) {
            obj_in_map.push(this);
          }
        }
      }
      if (this.no_path) {
        return window.Map.set('pathfinding', this.tile_pos[0], this.tile_pos[1], 1);
      }
    };

    Thing.prototype.detach_from_map = function() {
      var i, j, obj_in_map, _i, _j, _ref, _ref1, _ref2, _ref3;
      this.hide();
      window.Entities.objects.remove(this);
      window.Entities.objects_hash.remove(this);
      if (this.grid_area) {
        for (i = _i = _ref = this.grid_area[0], _ref1 = this.grid_area[1]; _ref <= _ref1 ? _i <= _ref1 : _i >= _ref1; i = _ref <= _ref1 ? ++_i : --_i) {
          for (j = _j = _ref2 = this.grid_area[2], _ref3 = this.grid_area[3]; _ref2 <= _ref3 ? _j <= _ref3 : _j >= _ref3; j = _ref2 <= _ref3 ? ++_j : --_j) {
            obj_in_map = window.Map.get('objects', this.tile_pos[0] + i, this.tile_pos[1] + j);
            if (obj_in_map && obj_in_map.length > 0) {
              obj_in_map.remove(this);
              if (obj_in_map.length === 0) {
                window.Map.set('objects', this.tile_pos[0] + i, this.tile_pos[1] + j, 0);
              }
            }
          }
        }
      } else {
        obj_in_map = window.Map.get('objects', this.tile_pos[0], this.tile_pos[1]);
        if (obj_in_map && obj_in_map.length > 0) {
          obj_in_map.remove(this);
          if (obj_in_map.length === 0) {
            window.Map.set('objects', this.tile_pos[0], this.tile_pos[1], 0);
          }
        }
      }
      if (this.no_path) {
        return window.Map.set('pathfinding', this.tile_pos[0], this.tile_pos[1], 0);
      }
    };

    return Thing;

  })(Entity);

  Hack = (function() {

    Hack.name = 'Hack';

    function Hack() {}

    return Hack;

  })();

  Hash = (function(_super) {

    __extends(Hash, _super);

    Hash.name = 'Hash';

    function Hash(size) {
      this.size = size;
      this.data = {};
      this.members = {};
    }

    Hash.prototype.add = function(obj) {
      var bucket;
      if (!this.members[obj.EID]) {
        bucket = this.pos_to_bucket(obj.pos);
        this.members[obj.EID] = bucket;
        if (!this.data[bucket]) {
          this.data[bucket] = [];
        }
        return this.data[bucket].push(obj);
      } else {
        return console.log('cant add to hash: ', obj);
      }
    };

    Hash.prototype.remove = function(obj) {
      var bucket;
      if (this.members[obj.EID]) {
        bucket = this.members[obj.EID];
        this._remove(this.data[this.members[obj.EID]], obj);
        return delete this.members[obj.EID];
      }
    };

    Hash.prototype.pos_to_bucket = function(pos) {
      var bucket;
      return bucket = [parseInt(pos[0] / this.size), parseInt(pos[1] / this.size)];
    };

    Hash.prototype.put_in_data = function(obj, bucket) {
      if (!this.data[bucket]) {
        this.data[bucket] = [];
      }
      if (__indexOf.call(this.data[bucket], obj) < 0) {
        this.data[bucket].push(obj);
      }
      return this.members[obj.EID] = bucket;
    };

    Hash.prototype.update_member = function(obj) {
      var bucket, without;
      if (this.members[obj.EID] != null) {
        bucket = this.pos_to_bucket(obj.pos);
        if (!this.compare(this.members[obj.EID], bucket)) {
          if (this.data[this.members[obj.EID]]) {
            without = this._remove(this.data[this.members[obj.EID]], obj);
            if (without) {
              this.data[this.members[obj.EID]] = without;
            }
            return this.put_in_data(obj, bucket);
          }
        }
      }
    };

    Hash.prototype._remove = function(listing, obj) {
      var index;
      index = listing.indexOf(obj);
      if (index !== -1) {
        listing = listing.splice(index, 1);
      }
      return false;
    };

    Hash.prototype.compare = function(list1, list2) {
      if (list1[0] === list2[0] && list1[1] === list2[1]) {
        return true;
      }
      return false;
    };

    Hash.prototype.get_within = function(pos, dist, filter) {
      var b_radius, bucket, i, j, obj, results, _i, _j, _k, _len, _ref, _ref1, _ref2, _ref3, _ref4;
      if (filter == null) {
        filter = false;
      }
      bucket = this.pos_to_bucket(pos);
      b_radius = Math.floor(dist / this.size);
      if (b_radius === 0) {
        b_radius = 1;
      }
      results = [];
      for (i = _i = _ref = bucket[0] - b_radius, _ref1 = bucket[0] + b_radius; _ref <= _ref1 ? _i <= _ref1 : _i >= _ref1; i = _ref <= _ref1 ? ++_i : --_i) {
        for (j = _j = _ref2 = bucket[1] - b_radius, _ref3 = bucket[1] + b_radius; _ref2 <= _ref3 ? _j <= _ref3 : _j >= _ref3; j = _ref2 <= _ref3 ? ++_j : --_j) {
          if (this.data[[i, j]] != null) {
            if (filter) {
              _ref4 = this.data[[i, j]];
              for (_k = 0, _len = _ref4.length; _k < _len; _k++) {
                obj = _ref4[_k];
                if (obj.nombre === filter) {
                  results.push(obj);
                }
              }
            } else {
              results = results.concat(this.data[[i, j]]);
            }
          }
        }
      }
      if (results.length > 0) {
        return results;
      } else {
        return false;
      }
    };

    Hash.prototype.get_closest = function(pos, obj_list) {};

    return Hash;

  })(Hack);

  window.Entities = {
    init: function() {
      window.Events.add_listener(this);
      this.classes = {};
      this.path_finder = new PF.JumpPointFinder({
        allowDiagonal: false,
        dontCrossCorners: true
      });
      this.sentient = [];
      this.objects = [];
      this.sentient_hash = new Hash(64);
      this.objects_hash = new Hash(64);
      this.classes.Entity = Entity;
      return this.classes.Thing = Thing;
    },
    update: function(delta) {
      var thing, _i, _j, _len, _len1, _ref, _ref1, _results;
      if (this.objects != null) {
        _ref = this.objects;
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          thing = _ref[_i];
          thing.__update(delta);
        }
      }
      if (this.sentient != null) {
        _ref1 = this.sentient;
        _results = [];
        for (_j = 0, _len1 = _ref1.length; _j < _len1; _j++) {
          thing = _ref1[_j];
          if (thing !== void 0) {
            _results.push(thing.__update(delta));
          } else {
            _results.push(void 0);
          }
        }
        return _results;
      }
    },
    get_path: function(x, y, x2, y2) {
      var grid;
      grid = new PF.Grid(window.Map.width, window.Map.height, window.Map.arrays['pathfinding']);
      try {
        return this.path_finder.findPath(x, y, x2, y2, grid);
      } catch (error) {
        return false;
      }
    },
    add_class: function(name, ancestor) {
      if (ancestor == null) {
        ancestor = 'Entity';
      }
      if (this.classes[name] != null) {
        return false;
      }
      if (this.classes[ancestor] != null) {
        eval("this.classes[name] = (function(_super) {          __extends(" + name + ", _super);          function " + name + "() {            return " + name + ".__super__.constructor.apply(this, arguments);          }          return " + name + ";        })(this.classes[ancestor]);");
        return this.classes[name];
      }
    },
    object_from_UID: function(id) {
      var thing, _i, _len, _ref;
      _ref = this.objects;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        thing = _ref[_i];
        if (thing.UID === id) {
          return thing;
        }
      }
      return false;
    }
  };

  $(window).ready(function() {
    window.Draw.add_image('tracks', "./textures/tracks.png");
    window.Draw.add_image('prints', "./textures/prints.png");
    window.Draw.add_image('colonist', "./textures/astronauts/colonist.png");
    window.Draw.add_image('shadow', "./textures/astronauts/shadow.png");
    window.Draw.add_image('engineer', "./textures/astronauts/engineer.png");
    window.Draw.add_image('rock', "./textures/objects/rock.png");
    window.Draw.add_image('rocksheet', "./textures/ground/rocksheet.png");
    window.Draw.add_image('wrench', "./textures/objects/wrench.png");
    window.Draw.add_image('launchpad', "./textures/objects/launchpad.png");
    window.Draw.add_image('corpse', "./textures/astronauts/corpse.png");
    window.Draw.add_image('suitcorpse', "./textures/astronauts/colonist_suit_dead.png");
    window.Draw.add_image('crate', "./textures/objects/crate_closed.png");
    window.Draw.add_image('airtanks', "./textures/objects/airtanks.png");
    window.Draw.add_image('emptytanks', "./textures/objects/emptytanks.png");
    window.Draw.add_image('solarpanel', "./textures/objects/solarpanel.png");
    window.Draw.add_image('wrench', "./textures/objects/wrench.png");
    window.Draw.add_image('door', "./textures/objects/door.png");
    window.Draw.add_image('locker', "./textures/objects/locker.png");
    window.Draw.add_image('barewalk', "./textures/astronauts/colonist_bare_walk.png");
    window.Draw.add_image('suitwalk', "./textures/astronauts/colonist_suit_walk.png");
    window.Draw.add_image('door_h', "./textures/objects/door_h.png");
    window.Draw.add_image('door_v', "./textures/objects/door_v.png");
    return window.Entities.init();
  });

}).call(this);
