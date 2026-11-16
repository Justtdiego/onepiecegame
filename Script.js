// [nivel, pregunta, [correcta, ...incorrectas], dato curioso]
const Q=[
 [1,"¿Cuál es el sueño de Monkey D. Luffy?",["Ser el Rey de los Piratas","Encontrar el All Blue","Ser el mejor espadachín","Dibujar un mapa del mundo"],"Luffy lo dijo desde niño, inspirado por Shanks."],
 [1,"¿Qué Fruta del Diablo comió Luffy?",["Gomu Gomu no Mi","Mera Mera no Mi","Hana Hana no Mi","Hito Hito no Mi"],"Su cuerpo se volvió de goma… y por eso no sabe nadar."],
 [1,"¿Quién es el cocinero de los Sombrero de Paja?",["Sanji","Zoro","Usopp","Franky"],"Sanji sueña con encontrar el All Blue."],
 [1,"¿Qué espadachín usa el estilo de tres espadas?",["Roronoa Zoro","Dracule Mihawk","Kuina","Smoker"],"Zoro lleva dos espadas en las manos y una en la boca."],
 [1,"¿Qué animal es Tony Tony Chopper?",["Un reno","Un oso","Un mapache","Un zorro"],"Comió la Hito Hito no Mi y se volvió el doctor de la tripulación."],
 [2,"¿Cómo se llamaba el Rey de los Piratas ejecutado en Loguetown?",["Gol D. Roger","Edward Newgate","Shanks","Monkey D. Garp"],"Sus últimas palabras iniciaron la Gran Era de la Piratería."],
 [2,"¿Cuál es el sueño de Nami?",["Dibujar un mapa del mundo","Ser médica","Ser la pirata más rica","Encontrar a su madre"],"Es la navegante y experta en el clima de la Grand Line."],
 [2,"¿En qué arco derrota Luffy a Crocodile?",["Alabasta","Skypiea","Water 7","Dressrosa"],"Crocodile era Shichibukai y usaba la Suna Suna no Mi."],
 [2,"¿Qué Fruta del Diablo comió Brook?",["Yomi Yomi no Mi","Hie Hie no Mi","Mochi Mochi no Mi","Zushi Zushi no Mi"],"Le permitió revivir… aunque ya solo quedaban sus huesos."],
 [2,"¿Cómo se llama el segundo barco de los Sombrero de Paja?",["Thousand Sunny","Going Merry","Moby Dick","Red Force"],"Lo construyó Franky con madera del árbol Adam."],
 [3,"¿Cómo se llama el dios del Sol que inspira el Gear 5?",["Nika","Ra","Helios","Apolo"],"Luffy despertó la Hito Hito no Mi, modelo Nika."],
 [3,"¿Qué hermano de Luffy murió en la guerra de Marineford?",["Portgas D. Ace","Sabo","Dragon","Garp"],"Ace era el comandante de la 2.ª división de Barbablanca."],
 [3,"¿Cómo se llama el arma ancestral escondida en Alabasta?",["Pluton","Poseidón","Uranus","Kraken"],"Pluton fue un buque de guerra de poder devastador."],
 [3,"¿Qué tipo de Haki permite sentir y prever ataques?",["Haki de observación","Haki de armadura","Haki del rey","Haki del fuego"],"En el manga se conoce también como Kenbunshoku."],
 [3,"¿Cómo se llama la isla donde está el One Piece?",["Laugh Tale","Raftel Norte","Isla Gyojin","Elbaf"],"Antes se llamaba Raftel, y el Gran Tesoro está allí."]
];
const TIERS={1:{n:"East Blue",t:20,m:1},2:{n:"Grand Line",t:18,m:2},3:{n:"Nuevo Mundo",t:15,m:3}};
const REACT={
 ok:[["🍖","Luffy","¡Shishishi! ¡Correcto!"],["🍳","Sanji","¡Mellorine! ¡Qué inteligente!"],["🗡️","Zoro","Nada mal."],["💀","Brook","¡Yohohoho! ¡Acertaste!"],["🩺","Chopper","¡No me alegra, idiota! ¡Jeje!"]],
 bad:[["🍊","Nami","¡Eso te va a costar 1.000 berries!"],["🎯","Usopp","¡Me dio la enfermedad de no-poder-responder-eso!"],["🗡️","Zoro","Te perdiste otra vez…"],["🍖","Luffy","¡Tengo hambre! ¿Cuál era la respuesta?"],["💀","Brook","Yohoho… casi me muero otra vez."]]
};
const $=id=>document.getElementById(id);
const rnd=a=>a[Math.floor(Math.random()*a.length)];
const berries=n=>"฿ "+n.toLocaleString("es-PE");
let S, name="";

function show(id){document.querySelectorAll(".screen").forEach(s=>s.classList.toggle("on",s.id===id));window.scrollTo(0,0)}
function shuffle(a){a=a.slice();for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]]}return a}

/* 1. Pantalla de carga */
function runLoader(){
  const msgs=["Izando las velas…","Cargando el Log Pose…","Buscando el One Piece…","¡Todo listo!"];
  let p=0;
  const t=setInterval(()=>{
    p+=2;$("lb").style.width=p+"%";
    $("lt").textContent=msgs[Math.min(3,Math.floor(p/26))];
    if(p>=100){clearInterval(t);setTimeout(()=>{show("hello");$("name").focus()},350)}
  },50);
}

/* 2. Nombre */
function enter(){
  const v=$("name").value.trim();
  if(v.length<2){$("err").textContent="Escribe tu nombre (mínimo 2 letras) para zarpar.";$("name").focus();return}
  name=v;try{localStorage.setItem("op-name",v)}catch(e){}
  start();
}

/* 3. Juego */
function start(){
  S={i:0,score:0,combo:0,best:0,ok:0,fifty:2,locked:false,left:0,timer:null,log:[]};
  $("cap").textContent="Capitán "+name;
  show("game");load();
}
function renderHud(){
  $("score").textContent=berries(S.score);
  $("combo").textContent=S.combo>=2?`🔥 Racha de ${S.combo} · bonus ×${(1+Math.min(S.combo,10)*0.1).toFixed(1)}`:"";
  $("fifty").textContent=`🧭 Log Pose: quitar 2 (${S.fifty})`;
  $("fifty").disabled=S.fifty<=0||S.locked;
  $("ship").style.left=(S.i/Q.length*100)+"%";
}
function load(){
  const [tier,text,ans]=Q[S.i],T=TIERS[tier];
  S.locked=false;
  $("qn").textContent=`${T.n} · Pregunta ${S.i+1} de ${Q.length}`;
  $("q").textContent=text;
  $("bubble").classList.remove("on");$("next").style.display="none";
  $("opts").innerHTML="";
  shuffle(ans.map((t,k)=>({t,ok:k===0}))).forEach(o=>{
    const b=document.createElement("button");b.className="opt";b.textContent=o.t;b.dataset.ok=o.ok?"1":"";
    b.onclick=()=>answer(b);$("opts").appendChild(b);
  });
  $("card").classList.remove("shake","pop");
  renderHud();
  clearInterval(S.timer);
  const t0=Date.now(),total=T.t*1000;
  S.timer=setInterval(()=>{
    const r=Math.max(0,total-(Date.now()-t0));S.left=r/1000;
    $("bar").style.transform=`scaleX(${r/total})`;
    if(r<=0){clearInterval(S.timer);answer(null)}
  },100);
}
function answer(btn){
  if(S.locked)return;S.locked=true;clearInterval(S.timer);
  const [tier,text,ans,fact]=Q[S.i],T=TIERS[tier];
  const right=!!btn&&btn.dataset.ok==="1";
  document.querySelectorAll(".opt").forEach(o=>{o.disabled=true;if(o.dataset.ok==="1")o.classList.add("ok")});
  if(right){
    S.ok++;S.combo++;S.best=Math.max(S.best,S.combo);
    S.score+=Math.round((500+Math.round(S.left*25))*T.m*(1+Math.min(S.combo,10)*0.1));
    $("card").classList.add("pop");
  }else{
    if(btn)btn.classList.add("bad");
    S.combo=0;$("card").classList.add("shake");
  }
  S.log.push({q:text,picked:btn?btn.textContent:null,correct:ans[0],ok:right});
  const r=rnd(right?REACT.ok:REACT.bad);
  $("av").textContent=r[0];
  $("bt").innerHTML=`<b></b>: ${r[2]}<small></small>`;
  $("bt").querySelector("b").textContent=r[1];
  $("bt").querySelector("small").textContent=(btn?"":"⏰ ¡Se acabó el tiempo! ")+fact;
  $("bubble").classList.add("on");
  renderHud();
  $("next").textContent=S.i===Q.length-1?"Ver mi recompensa":"Siguiente";
  $("next").style.display="block";
  $("next").focus();
}
function useFifty(){
  if(S.locked||S.fifty<=0)return;S.fifty--;
  shuffle([...document.querySelectorAll('.opt:not([data-ok="1"])')]).slice(0,2).forEach(o=>{o.disabled=true;o.classList.add("gone")});
  renderHud();
}
function next(){
  if(S.i===Q.length-1)return finish();
  S.i++;load();
}

/* 4. Resultado + respuestas */
function finish(){
  $("ship").style.left="100%";
  show("end");
  const o=S.ok;
  $("pname").textContent=name.toUpperCase();
  $("bounty").textContent=berries(S.score*10000);
  const ranks=[[15,"Rey de los Piratas","¡Perfecto! Hasta Roger te saludaría."],[12,"Yonko","Tu fama hace temblar a la Marina."],[9,"Supernova","Eres de los peligrosos. Un poco más y llegas a la cima."],[6,"Pirata de East Blue","Buen comienzo, pero la Grand Line es dura."],[0,"Grumete","Toca ver más anime y volver a intentarlo."]];
  const r=ranks.find(x=>o>=x[0]);
  $("rank").textContent=r[1];$("endMsg").textContent=r[2];
  $("sOk").textContent=`${o}/${Q.length}`;$("sBad").textContent=Q.length-o;$("sStreak").textContent=S.best;
  const box=$("review");box.innerHTML="";
  S.log.forEach((l,k)=>{
    const d=document.createElement("div");d.className="rv "+(l.ok?"ok":"bad");
    const add=(cls,txt)=>{const p=document.createElement("p");if(cls)p.className=cls;p.textContent=txt;d.appendChild(p)};
    add("rq",`${k+1}. ${l.q}`);
    add("mine "+(l.ok?"ok":"bad"),l.ok?`✓ Tu respuesta: ${l.picked}`:`✗ Tu respuesta: ${l.picked??"(sin responder)"}`);
    if(!l.ok)add("good",`✓ Correcta: ${l.correct}`);
    box.appendChild(d);
  });
}

$("go").onclick=enter;
$("name").addEventListener("keydown",e=>{if(e.key==="Enter")enter()});
$("name").addEventListener("input",()=>$("err").textContent="");
$("next").onclick=next;$("fifty").onclick=useFifty;
$("again").onclick=start;
$("rename").onclick=()=>{show("hello");$("name").focus()};
try{const n=localStorage.getItem("op-name");if(n)$("name").value=n}catch(e){}
runLoader();