// Generated by CoffeeScript 1.3.1
(function() {
  var __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; };

  $(window).ready(function() {
    var Airtank, Door, E, Installable, Locker, Solarpanel;
    E = window.Entities.classes;
    Installable = (function(_super) {

      __extends(Installable, _super);

      Installable.name = 'Installable';

      function Installable() {
        return Installable.__super__.constructor.apply(this, arguments);
      }

      Installable.prototype.setup_1 = function() {
        this.name = this.nombre;
        this.moveable = true;
        this.buildable = true;
        this.removable = true;
        this.selectable = true;
        this.place_interior = true;
        this.place_exterior = true;
        return this.layout = [[2]];
      };

      return Installable;

    })(E.DThing);
    Door = (function(_super) {

      __extends(Door, _super);

      Door.name = 'Door';

      function Door() {
        return Door.__super__.constructor.apply(this, arguments);
      }

      Door.prototype.setup = function() {
        this.name = 'door';
        this.nombre = 'door';
        return this.image = 'door';
      };

      Door.prototype.check_clear = function(loc, rot) {
        var b, check_tile, l, r, t;
        check_tile = function(loc) {
          var t;
          t = window.Map.get("tiles", loc[0], loc[1]);
          if (t) {
            return t;
          }
          return false;
        };
        l = check_tile([loc[0] - 1, loc[1]]);
        r = check_tile([loc[0] + 1, loc[1]]);
        t = check_tile([loc[0], loc[1] - 1]);
        b = check_tile([loc[0], loc[1] + 1]);
        if (l && r && l.is_wall() && r.is_wall()) {
          return true;
        } else if (t && b && t.is_wall() && b.is_wall()) {
          return true;
        }
      };

      Door.prototype.install = function() {
        console.log("INSTALL CALLED");
        return window.Map.set('pathfinding', this.tile_pos[0], this.tile_pos[1], 0);
        /*
            init: ->
              @drawn = false
              @open = 0
        
              @attach_to_map()
        
              window.Draw.use_layer('objects')
              window.Draw.clear_box(@pos[0], @pos[1], 32, 32);
        
              
            place: ()->
              console.log 'Door placed'
              @placed = true
              @pos_to_tile_pos()
              pos = @tile_pos
              left = window.Map.get('tiles', pos[0]-1, pos[1])
              right = window.Map.get('tiles', pos[0]+1, pos[1])
              top = window.Map.get('tiles', pos[0], pos[1]-1)
              bottom = window.Map.get('tiles', pos[0], pos[1]+1)
              center = window.Map.get('tiles', pos[0], pos[1])
              if left and left.is_wall() and right and right.is_wall()
                @placed_image = 'door_h'
              else if top and top.is_wall() and bottom and bottom.is_wall()
                @placed_image = 'door_v'
        
              @image = @placed_image
              window.Map.set('pathfinding', @tile_pos[0], @tile_pos[1], 0)
            draw: ->
              if @placed
                @placed_draw()
              else
                if @persistant_draw is true
                  if @needs_draw
                    window.Draw.use_layer 'objects'
                    drawn = window.Draw.image(@image, @pos[0]+@sprite_offset[0], @pos[1]+@sprite_offset[0], @sprite_size, @sprite_size, @opacity)
                    if drawn
                      @needs_draw = false
                else
                  window.Draw.use_layer 'entities'
                  drawn = window.Draw.image(@image, @pos[0]+@sprite_offset[0], @pos[1]+@sprite_offset[0], @sprite_size, @sprite_size, @opacity)
              for hook in @draw_hooks
                @[hook]()
        
            placed_draw: ->
              @open -= 1
              if @open < 0
                @open = 0
        
              window.Draw.use_layer 'objects'
              window.Draw.clear_box(@pos[0], @pos[1], 32, 32);
              window.Draw.image('supply',@pos[0], @pos[1], 32, 32);
              if @image is 'door_h'
                window.Draw.image('corridor', @pos[0]+@sprite_offset[0], @pos[1]+@sprite_offset[0]+11, (@sprite_size-1)-@open, 10, {fillStyle:'red'})
              else
                window.Draw.image('corridor', @pos[0]+@sprite_offset[0]+11, @pos[1]+@sprite_offset[0], 10, (@sprite_size-1)-@open, {fillStyle:'red'})
        
              #window.Draw.image(@image, @pos[0]+@sprite_offset[0], @pos[1]+@sprite_offset[0], (@sprite_size), @sprite_size)
        
        
              for hook in @draw_hooks
                @[hook]()
            visited: ()->
              @open += 2
              if @open > 32
                @open = 32
        */

      };

      return Door;

    })(Installable);
    Locker = (function(_super) {

      __extends(Locker, _super);

      Locker.name = 'Locker';

      function Locker() {
        return Locker.__super__.constructor.apply(this, arguments);
      }

      Locker.prototype.setup = function() {
        this.name = 'locker';
        this.nombre = 'locker';
        this.image = 'locker';
        return this.layout = [[3]];
      };

      return Locker;

    })(Installable);
    Solarpanel = (function(_super) {

      __extends(Solarpanel, _super);

      Solarpanel.name = 'Solarpanel';

      function Solarpanel() {
        return Solarpanel.__super__.constructor.apply(this, arguments);
      }

      Solarpanel.prototype.setup = function() {
        this.name = 'solarpanel';
        this.nombre = 'solarpanel';
        this.image = 'solarpanel';
        return this.layout = [[3, 2]];
      };

      return Solarpanel;

    })(Installable);
    Airtank = (function(_super) {

      __extends(Airtank, _super);

      Airtank.name = 'Airtank';

      function Airtank() {
        return Airtank.__super__.constructor.apply(this, arguments);
      }

      Airtank.prototype.setup = function() {
        this.name = 'airtank';
        this.nombre = 'airtank';
        this.image = 'airtanks';
        this.layout = [[3]];
        this.moveable = true;
        return this.removeable = true;
      };

      Airtank.prototype.install = function() {
        return console.log('airtanks installed');
      };

      Airtank.prototype.use = function(entity) {
        if (!this.oxygen) {
          this.oxygen = 80000;
          this.max_oxygen = 80000;
        }
        if (this.oxygen > 30) {
          entity.oxygen += 30;
          this.oxygen -= 30;
        } else {
          return true;
        }
        if (entity.oxygen >= entity.max_oxygen) {
          return true;
        }
        if (this.oxygen >= this.max_oxygen) {
          this.nombre = 'empty tank';
          return this.image = 'emptytanks';
        }
      };

      return Airtank;

    })(Installable);
    window.Entities.classes.Installable = Installable;
    window.Entities.classes.Door = Door;
    window.Entities.classes.Airtank = Airtank;
    window.Entities.classes.Locker = Locker;
    return window.Entities.classes.Solarpanel = Solarpanel;
  });

}).call(this);
