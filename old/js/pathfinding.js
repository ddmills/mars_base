// Generated by CoffeeScript 1.3.3
(function() {
  var Guy;

  Guy = (function() {

    function Guy(name, color) {
      this.name = name;
      this.color = color;
      console.log(color);
      this.pos = window.mapper.get_random_pos();
      this.pix_pos = [this.pos[0] * 16, this.pos[1] * 16];
      this.speed = 1 + Math.random() * 4;
      this.state = 'idle';
      this.guy_image = window.mapper.guy_image;
    }

    Guy.prototype.update = function() {
      var d, dd, img, k, mx, my, pmx, pmy;
      if (this.state === 'idle') {
        this.target = window.mapper.get_random_pos();
        if (this.target && this.pos) {
          if (window.mapper.map[this.target[1]][this.target[0]] === 0) {
            try {
              this.path = window.mapper.get_path(this.pos[0], this.pos[1], this.target[0], this.target[1]);
              this.path = this.path.reverse();
              this.state = 'has_target';
            } catch (e) {
              console.log('nope', e);
              console.log(this.pos, this.target);
            }
          }
        }
      }
      d = this.pos[0] * 16 - this.pix_pos[0];
      dd = this.pos[1] * 16 - this.pix_pos[1];
      pmx = 0;
      pmy = 0;
      if (d < -this.speed) {
        this.pix_pos[0] -= this.speed;
        pmx = 1;
      } else if (d > this.speed) {
        this.pix_pos[0] += this.speed;
        pmx = 1;
      }
      if (dd < -this.speed) {
        this.pix_pos[1] -= this.speed;
        pmy = 1;
      } else if (dd > this.speed) {
        this.pix_pos[1] += this.speed;
        pmy = 1;
      }
      if (pmy === 0 && pmx === 0 && this.state === 'has_target') {
        mx = 0;
        my = 0;
        k = this.path.length - 1;
        if (this.path[k] != null) {
          if (this.pos[0] < this.path[k][0]) {
            this.pos[0] += 1;
            mx = 1;
          }
          if (this.pos[0] > this.path[k][0]) {
            this.pos[0] -= 1;
            mx = 1;
          }
          if (this.pos[1] < this.path[k][1]) {
            this.pos[1] += 1;
            my = 1;
          }
          if (this.pos[1] > this.path[k][1]) {
            this.pos[1] -= 1;
            my = 1;
          }
          if (this.pos[0] === this.path[k][0] && this.pos[1] === this.path[k][1]) {
            if (this.path.length > 0) {
              this.path.pop(0);
            }
          }
        } else {
          this.state = 'idle';
        }
      }
      /*
      		for point, i in @path
      			if i < @path.length
      
      				point2 = @path[i+1]
      				window.mapper.draw_box(3+point[0]*16, 3+point[1]*16, 10,10, {fillStyle:'transparent', strokeStyle:@color,lineWidth:1})
      				if point2
      					#console.log i, point, point2
      					window.mapper.draw_line(8+point[0]*16, 8+point[1]*16, 8+point2[0]*16, 8+point2[1]*16, {strokeStyle:@color,lineWidth:2})
      				else
      					#console.log @path
      					n = 0
      
      				if i is @path.length-1
      					window.mapper.draw_line(8+point[0]*16, 8+point[1]*16, 8+@pos[0]*16, 8+@pos[1]*16, {strokeStyle:@color,lineWidth:2})
      */

      img = window.mapper.guy_image;
      if (img != null) {
        return window.mapper.context.drawImage(img, this.pix_pos[0], this.pix_pos[1]);
      }
    };

    return Guy;

  })();

  $(window).ready(function() {
    window.mapper = {
      mouse_is_down: 0,
      init: function() {
        var i, j, _i, _j, _k, _ref, _ref1;
        this.canvas = $('#game_canvas');
        this.context = this.canvas[0].getContext("2d");
        this.grid_w = 71;
        this.grid_h = 50;
        this.grid_size = 16;
        this.map = [];
        for (i = _i = 0, _ref = this.grid_h - 1; 0 <= _ref ? _i <= _ref : _i >= _ref; i = 0 <= _ref ? ++_i : --_i) {
          this.map.push([]);
          for (j = _j = 0, _ref1 = this.grid_w - 1; 0 <= _ref1 ? _j <= _ref1 : _j >= _ref1; j = 0 <= _ref1 ? ++_j : --_j) {
            if (j < 1 || j === this.grid_w - 1 || i < 1 || i === this.grid_h - 1) {
              this.map[i].push(1);
            } else {
              this.map[i].push(0);
            }
          }
        }
        this.path_finder = new PF.JumpPointFinder();
        this.canvas.mousedown(function(e) {
          return window.mapper.mousedown(e);
        });
        this.canvas.mousemove(function(e) {
          return window.mapper.mousemove(e);
        });
        $(window).mouseup(function(e) {
          return window.mapper.mouseup(e);
        });
        this.guys = [];
        for (i = _k = 0; _k <= 600; i = ++_k) {
          this.guys.push(new Guy('anon', 'rgb(' + parseInt(Math.random() * 255) + ',' + parseInt(Math.random() * 255) + ',' + parseInt(Math.random() * 255) + ')'));
        }
        this.guy_image = new Image();
        this.guy_image.src = "./astronaut.png";
        return this.animate();
      },
      get_path: function(x, y, x2, y2) {
        var grid;
        grid = new PF.Grid(this.grid_w, this.grid_h, this.map);
        return this.path_finder.findPath(x, y, x2, y2, grid);
      },
      mousedown: function(e) {
        return this.mouse_is_down = 1;
      },
      mousemove: function(e) {
        var pos;
        if (this.mouse_is_down) {
          pos = this.mouse_to_grid(e.clientX, e.clientY);
          return this.map[pos[1]][pos[0]] = 1;
        }
      },
      mouseup: function(e) {
        return this.mouse_is_down = 0;
      },
      mouse_to_grid: function(x, y) {
        var c_o;
        c_o = this.canvas.offset();
        x -= c_o.left;
        y -= c_o.top;
        x = parseInt(x / 16);
        y = parseInt(y / 16);
        x = window.util.constrict(x, 0, this.grid_w);
        y = window.util.constrict(y, 0, this.grid_h);
        return [x, y];
      },
      get_random_pos: function() {
        var x, xy, y;
        x = Math.random() * (this.grid_w - 1);
        y = Math.random() * (this.grid_h - 1);
        xy = [parseInt(x), parseInt(y)];
        if (this.map[xy[1]][xy[0]] !== 1) {
          return xy;
        } else {
          return this.get_random_pos();
        }
      },
      draw: function() {
        var column, guy, i, j, n, row, _i, _j, _k, _len, _len1, _len2, _ref, _ref1, _results;
        this.context.clearRect(0, 0, this.canvas.width(), this.canvas.height());
        _ref = this.map;
        for (i = _i = 0, _len = _ref.length; _i < _len; i = ++_i) {
          row = _ref[i];
          for (j = _j = 0, _len1 = row.length; _j < _len1; j = ++_j) {
            column = row[j];
            if (column === 0) {
              n = 0;
            } else {
              this.draw_box(j * 16, i * 16, 16, 16, {
                fillStyle: "silver"
              });
            }
          }
        }
        _ref1 = this.guys;
        _results = [];
        for (_k = 0, _len2 = _ref1.length; _k < _len2; _k++) {
          guy = _ref1[_k];
          _results.push(guy.update());
        }
        return _results;
      },
      animate: function() {
        window.mapper.draw();
        return window.requestAnimFrame(window.mapper.animate);
      },
      draw_box: function(x, y, w, h, options) {
        if (x == null) {
          x = 0;
        }
        if (y == null) {
          y = 0;
        }
        if (w == null) {
          w = 100;
        }
        if (h == null) {
          h = 100;
        }
        if (options == null) {
          options = {
            fillStyle: "transparent",
            strokeStyle: "rgb(113, 183, 248)",
            lineWidth: 1
          };
        }
        x += .5;
        y += .5;
        this.context.fillStyle = options.fillStyle;
        this.context.strokeStyle = options.strokeStyle;
        this.context.lineWidth = options.lineWidth;
        this.context.beginPath();
        this.context.moveTo(x, y);
        this.context.lineTo(x + w, y);
        this.context.lineTo(x + w, y + h);
        this.context.lineTo(x, y + h);
        this.context.lineTo(x, y);
        this.context.closePath();
        this.context.fill();
        if (options.lineWidth > 0) {
          return this.context.stroke();
        }
      },
      draw_line: function(x, y, x2, y2, options) {
        if (x == null) {
          x = 0;
        }
        if (y == null) {
          y = 0;
        }
        if (x2 == null) {
          x2 = 0;
        }
        if (y2 == null) {
          y2 = 0;
        }
        if (options == null) {
          options = {
            fillStyle: "transparent",
            strokeStyle: "rgb(113, 183, 248)",
            lineWidth: 1
          };
        }
        x += .5;
        y += .5;
        x2 += .5;
        y2 += .5;
        this.context.fillStyle = options.fillStyle;
        this.context.strokeStyle = options.strokeStyle;
        if (options.lineWidth) {
          this.context.lineWidth = options.lineWidth;
        }
        this.context.beginPath();
        this.context.moveTo(x, y);
        this.context.lineTo(x2, y2);
        this.context.closePath();
        return this.context.stroke();
      }
    };
    return window.mapper.init();
  });

}).call(this);
