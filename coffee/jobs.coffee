



class Job
  constructor: (@type='default')->
    @instructions = []
    @timer = 0
    @assigned = false
    @timeout = 10000
  to_string: ->
    return 'job: '+@type
  update: (delta)->
    if @assigned
      @timer += delta
      if @timer > @timeout
        @assigned = false
        window.Jobs.fail(@)
  complete: ()->
    if @is_done()
      window.Jobs.complete(@)
    else
      window.Jobs.fail(@)
  is_done: ()->
    #usually overwritten
    return true


window.Jobs =
  init: ->
    window.Events.add_listener(@)
    @open_jobs = []
    @assigned_jobs = []
  update: (delta)->
    for job in @assigned_jobs
      if job?
        job.update(delta)

  fail: (job)->
    if job in @assigned_jobs
      @assigned_jobs.remove job
    if job not in @open_jobs
      @open_jobs.push job
  complete: (job)->
    if job in @assigned_jobs
      if job?
        @assigned_jobs.remove job

  get_job: (entity)->
    @update_listings()
    job = @open_jobs.pop()
    if job
      entity.job = job
      job.assigned = true
      @assigned_jobs.push job
      return job

  update_listings: ()->
    window.Tiles.under_construction.reverse()
    for tile in window.Tiles.under_construction
      job = new Job('build')
      job.tile = tile
      job.instructions.push new window.SlowDataTypes.Vect2D(tile.x, tile.y)
      job.is_done = ()->
        console.log 'job.is_done: ', @tile
        if @tile and @tile.built
          return true
        return false

      @open_jobs.push job
    window.Tiles.under_construction = []

    for thing in window.Placer.jobs
      #[@type, pos]
      job = new Job('place')
      job.place_proxy = job
      job.instructions.push new window.SlowDataTypes.Vect2D(thing[1][0], thing[1][1])
      job.instructions.push thing[0]
      @open_jobs.push job
      job.is_done = ()->
        if @approved
          console.log 'job.place.is_done: ', @tile
          return true
        return false
    window.Placer.jobs = []



$(window).ready ->
  Vect2D =   window.SlowDataTypes.Vect2D
  AxisNum =   window.SlowDataTypes.AxisNum
  EntityRef =   window.SlowDataTypes.EntityRef
  RegisterStack =   window.SlowDataTypes.RegisterStack
  window.Jobs.init()



