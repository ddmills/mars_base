// Generated by CoffeeScript 1.3.1
(function() {
  var __indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; },
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; };

  $(window).ready(function() {
    var AxisNum, EntityRef, RegisterStack, Scripted, SlowColonist, SlowEntity, SlowSentient, SlowWalker, Vect2D;
    Vect2D = window.SlowDataTypes.Vect2D;
    AxisNum = window.SlowDataTypes.AxisNum;
    EntityRef = window.SlowDataTypes.EntityRef;
    RegisterStack = window.SlowDataTypes.RegisterStack;
    SlowEntity = (function() {

      SlowEntity.name = 'SlowEntity';

      function SlowEntity(nombre, image, pos) {
        this.nombre = nombre != null ? nombre : 'thing';
        this.image = image != null ? image : 'sprite';
        this.pos = pos != null ? pos : [0, 0];
        this.EID = window.get_unique_id();
        this.props = {
          name: this.nombre,
          task: false
        };
        this.draw_hooks = [];
        this.tile_pos = [parseInt(this.pos[0] / window.Map.tilesize), parseInt(this.pos[1] / window.Map.tilesize)];
        this.debug = [];
        this.half_size = 16;
        this.no_path = false;
        this.opacity = false;
        this.sprite_size = 32;
        this.sprite_offset = [0, 0];
        this.claimed = false;
        this.state_que = [];
        this.hidden = false;
        this.block_build = false;
        this.needs_draw = true;
        this.persistant_draw = true;
        this.flags = {};
        this.init();
        this.init_2();
      }

      SlowEntity.prototype.init = function() {};

      SlowEntity.prototype.init_2 = function() {};

      SlowEntity.prototype.__update = function(delta) {
        this.pos_to_tile_pos();
        this.props['pos'] = new Vect2D(this.tile_pos[0], this.tile_pos[1]);
        this.delta_time = delta;
        this.total_time += delta;
        this.frame_count += 1;
        this.move();
        if (!this.hidden) {
          this.draw();
        }
        this.update(delta);
        return this.update_2();
      };

      SlowEntity.prototype.move = function() {};

      SlowEntity.prototype.hide = function() {
        if (!this.hidden) {
          this.hidden = true;
          if (this.persistant_draw) {
            window.Draw.use_layer('objects');
            return window.Draw.clear_box(this.pos[0], this.pos[1], this.sprite_size, this.sprite_size);
          }
        }
      };

      SlowEntity.prototype.show = function() {
        if (this.hidden) {
          this.hidden = false;
          if (this.persistant_draw) {
            return this.needs_draw = true;
          }
        }
      };

      SlowEntity.prototype.draw = function() {
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

      SlowEntity.prototype.update = function() {};

      SlowEntity.prototype.pos_to_tile_pos = function() {
        if (this.pos != null) {
          return this.tile_pos = [parseInt((this.pos[0] + this.half_size) / window.Map.tilesize), parseInt((this.pos[1] + this.half_size) / window.Map.tilesize)];
        }
      };

      SlowEntity.prototype.destroy = function() {
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

      return SlowEntity;

    })();
    Scripted = (function(_super) {

      __extends(Scripted, _super);

      Scripted.name = 'Scripted';

      function Scripted() {
        return Scripted.__super__.constructor.apply(this, arguments);
      }

      Scripted.prototype.init_2 = function() {
        this.speed = 2;
        this.parsed_script = false;
        this.parser = false;
        this.script = false;
        this.error = false;
        try {
          this.parsed_script = window.slow_parser.parse(this.script);
        } catch (error) {
          console.log('parse error: ', error, this.script);
        }
        if (this.parsed_script) {
          return this.parser = new window.Entities.slowparser(this, this.parsed_script);
        }
      };

      Scripted.prototype.update_2 = function(delta) {
        if (this.parser) {
          return this.parser.exec();
        }
      };

      Scripted.prototype.run_script = function(script) {
        var i, j, _i, _j, _len, _ref, _results;
        this.script = script;
        try {
          this.parsed_script = window.slow_parser.parse(this.script);
          this.error = false;
        } catch (error) {
          this.error = {
            line: error.line,
            column: error.column,
            message: error.name + ': ' + error.found
          };
        }
        if (this.parsed_script) {
          this.parser = new window.Entities.slowparser(this, this.parsed_script);
          this.script_vars = {};
          _ref = ['I', 'F', 'S', 'V', 'E'];
          _results = [];
          for (_i = 0, _len = _ref.length; _i < _len; _i++) {
            i = _ref[_i];
            this.script_vars[i] = [];
            for (j = _j = 0; _j <= 9; j = ++_j) {
              this.script_vars[i].push(void 0);
            }
            _results.push(this.script_vars[i].push(new RegisterStack));
          }
          return _results;
        }
      };

      Scripted.prototype.walk_path = function() {
        var near, p1, p2, tilesize;
        if (!(this.path != null)) {
          this.target = false;
          return false;
        }
        if (this.path.length === 0) {
          this.target = false;
          this.path = false;
          return false;
        }
        try {
          if (this.path[0].length === 0) {
            this.target = false;
            this.path = false;
            return false;
          }
        } catch (error) {

        }
        tilesize = window.Map.tilesize;
        try {
          p1 = this.path[0][0] * tilesize;
          p2 = this.path[0][1] * tilesize;
        } catch (error) {
          console.log("BAD PATH:", error);
          console.log(this.path);
          return false;
        }
        this.vect_to_target = new Vector((this.path[0][0] * tilesize) - this.pos[0], (this.path[0][1] * tilesize) - this.pos[1], 0);
        this.dist_to_target = this.vect_to_target.length();
        this.target_vect = this.normalize_vector(this.vect_to_target);
        this.vector = Vector.lerp(this.vector, this.target_vect, this.turn_speed);
        near = 10;
        if (this.pos[0] > p1 - near && this.pos[0] < p1 + near && this.pos[1] > p2 - near && this.pos[1] < p2 + near) {
          this.path = this.path.splice(1, this.path.length);
          this.velocity = .1;
          if (this.path.length === 0) {
            return true;
          }
        }
      };

      return Scripted;

    })(SlowEntity);
    SlowWalker = (function(_super) {

      __extends(SlowWalker, _super);

      SlowWalker.name = 'SlowWalker';

      function SlowWalker() {
        return SlowWalker.__super__.constructor.apply(this, arguments);
      }

      SlowWalker.prototype.init = function() {
        this.speed = 4;
        this.turn_speed = .04;
        this.target = 0;
        this.path = 0;
        this.vector = this.normalize_vector(new Vector(0, 1, 0));
        this.new_vector = false;
        this.wait_time = 0;
        this.total_time = 0;
        this.frame_count = 0;
        this.footprint_img = 'prints';
        this.velcoity = .1;
        this.draw_prints = 0;
        this.rotate_sprite = 1;
        this.pos = [this.pos[0] - this.pos[0] % 32, this.pos[1] - this.pos[1] % 32];
        this.sprite_size = 32;
        this.sprite_offset = [0, 0];
        this.claimed = false;
        window.Entities.sentient.push(this);
        window.Entities.sentient_hash.add(this);
        this.setup();
        return this.pocket = [];
      };

      SlowWalker.prototype.setup = function() {};

      SlowWalker.prototype.get_objects_here = function() {
        var map;
        map = window.Map.get('objects', this.tile_pos[0], this.tile_pos[1]);
        if (map && map.length) {
          return map;
        }
        return [];
      };

      SlowWalker.prototype.draw = function() {
        var hook, i, s, thing, x, y, _i, _j, _k, _len, _len1, _len2, _ref, _ref1, _ref2, _results;
        _ref = this.get_objects_here();
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          thing = _ref[_i];
          if (thing.visited) {
            thing.visited();
          }
        }
        this.draw_sprite();
        window.Draw.context.fillStyle = 'white';
        window.Draw.draw_text(this.state, this.pos[0] + 2, this.pos[1] + 43, {
          fillStyle: 'white',
          font: 'courier',
          fontsize: 8
        });
        _ref1 = this.debug;
        for (i = _j = 0, _len1 = _ref1.length; _j < _len1; i = ++_j) {
          s = _ref1[i];
          window.Draw.draw_text(s, this.pos[0] + 18, this.pos[1] + i * 11, {
            fillStyle: 'white',
            font: 'courier',
            fontsize: 8
          });
        }
        this.debug = [];
        if (this.target) {
          x = this.target[0] * window.Map.tilesize;
          y = this.target[1] * window.Map.tilesize;
        }
        _ref2 = this.draw_hooks;
        _results = [];
        for (_k = 0, _len2 = _ref2.length; _k < _len2; _k++) {
          hook = _ref2[_k];
          _results.push(this[hook]());
        }
        return _results;
      };

      SlowWalker.prototype.draw_sprite = function() {
        var rotation;
        rotation = false;
        if (this.vector && this.rotate_sprite) {
          rotation = Math.atan2(this.vector.y, this.vector.x);
          rotation += Math.PI + Math.PI / 2;
        }
        if (this.footprint_img) {
          if (this.draw_prints) {
            this.draw_prints = 0;
            window.Draw.use_layer('background');
            window.Draw.image(this.footprint_img, this.pos[0], this.pos[1], 32, 32, rotation);
          }
        }
        window.Draw.use_layer('entities');
        return window.Draw.image(this.image, this.pos[0] + this.sprite_offset[0], this.pos[1] + this.sprite_offset[0], this.sprite_size, this.sprite_size, rotation);
      };

      SlowWalker.prototype.normalize_vector = function(vector) {
        var len;
        len = vector.length();
        vector = vector.unit().multiply(this.speed);
        return vector;
      };

      SlowWalker.prototype.get_random_tile = function(distance) {
        var x, y;
        if (distance == null) {
          distance = false;
        }
        if (!distance) {
          x = parseInt(Math.random() * window.Map.width);
          y = parseInt(Math.random() * window.Map.height);
        } else {
          x = parseInt((Math.random() * distance * 2) - distance) + this.tile_pos[0];
          y = parseInt((Math.random() * distance * 2) - distance) + this.tile_pos[1];
          x = window.util.constrict(x, 0, window.Map.width);
          y = window.util.constrict(y, 0, window.Map.height);
        }
        return [x, y];
      };

      SlowWalker.prototype.path_to = function(pos) {
        var path;
        path = window.Entities.get_path(this.tile_pos[0], this.tile_pos[1], pos[0], pos[1]);
        if (path && (path.length != null) && path.length > 0) {
          this.path = path;
          return true;
        } else {
          return false;
        }
      };

      SlowWalker.prototype.radians_between_vectors = function(v1, v2) {
        var l1, l2, l3;
        l1 = v1.unit();
        l2 = v2.unit();
        l3 = l1.subtract(l2);
        return l3.length();
      };

      SlowWalker.prototype.move = function(friction) {
        var avoid, l, r;
        if (friction == null) {
          friction = .95;
        }
        this.vector = this.vector.multiply(.90);
        if (!this.vvv) {
          this.vvv = new Vector(0, 0, 0);
        }
        if (!this.dist_to_target) {
          return;
        }
        r = this.radians_between_vectors(this.vvv, this.vect_to_target);
        if (r > .5) {
          friction = 1 - r;
        }
        this.vvv = this.vvv.multiply(friction);
        this.vvv = this.vvv.add(this.vector.multiply(.2));
        if (this.vvv.length() > this.speed) {
          this.vvv = this.normalize_vector(this.vvv);
        }
        if (this.vvv.length() > this.speed / 3) {
          if (this.frame_count % 18 === 0) {
            this.draw_prints = 1;
          }
        }
        avoid = this.get_floor_avoidance();
        if ((avoid != null) && (avoid !== false && avoid !== (void 0)) && (avoid.x != null)) {
          l = avoid.length();
          if (l > 1) {
            if (l > 10) {
              avoid = avoid.unit().multiply(10);
            }
            this.pos[0] += avoid.x;
            this.pos[1] += avoid.y;
            window.Entities.sentient_hash.update_member(this);
            return;
          }
        }
        this.pos[0] += this.vvv.x;
        this.pos[1] += this.vvv.y;
        return window.Entities.sentient_hash.update_member(this);
      };

      SlowWalker.prototype.get_floor_avoidance = function() {
        var count, i, j, n_v, nl, tile, v, x, y, _i, _j;
        v = new Vector(0, 0, 0);
        count = 0;
        for (i = _i = -1; _i <= 1; i = ++_i) {
          for (j = _j = -1; _j <= 1; j = ++_j) {
            tile = window.Map.get('pathfinding', this.tile_pos[0] + i, this.tile_pos[1] + j);
            if (tile === 1) {
              x = ((this.tile_pos[0] + i) * window.Map.tilesize) - this.pos[0];
              y = ((this.tile_pos[1] + j) * window.Map.tilesize) - this.pos[1];
              n_v = new Vector(x, y, 0);
              nl = n_v.length();
              count += 1;
              n_v = n_v.unit().multiply(32 / nl);
              v = v.add(n_v);
            }
          }
        }
        if (count > 0) {
          v = v.divide(count).multiply(.15);
          return v;
        }
        return false;
      };

      SlowWalker.prototype.n_tiles_away = function(p1, p2, n) {
        if (p1[0] > p2[0] - n && p1[0] < p2[0] + n && p1[1] > p2[1] - n && p1[1] < p2[1] + n) {
          return true;
        }
      };

      SlowWalker.prototype.find_unclaimed_object = function(nombre) {
        var distance, found, local, obj, path, _i, _len;
        found = false;
        distance = 2000;
        local = window.Entities.objects_hash.get_within([this.pos[0], this.pos[1]], distance);
        if (local) {
          for (_i = 0, _len = local.length; _i < _len; _i++) {
            obj = local[_i];
            if (obj.nombre === nombre) {
              if (!obj.claimed) {
                if (!(this.job === 'place' && obj.placed === true)) {
                  path = window.Entities.get_path(this.tile_pos[0], this.tile_pos[1], obj.tile_pos[0], obj.tile_pos[1]);
                  if (path && (path.length != null) && path.length > 0) {
                    this.path = path;
                    obj.claimed = true;
                    this.claim = obj;
                    return true;
                  }
                }
              }
            }
          }
        }
        return false;
      };

      return SlowWalker;

    })(Scripted);
    SlowSentient = (function(_super) {

      __extends(SlowSentient, _super);

      SlowSentient.name = 'SlowSentient';

      function SlowSentient() {
        return SlowSentient.__super__.constructor.apply(this, arguments);
      }

      SlowSentient.prototype._debug = function(i_f_s_v_e) {
        console.log(this.nombre, ': ', i_f_s_v_e);
        return true;
      };

      SlowSentient.prototype._wander = function(i) {
        var distance;
        if (i == null) {
          i = 10;
        }
        distance = i;
        if (!this.path || !this.target) {
          this.target = this.get_random_tile(distance);
          this.path_to(this.target);
          if (!this.path) {
            this.target = false;
          }
        }
        if (this.walk_path()) {
          this.path = false;
          this.target = false;
          return true;
        }
      };

      SlowSentient.prototype._goto = function(e_v) {
        var v;
        v = e_v;
        if (typeof v === 'object' && v.x && v.y) {
          if (!this.target) {
            this.target = [v.x, v.y];
          }
        } else if (typeof v === 'object' && v.e) {
          if (!this.target) {
            this.target = [v.v.x, v.v.y];
          }
        }
        if (!this.path && this.target) {
          this.path_to([this.target[0], this.target[1]]);
        }
        if (this.path) {
          if (this.walk_path()) {
            this.path = false;
            this.target = false;
            return e_v;
          }
        } else {
          return false;
        }
      };

      SlowSentient.prototype._go_near = function(e_v) {
        var mod, v;
        v = e_v;
        if (typeof v === 'object' && v.x && v.y) {
          if (!this.target) {
            this.target = [v.x, v.y];
          }
        } else if (typeof v === 'object' && v.e) {
          if (!this.target) {
            this.target = [v.v.x, v.v.y];
          }
        }
        this.near_options = [[0, 0], [-1, 0], [1, 0], [0, -1], [0, 1], [-1, 1], [-1, -1], [1, -1], [1, 1]];
        if (!this.path && this.target) {
          if (this.near_options.length === 0) {
            return false;
          }
          mod = this.near_options.pop();
          this.path_to([this.target[0] + mod[0], this.target[1] + mod[1]]);
        }
        if (this.path) {
          if (this.walk_path()) {
            this.path = false;
            this.target = false;
            return e_v;
          }
        } else {
          return false;
        }
      };

      SlowSentient.prototype._wait = function(i) {
        var time;
        if (i == null) {
          i = 10;
        }
        time = i;
        if (!this.test_timer) {
          this.test_timer = 0;
        }
        this.test_timer += 1;
        if (this.test_timer > time) {
          this.test_timer = 0;
          return true;
        }
      };

      SlowSentient.prototype._slow_five = function(i) {
        var time;
        if (i == null) {
          i = 10;
        }
        time = i;
        if (!this.test_timer) {
          this.test_timer = 0;
        }
        this.test_timer += 1;
        if (this.test_timer > time) {
          this.test_timer = 0;
          return 5;
        }
      };

      SlowSentient.prototype._random = function(i) {
        if (i == null) {
          i = 100;
        }
        return parseInt(Math.random() * i);
      };

      SlowSentient.prototype._search = function(i_s) {
        var distance, filter, local, obj, _i, _len;
        if (typeof i_s === 'number') {
          distance = i_s;
          filter = false;
        } else if (typeof i_s === 'string') {
          distance = 400;
          filter = true;
        } else {
          return;
        }
        local = window.Entities.objects_hash.get_within([this.pos[0], this.pos[1]], distance);
        for (_i = 0, _len = local.length; _i < _len; _i++) {
          obj = local[_i];
          if (!obj.claimed && !obj.placed) {
            if (filter) {
              if (i_s === obj.nombre) {
                return new EntityRef(obj);
              }
            } else {
              return new EntityRef(obj);
            }
          }
        }
        return false;
      };

      SlowSentient.prototype._search_built = function(i_s) {
        var distance, filter, local, obj, _i, _len;
        if (typeof i_s === 'number') {
          distance = i_s;
          filter = false;
        } else if (typeof i_s === 'string') {
          distance = 400;
          filter = true;
        } else {
          return;
        }
        local = window.Entities.objects_hash.get_within([this.pos[0], this.pos[1]], distance);
        for (_i = 0, _len = local.length; _i < _len; _i++) {
          obj = local[_i];
          if (!obj.claimed && obj.placed) {
            if (filter) {
              if (i_s === obj.nombre) {
                return new EntityRef(obj);
              }
            } else {
              return new EntityRef(obj);
            }
          }
        }
        return false;
      };

      SlowSentient.prototype._use = function(e_s) {
        var e, ground, o, r, s, _i, _len;
        e = -9999;
        s = '-00000000';
        if (typeof e_s === 'object' && e_s.e) {
          e = e_s.e;
        }
        if (typeof e_s === 'string') {
          s = e_s;
        }
        ground = window.Map.get('objects', this.tile_pos[0], this.tile_pos[1]);
        if (ground === 0) {
          ground = [];
        }
        r = this.pocket.concat(ground);
        for (_i = 0, _len = r.length; _i < _len; _i++) {
          o = r[_i];
          if (o.EID === e || o.nombre === s) {
            if ((o.flags != null) && o.flags['suit']) {
              this.pocket.remove(o);
              this.wear_body = o;
              this.wear_suit();
              return e;
            } else if ((o.use != null) && typeof o.use === 'function') {
              if (o.use(this)) {
                return e;
              } else {
                return;
              }
            }
          }
        }
        return false;
      };

      SlowSentient.prototype.wear_suit = function() {
        this.suit = true;
        this.oxygen = 6000;
        this.max_oxygen = 6000;
        return this.image = 'suitwalk';
      };

      SlowSentient.prototype._pickup = function(e_s) {
        var found, i, j, obj, r, _i, _j, _k, _len;
        r = [];
        for (i = _i = -1; _i <= 1; i = ++_i) {
          for (j = _j = -1; _j <= 1; j = ++_j) {
            if (r !== 0) {
              r = r.concat(window.Map.get('objects', this.tile_pos[0] + i, this.tile_pos[1] + j));
            }
          }
        }
        found = false;
        if (r && r.length > 0) {
          for (_k = 0, _len = r.length; _k < _len; _k++) {
            obj = r[_k];
            if (obj !== 'undefined' && typeof obj === 'object') {
              if (typeof e_s === 'object') {
                if (obj.EID = e_s.e) {
                  obj.detach_from_map();
                  this.pocket.push(obj);
                  obj.pos = this.pos;
                  return e_s;
                }
              } else if (obj.nombre === e_s) {
                obj.detach_from_map();
                this.pocket.push(obj);
                obj.pos = this.pos;
                return e_s;
              }
            }
          }
        }
        return false;
      };

      SlowSentient.prototype._claim = function(e) {
        var EID, o, _i, _len, _ref;
        if (typeof e === 'object' && (e.e != null)) {
          EID = e.e;
          _ref = window.Entities.objects;
          for (_i = 0, _len = _ref.length; _i < _len; _i++) {
            o = _ref[_i];
            if (o.EID = EID) {
              if (!o.claimed) {
                o.claimed = this.EID;
                return e;
              }
            }
          }
        }
        return false;
      };

      SlowSentient.prototype._drop = function(i_s_e) {
        var found, obj, _i, _len, _ref;
        if (typeof i_s_e === 'number') {
          if (this.pocket[i_s_e] != null) {
            found = this.pocket[i_s_e];
            this.pocket.remove(found);
            found.attach_to_map([this.tile_pos[0], this.tile_pos[1]]);
            return i_s_e;
          }
        } else {
          _ref = this.pocket;
          for (_i = 0, _len = _ref.length; _i < _len; _i++) {
            obj = _ref[_i];
            if (typeof obj === 'object') {
              if (typeof i_s_e === 'object' && i_s_e.type === 'e') {
                if (i_s_e.e === obj.EID) {
                  obj.attach_to_map([this.tile_pos[0], this.tile_pos[1]]);
                  this.pocket.remove(obj);
                  return i_s_e;
                }
              }
              if (typeof i_s_e === 'string') {
                if (obj.nombre === i_s_e) {
                  obj.attach_to_map([this.tile_pos[0], this.tile_pos[1]]);
                  this.pocket.remove(obj);
                  return i_s_e;
                }
              }
            }
          }
        }
        return false;
      };

      SlowSentient.prototype._pocket = function(i_s_e) {
        var obj, _i, _len, _ref;
        if (typeof i_s_e === 'number') {
          if (this.pocket[i_s_e] != null) {
            return new EntityRef(this.pocket[i_s_e]);
            return true;
          }
        } else {
          _ref = this.pocket;
          for (_i = 0, _len = _ref.length; _i < _len; _i++) {
            obj = _ref[_i];
            if (obj !== 'undefined' && typeof obj === 'object') {
              if (typeof i_s_e === 'object' && i_s_e.type === 'e') {
                if (i_s_e.e === obj.UID) {
                  return new EntityRef(obj);
                }
              }
              if (typeof i_s_e === 'string') {
                if (obj.nombre === i_s_e) {
                  return new EntityRef(obj);
                }
              }
            }
          }
        }
        return false;
      };

      SlowSentient.prototype._get_task = function() {
        var job, task;
        if (!this.job) {
          job = window.Jobs.get_job(this);
          if (job) {
            this.job = job;
            console.log('assigned a job', this.job);
          }
        }
        if (this.job) {
          task = this.job.instructions.pop();
          if (task) {
            console.log('assign task: ', task);
            this.props['task'] = task;
            return task;
          } else {
            this.props['task'] = 0;
            this.job.complete();
            this.job = false;
            return false;
          }
        }
        return false;
      };

      SlowSentient.prototype._build = function() {
        if (this.job && (this.job.tile != null)) {
          if (this.n_tiles_away(this.tile_pos, [this.job.tile.x, this.job.tile.y], 200)) {
            this.job.tile.build(30);
            if (this.job.tile.built) {
              console.log('tile built');
              return true;
            }
            return;
          }
        }
        return false;
      };

      SlowSentient.prototype._place = function(e) {
        var obj, r, _i, _len;
        if (this.job && this.job.place_proxy) {
          if ((e != null) && typeof e === 'object' && e.type === 'e') {
            r = window.Entities.sentient_hash.get_within([this.pos[0], this.pos[1]], 64);
            if (r === 0) {
              return false;
            }
            for (_i = 0, _len = r.length; _i < _len; _i++) {
              obj = r[_i];
              if (obj.EID === r.EID) {
                console.log('found place object ', e.s);
                if (window.Placer.job_done(this.job.place_proxy)) {
                  this.job.approved = true;
                  if (obj.place != null) {
                    obj.pos = [this.job.place_proxy[1][0] * 32, this.job.place_proxy[1][1] * 32];
                    obj.pos_to_tile_pos();
                    obj.place();
                    return true;
                  }
                }
              }
            }
          }
        }
        return false;
      };

      return SlowSentient;

    })(SlowWalker);
    SlowColonist = (function(_super) {

      __extends(SlowColonist, _super);

      SlowColonist.name = 'SlowColonist';

      function SlowColonist() {
        return SlowColonist.__super__.constructor.apply(this, arguments);
      }

      SlowColonist.prototype.setup = function() {
        this.pocket = [];
        this.suit = false;
        this.oxygen = 1200;
        this.max_oxygen = this.oxygen;
        return this.walk_frame = 0;
      };

      SlowColonist.prototype.update = function(delta) {
        var len, tile, w;
        this.state = '';
        if (this.vvv) {
          len = this.vvv.length();
          if (len > .2) {
            this.walk_frame += len * .25;
            if (this.walk_frame > 12) {
              this.walk_frame = 0;
            }
          }
        }
        if (this.oxygen != null) {
          tile = window.Map.get('tiles', this.tile_pos[0], this.tile_pos[1]);
          if (tile && tile !== 0) {
            this.oxygen += 5;
          }
          if (this.oxygen > this.max_oxygen) {
            this.oxygen = this.max_oxygen;
          }
          this.oxygen -= 1;
          this.props['oxygen'] = this.oxygen;
          this.props['max_oxygen'] = this.max_oxygen;
          this.props['suit'] = this.suit;
          if (!this.job) {
            this.props['job'] = 0;
          } else {
            this.props['job'] = this.job.type;
          }
          /*
                  if @job?
                    j = @job
                    if @job.to_string
                      j = @job.to_string()
                    t = @props['task']
                    if t.to_string
                      t = t.to_string()
                    @state = j + ' / ' + t
                  else
                    @state = ''
          */

          if (this.oxygen < this.max_oxygen * .9) {
            window.Draw.use_layer('view');
            w = 32 * (this.oxygen / this.max_oxygen);
            window.Draw.draw_box(16 + this.pos[0] - w * .5, this.pos[1] + 30, w, 5, {
              fillStyle: 'red',
              strokeStyle: 'rgba(' + 32 - w + ',' + w + ',' + w + ',.4)',
              lineWidth: 0
            });
          }
          if (this.oxygen < 0) {
            this.die();
          }
        }
      };

      SlowColonist.prototype.draw_sprite = function() {
        var offset, rotation;
        offset = [parseInt(this.walk_frame) % 4, parseInt(parseInt(this.walk_frame) / 4)];
        rotation = false;
        if (this.vector && this.rotate_sprite) {
          rotation = Math.atan2(this.vector.y, this.vector.x);
          rotation += Math.PI / 2;
        }
        if (this.footprint_img) {
          if (this.draw_prints) {
            this.draw_prints = 0;
            window.Draw.use_layer('background');
            window.Draw.image(this.footprint_img, this.pos[0], this.pos[1], 32, 32, rotation);
          }
        }
        window.Draw.use_layer('entities');
        return window.Draw.sub_image(this.image, this.pos[0] + this.sprite_offset[0], this.pos[1] + this.sprite_offset[0], this.sprite_size, this.sprite_size, this.sprite_size, offset, rotation);
      };

      SlowColonist.prototype.die = function() {
        var corpse;
        if (this.suit) {
          corpse = new window.Entities.classes.Thing('a corpse', 'suitcorpse', this.pos);
        } else {
          corpse = new window.Entities.classes.Thing('a corpse', 'corpse', this.pos);
        }
        corpse.sprite_size = 48;
        corpse.sprite_offset = [0, 0];
        return this.destroy();
      };

      return SlowColonist;

    })(SlowSentient);
    window.Entities.classes.SlowEntity = SlowEntity;
    window.Entities.classes.SlowWalker = SlowWalker;
    window.Entities.classes.SlowSentient = SlowSentient;
    return window.Entities.classes.SlowColonist = SlowColonist;
  });

}).call(this);
