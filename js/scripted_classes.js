// Generated by CoffeeScript 1.3.1
(function() {
  var __indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; },
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; };

  $(window).ready(function() {
    var EntityRef, SlowEntity, SlowSentient, SlowWalker, Vect2D;
    SlowEntity = (function() {

      SlowEntity.name = 'SlowEntity';

      function SlowEntity(nombre, image, pos) {
        this.nombre = nombre != null ? nombre : 'thing';
        this.image = image != null ? image : 'sprite';
        this.pos = pos != null ? pos : [0, 0];
        this.EID = window.get_unique_id();
        this.props = {
          name: this.nombre
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
        this.init();
        this.init_2();
      }

      SlowEntity.prototype.init = function() {};

      SlowEntity.prototype.init_2 = function() {};

      SlowEntity.prototype.__update = function(delta) {
        this.pos_to_tile_pos();
        this.delta_time = delta;
        this.total_time += delta;
        this.frame_count += 1;
        if (!this.hidden) {
          this.draw();
        }
        return this.update(delta);
      };

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
    SlowWalker = (function(_super) {

      __extends(SlowWalker, _super);

      SlowWalker.name = 'SlowWalker';

      function SlowWalker() {
        return SlowWalker.__super__.constructor.apply(this, arguments);
      }

      SlowWalker.prototype.init = function() {
        this.state = 'idle';
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
        return this.setup();
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
          this.state = 'moving';
          return true;
        } else {
          this.state = 'wait';
          return false;
        }
      };

      SlowWalker.prototype.path_close_to = function(pos) {
        var i, j, path, _i, _j;
        path = window.Entities.get_path(this.tile_pos[0], this.tile_pos[1], pos[0], pos[1]);
        if (path && (path.length != null) && path.length > 0) {
          return path;
        } else {
          for (i = _i = -1; _i <= 1; i = ++_i) {
            for (j = _j = -1; _j <= 1; j = ++_j) {
              path = window.Entities.get_path(this.tile_pos[0], this.tile_pos[1], pos[0] + i, pos[1] + j);
              if (path && (path.length != null) && path.length > 0) {
                return path;
              }
            }
          }
        }
        return false;
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

    })(SlowEntity);
    Vect2D = (function() {

      Vect2D.name = 'Vect2D';

      function Vect2D(x, y) {
        this.x = x;
        this.y = y;
      }

      return Vect2D;

    })();
    EntityRef = (function() {

      EntityRef.name = 'EntityRef';

      function EntityRef(entity) {
        this.e = entity.EID;
        this.v = new Vect2D(entity.tile_pos[0], entity.tile_pos[0]);
        this.s = entity.nombre;
      }

      return EntityRef;

    })();
    SlowSentient = (function(_super) {

      __extends(SlowSentient, _super);

      SlowSentient.name = 'SlowSentient';

      function SlowSentient() {
        return SlowSentient.__super__.constructor.apply(this, arguments);
      }

      SlowSentient.prototype._wander = function(i) {
        var distance;
        if (i == null) {
          i = 10;
        }
        distance = i;
        if (!this.path || !this.target) {
          this.target = this.get_random_tile(distance);
          this.path_to(this.target);
        }
        if (this.walk_path()) {
          this.path = false;
          this.target = false;
          return true;
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

      SlowSentient.prototype._test = function() {
        return 8;
      };

      SlowSentient.prototype._search = function(i, s) {
        var distance, local, obj, _i, _len;
        if (s == null) {
          s = false;
        }
        distance = i;
        local = window.Entities.objects_hash.get_within([this.pos[0], this.pos[1]], distance);
        for (_i = 0, _len = local.length; _i < _len; _i++) {
          obj = local[_i];
          if (s && typeof s === 'string') {
            if (s === obj.nombre) {
              return new EntityRef(obj);
            }
          } else {
            return new EntityRef(obj);
          }
        }
        return false;
      };

      SlowSentient.prototype._use_object = function(e) {
        var found, obj, r, _i, _len;
        r = window.Map.get('objects', this.tile_pos[0], this.tile_pos[1]);
        found = false;
        if (r && r.length > 0) {
          for (_i = 0, _len = r.length; _i < _len; _i++) {
            obj = r[_i];
            if (obj.nombre === this.want) {
              found = true;
              if (obj.use) {
                if (obj.use(this)) {
                  this.state = 'idle';
                  this.forget(this.want, this.tile_pos);
                  return;
                } else {
                  return;
                }
              }
            }
          }
          if (!found) {
            this.state = 'job_fail';
          }
        }
        return this.state = 'job_fail';
      };

      SlowSentient.prototype._find_object = function() {
        var found;
        if (this.want) {
          found = this.find_unclaimed_object(this.want);
          if (found) {
            this.que_add_first('moving');
            this._found_obj = this.want;
          }
        }
      };

      SlowSentient.prototype._pickup = function() {
        var found, obj, r, _i, _len;
        r = window.Map.get('objects', this.tile_pos[0], this.tile_pos[1]);
        found = false;
        if (r && r.length > 0) {
          for (_i = 0, _len = r.length; _i < _len; _i++) {
            obj = r[_i];
            if (obj.nombre === this.want) {
              found = true;
              obj.detach_from_map();
              this.pocket.push(obj);
              obj.pos = this.pos;
              this.want = false;
              this.state = 'idle';
              return;
            }
          }
        }
      };

      return SlowSentient;

    })(SlowWalker);
    window.Entities.classes.SlowEntity = SlowEntity;
    window.Entities.classes.SlowWalker = SlowWalker;
    return window.Entities.classes.SlowSentient = SlowSentient;
  });

}).call(this);