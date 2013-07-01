// Generated by CoffeeScript 1.3.1
(function() {
  var __indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; },
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; };

  $(window).ready(function() {
    var CallPoint, Scripted, SlowException, SlowParser;
    window.Scripter = {
      init: function() {
        var i, _i;
        this.watch = false;
        this.edit_mode = false;
        window.Events.add_listener(this);
        this.inspect = $('<div id="inspect"></div>');
        $('#UI_overlay').append(this.inspect);
        this.vars = $('<div class="script_vars"></div>');
        this.inspect.append(this.vars);
        this.script = $('<div class="script_display"><div class="linenums"></div><code></code></div>');
        this.linenums = this.script.find('.linenums');
        for (i = _i = 0; _i <= 200; i = ++_i) {
          this.linenums.append('<p>' + i + '</p>');
        }
        this.code = this.script.find('code');
        this.editarea = $('<textarea class="tabindent">');
        this.messages = $('<div class="messages"></div>');
        this.editbutton = $('<div class="codebutton">edit</div>');
        this.saveload = $('<div class="saveload"><input id="file">\
        <div class="codebutton" id="save">save</div><div class="codebutton" id="load">load</div></div>');
        this.saveload.find('#save').click(function() {
          return window.Scripter.save_script(window.Scripter.saveload.find('input').val());
        });
        this.saveload.find('#load').click(function() {
          return window.Scripter.load_script(window.Scripter.saveload.find('input').val());
        });
        this.reference = $('<div class="reference"></div>');
        this.reference.hide();
        this.tileinfo = $('<div class="tileinfo"></div>');
        this.tileinfo.hide();
        this.inspect.append(this.messages);
        this.inspect.append(this.editbutton);
        this.inspect.append(this.saveload);
        this.inspect.append(this.script);
        this.inspect.append(this.tileinfo);
        this.inspect.append(this.reference);
        this.editbutton.data('scripter', this);
        return this.editbutton.click(function() {
          var scripter;
          scripter = $(this).data('scripter');
          return scripter.toggle_edit();
        });
      },
      save_script: function(filename) {
        var script;
        if (this.watch && this.watch.script && filename && filename !== '') {
          filename = 'SLOWCODE' + filename;
          script = this.editarea.val();
          localStorage[filename] = script;
          return console.log('saved: ', localStorage[filename]);
        }
      },
      load_script: function(filename) {
        var script;
        if (this.watch && this.watch.script && filename && filename !== '') {
          filename = 'SLOWCODE' + filename;
          if (localStorage[filename] != null) {
            script = localStorage[filename];
            return this.editarea.val(script);
          }
        }
      },
      toggle_edit: function() {
        if (this.watch) {
          if (this.edit_mode === false) {
            this.inspect.animate({
              width: 510
            }, 300);
            this.reference.show();
            this.editbutton.html('compile');
            this.edit_mode = true;
            this.editarea.val(this.watch.script);
            this.editarea.height(this.code.height());
            this.code.replaceWith(this.editarea);
            return console.log(localStorage);
          } else {
            this.watch.run_script(this.editarea.val());
            if (this.watch.error) {
              return this.show(this.watch);
            } else {
              this.reference.hide();
              this.inspect.animate({
                width: 330
              }, 300);
              this.editbutton.html('edit');
              this.edit_mode = false;
              this.editarea.replaceWith(this.code);
              return this.show(this.watch);
            }
          }
        }
      },
      make_docs: function() {
        var args, data, prop, v, _results;
        this.reference.html('');
        if (this.watch) {
          for (prop in this.watch.props) {
            data = this.watch.props[prop];
            v = '?';
            if (typeof data === 'object') {
              if (data.type != null) {
                v = data.type;
              }
            } else if (typeof data === 'string') {
              v = 's';
            } else if (typeof data === 'string') {
              v = 's';
            } else if (typeof data === 'number') {
              if (__indexOf.call(v + '', '.') >= 0) {
                v = 'f';
              } else {
                v = 'i';
              }
            }
            this.reference.append('<p class="prop">@' + prop + ' = ' + v + '</p>');
          }
          _results = [];
          for (prop in this.watch) {
            if (typeof this.watch[prop] === 'function') {
              if (prop[0] === '_' && prop[1] !== '_') {
                args = window.get_function_arg_strings(this.watch[prop]);
                if (args) {
                  args.join(', ');
                } else {
                  args = '';
                }
                _results.push(this.reference.append('<p class="funct">' + prop.slice(1) + '( ' + args + ' )' + '</p>'));
              } else {
                _results.push(void 0);
              }
            } else {
              _results.push(void 0);
            }
          }
          return _results;
        }
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
              if (typeof item === 'object') {
                item = item.to_string();
              }
              $(this.vars.children()[i]).append($('<div class="entry">' + item + '</div>'));
            }
            _results.push(i += 1);
          }
          return _results;
        }
      },
      show: function(thing) {
        var column, line, make_block, message, parsed, routine, _i, _len, _results;
        this.watch = thing;
        this.make_docs();
        if (thing.script) {
          this.inspect.css('visibility', 'visible');
          this.show_vars();
        }
        if (thing.error) {
          line = thing.error.line;
          column = thing.error.column;
          message = thing.error.message;
          this.code.html(this.watch.script);
          this.messages.html(message);
          this.linenums.children().removeClass('error');
          return $(this.linenums.children()[line - 1]).addClass('error');
        } else if (thing.script && thing.parsed_script) {
          this.script.show();
          this.messages.show();
          this.vars.show();
          this.tileinfo.hide();
          this.saveload.show();
          this.code.html('');
          this.messages.html('');
          this.linenums.children().removeClass('error');
          parsed = thing.parsed_script;
          make_block = function(obj) {
            var block, chars, g, i, part, statement, sub, _i, _j, _len, _len1, _ref, _ref1;
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
                statement = $('<span class="block statement"></span>');
                chars = 0;
                for (_j = 0, _len1 = part.length; _j < _len1; _j++) {
                  g = part[_j];
                  statement.append($('<span class="word">' + g.literal + '</span>'));
                  chars += g.literal.length;
                }
                statement.append(obj.literals[i].slice(chars));
                block.append(statement);
              }
            }
            if (obj.end) {
              block.append(obj.end);
            }
            return block;
          };
          _results = [];
          for (_i = 0, _len = parsed.length; _i < _len; _i++) {
            routine = parsed[_i];
            _results.push(this.code.append(make_block(routine)));
          }
          return _results;
        } else {
          this.script.hide();
          this.messages.hide();
          return this.vars.hide();
        }
      },
      update: function() {
        var cp, i, index, si, start, _i, _ref;
        if (this.watch && this.script && this.watch.parser) {
          this.code.find('.block').removeClass('current');
          this.code.find('.word').removeClass('chunk');
          start = this.code;
          for (i = _i = 0, _ref = this.watch.parser.block_level; 0 <= _ref ? _i <= _ref : _i >= _ref; i = 0 <= _ref ? ++_i : --_i) {
            index = this.watch.parser.code_index[i];
            start = $(start.children('.block')[index]);
          }
          start.addClass('current');
          cp = this.watch.parser.callpoints.get_last();
          if (cp) {
            si = cp.statement_index;
            if (si != null) {
              return $(start.children('.word')[si]).addClass('chunk');
            }
          }
        }
        /*
              if window.Entities.objects_hash
                mt = window.Events.tile_under_mouse
                local = window.Entities.objects_hash.get_within([mt[0]*32, mt[1]*32], 64)
        
                for obj in local
                  window.Draw.use_layer 'entities'
                  window.Draw.draw_box obj.tile_pos[0] * 32, obj.tile_pos[1] * 32, 32, 32,
                    fillStyle: "transparent"
                    strokeStyle: "red"
                    lineWidth: 2
        */

      },
      show_tile: function(x, y) {
        var ob, obd, obs, stats, _i, _len;
        this.watch = false;
        this.script.hide();
        this.messages.hide();
        this.vars.hide();
        this.saveload.hide();
        this.tileinfo.show();
        stats = $('<p>' + x + ',' + y + '</p>');
        obs = window.Map.get('objects', x, y);
        obd = $('<ul></ul>');
        if (obs) {
          for (_i = 0, _len = obs.length; _i < _len; _i++) {
            ob = obs[_i];
            obd.append('<li>' + ob.nombre + '</li>');
          }
        }
        this.tileinfo.html('');
        this.tileinfo.append(stats);
        return this.tileinfo.append(obd);
      },
      mouseup: function(e) {
        var found, guy, p, results, t, _i, _len;
        if (!$('#UI_overlay').is($(e.target).parents())) {
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
            return this.show(results[0]);
          } else {
            return this.show_tile(t[0], t[1]);
          }
        }
      }
    };
    window.Scripter.init();
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
          return this.parser = new SlowParser(this, this.parsed_script);
        }
      };

      Scripted.prototype.update = function(delta) {
        if (this.parser) {
          return this.parser.exec();
        }
      };

      Scripted.prototype.run_script = function(script) {
        var i, _i, _results;
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
          this.parser = new SlowParser(this, this.parsed_script);
          this.script_vars = {
            i: [],
            f: [],
            s: [],
            v: [],
            e: []
          };
          _results = [];
          for (i = _i = 0; _i <= 9; i = ++_i) {
            this.script_vars.i.push(void 0);
            this.script_vars.f.push(void 0);
            this.script_vars.s.push(void 0);
            this.script_vars.v.push(void 0);
            _results.push(this.script_vars.e.push(void 0));
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
          console.log('bad bad bad ', this.path);
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
      };

      return Scripted;

    })(window.Entities.classes.SlowSentient);
    CallPoint = (function() {

      CallPoint.name = 'CallPoint';

      function CallPoint(index_stack, word, callee, callee_funct, callee_args, callee_return) {
        this.index_stack = index_stack != null ? index_stack : void 0;
        this.word = word != null ? word : void 0;
        this.callee = callee != null ? callee : false;
        this.callee_funct = callee_funct != null ? callee_funct : false;
        this.callee_args = callee_args != null ? callee_args : [];
        this.callee_return = callee_return != null ? callee_return : void 0;
        this.index = 0;
        this.word = void 0;
      }

      return CallPoint;

    })();
    SlowException = (function() {

      SlowException.name = 'SlowException';

      function SlowException(message) {
        this.message = message;
        this.error = true;
      }

      SlowException.prototype.to_string = function() {
        return 'ERROR';
      };

      return SlowException;

    })();
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
        this.conditionals = {};
        this.callpoints = [];
      }

      SlowParser.prototype.enter_block = function(block) {
        this.block_level += 1;
        if (this.code_index.length - 1 < this.block_level) {
          this.code_index.push(0);
        }
        this.code_index[this.block_level] = 0;
        this.scope = block;
        return this.scope_stack.push(block);
      };

      SlowParser.prototype.leave_block = function() {
        var scope;
        this.code_index[this.block_level] = 0;
        scope = this.scope;
        this.block_level -= 1;
        this.code_index[this.block_level] += 1;
        if (this.block_level === 0) {
          this.scope = false;
          return this.code_index[this.block_level] = 0;
        } else {
          this.scope_stack.pop();
          return this.scope = this.scope_stack[this.scope_stack.length - 1];
        }
      };

      SlowParser.prototype.exec = function() {
        var cp, lines, result;
        if (!this.scope) {
          if (this.routines['main']) {
            this.enter_block(this.routines['main']);
          }
        }
        if (this.callpoints.length > 0) {
          cp = this.callpoints.get_last();
          result = cp.callee[cp.callee_funct](cp.callee_args);
          if (result === void 0) {
            return;
          } else {
            cp.word.result = result;
            cp.callee_return = result;
            this.callpoints.pop();
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
        var args, assign, ev, first, funct, index, parts, pattern, register, result, slot, value, value_found, vars, _ref, _ref1;
        if ((line.type != null) && ((_ref = line.type) === 'conditional')) {
          if (line.term === 'if') {
            this.conditionals[this.block_level] = false;
          }
          if (this.conditionals[this.block_level] === false) {
            if (line.term === 'else' && line["eval"] === '') {
              this.conditionals[this.block_level] = true;
              this.enter_block(line);
              return;
            }
            ev = this.calculate(line["eval"]);
            if (ev !== false && ev !== 0 && ev !== (void 0)) {
              this.conditionals[this.block_level] = true;
              this.enter_block(line);
              return;
            } else {
              this.code_index[this.block_level] += 1;
              return;
            }
          } else {
            this.code_index[this.block_level] += 1;
            return;
          }
        } else {
          if (this.conditionals[this.block_level] != null) {
            delete this.conditionals[this.block_level];
          }
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
        if ((first.type != null) && ((_ref1 = first.type) === 'reserved')) {
          if (first.value.toLowerCase() === 'delete') {
            slot = line[1];
            if (slot.type === 'memory') {
              this.delete_var(slot);
              window.Scripter.show_vars();
              this.code_index[this.block_level] += 1;
              return;
            }
          }
        }
        result = this.calculate(line);
        if ((result !== (void 0) && result !== null) && !(result.error != null)) {
          if (this.assign) {
            this.store_var(this.assign, result);
            this.assign = false;
            window.Scripter.show_vars();
          }
          return this.code_index[this.block_level] += 1;
        }
      };

      SlowParser.prototype.store_var = function(reg, value) {
        var result;
        if (reg.slot === 'e') {
          if (value.e) {
            value = value;
          } else {
            result = result + '';
          }
        }
        if (reg.slot === 's') {
          if (value.s) {
            value = value.s;
          } else {
            value = value + '';
          }
        }
        if (reg.slot === 'v') {
          if (value.v) {
            value = value.v;
          }
        }
        if (reg.slot === 'i') {
          if (typeof value === 'object' || value === true) {
            value = 1;
          } else if (value === false) {
            value = 0;
          } else {
            value = parseInt(value);
          }
        }
        if (reg.slot === 'f') {
          if (typeof value === 'object' || value === true) {
            value = 1;
          } else if (value === false) {
            value = 0;
          } else {
            value = parseFloat(value).toFixed(2);
          }
        }
        return this.self.script_vars[reg.slot][reg.index] = value;
      };

      SlowParser.prototype.delete_var = function(reg) {
        try {
          return this.self.script_vars[reg.slot][parseInt(reg.index)] = void 0;
        } catch (error) {
          return console.log('cant delete register ', reg, error);
        }
      };

      SlowParser.prototype.untoken = function(obj, i) {
        var args, callee, callee_funct, funct, mem, point, r, stack, v;
        if (i == null) {
          i = 0;
        }
        if (typeof obj !== 'object') {
          return;
        }
        if (obj.type === 'enclosure') {
          return this.calculate(obj.value);
        }
        if (obj.type === 'number') {
          return obj.value;
        }
        if (obj.type === 'self') {
          if (this.self.props[obj.value] != null) {
            return this.self.props[obj.value];
          }
        }
        if (obj.type === 'memory') {
          mem = this.self.script_vars[obj.slot][parseInt(obj.index)];
          if (mem === void 0) {
            mem = false;
          }
          return mem;
        }
        if (obj.type === 'call') {
          funct = obj.value.value;
          v = this.self['_' + funct];
          if ((this.self['_' + funct] != null) && typeof this.self['_' + funct] === 'function') {
            callee = this.self;
            callee_funct = '_' + funct;
          } else if (this.routines[funct] != null) {
            callee = this.routines[funct];
            callee_funct = 'SLOW_ROUT';
          }
          if (callee && callee_funct) {
            if (obj.result != null) {
              r = obj.result;
              return r;
            } else {
              args = this.calculate(obj.args);
              stack = this.code_index.clone();
              point = new CallPoint(stack, obj, this.self, '_' + funct, args);
              point.statement_index = i;
              this.callpoints.push(point);
            }
          }
        }
      };

      SlowParser.prototype.calculate = function(tokens) {
        var i, next, operator, report, t, token, valid, value, _i, _j, _k, _len, _len1, _len2, _ref;
        report = '';
        for (_i = 0, _len = tokens.length; _i < _len; _i++) {
          t = tokens[_i];
          report += t.type + ' ';
        }
        value = void 0;
        valid = false;
        operator = false;
        for (i = _j = 0, _len1 = tokens.length; _j < _len1; i = ++_j) {
          token = tokens[i];
          if (value === void 0) {
            if (!valid) {
              value = this.untoken(token, i);
              valid = true;
            } else {
              return;
            }
          } else if (!operator) {
            if ((_ref = token.type) === 'operator' || _ref === 'compare' || _ref === 'assignment') {
              operator = token.value;
            }
          } else {
            next = this.untoken(token, i);
            if (next != null) {
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
              } else if (operator === '==') {
                value = value === next;
              } else if (operator === '<=') {
                value = value <= next;
              } else if (operator === '>=') {
                value = value >= next;
              } else if (operator === '<') {
                value = value < next;
              } else if (operator === '>') {
                value = value > next;
              } else if (operator === '&') {
                value = value && next;
              } else if (operator === '|') {
                value = value || next;
              } else if (operator === '=') {
                if (tokens[i - 2].type === 'memory') {
                  value = next;
                  this.assign = tokens[i - 2];
                }
              }
              operator = false;
            }
          }
        }
        for (_k = 0, _len2 = tokens.length; _k < _len2; _k++) {
          token = tokens[_k];
          delete token.result;
        }
        return value;
      };

      return SlowParser;

    })();
    return window.Entities.classes.Scripted = Scripted;
  });

}).call(this);
