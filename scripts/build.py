import pathlib, struct, zlib, shutil
out=pathlib.Path('_site')
out.mkdir(exist_ok=True)
for name in ['index.html','manifest.webmanifest','pwa.js','sw.js']:
    shutil.copyfile(name,out/name)
(out/'icons').mkdir(exist_ok=True)
glyphs=['111100011110','100010010000','100010010000','111100010110','100010010010','100010010010','111100011110']
def chunk(kind,data):
    return struct.pack('!I',len(data))+kind+data+struct.pack('!I',zlib.crc32(kind+data)&0xffffffff)
for size in (192,512):
    scale=size//20
    left=(size-12*scale)//2
    top=(size-7*scale)//2
    rows=bytearray()
    for y in range(size):
        rows.append(0)
        for x in range(size):
            gx,gy=(x-left)//scale,(y-top)//scale
            lit=0<=gx<12 and 0<=gy<7 and glyphs[gy][gx]=='1'
            rows.extend((94,216,255) if lit else (7,17,31))
    png=b'\x89PNG\r\n\x1a\n'+chunk(b'IHDR',struct.pack('!2I5B',size,size,8,2,0,0,0))+chunk(b'IDAT',zlib.compress(rows))+chunk(b'IEND',b'')
    (out/'icons'/('icon-%s.png'%size)).write_bytes(png)
