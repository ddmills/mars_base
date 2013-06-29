// Generated by CoffeeScript 1.3.1
(function() {
  var __indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; },
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; };

  $(window).ready(function() {
    var Scripted, SlowEntity, SlowParser, SlowWalker;
    window.Scripter = {
      init: function() {
        this.watch = false;
        window.Events.add_listener(this);
        this.inspect = $('<div id="inspect"></div>');
        return $('#UI_overlay').append(this.inspect);
      },
      show_vars: function() {
        var i, item, type, _i, _j, _len, _ref, _results;
        if (this.watch && this.watch.script_vars) {
          this.vars.html('');
          for (i = _i = 0; _i <= 4; i = ++_i) {
            this.vars.append($('<div class="column"></div>'));
          }
          i = 0;
          _results = [];
          for (type in this.watch.script_vars) {
            $(this.vars.children()[i]).append('<p>' + type + '</p>');
            _ref = this.watch.script_vars[type];
            for (_j = 0, _len = _ref.length; _j < _len; _j++) {
              item = _ref[_j];
              if (item === void 0) {
                item = '';
              }
              $(this.vars.children()[i]).append($('<div class="entry">' + item + '</div>'));
            }
            _results.push(i += 1);
          }
          return _results;
        }
      },
      show: function(thing) {
        var make_block, parsed, routine, _i, _len, _results;
        this.watch = thing;
        this.inspect.html('');
        this.inspect.append('<p>' + thing.nombre + '</p>');
        this.inspect.append('<p>' + thing.tile_pos + '</p>');
        if (thing.script && thing.parsed_script) {
          this.inspect.css('visibility', 'visible');
          this.vars = $('<div class="script_vars"></div>');
          this.show_vars();
          this.inspect.append(this.vars);
          this.script = $('<div class="script_display"><pre><code></pre></code></div>');
          this.code = this.script.find('code');
          this.inspect.append(this.script);
          parsed = thing.parsed_script;
          make_block = function(obj) {
            var block, i, part, sub, _i, _len, _ref, _ref1;
            block = $('<span class="block"></span>');
            if (obj.begin) {
              block.append(obj.begin);
            }
            _ref = obj.block;
            for (i = _i = 0, _len = _ref.length; _i < _len; i = ++_i) {
              part = _ref[i];
              if ((_ref1 = part.type) === 'action' || _ref1 === 'routine' || _ref1 === 'conditional') {
                sub = make_block(part);
                block.append(sub);
              } else {
                block.append($('<span class="block statement">' + obj.literals[i] + '</span>'));
              }
            }
            if (obj.end) {
              block.append(obj.end);
            }
            return block;
          };
          console.log(parsed);
          _results = [];
          for (_i = 0, _len = parsed.length; _i < _len; _i++) {
            routine = parsed[_i];
            _results.push(this.code.append(make_block(routine)));
          }
          return _results;
        } else {
          return this.script = false;
        }
      },
      update: function() {
        var i, index, start, _i, _ref;
        if (this.watch && this.script && this.watch.parser) {
          this.code.find('.block').removeClass('current');
          start = this.code;
          for (i = _i = 0, _ref = this.watch.parser.block_level; 0 <= _ref ? _i <= _ref : _i >= _ref; i = 0 <= _ref ? ++_i : --_i) {
            index = this.watch.parser.code_index[i];
            start = $(start.children('.block')[index]);
          }
          return start.addClass('current');
        }
      },
      mouseup: function() {
        var found, guy, p, results, t, _i, _len;
        t = window.Events.tile_under_mouse;
        p = {
          x: t[0] * 32,
          y: t[1] * 32
        };
        found = window.Entities.sentient_hash.get_within([p.x, p.y], 32);
        results = [];
        for (_i = 0, _len = found.length; _i < _len; _i++) {
          guy = found[_i];
          if (guy.tile_pos[0] === t[0] && guy.tile_pos[1] === t[1]) {
            results.push(guy);
          }
        }
        if (results.length > 0) {
          console.log('Selected:', results);
          return this.show(results[0]);
        }
      }
    };
    window.Scripter.init();
    SlowEntity = (function() {

      SlowEntity.name = 'SlowEntity';

      function SlowEntity(nombre, image, pos) {
        this.nombre = nombre != null ? nombre : 'thing';
        this.image = image != null ? image : 'sprite';
        this.pos = pos != null ? pos : [0, 0];
        this.EID = window.get_unique_id();
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

      SlowWalker.prototype._get_objects_here = function() {
        var map;
        map = window.Map.get('objects', this.tile_pos[0], this.tile_pos[1]);
        if (map && map.length) {
          return map;
        }
        return [];
      };

      SlowWalker.prototype.draw = function() {
        var hook, i, s, thing, x, y, _i, _j, _k, _len, _len1, _len2, _ref, _ref1, _ref2, _results;
        _ref = this._get_objects_here();
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
    Scripted = (function(_super) {

      __extends(Scripted, _super);

      Scripted.name = 'Scripted';

      function Scripted() {
        return Scripted.__super__.constructor.apply(this, arguments);
      }

      Scripted.prototype.init_2 = function() {
        var i, _i;
        this.speed = 2;
        this.parsed_script = false;
        this.parser = false;
        this.script = false;
        this.script_vars = {
          i: [],
          f: [],
          s: [],
          v: [],
          e: []
        };
        for (i = _i = 0; _i <= 9; i = ++_i) {
          this.script_vars.i.push(void 0);
          this.script_vars.f.push(void 0);
          this.script_vars.s.push(void 0);
          this.script_vars.v.push(void 0);
          this.script_vars.e.push(void 0);
        }
        try {
          this.parsed_script = window.slow_parser.parse(this.script);
        } catch (error) {
          console.log('parse error: ', error, this.script);
        }
        console.log(this.parsed_script);
        if (this.parsed_script) {
          return this.parser = new SlowParser(this, this.parsed_script);
        }
      };

      Scripted.prototype.update = function(delta) {
        if (this.parser) {
          return this.parser.exec();
        }
      };

      Scripted.prototype.run_script = function(script) {
        this.script = script;
        try {
          this.parsed_script = window.slow_parser.parse(this.script);
        } catch (error) {
          console.log('parse error: ', error, this.script);
        }
        console.log(this.parsed_script);
        if (this.parsed_script) {
          return this.parser = new SlowParser(this, this.parsed_script);
        }
      };

      Scripted.prototype.walk_path = function() {
        var near, p1, p2, tilesize;
        if (!(this.path != null) || this.path.length === 0) {
          return false;
        }
        tilesize = window.Map.tilesize;
        p1 = this.path[0][0] * tilesize;
        p2 = this.path[0][1] * tilesize;
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
        } else {
          this.move(1);
        }
        return false;
      };

      Scripted.prototype._wander = function(args) {
        var amount;
        if (args == null) {
          args = [];
        }
        if (!args[0]) {
          amount = 10;
        } else {
          amount = args[0];
        }
        if (!this.path || !this.target) {
          this.target = this.get_random_tile(amount);
          this.path_to(this.target);
        }
        if (this.walk_path()) {
          this.path = false;
          this.target = false;
          return true;
        }
      };

      Scripted.prototype._wait = function(args) {
        var amount;
        if (args == null) {
          args = [];
        }
        if (!args[0]) {
          amount = 0;
        } else {
          amount = args[0];
        }
        if (!this.test_timer) {
          this.test_timer = 0;
        }
        this.test_timer += 1;
        if (this.test_timer > amount) {
          this.test_timer = 0;
          return true;
        }
        return false;
      };

      return Scripted;

    })(SlowWalker);
    SlowParser = (function() {

      SlowParser.name = 'SlowParser';

      function SlowParser(self, json) {
        var r, _i, _len, _ref;
        this.self = self;
        this.json = json;
        this.scope = false;
        this.scope_stack = [];
        this.code_index = [0];
        this.block_level = 0;
        this.routines = {};
        _ref = this.json;
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          r = _ref[_i];
          this.routines[r.action] = r;
        }
      }

      SlowParser.prototype.enter_block = function(block) {
        this.block_level += 1;
        if (this.code_index.length - 1 < this.block_level) {
          this.code_index.push(0);
        }
        this.code_index[this.block_level] = 0;
        this.scope = block;
        this.scope_stack.push(block);
        return console.log('ENTERING ', block.type, this.code_index, '|', this.block_level);
      };

      SlowParser.prototype.leave_block = function() {
        var scope;
        this.code_index[this.block_level] = 0;
        scope = this.scope;
        this.block_level -= 1;
        console.log('Leaving ', scope.type, this.code_index, '|', this.block_level);
        if (this.block_level === 0) {
          this.scope = false;
          return this.code_index[this.block_level] = 0;
        } else {
          return this.scope = this.scope_stack.pop();
        }
      };

      SlowParser.prototype.exec = function() {
        var lines;
        if (!this.scope) {
          if (this.routines['main']) {
            this.enter_block(this.routines['main']);
          }
        }
        if (this.scope) {
          lines = this.scope.block;
          if (lines.length > this.code_index[this.block_level]) {
            return this.run_statement(lines[this.code_index[this.block_level]]);
          } else {
            return this.leave_block();
          }
        }
      };

      SlowParser.prototype.run_statement = function(line) {
        var args, assign, first, funct, i, index, part, parts, pattern, register, remains, subpart, v, value, value_found, vars, _i, _j, _len, _len1, _ref, _ref1;
        if ((line.type != null) && ((_ref = line.type) === 'conditional')) {
          this.enter_block(line);
          return;
        }
        index = 0;
        parts = line.length;
        pattern = false;
        funct = false;
        register = false;
        assign = false;
        value = void 0;
        value_found = false;
        args = false;
        vars = [];
        first = line[0];
        if (typeof first !== 'object') {
          console.log('ERROR parsing first token: ', first);
        }
        if (first.type === 'word') {
          pattern = 'call';
          funct = first.value;
        }
        if (first.type === 'memory') {
          pattern = 'assign';
          register = first;
        }
        for (i = _i = 0, _len = line.length; _i < _len; i = ++_i) {
          part = line[i];
          if (i !== 0) {
            if (pattern === 'call' && args === false) {
              if (part.type === 'enclosure') {
                args = [];
                _ref1 = part.value;
                for (_j = 0, _len1 = _ref1.length; _j < _len1; _j++) {
                  subpart = _ref1[_j];
                  args.push(this.untoken(subpart));
                }
              }
            } else if (pattern === 'assign') {
              if (!assign) {
                if (part.type === 'assignment') {
                  assign = part.value;
                }
              } else if (value_found === false) {
                remains = line.slice(i, line.length);
                value = this.calculate(remains);
                value_found = true;
              }
            } else {
              console.log('parsing leftover: ', part.type, part.value);
            }
          }
        }
        if (pattern === 'call') {
          if (!args) {
            args = [];
          }
          v = this.self['_' + funct];
          if ((this.self['_' + funct] != null) && typeof this.self['_' + funct] === 'function') {
            if (this.self['_' + funct](args)) {
              this.code_index[this.block_level] += 1;
              console.log('STATEMENT: ', this.code_index, this.code_index, '|', this.block_level);
            }
          }
        }
        if (pattern === 'assign') {
          if (register && assign && value) {
            v = this.self.script_vars[register.slot][register.index];
            if (assign === '+=') {
              v += value;
            } else if (assign === '-=') {
              v -= value;
            } else if (assign === '/=') {
              v /= value;
            } else if (assign === '*=') {
              v *= value;
            } else {
              v = value;
            }
            this.store_var(register, value);
            window.Scripter.show_vars();
          }
          this.code_index[this.block_level] += 1;
          return console.log('STATEMENT: ', this.code_index, '|', this.block_level);
        }
      };

      SlowParser.prototype.store_var = function(reg, value) {
        if (reg.slot === 'i') {
          value = parseInt(value);
        }
        if (reg.slot === 'f') {
          value = parseFloat(value).toFixed(2);
        }
        return this.self.script_vars[reg.slot][reg.index] = value;
      };

      SlowParser.prototype.untoken = function(obj) {
        if (typeof obj !== 'object') {
          return;
        }
        if (obj.type === 'enclosure') {
          return this.calculate(obj.value);
        }
        if (obj.type === 'number') {
          return obj.value;
        }
        if (obj.type === 'memory') {
          return this.self.script_vars[obj.slot][obj.index];
        }
      };

      SlowParser.prototype.calculate = function(tokens) {
        var next, operator, report, t, token, valid, value, _i, _j, _len, _len1;
        report = '';
        for (_i = 0, _len = tokens.length; _i < _len; _i++) {
          t = tokens[_i];
          report += t.value + ' ';
        }
        console.log('calc:', report);
        value = void 0;
        valid = false;
        operator = false;
        for (_j = 0, _len1 = tokens.length; _j < _len1; _j++) {
          token = tokens[_j];
          if (value === void 0) {
            if (!valid) {
              value = this.untoken(token);
              valid = true;
            } else {
              return;
            }
          } else if (!operator) {
            if (token.type === 'operator') {
              operator = token.value;
            } else {
              return;
            }
          } else {
            next = this.untoken(token);
            if (operator === '+') {
              value += next;
            } else if (operator === '-') {
              value -= next;
            } else if (operator === '*') {
              value *= next;
            } else if (operator === '/') {
              value /= next;
            } else if (operator === '%') {
              value %= next;
            }
            operator = false;
          }
        }
        console.log('  = ', value);
        return value;
      };

      return SlowParser;

    })();
    window.Entities.classes.SlowEntity = SlowEntity;
    window.Entities.classes.SlowWalker = SlowWalker;
    return window.Entities.classes.Scripted = Scripted;
  });

}).call(this);
