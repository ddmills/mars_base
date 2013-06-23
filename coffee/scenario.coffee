names = ['Jack','Rupert',
'Iona',
'Jennie',
'Casie',
'Numbers',
'Naomi',
'Milissa',
'Janina',
'Lauren',
'Herman',
'Tawnya',
'Bernadine',
'Marjory',
'Jennell',
'Ricardo',
'Rita',
'Coreen',
'Tennille',
'Shondra',
'Donny',
'Florine']


$(window).ready ->

  E = window.Entities.classes

  cx =(window.Map.width*32)/2
  cy = (window.Map.height*32)/2

  launchpad = new E.Launchpad('Launchpad', 'launchpad', [cx, cy])
  launchpad.sprite_size = 128
  launchpad.sprite_offset = [-64,-64]

  crate = new E.Thing('crate', 'crate', [cx+(4*32), cy+(4*32)])
  airtanks = new E.Airtank('airtanks', 'airtanks', [cx-(1*32), cy+(2*32)])
  airtanks = new E.Airtank('airtanks', 'airtanks', [cx-(3*32), cy+(-1*32)])
  wrench = new E.Thing('wrench', 'wrench', [cx-(4*32), cy+(0*32)])
  solarpanel = new E.Thing('solarpanel', 'solarpanel', [cx-(2*32), cy-(8*32)])



  for i in [0..3]
    for j in [0..1]
      suit = new E.Thing('suit', 'engineer', [cx+((i-2)*32), cy+((j-2)*32)])

  for i in [0..7]
    x = parseInt(Math.random()*600+(window.Map.width*window.Map.tilesize / 2 )-300)
    y = parseInt(Math.random()*600+ (window.Map.width*window.Map.tilesize / 2)-300)
    name = names[parseInt(Math.random()*names.length)]
    advanced = new E.Engineer(name, 'barewalk', [x,y])
    advanced.speed = 1.5

    advanced.sprite_offset = [0, 0]
    advanced.sprite_size = 32

    
