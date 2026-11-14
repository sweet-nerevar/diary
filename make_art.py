from PIL import Image, ImageDraw
import math, random, json, re, os
from pathlib import Path
ROOT=Path(__file__).parent; OUT=ROOT/'assets'; OUT.mkdir(exist_ok=True)
# 4x4 Bayer ordered dithering, classic engraved 1-bit look.
BAYER=[[0,8,2,10],[12,4,14,6],[3,11,1,9],[15,7,13,5]]
PAPER=(240,235,223); INK=(39,38,33)

def dither(gray, output, zoom=2, paper=PAPER, ink=INK):
    w,h=gray.size; g=gray.load(); result=Image.new('RGB',(w,h)); o=result.load()
    for y in range(h):
      for x in range(w):
       v=g[x,y];t=(BAYER[y%4][x%4]+.5)/16*255
       o[x,y]=paper if v >= t else ink
    result.resize((w*zoom,h*zoom),Image.Resampling.NEAREST).save(output,optimize=True)

def new(w,h,seed=1, bg=243):
    im=Image.new('L',(w,h),bg);draw=ImageDraw.Draw(im);return im,draw,random.Random(seed)

def sky_noise(im, seed=3, density=.22):
    r=random.Random(seed);d=ImageDraw.Draw(im);w,h=im.size
    for _ in range(int(w*h*density/7)):
       x=r.randrange(w);y=r.randrange(h); value=r.choice((190,208,224,233,246))
       if y < h*.75:d.point((x,y),fill=value)

def stars(d,w,h,r,count=18):
    for i in range(count):
      x=r.randrange(14,w-14);y=r.randrange(12,int(h*.55));k=r.choice([1,2,3])
      d.line((x-k,y,x+k,y),fill=25,width=1);d.line((x,y-k,x,y+k),fill=25,width=1)

def castle(d,w,h,seed=2):
    r=random.Random(seed);base=int(h*.77);x0=int(w*.16);x1=int(w*.84)
    d.polygon([(0,base+18),(45,base-13),(86,base+12),(w-40,base-24),(w,base+4),(w,h),(0,h)],fill=197)
    for k in range(9):
      x=x0+k*int((x1-x0)/9);tw=r.randint(18,31); top=base-r.randint(50,110)
      d.rectangle((x,top,x+tw,base+15),fill=49)
      d.polygon([(x-6,top),(x+tw//2,top-r.randint(15,34)),(x+tw+6,top)],fill=35)
      for wy in range(top+17,base-7,19):d.rectangle((x+tw//2-2,wy,x+tw//2+2,wy+8),fill=221)
    d.rectangle((int(w*.33),base-125,int(w*.67),base+14),fill=58)
    d.polygon([(int(w*.29),base-125),(int(w*.5),base-174),(int(w*.71),base-125)],fill=41)
    for xx in (int(w*.37),int(w*.47),int(w*.57)):
      for y in range(base-105,base,23):d.rectangle((xx,y,xx+5,y+11),fill=219)
    d.arc((int(w*.42),base-37,int(w*.59),base+42),180,360,fill=222,width=3)
    for k in range(25):
      ax=r.randrange(x0,x1);ay=r.randrange(base-10,base+37)
      d.line((ax,ay,ax+r.randint(-8,8),ay+3),fill=139)

def forest(d,w,h,seed=7):
    r=random.Random(seed)
    for i in range(6):
      x=int(w*(i+.3)/6); tr_y=int(h*.84)+r.randint(-10,15); top=int(h*(.23+r.random()*.28))
      d.line((x,tr_y,x,top),fill=34,width=3)
      for a in range(5):
        yy=top+a*17; dx=(20-a*3)+r.randrange(-3,4)
        d.line((x,yy+20,x-dx,yy-7),fill=42,width=2)
        d.line((x,yy+20,x+dx,yy-12),fill=42,width=2)
        for b in range(5):
         bx=x+r.randrange(-dx,dx); by=yy+r.randrange(-10,13)
         d.rectangle((bx,by,bx+r.choice([2,3,4]),by+2),fill=r.randrange(65,165))

def moon(d,w,h):
    x=int(w*.67);y=int(h*.25);rad=int(min(w,h)*.16)
    d.ellipse((x-rad,y-rad,x+rad,y+rad),fill=242,outline=55,width=3)
    for i in range(6):d.arc((x-rad+i*3,y-rad+i*2,x+rad-i*3,y+rad-i*2),230,330,fill=156,width=1)

def open_book(d,w,h,seed):
    cy=int(h*.56);cx=w//2;ww=int(w*.32);hh=int(h*.25)
    d.polygon([(cx,cy+hh//2),(cx-ww,cy+hh//2-14),(cx-ww,cy-hh//2),(cx,cy-hh//2+7)],fill=232,outline=40)
    d.polygon([(cx,cy+hh//2),(cx+ww,cy+hh//2-14),(cx+ww,cy-hh//2),(cx,cy-hh//2+7)],fill=230,outline=40)
    d.line((cx,cy-hh//2,cx,cy+hh//2),fill=35,width=3)
    for k in range(7):
      yy=cy-hh//2+15+k*12
      d.line((cx-ww+12,yy,cx-13,yy+4),fill=135,width=1)
      d.line((cx+13,yy+4,cx+ww-12,yy),fill=135,width=1)
    for k in range(3):d.arc((cx-ww-7,cy+hh//2-8,cx+ww+9,cy+hh//2+18+k*6),5,175,fill=33,width=1)

def quill(d,w,h):
    x=w//2;y=int(h*.7);d.line((x-38,y+63,x+67,y-120),fill=35,width=3)
    d.ellipse((x+26,y-170,x+97,y-50),fill=80,outline=35,width=2)
    d.polygon([(x+62,y-174),(x+93,y-101),(x+48,y-63)],fill=218)
    for k in range(9):
      yy=y-157+k*11;d.line((x+63,yy,x+35+k,yy+26),fill=52,width=1)
    d.rectangle((x-66,y+44,x+12,y+65),fill=33)
    d.polygon([(x-66,y+44),(x-45,y+10),(x-8,y+10),(x+12,y+44)],fill=50)

def key(d,w,h):
    x=int(w*.50); y=int(h*.43);rad=38
    d.ellipse((x-rad,y-rad,x+rad,y+rad),outline=34,width=13)
    d.ellipse((x-rad+18,y-rad+18,x+rad-18,y+rad-18),outline=90,width=2)
    d.line((x+29,y+29,x+118,y+119),fill=30,width=14)
    d.line((x+99,y+99,x+122,y+78),fill=30,width=10)
    d.line((x+116,y+116,x+142,y+92),fill=30,width=10)

def owl(d,w,h):
    cx=w//2;cy=int(h*.50)
    d.ellipse((cx-86,cy-84,cx+86,cy+115),fill=130,outline=36,width=3)
    d.polygon([(cx-70,cy-53),(cx-75,cy-120),(cx-22,cy-75),(cx+22,cy-75),(cx+75,cy-120),(cx+70,cy-53)],fill=105,outline=34)
    for xx in (cx-37,cx+37):
      d.ellipse((xx-26,cy-26,xx+26,cy+24),fill=231,outline=30,width=3)
      d.ellipse((xx-7,cy-12,xx+8,cy+4),fill=25)
    d.polygon([(cx-12,cy+28),(cx+12,cy+28),(cx,cy+50)],fill=38)
    for k in range(-3,4):d.arc((cx-50+k*10,cy+56,cx-15+k*10,cy+84),0,160,fill=38,width=1)
    d.line((cx-115,cy+117,cx+115,cy+117),fill=37,width=6)

def potion(d,w,h):
    cx=w//2;cy=int(h*.58)
    d.rectangle((cx-35,cy-127,cx+35,cy-95),fill=224,outline=43,width=4)
    d.polygon([(cx-35,cy-96),(cx+35,cy-96),(cx+35,cy-64),(cx+93,cy+43),(cx+85,cy+105),(cx-85,cy+105),(cx-93,cy+43),(cx-35,cy-64)],fill=231,outline=43)
    d.polygon([(cx-74,cy+20),(cx+72,cy+20),(cx+85,cy+81),(cx+73,cy+93),(cx-74,cy+93),(cx-85,cy+81)],fill=100)
    for dx,dy in [(-24,-9),(38,-32),(8,-42),(-45,31)]:d.ellipse((cx+dx,cy+dy-10,cx+dx+12,cy+dy+2),outline=42,width=2)
    d.arc((cx-74,cy+20,cx+73,cy+54),0,180,fill=42,width=3)

def scroll(d,w,h):
    cx=w//2;cy=h//2; d.rectangle((cx-85,cy-95,cx+93,cy+90),fill=225,outline=34,width=3)
    d.ellipse((cx-93,cy-100,cx+93,cy-75),fill=188,outline=34,width=2)
    d.ellipse((cx-94,cy+73,cx+94,cy+105),fill=186,outline=34,width=2)
    for i in range(8):
      yy=cy-53+i*17; d.line((cx-65,yy,cx+rnd_ends[i%len(rnd_ends)],yy),fill=112,width=2)
    d.ellipse((cx+30,cy+23,cx+68,cy+61),fill=44)
    d.polygon([(cx+48,cy+42),(cx+33,cy+90),(cx+53,cy+76),(cx+73,cy+95),(cx+65,cy+42)],fill=50)
rnd_ends=[43,54,2,27,58,12,40,8]

def draw_plate(filename, motif, seed=8, w=300,h=230, variant=0):
    im,d,r=new(w,h,seed,bg=239)
    # sparse engraved ground + vignette
    d.rectangle((3,3,w-4,h-4),outline=195,width=1)
    for i in range(1,14):
      yy=int(h*(.75+i*.017)); d.line((0,yy,w,yy),fill=220 if i%2 else 198)
    for i in range(200):
      x=r.randrange(10,w-10);y=r.randrange(15,h-10)
      if (x+y)%7>2:d.point((x,y),fill=r.randint(156,232))
    if motif=='castle': castle(d,w,h,seed)
    elif motif=='forest': forest(d,w,h,seed)
    elif motif=='moon': moon(d,w,h);stars(d,w,h,r,12)
    elif motif=='book': open_book(d,w,h,seed)
    elif motif=='quill': quill(d,w,h)
    elif motif=='key':key(d,w,h)
    elif motif=='owl': owl(d,w,h)
    elif motif=='potion':potion(d,w,h)
    elif motif=='scroll': scroll(d,w,h)
    if variant%3==1:
      for k in range(3):d.arc((10+k*5,10+k*5,w-10-k*5,h-10-k*5),30,120,fill=161,width=1)
    if variant%3==2:
      for k in range(7):d.line((5+k*5,5,5,5+k*5),fill=90,width=1)
    dither(im,OUT/filename,zoom=2)

draw_plate('castle-hero.png','castle',seed=19,w=310,h=500)
for section,motif in dict(chronicle='castle',diary='quill',people='owl',mysteries='key',archive='book').items():
  draw_plate(f'{section}.png',motif,seed=len(section)*31)

# For each page, generate independent original placeholder with rotating subjects.
text=(ROOT/'data.js').read_text();sections=re.findall(r"id:'(chronicle|diary|people|mysteries|archive)'[\s\S]*?(?=\n      \{|\n    \]\n  \};)",text)
page_data={
'chronicle':['prologue','train','school','tournament','dream','wolves','fair','mind','before-ball','ball','after-ball'],
'diary':['dated','reflections','drafts'],
'people':['closest','students','faculty','wolves','ministry','family'],
'mysteries':['active','distortions','wolves','tournament','castle','closed'],
'archive':['letters','dreams','objects','places','source']}
motifs=['castle','forest','moon','book','potion','owl','scroll','quill','key']
for section,pages in page_data.items():
  for i,slug in enumerate(pages):
    motif=motifs[(i+len(section))%len(motifs)]
    draw_plate(f'{section}-{slug}.png',motif,seed=i*42+len(section)*17,variant=i)
print('generated',len(list(OUT.glob('*.png'))),'images')
