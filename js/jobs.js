// Generated by CoffeeScript 1.3.1
(function() {
  var Job,
    __indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

  Job = (function() {

    Job.name = 'Job';

    function Job(type) {
      this.type = type != null ? type : 'default';
      this.instructions = [];
      this.timer = 0;
      this.assigned = false;
      this.timeout = 10000;
      this.index = 0;
    }

    Job.prototype.get_instruction = function() {
      if (this.index > this.instructions.length) {
        this.index = 0;
      } else {
        this.index += 1;
        return this.instructions[this.index - 1];
      }
    };

    Job.prototype.to_string = function() {
      return 'job: ' + this.type;
    };

    Job.prototype.update = function(delta) {
      if (this.assigned) {
        this.timer += delta;
        if (this.timer > this.timeout) {
          this.assigned = false;
          return window.Jobs.fail(this);
        }
      }
    };

    Job.prototype.complete = function() {
      if (this.is_done()) {
        return window.Jobs.complete(this);
      } else {
        return window.Jobs.fail(this);
      }
    };

    Job.prototype.is_done = function() {
      return true;
    };

    return Job;

  })();

  window.Jobs = {
    init: function() {
      window.Events.add_listener(this);
      this.open_jobs = [];
      return this.assigned_jobs = [];
    },
    update: function(delta) {
      var job, _i, _len, _ref, _results;
      _ref = this.assigned_jobs;
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        job = _ref[_i];
        if (job != null) {
          _results.push(job.update(delta));
        } else {
          _results.push(void 0);
        }
      }
      return _results;
    },
    fail: function(job) {
      if (__indexOf.call(this.assigned_jobs, job) >= 0) {
        this.assigned_jobs.remove(job);
      }
      if (__indexOf.call(this.open_jobs, job) < 0) {
        return this.open_jobs.push(job);
      }
    },
    complete: function(job) {
      if (__indexOf.call(this.assigned_jobs, job) >= 0) {
        if (job != null) {
          return this.assigned_jobs.remove(job);
        }
      }
    },
    get_job: function(entity) {
      var job;
      this.update_listings();
      job = this.open_jobs.pop();
      if (job) {
        entity.job = job;
        job.assigned = entity;
        this.assigned_jobs.push(job);
        return job;
      }
    },
    update_listings: function() {
      var job, thing, tile, _i, _j, _len, _len1, _ref, _ref1;
      window.Tiles.under_construction.reverse();
      _ref = window.Tiles.under_construction;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        tile = _ref[_i];
        job = new Job('build');
        job.tile = tile;
        job.instructions.push(new window.SlowDataTypes.Vect2D(tile.x, tile.y));
        job.is_done = function() {
          console.log('job.is_done: ', this.tile);
          if (this.tile && this.tile.built) {
            return true;
          }
          return false;
        };
        this.open_jobs.push(job);
      }
      window.Tiles.under_construction = [];
      _ref1 = window.Objects.jobs;
      for (_j = 0, _len1 = _ref1.length; _j < _len1; _j++) {
        thing = _ref1[_j];
        job = new Job('place');
        job.place_job = thing;
        job.type = thing.type;
        console.log('PLACE JOB: ', thing.type);
        console.log(thing);
        console.log(thing.location[0], thing.location[1]);
        job.instructions.push(new window.SlowDataTypes.Vect2D(thing.location[0], thing.location[1]));
        this.open_jobs.push(job);
        job.is_done = function() {
          var _ref2;
          if (this.assigned.tile_pos[0] === this.place_job.location[0] && this.assigned.tile_pos[1] === this.place_job.location[1]) {
            if ((_ref2 = this.type) === 'build') {
              this.place_job.obj['place']();
            } else {
              this.place_job.obj[this.type]();
            }
            this.place_job.job_done(this.place_job);
            return true;
          } else {
            window.Jobs.fail(this);
            return false;
          }
        };
      }
      return window.Objects.jobs = [];
    }
  };

  $(window).ready(function() {
    var AxisNum, EntityRef, RegisterStack, Vect2D;
    Vect2D = window.SlowDataTypes.Vect2D;
    AxisNum = window.SlowDataTypes.AxisNum;
    EntityRef = window.SlowDataTypes.EntityRef;
    RegisterStack = window.SlowDataTypes.RegisterStack;
    return window.Jobs.init();
  });

}).call(this);
