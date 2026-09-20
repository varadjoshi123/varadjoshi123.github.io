const reduced=matchMedia('(prefers-reduced-motion: reduce)');
const observer=new IntersectionObserver(entries=>entries.forEach(e=>{if(e.isIntersecting){e.target.classList.add('visible');observer.unobserve(e.target)}}),{threshold:.04});
if(!reduced.matches){document.body.classList.add('js-reveal');document.querySelectorAll('.reveal').forEach(el=>observer.observe(el));}
document.querySelector('#year').textContent=new Date().getFullYear();
const progress=document.querySelector('.progress');
function updateScroll(){const total=document.documentElement.scrollHeight-innerHeight;progress.style.width=(total>0?scrollY/total*100:0)+'%'}
addEventListener('scroll',updateScroll,{passive:true});addEventListener('resize',updateScroll);updateScroll();
const navObserver=new IntersectionObserver(entries=>entries.forEach(e=>{if(e.isIntersecting)document.querySelectorAll('nav a').forEach(a=>a.classList.toggle('active',a.hash==='#'+e.target.id))}),{rootMargin:'-15% 0px -65% 0px'});
document.querySelectorAll('#work,#about,#experience').forEach(s=>navObserver.observe(s));
document.querySelectorAll('.project').forEach(card=>{card.addEventListener('pointermove',e=>{if(reduced.matches)return;const r=card.getBoundingClientRect();card.style.setProperty('--mx',(e.clientX-r.left)+'px');card.style.setProperty('--my',(e.clientY-r.top)+'px')});card.addEventListener('pointerleave',()=>{card.style.removeProperty('--mx');card.style.removeProperty('--my')})});
const canvas=document.querySelector('#field'),ctx=canvas.getContext('2d'),motion=document.querySelector('#motion');
let width=0,height=0,t=0,paused=reduced.matches,frame=null,visible=true,last=0,pointer={x:0,y:0};
function draw(){if(!ctx||!width||!height)return;ctx.clearRect(0,0,width,height);const scale=Math.min(width,height)*.285,cx=width*.5,cy=height*.5;
 const glow=ctx.createRadialGradient(cx,cy,0,cx,cy,scale*1.65);glow.addColorStop(0,'rgba(65,111,211,.12)');glow.addColorStop(1,'rgba(65,111,211,0)');ctx.fillStyle=glow;ctx.fillRect(0,0,width,height);
 const points=[],rot=t*.16+pointer.x*.4,tilt=.72+pointer.y*.3;
 for(let i=0;i<78;i++){const u=i/78*Math.PI*2;for(let j=0;j<22;j++){const v=j/22*Math.PI*2;const ring=1+.09*Math.sin(u*3+t*.35);let x=(ring+.34*Math.cos(v))*Math.cos(u),y=(ring+.34*Math.cos(v))*Math.sin(u),z=.34*Math.sin(v);let xx=x*Math.cos(rot)-z*Math.sin(rot),zz=x*Math.sin(rot)+z*Math.cos(rot);let yy=y*Math.cos(tilt)-zz*Math.sin(tilt),depth=y*Math.sin(tilt)+zz*Math.cos(tilt);const p=3.6/(3.6-depth);points.push({x:cx+xx*scale*p,y:cy+yy*scale*p,z:depth,v,i});}}
 points.sort((a,b)=>a.z-b.z);points.forEach(p=>{const depth=(p.z+1.5)/3;ctx.beginPath();ctx.fillStyle=p.i%6<3?`rgba(131,207,255,${.12+depth*.72})`:`rgba(179,160,255,${.12+depth*.66})`;ctx.arc(p.x,p.y,.55+depth*1.4,0,Math.PI*2);ctx.fill()});
}
function stop(){if(frame!==null)cancelAnimationFrame(frame);frame=null;last=0}
function tick(now){frame=null;if(paused||!visible||document.hidden)return;if(last)t+=Math.min((now-last)/1000,.05);last=now;draw();frame=requestAnimationFrame(tick)}
function start(){stop();if(!paused&&visible&&!document.hidden)frame=requestAnimationFrame(tick)}
function resize(){const r=canvas.getBoundingClientRect();width=r.width;height=r.height;const dpr=Math.min(devicePixelRatio||1,2);canvas.width=width*dpr;canvas.height=height*dpr;if(ctx)ctx.setTransform(dpr,0,0,dpr,0,0);draw()}
function syncMotion(){document.body.classList.toggle('paused',paused);motion.textContent=paused?'▷':'Ⅱ';motion.setAttribute('aria-label',paused?'Play animation':'Pause animation');motion.title=paused?'Play animation':'Pause animation';draw();start()}
motion.addEventListener('click',()=>{paused=!paused;syncMotion()});
canvas.parentElement.addEventListener('pointermove',e=>{if(paused||reduced.matches)return;const r=canvas.getBoundingClientRect();pointer.x=(e.clientX-r.left)/r.width-.5;pointer.y=(e.clientY-r.top)/r.height-.5});
canvas.parentElement.addEventListener('pointerleave',()=>{pointer.x=0;pointer.y=0});
new ResizeObserver(resize).observe(canvas);
new IntersectionObserver(entries=>{visible=entries[0].isIntersecting;start()}).observe(canvas);
document.addEventListener('visibilitychange',start);
reduced.addEventListener('change',e=>{paused=e.matches;if(e.matches){document.body.classList.remove('js-reveal');document.querySelectorAll('.reveal').forEach(el=>el.classList.add('visible'))}syncMotion()});syncMotion();
