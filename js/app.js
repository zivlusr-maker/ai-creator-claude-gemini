// ================================================
//  AI 电商创作工作台 v2.1 — 主应用逻辑
//  Gemini API + 女装/男装真实提示词模版 + 12功能页面
// ================================================
(function(){
'use strict';

const state={
  currentPage:'image-gen', gender:'women',
  selectedTemplate:null, selectedModelId:'models/gemini-3.1-flash-image',
  apiKey:localStorage.getItem('gemini_api_key')||'',
  generationCount:1, aspectRatio:'3:4', savePath:'/outputs/images/'
};

const PAGES={
  'image-gen':renderImageGen,'video-gen':renderVideoGen,
  'reverse-prompt':renderReversePrompt,'video-upscale':renderVideoUpscale,
  'video-motion':renderVideoMotion,'digital-human':renderDigitalHuman,
  'chat':renderChat,'image-dewatermark':renderImageDewatermark,
  'video-dewatermark':renderVideoDewatermark,'batch-gen':renderBatchGen,
  'infinite-canvas':renderInfiniteCanvas,'ecommerce-detail':renderEcommerceDetail
};

function init(){
  document.querySelectorAll('.nav-item').forEach(item=>{
    item.addEventListener('click',e=>{e.preventDefault();navigateTo(item.dataset.page);});
  });
  navigateTo(state.currentPage);
}
function navigateTo(page){
  state.currentPage=page;
  document.querySelectorAll('.nav-item').forEach(i=>i.classList.toggle('active',i.dataset.page===page));
  const main=document.getElementById('main-content');main.innerHTML='';
  if(PAGES[page]){PAGES[page](main);main.classList.remove('page-fade');void main.offsetWidth;main.classList.add('page-fade');}
}
window.navigateTo_=(p)=>navigateTo(p);

/* ---- UI helpers ---- */
const H=(i,t,s)=>`<div class="page-header"><div class="page-title">${i} ${t}</div><div class="page-subtitle">${s}</div></div>`;
const FB=(l,c)=>`<div class="form-block"><div class="form-label">${l}</div>${c}</div>`;
const UZ=(id,acc,hint)=>`<div class="upload-zone"><input type="file" id="file-${id}" accept="${acc}"/><div class="upload-icon">📂</div><div class="upload-title">点击上传或拖拽文件</div><div class="upload-hint">${hint}</div><div class="upload-preview" id="preview-${id}" style="display:none"><img id="preview-img-${id}" src="" style="width:100%;border-radius:6px;margin-top:8px"/></div></div>`;
const SP=(path)=>`<div class="save-location-row"><input class="save-path-input" id="save-path" value="${path}" readonly/><button class="btn btn-secondary btn-sm" onclick="chooseSavePath()">更改</button></div>`;
window.chooseSavePath=function(){const i=document.getElementById('save-path');const p=prompt('保存路径:',i?i.value:'/outputs/');if(p&&i)i.value=p;};

function makeRatioSel(sel){
  const rs=[{v:'1:1',w:40,h:40},{v:'3:4',w:34,h:45},{v:'4:3',w:45,h:34},{v:'9:16',w:28,h:50},{v:'16:9',w:50,h:28},{v:'2:3',w:34,h:51}];
  return '<div class="ratio-grid">'+rs.map(r=>`<div class="ratio-item ${r.v===sel?'selected':''}" data-ratio="${r.v}"><svg class="ratio-visual" width="${r.w}" height="${r.h}"><rect x="0" y="0" width="${r.w}" height="${r.h}" rx="3" fill="${r.v===sel?'rgba(201,168,76,0.3)':'rgba(255,255,255,0.08)'}" stroke="${r.v===sel?'#c9a84c':'rgba(255,255,255,0.12)'}" stroke-width="1.5"/></svg><span>${r.v}</span></div>`).join('')+'</div>';
}
function makeCtr(id,val,mn,mx,lbl){return `<div class="counter-row"><button class="counter-btn" data-counter="${id}" data-op="-">−</button><input class="counter-val" id="counter-${id}" type="number" value="${val}" min="${mn}" max="${mx}"/><button class="counter-btn" data-counter="${id}" data-op="+">+</button><span class="counter-label">${lbl}</span></div>`;}

/* ---- Model selector ---- */
function makeModelSel(){
  let opts='';
  window.GEMINI_MODELS.forEach(g=>{
    opts+=`<optgroup label="${g.group}">`;
    g.models.forEach(m=>{opts+=`<option value="${m.id}" ${m.id===state.selectedModelId?'selected':''}>${m.name}</option>`;});
    opts+='</optgroup>';
  });
  return `<div class="section-card"><div class="section-card-title">🔑 API 设置</div>
<div class="form-block"><div class="form-label">Gemini API Key</div>
<div style="display:flex;gap:8px"><input class="form-input" id="api-key-input" type="password" placeholder="Alz... 开头的API Key" value="${state.apiKey}" style="flex:1;font-family:monospace;font-size:12px"/><button class="btn btn-secondary btn-sm" id="save-key-btn">保存</button></div>
<div style="font-size:11px;color:var(--text-muted);margin-top:4px">Key 仅存储在本地浏览器，不会上传</div></div>
<div class="form-block"><div class="form-label">选择模型</div>
<select class="form-select" id="model-select">${opts}</select>
<div id="model-desc" style="font-size:11px;color:var(--accent-gold);margin-top:5px"></div></div></div>`;
}

/* ---- Template library ---- */
function makeTplLib(gender){
  const tpls=gender==='women'?window.WOMEN_TEMPLATES:window.MEN_TEMPLATES;
  const other=gender==='women'?'men':'women';
  const otherLbl=gender==='women'?'切换男装':'切换女装';
  const groups={};
  tpls.forEach(t=>{if(!groups[t.category])groups[t.category]=[];groups[t.category].push(t);});
  let html=`<div class="section-card"><div class="section-card-title" style="display:flex;justify-content:space-between;align-items:center"><span>📂 提示词模版库 · ${gender==='women'?'女装':'男装'}</span><button class="btn btn-ghost btn-sm" data-switch-gender="${other}">🔄 ${otherLbl}</button></div><div id="template-library">`;
  Object.entries(groups).forEach(([cat,items])=>{
    html+=`<div style="margin-bottom:14px"><div style="font-size:11px;color:var(--text-muted);font-weight:600;letter-spacing:0.5px;text-transform:uppercase;padding:6px 0 8px;border-bottom:1px solid var(--border);margin-bottom:8px">${cat}</div><div style="display:flex;flex-direction:column;gap:6px">`;
    items.forEach(t=>{
      const isSel=state.selectedTemplate&&state.selectedTemplate.id===t.id;
      html+=`<div class="tpl-card" data-tid="${t.id}" data-tgender="${gender}" style="background:${isSel?'rgba(201,168,76,0.12)':'var(--bg-input)'};border:1px solid ${isSel?'var(--accent-gold)':'var(--border)'};border-radius:var(--radius-sm);padding:10px 12px;cursor:pointer;transition:all 0.15s"><div style="display:flex;align-items:center;gap:8px;margin-bottom:4px"><span style="font-size:16px">${t.icon}</span><span class="tpl-name" style="font-size:13px;font-weight:500;color:${isSel?'var(--accent-gold2)':'var(--text-primary)'}">${t.name}</span><span style="margin-left:auto;font-size:10px;background:var(--bg-hover);padding:2px 6px;border-radius:10px;color:var(--text-muted)">${t.ratio}</span></div><div style="font-size:11px;color:var(--text-muted)">${t.tip}</div></div>`;
    });
    html+='</div></div>';
  });
  html+='</div></div>';
  return html;
}

/* ---- Bind events ---- */
function bindEvts(){
  /* ratio */
  document.querySelectorAll('.ratio-item').forEach(item=>{
    item.addEventListener('click',()=>{
      document.querySelectorAll('.ratio-item').forEach(i=>i.classList.remove('selected'));
      item.classList.add('selected');state.aspectRatio=item.dataset.ratio;
    });
  });
  /* counter */
  document.querySelectorAll('.counter-btn').forEach(btn=>{
    btn.addEventListener('click',()=>{
      const id=btn.dataset.counter;const inp=document.getElementById('counter-'+id);if(!inp)return;
      let v=parseInt(inp.value)||1;const mn=parseInt(inp.min)||1;const mx=parseInt(inp.max)||99;
      v=btn.dataset.op==='+'?Math.min(v+1,mx):Math.max(v-1,mn);inp.value=v;
      if(id==='gen-count')state.generationCount=v;
    });
  });
  /* file upload preview */
  document.querySelectorAll('.upload-zone input[type=file]').forEach(inp=>{
    inp.addEventListener('change',e=>{
      const file=e.target.files[0];if(!file||!file.type.startsWith('image/'))return;
      const id=inp.id.replace('file-','');
      const prev=document.getElementById('preview-'+id);const img=document.getElementById('preview-img-'+id);
      if(prev&&img){img.src=URL.createObjectURL(file);prev.style.display='block';}
    });
  });
  /* API key save */
  const skb=document.getElementById('save-key-btn');
  if(skb){skb.addEventListener('click',()=>{const k=document.getElementById('api-key-input').value.trim();if(k){state.apiKey=k;localStorage.setItem('gemini_api_key',k);skb.textContent='✓ 已保存';setTimeout(()=>skb.textContent='保存',1500);}});}
  /* model select */
  const ms=document.getElementById('model-select');
  if(ms){
    const upd=()=>{state.selectedModelId=ms.value;const d=document.getElementById('model-desc');let f=null;window.GEMINI_MODELS.forEach(g=>g.models.forEach(m=>{if(m.id===ms.value)f=m;}));if(d&&f)d.textContent=f.desc;};
    ms.addEventListener('change',upd);upd();
  }
  /* template card click */
  document.querySelectorAll('.tpl-card').forEach(card=>{
    card.addEventListener('click',()=>{
      const id=card.dataset.tid;const gender=card.dataset.tgender;
      const tpls=gender==='women'?window.WOMEN_TEMPLATES:window.MEN_TEMPLATES;
      const t=tpls.find(x=>x.id===id);if(!t)return;
      state.selectedTemplate=t;
      document.querySelectorAll('.tpl-card').forEach(c=>{c.style.background='var(--bg-input)';c.style.borderColor='var(--border)';const n=c.querySelector('.tpl-name');if(n)n.style.color='var(--text-primary)';});
      card.style.background='rgba(201,168,76,0.12)';card.style.borderColor='var(--accent-gold)';
      const n=card.querySelector('.tpl-name');if(n)n.style.color='var(--accent-gold2)';
      const pi=document.getElementById('prompt-input');if(pi)pi.value=t.prompt;
      const ni=document.getElementById('negative-input');if(ni)ni.value=t.negative||'';
      if(t.ratio){
        document.querySelectorAll('.ratio-item').forEach(ri=>{
          const m=ri.dataset.ratio===t.ratio;ri.classList.toggle('selected',m);
          ri.querySelector('rect').setAttribute('fill',m?'rgba(201,168,76,0.3)':'rgba(255,255,255,0.08)');
          ri.querySelector('rect').setAttribute('stroke',m?'#c9a84c':'rgba(255,255,255,0.12)');
        });state.aspectRatio=t.ratio;
      }
      const tip=document.getElementById('template-tip');if(tip)tip.textContent='💡 '+t.tip;
    });
  });
  /* gender switch */
  document.querySelectorAll('[data-switch-gender]').forEach(btn=>{
    btn.addEventListener('click',()=>{state.gender=btn.dataset.switchGender;state.selectedTemplate=null;navigateTo(state.currentPage);});
  });
  /* toggle switch */
  document.querySelectorAll('.toggle-switch').forEach(sw=>{sw.addEventListener('click',()=>sw.classList.toggle('on'));});
  /* action template */
  document.querySelectorAll('.action-template').forEach(el=>{
    el.addEventListener('click',()=>{document.querySelectorAll('.action-template').forEach(e=>e.style.borderColor='var(--border)');el.style.borderColor='var(--accent-gold)';});
  });
  /* tabs */
  document.querySelectorAll('.tab-btn').forEach(btn=>{
    btn.addEventListener('click',()=>{
      const parent=btn.closest('.tabs-row')||btn.parentElement;
      const tabId=btn.dataset.tab||btn.dataset.panel;
      parent.querySelectorAll('.tab-btn').forEach(b=>b.classList.remove('active'));btn.classList.add('active');
      if(btn.dataset.panel){
        document.getElementById('panel-templates').style.display=tabId==='templates'?'block':'none';
        document.getElementById('panel-results').style.display=tabId==='results'?'flex':'none';
      } else if(btn.dataset.tab){
        document.getElementById('tab-template')&&(document.getElementById('tab-template').style.display=tabId==='template'?'block':'none');
        document.getElementById('tab-replace')&&(document.getElementById('tab-replace').style.display=tabId==='replace'?'block':'none');
      }
    });
  });
}

/* ---- Generation helpers ---- */
function simGen(count,onDone){
  const area=document.getElementById('result-area');if(!area)return;
  area.className='';
  area.innerHTML=`<div style="padding:20px 0"><div style="font-size:13px;color:var(--text-secondary);margin-bottom:12px">⏳ 正在生成中，请稍候…</div><div class="progress-bar" style="max-width:300px;margin-bottom:20px"><div class="progress-fill" id="gen-progress" style="width:0%"></div></div><div class="loading-grid">${Array(count).fill(0).map(()=>'<div class="skeleton-card"><div class="skeleton-img"></div><div class="skeleton-bar"></div></div>').join('')}</div></div>`;
  let p=0;const pbar=document.getElementById('gen-progress');
  const ti=setInterval(()=>{p+=Math.random()*15+5;if(pbar)pbar.style.width=Math.min(p,92)+'%';},300);
  setTimeout(()=>{clearInterval(ti);if(pbar)pbar.style.width='100%';setTimeout(()=>{if(onDone)onDone();},300);},2400);
}
let generatedAssets=[];

async function fileToInlinePart(file){
  return new Promise((resolve,reject)=>{
    const reader=new FileReader();
    reader.onerror=()=>reject(new Error('读取图片失败，请重新选择文件。'));
    reader.onload=()=>{
      const value=String(reader.result||'');
      const comma=value.indexOf(',');
      if(comma<0){reject(new Error('图片编码失败。'));return;}
      resolve({inline_data:{mime_type:file.type||'image/jpeg',data:value.slice(comma+1)}});
    };
    reader.readAsDataURL(file);
  });
}

function normalizeImageModel(modelId){
  const raw=String(modelId||'').replace(/^models\//,'');
  const aliases={
    'gemini-3.1-flash-image-preview':'gemini-3.1-flash-image',
    'gemini-3-pro-image-preview':'gemini-3-pro-image',
    'imagen-4.0-generate-001':'gemini-3.1-flash-image',
    'imagen-4.0-ultra-generate-001':'gemini-3-pro-image',
    'imagen-4.0-fast-generate-001':'gemini-3.1-flash-lite-image'
  };
  const model=aliases[raw]||raw;
  const allowed=['gemini-2.5-flash-image','gemini-3.1-flash-image','gemini-3.1-flash-lite-image','gemini-3-pro-image'];
  return allowed.includes(model)?model:'gemini-3.1-flash-image';
}

function toApiAspectRatio(value){
  const ratios={
    '1:1':'ASPECT_RATIO_ONE_BY_ONE',
    '2:3':'ASPECT_RATIO_TWO_BY_THREE',
    '3:2':'ASPECT_RATIO_THREE_BY_TWO',
    '3:4':'ASPECT_RATIO_THREE_BY_FOUR',
    '4:3':'ASPECT_RATIO_FOUR_BY_THREE',
    '4:5':'ASPECT_RATIO_FOUR_BY_FIVE',
    '5:4':'ASPECT_RATIO_FIVE_BY_FOUR',
    '9:16':'ASPECT_RATIO_NINE_BY_SIXTEEN',
    '16:9':'ASPECT_RATIO_SIXTEEN_BY_NINE',
    '21:9':'ASPECT_RATIO_TWENTY_ONE_BY_NINE'
  };
  return ratios[value]||'ASPECT_RATIO_ONE_BY_ONE';
}

function friendlyApiError(status,message){
  const msg=String(message||'').replace(/AIza[0-9A-Za-z_-]+/g,'[API Key]');
  if(status===400&&/API_KEY_INVALID|API key not valid/i.test(msg))return 'Google API Key 无效，请重新检查后保存。';
  if(status===403)return 'Google 拒绝了请求。请确认该 Key 已启用 Gemini API，并允许 generativelanguage.googleapis.com。';
  if(status===429)return 'Google API 配额不足或请求过快，请稍后再试，或检查项目配额/结算设置。';
  if(status>=500)return 'Google 图片服务暂时不可用，请稍后重试。';
  return msg||('请求失败（HTTP '+status+'）');
}

function extractGeneratedImage(payload){
  const candidates=Array.isArray(payload&&payload.candidates)?payload.candidates:[];
  for(const candidate of candidates){
    const parts=candidate&&candidate.content&&Array.isArray(candidate.content.parts)?candidate.content.parts:[];
    for(const part of parts){
      if(part&&part.thought)continue;
      const inline=part&&(part.inlineData||part.inline_data);
      if(inline&&inline.data){
        const mimeType=inline.mimeType||inline.mime_type||'image/png';
        if(String(mimeType).startsWith('image/'))return {data:inline.data,mimeType};
      }
    }
  }
  const reason=payload&&payload.promptFeedback&&payload.promptFeedback.blockReason;
  const text=candidates.flatMap(c=>c&&c.content&&Array.isArray(c.content.parts)?c.content.parts:[]).map(p=>p&&p.text).filter(Boolean).join(' ');
  throw new Error(reason?('请求被安全策略拦截：'+reason):(text||'Google 返回了响应，但其中没有图片数据。'));
}

async function generateGeminiImage(apiKey,model,prompt,imageParts,aspectRatio,variation){
  const text=prompt+'\n\nReference image 1 is the garment/product image. If reference image 2 is present, use it only as the face identity reference. Preserve the garment design, color, logo, texture and silhouette faithfully. Produce exactly one final image. Variation '+variation+'.';
  const body={
    contents:[{role:'user',parts:[{text}].concat(imageParts)}],
    generationConfig:{
      responseModalities:['TEXT','IMAGE'],
      responseFormat:{image:{aspectRatio:toApiAspectRatio(aspectRatio)}}
    }
  };
  const response=await fetch('https://generativelanguage.googleapis.com/v1/models/'+encodeURIComponent(model)+':generateContent',{
    method:'POST',
    headers:{'Content-Type':'application/json','x-goog-api-key':apiKey},
    body:JSON.stringify(body)
  });
  let payload={};
  try{payload=await response.json();}catch(_){}
  if(!response.ok)throw new Error(friendlyApiError(response.status,payload&&payload.error&&payload.error.message));
  return extractGeneratedImage(payload);
}

function base64ImageToUrl(image){
  const binary=atob(image.data);
  const bytes=new Uint8Array(binary.length);
  for(let i=0;i<binary.length;i++)bytes[i]=binary.charCodeAt(i);
  return URL.createObjectURL(new Blob([bytes],{type:image.mimeType}));
}

function clearGeneratedAssets(){
  generatedAssets.forEach(item=>URL.revokeObjectURL(item.url));
  generatedAssets=[];
}

function renderGenerationProgress(done,total){
  const area=document.getElementById('result-area');if(!area)return;
  const percent=Math.round((done/Math.max(total,1))*100);
  area.className='';
  area.innerHTML='<div style="padding:20px 0"><div style="font-size:13px;color:var(--text-secondary);margin-bottom:12px">⏳ 正在调用 Gemini 生成图片… '+done+'/'+total+'</div><div class="progress-bar" style="max-width:300px"><div class="progress-fill" style="width:'+percent+'%"></div></div><div style="font-size:11px;color:var(--text-muted);margin-top:10px">请保持页面打开，生成多张图片会依次请求。</div></div>';
}

function triggerImageDownload(item,index){
  const a=document.createElement('a');
  a.href=item.url;
  a.download='gemini-fashion-'+String(index+1).padStart(2,'0')+'.'+(item.mimeType.includes('jpeg')?'jpg':item.mimeType.includes('webp')?'webp':'png');
  document.body.appendChild(a);a.click();a.remove();
}

function renderGeneratedResults(images,failures){
  const area=document.getElementById('result-area');if(!area)return;
  clearGeneratedAssets();
  generatedAssets=images.map(image=>({url:base64ImageToUrl(image),mimeType:image.mimeType}));
  area.className='';
  area.innerHTML='';
  const top=document.createElement('div');
  top.style.cssText='margin-bottom:14px;display:flex;justify-content:space-between;align-items:center;gap:10px';
  const status=document.createElement('div');
  status.style.cssText='font-size:13px;color:var(--accent-green)';
  status.textContent='✅ 已生成 '+generatedAssets.length+' 张真实图片'+(failures.length?'，'+failures.length+' 张失败':'');
  const all=document.createElement('button');
  all.className='btn btn-secondary btn-sm';all.textContent='⬇ 全部下载';
  all.addEventListener('click',()=>generatedAssets.forEach((item,index)=>triggerImageDownload(item,index)));
  top.append(status,all);area.appendChild(top);
  const grid=document.createElement('div');grid.className='result-grid';
  generatedAssets.forEach((item,index)=>{
    const card=document.createElement('div');card.className='result-card';
    const img=document.createElement('img');
    img.src=item.url;img.alt='Gemini 生成图片 '+(index+1);img.loading='lazy';
    img.style.cssText='display:block;width:100%;height:auto;background:var(--bg-input)';
    const actions=document.createElement('div');actions.className='card-actions';
    const download=document.createElement('button');
    download.className='btn btn-secondary btn-sm';download.style.flex='1';download.textContent='⬇ 下载';
    download.addEventListener('click',()=>triggerImageDownload(item,index));
    const view=document.createElement('button');
    view.className='btn btn-secondary btn-sm btn-icon';view.textContent='🔍';
    view.addEventListener('click',()=>window.open(item.url,'_blank','noopener,noreferrer'));
    actions.append(download,view);card.append(img,actions);grid.appendChild(card);
  });
  area.appendChild(grid);
  if(failures.length){
    const note=document.createElement('div');
    note.style.cssText='margin-top:12px;font-size:11px;color:var(--accent-red)';
    note.textContent='部分失败：'+failures[0];
    area.appendChild(note);
  }
}

function renderGenerationError(message){
  const area=document.getElementById('result-area');if(!area)return;
  area.className='';
  area.innerHTML='';
  const box=document.createElement('div');
  box.className='section-card';
  box.style.borderColor='rgba(239,100,100,.45)';
  const title=document.createElement('div');
  title.style.cssText='color:var(--accent-red);font-size:13px;font-weight:600;margin-bottom:8px';
  title.textContent='❌ 生成失败';
  const detail=document.createElement('div');
  detail.style.cssText='font-size:12px;color:var(--text-secondary);line-height:1.7;white-space:pre-wrap';
  detail.textContent=String(message||'未知错误');
  box.append(title,detail);area.appendChild(box);
}

let generatedVideoAssets=[];

function clearGeneratedVideoAssets(){
  generatedVideoAssets.forEach(item=>URL.revokeObjectURL(item.url));
  generatedVideoAssets=[];
}

function renderVideoProgress(message,percent){
  const area=document.getElementById('result-area');if(!area)return;
  area.className='';
  area.innerHTML='<div style="padding:20px 0"><div style="font-size:13px;color:var(--text-secondary);margin-bottom:12px">⏳ '+message+'</div><div class="progress-bar" style="max-width:320px"><div class="progress-fill" style="width:'+Math.max(3,Math.min(percent,95))+'%"></div></div><div style="font-size:11px;color:var(--text-muted);margin-top:10px">真实视频生成通常需要几十秒到数分钟，请保持页面打开。</div></div>';
}

function extractInteractionVideo(interaction){
  const direct=interaction&&(interaction.output_video||interaction.outputVideo);
  if(direct&&(direct.data||direct.uri))return direct;
  const steps=interaction&&Array.isArray(interaction.steps)?interaction.steps:[];
  for(const step of steps){
    if(!step||step.type!=='model_output'||!Array.isArray(step.content))continue;
    for(const content of step.content){
      if(content&&content.type==='video'&&(content.data||content.uri))return content;
    }
  }
  return null;
}

async function interactionMediaFromFile(file){
  const part=await fileToInlinePart(file);
  return {type:file.type.startsWith('video/')?'video':'image',mime_type:part.inline_data.mime_type,data:part.inline_data.data};
}

async function fetchInteractionJson(url,options,apiKey){
  const response=await fetch(url,Object.assign({},options||{},{headers:Object.assign({'x-goog-api-key':apiKey},options&&options.headers||{})}));
  let payload={};
  try{payload=await response.json();}catch(_){ }
  if(!response.ok)throw new Error(friendlyApiError(response.status,payload&&payload.error&&payload.error.message));
  return payload;
}

async function generateOmniVideo(apiKey,prompt,mediaFiles,format,onProgress){
  const files=mediaFiles?(Array.isArray(mediaFiles)?mediaFiles:[mediaFiles]):[];
  const input=[];
  for(const file of files)input.push(await interactionMediaFromFile(file));
  input.push({type:'text',text:prompt});
  const durationSeconds=Math.max(3,Math.min(10,parseInt(format.duration,10)||8));
  const responseFormat={
    type:'video',
    delivery:'inline',
    aspect_ratio:format.aspectRatio==='9:16'?'9:16':'16:9',
    resolution:['360p','720p','1080p','4k'].includes(format.resolution)?format.resolution:'720p',
    duration:durationSeconds+'s'
  };
  let interaction=await fetchInteractionJson('https://generativelanguage.googleapis.com/v1beta/interactions',{
    method:'POST',
    headers:{'Content-Type':'application/json'},
    body:JSON.stringify({
      model:'gemini-omni-1.1-flash',
      input:files.length?input:prompt,
      response_format:responseFormat,
      background:true,
      store:true
    })
  },apiKey);
  const started=Date.now();
  while(interaction.status==='in_progress'||interaction.status==='queued'){
    const elapsed=Math.round((Date.now()-started)/1000);
    onProgress('Gemini Omni 正在生成视频（'+elapsed+' 秒）…',Math.min(90,10+elapsed/4));
    await new Promise(resolve=>setTimeout(resolve,5000));
    if(Date.now()-started>10*60*1000)throw new Error('视频生成超过 10 分钟，请稍后重试。');
    interaction=await fetchInteractionJson('https://generativelanguage.googleapis.com/v1beta/interactions/'+encodeURIComponent(interaction.id),{method:'GET'},apiKey);
  }
  if(interaction.status!=='completed'){
    const message=interaction&&interaction.error&&interaction.error.message;
    throw new Error(message||('视频任务结束，状态：'+String(interaction.status||'unknown')));
  }
  const output=extractInteractionVideo(interaction);
  if(!output)throw new Error('Google 返回任务已完成，但响应中没有视频数据。');
  if(output.data){
    const binary=atob(output.data);const bytes=new Uint8Array(binary.length);
    for(let i=0;i<binary.length;i++)bytes[i]=binary.charCodeAt(i);
    const blob=new Blob([bytes],{type:output.mime_type||output.mimeType||'video/mp4'});
    return {url:URL.createObjectURL(blob),mimeType:blob.type||'video/mp4'};
  }
  const videoResponse=await fetch(output.uri,{headers:{'x-goog-api-key':apiKey}});
  if(!videoResponse.ok)throw new Error('视频生成成功，但下载失败（HTTP '+videoResponse.status+'）。');
  const blob=await videoResponse.blob();
  return {url:URL.createObjectURL(blob),mimeType:blob.type||'video/mp4'};
}

function downloadVideoAsset(item,index){
  const a=document.createElement('a');a.href=item.url;a.download='gemini-video-'+String(index+1).padStart(2,'0')+'.mp4';
  document.body.appendChild(a);a.click();a.remove();
}

function renderVideoResults(items){
  const area=document.getElementById('result-area');if(!area)return;
  clearGeneratedVideoAssets();generatedVideoAssets=items;
  area.className='';area.innerHTML='';
  const status=document.createElement('div');status.style.cssText='color:var(--accent-green);font-size:13px;margin-bottom:14px';status.textContent='✅ 已生成 '+items.length+' 条真实视频';area.appendChild(status);
  const grid=document.createElement('div');grid.className='result-grid';
  items.forEach((item,index)=>{
    const card=document.createElement('div');card.className='result-card';
    const video=document.createElement('video');video.src=item.url;video.controls=true;video.playsInline=true;video.preload='metadata';video.style.cssText='display:block;width:100%;background:#000';
    const actions=document.createElement('div');actions.className='card-actions';
    const download=document.createElement('button');download.className='btn btn-secondary btn-sm';download.style.flex='1';download.textContent='⬇ 下载视频';download.addEventListener('click',()=>downloadVideoAsset(item,index));
    actions.appendChild(download);card.append(video,actions);grid.appendChild(card);
  });
  area.appendChild(grid);
}

async function generateGeminiText(apiKey,prompt,mediaFiles){
  const files=mediaFiles?(Array.isArray(mediaFiles)?mediaFiles:[mediaFiles]):[];
  const parts=[{text:prompt}];
  for(const file of files){
    const part=await fileToInlinePart(file);
    parts.push(part);
  }
  const response=await fetch('https://generativelanguage.googleapis.com/v1/models/gemini-3.8-flash:generateContent',{
    method:'POST',headers:{'Content-Type':'application/json','x-goog-api-key':apiKey},
    body:JSON.stringify({contents:[{role:'user',parts}]})
  });
  let payload={};try{payload=await response.json();}catch(_){ }
  if(!response.ok)throw new Error(friendlyApiError(response.status,payload&&payload.error&&payload.error.message));
  const text=(payload.candidates||[]).flatMap(candidate=>candidate&&candidate.content&&candidate.content.parts||[]).map(part=>part.text||'').join('').trim();
  if(!text)throw new Error('Google 返回了响应，但没有文本内容。');
  return text;
}

function getPageApiKey(){
  return ((document.getElementById('api-key-input')&&document.getElementById('api-key-input').value)||state.apiKey||'').trim();
}

function setBusy(button,busy,label){
  if(!button)return;button.disabled=busy;button.textContent=busy?'⏳ 处理中…':label;
}

function renderTextResult(title,text){
  const area=document.getElementById('result-area');if(!area)return;
  area.className='';area.innerHTML='';
  const card=document.createElement('div');card.className='section-card';
  const heading=document.createElement('div');heading.className='section-card-title';heading.textContent=title;
  const body=document.createElement('div');body.style.cssText='font-size:13px;line-height:1.85;color:var(--text-primary);white-space:pre-wrap';body.textContent=text;
  const copy=document.createElement('button');copy.className='btn btn-secondary btn-sm';copy.style.marginTop='12px';copy.textContent='复制结果';copy.addEventListener('click',()=>navigator.clipboard.writeText(text));
  card.append(heading,body,copy);area.appendChild(card);
}

function parseJsonFromText(text){
  const cleaned=String(text).replace(/^```(?:json)?\s*/i,'').replace(/\s*```$/,'').trim();
  const start=cleaned.indexOf('{'),end=cleaned.lastIndexOf('}');
  if(start<0||end<start)throw new Error('AI 返回内容不是有效 JSON，请重试。');
  return JSON.parse(cleaned.slice(start,end+1));
}

function escapeHtml(value){
  return String(value==null?'':value).replace(/[&<>"']/g,char=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));
}

function fileToDataUrl(file){
  return new Promise((resolve,reject)=>{const reader=new FileReader();reader.onerror=()=>reject(new Error('读取文件失败。'));reader.onload=()=>resolve(String(reader.result||''));reader.readAsDataURL(file);});
}

function downloadTextFile(filename,content,type){
  const url=URL.createObjectURL(new Blob([content],{type:type||'text/plain;charset=utf-8'}));
  const link=document.createElement('a');link.href=url;link.download=filename;document.body.appendChild(link);link.click();link.remove();setTimeout(()=>URL.revokeObjectURL(url),1000);
}

/* ============================================================
   PAGE 1: IMAGE GEN
   ============================================================ */
function renderImageGen(root){
  state.selectedModelId='models/gemini-3.1-flash-image';
  root.innerHTML=H('🖼','图片生成','选择提示词模版，上传服装图片，一键生成模特展示图')+`
<div class="page-body">
<div class="left-panel">
${makeModelSel()}
<div class="section-card"><div class="section-card-title">📷 上传图片</div>
${UZ('cloth','image/*','服装图片（必须）JPG/PNG；参考图合计最大14MB')}
<div style="margin-top:10px">${UZ('face','image/*','人脸参考图（部分模版需要）')}</div></div>
<div class="section-card"><div class="section-card-title">✏️ 提示词</div>
<div id="template-tip" style="font-size:11px;color:var(--accent-gold);margin-bottom:8px;min-height:16px"></div>
${FB('正向提示词','<textarea class="form-textarea" id="prompt-input" rows="5" placeholder="从右侧模版库选择，或手动输入提示词…"></textarea>')}
${FB('反向提示词','<textarea class="form-textarea" id="negative-input" rows="2" placeholder="不希望出现的内容…"></textarea>')}
</div>
<div class="section-card"><div class="section-card-title">⚙️ 生成参数</div>
${FB('图片比例',makeRatioSel(state.aspectRatio))}
${FB('生成数量',makeCtr('gen-count',state.generationCount,1,9,'张（最多9张）'))}
${FB('保存位置',SP(state.savePath))}
</div>
<button class="btn btn-primary" id="gen-btn">✦ 开始生成</button>
</div>
<div class="right-panel" style="display:flex;flex-direction:column;gap:0;padding:0">
<div class="tabs-row" style="border-bottom:1px solid var(--border);flex-shrink:0;margin:0">
<button class="tab-btn active" data-panel="templates" style="padding:14px 20px">模版库</button>
<button class="tab-btn" data-panel="results" style="padding:14px 20px">生成结果</button>
</div>
<div id="panel-templates" style="flex:1;overflow-y:auto;padding:20px">${makeTplLib(state.gender)}</div>
<div id="panel-results" style="flex:1;overflow-y:auto;padding:20px;display:none">
<div class="result-placeholder" id="result-area"><div class="placeholder-icon">🖼</div><div class="placeholder-text">点击"开始生成"后，结果将在此处显示</div></div>
</div>
</div>
</div>`;
  bindEvts();
  document.getElementById('gen-btn').addEventListener('click',async function handleGenerateClick(){
  const button=document.getElementById('gen-btn');
  const key=(document.getElementById('api-key-input')&&document.getElementById('api-key-input').value||state.apiKey||'').trim();
  const cloth=document.getElementById('file-cloth')&&document.getElementById('file-cloth').files[0];
  const face=document.getElementById('file-face')&&document.getElementById('file-face').files[0];
  const prompt=(document.getElementById('prompt-input')&&document.getElementById('prompt-input').value||'').trim();
  const negative=(document.getElementById('negative-input')&&document.getElementById('negative-input').value||'').trim();
  document.querySelectorAll('[data-panel]').forEach(b=>b.classList.toggle('active',b.dataset.panel==='results'));
  document.getElementById('panel-templates').style.display='none';
  document.getElementById('panel-results').style.display='flex';
  if(!key){renderGenerationError('请先填入 Google Gemini API Key。');return;}
  if(!cloth){renderGenerationError('请先上传服装图片。');return;}
  if(!prompt){renderGenerationError('请选择提示词模版或手动输入提示词。');return;}
  const files=[cloth].concat(face?[face]:[]);
  const totalBytes=files.reduce((sum,file)=>sum+file.size,0);
  if(totalBytes>14*1024*1024){renderGenerationError('参考图片合计不能超过 14MB，请压缩后重试。');return;}
  const count=Math.max(1,Math.min(9,parseInt(document.getElementById('counter-gen-count')&&document.getElementById('counter-gen-count').value||1,10)||1));
  const model=normalizeImageModel(state.selectedModelId);
  const fullPrompt=negative?prompt+'\n\nAvoid the following: '+negative:prompt;
  state.apiKey=key;state.generationCount=count;
  button.disabled=true;button.textContent='⏳ 生成中…';
  clearGeneratedAssets();renderGenerationProgress(0,count);
  try{
    const imageParts=[];
    for(const file of files)imageParts.push(await fileToInlinePart(file));
    const images=[];const failures=[];
    for(let i=0;i<count;i++){
      try{images.push(await generateGeminiImage(key,model,fullPrompt,imageParts,state.aspectRatio,i+1));}
      catch(error){failures.push(error&&error.message?error.message:String(error));}
      renderGenerationProgress(i+1,count);
      if(!images.length&&failures.length&&/API Key|Google 拒绝|配额不足/i.test(failures[0]))break;
    }
    if(!images.length)throw new Error(failures[0]||'没有生成任何图片。');
    renderGeneratedResults(images,failures);
  }catch(error){
    renderGenerationError(error&&error.message?error.message:String(error));
  }finally{
    button.disabled=false;button.textContent='✦ 开始生成';
  }
});
}

/* ============================================================
   PAGE 2: VIDEO GEN
   ============================================================ */
function renderVideoGen(root){
  const vp=window.VIDEO_PROMPTS;
  state.selectedModelId='models/gemini-omni-1.1-flash';
  root.innerHTML=H('🎬','视频生成','将服装图片生成为动态展示视频')+`
<div class="page-body">
<div class="left-panel">
${makeModelSel()}
${UZ('video-src','image/*','上传参考图片（可选；不上传则文字生成视频）')}
<div class="section-card"><div class="section-card-title">⚙️ 视频参数</div>
${FB('提示词','<textarea class="form-textarea" id="video-prompt" rows="3" placeholder="描述视频动作和氛围…例如：模特缓慢行走，风衣随风飘动"></textarea>')}
${FB('视频时长','<select class="form-select" id="video-duration"><option value="5">5秒</option><option value="8">8秒</option><option value="10">10秒</option></select>')}
${FB('画面比例','<select class="form-select" id="video-aspect"><option value="9:16">9:16 竖屏</option><option value="16:9">16:9 横屏</option></select>')}
${FB('分辨率','<select class="form-select" id="video-resolution"><option value="720p">720p（推荐）</option><option value="1080p">1080p</option></select>')}
${FB('镜头运动','<select class="form-select" id="video-motion">'+vp.motion.map(m=>`<option>${m}</option>`).join('')+'</select>')}
${FB('视频风格','<select class="form-select" id="video-style">'+vp.style.map(s=>`<option>${s}</option>`).join('')+'</select>')}
${FB('生成数量',makeCtr('video-count',1,1,4,'最多4条'))}
${FB('保存位置',SP('/outputs/videos/'))}
</div>
<button class="btn btn-primary" id="video-gen-btn">✦ 生成视频</button>
</div>
<div class="right-panel"><div id="result-area" class="result-placeholder"><div class="placeholder-icon">🎬</div><div class="placeholder-text">视频生成结果将在此处显示</div></div></div>
</div>`;
  bindEvts();
  document.getElementById('video-gen-btn').addEventListener('click',async()=>{
    const button=document.getElementById('video-gen-btn');
    const key=(document.getElementById('api-key-input')&&document.getElementById('api-key-input').value||state.apiKey||'').trim();
    const source=document.getElementById('file-video-src')&&document.getElementById('file-video-src').files[0];
    const prompt=(document.getElementById('video-prompt').value||'').trim();
    if(!key){renderGenerationError('请先填入 Google Gemini API Key。');return;}
    if(!prompt){renderGenerationError('请先输入视频提示词。');return;}
    if(source&&source.size>14*1024*1024){renderGenerationError('参考图片不能超过 14MB，请压缩后重试。');return;}
    const count=Math.max(1,Math.min(4,parseInt(document.getElementById('counter-video-count').value||1,10)||1));
    const duration=document.getElementById('video-duration').value;
    const aspectRatio=document.getElementById('video-aspect').value;
    const resolution=document.getElementById('video-resolution').value;
    const motion=document.getElementById('video-motion').value;
    const style=document.getElementById('video-style').value;
    const fullPrompt=prompt+'\nStyle: '+style+'. Camera movement: '+motion+'. Create a single coherent fashion product video. Preserve the clothing design, colors, logo and texture. Duration: '+duration+' seconds.';
    button.disabled=true;button.textContent='⏳ 生成中…';clearGeneratedVideoAssets();
    try{
      const results=[];
      for(let i=0;i<count;i++){
        renderVideoProgress('正在生成第 '+(i+1)+'/'+count+' 条视频…',5+(i/count)*85);
        results.push(await generateOmniVideo(key,fullPrompt+' Variation '+(i+1)+'.',source,{duration,aspectRatio,resolution},(message,percent)=>renderVideoProgress(message,Math.min(95,(i/count)*90+percent/count))));
      }
      renderVideoResults(results);
    }catch(error){renderGenerationError(error&&error.message?error.message:String(error));}
    finally{button.disabled=false;button.textContent='✦ 生成视频';}
  });
}

/* ============================================================
   PAGE 3: REVERSE PROMPT
   ============================================================ */
function renderReversePrompt(root){
  state.selectedModelId='models/gemini-3.8-flash';
  root.innerHTML=H('🔍','反推提示词','上传图片，AI 自动分析并生成对应提示词')+`
<div class="page-body">
<div class="left-panel">
${makeModelSel()}
${UZ('reverse','image/*','上传要分析的图片')}
<div class="section-card"><div class="section-card-title">⚙️ 分析设置</div>
${['服装风格与品类','模特特征','场景环境','光线效果','色彩搭配','图像质量描述'].map(d=>`<label style="display:flex;align-items:center;gap:8px;cursor:pointer;font-size:13px;color:var(--text-secondary);margin-bottom:8px"><input type="checkbox" checked style="accent-color:var(--accent-gold)"> ${d}</label>`).join('')}
${FB('输出语言','<select class="form-select" id="reverse-language"><option>中英双语</option><option>中文提示词</option><option>English Prompts</option></select>')}
</div>
<button class="btn btn-primary" id="reverse-btn">✦ 开始分析</button>
</div>
<div class="right-panel"><div id="result-area" class="result-placeholder"><div class="placeholder-icon">🔍</div><div class="placeholder-text">分析结果将在此处显示</div></div></div>
</div>`;
  bindEvts();
  document.getElementById('reverse-btn').addEventListener('click',async()=>{
    const button=document.getElementById('reverse-btn'),key=getPageApiKey(),file=document.getElementById('file-reverse').files[0];
    if(!key){renderGenerationError('请先填入 Google Gemini API Key。');return;}
    if(!file){renderGenerationError('请先上传要分析的图片。');return;}
    const language=document.getElementById('reverse-language').value;
    setBusy(button,true,'✦ 开始分析');renderTextResult('分析中','Gemini 正在读取图片并反推提示词…');
    try{
      const prompt='Analyze this ecommerce/fashion image in detail. Return '+language+' output with sections for subject/product, clothing details, model, pose, composition, scene, lighting, color palette, camera/lens, quality keywords, negative prompt, and one complete reusable image-generation prompt. Be concrete and faithful to visible details.';
      renderTextResult('真实反推结果',await generateGeminiText(key,prompt,file));
    }catch(error){renderGenerationError(error.message||String(error));}
    finally{setBusy(button,false,'✦ 开始分析');}
  });
}

/* ============================================================
   PAGE 4: VIDEO UPSCALE
   ============================================================ */
function renderVideoUpscale(root){
  state.selectedModelId='models/gemini-omni-1.1-flash';
  root.innerHTML=H('📐','视频高清重制','使用 Gemini Omni 生成式重制清晰度；输出可能与原视频存在细微差异')+`
<div class="page-body">
<div class="left-panel">
${makeModelSel()}
${UZ('upscale','video/*','上传视频文件，支持 MP4 / MOV')}
<div class="section-card"><div class="section-card-title">⚙️ 放大参数</div>
${FB('目标分辨率','<select class="form-select" id="upscale-resolution"><option value="1080p">1080p</option><option value="4k">4K（费用和耗时更高）</option></select>')}
${FB('画面比例','<select class="form-select" id="upscale-aspect"><option value="16:9">16:9 横屏</option><option value="9:16">9:16 竖屏</option></select>')}
${FB('处理要求','<textarea class="form-textarea" id="upscale-prompt" rows="3">Remaster this video with cleaner details, reduced compression artifacts, stable motion, natural skin and faithful colors. Preserve the original subject, clothing, timing and composition.</textarea>')}
${FB('保存位置',SP('/outputs/upscaled/'))}
</div>
<button class="btn btn-primary" id="upscale-btn">✦ 开始放大</button>
</div>
<div class="right-panel"><div id="result-area" class="result-placeholder"><div class="placeholder-icon">📐</div><div class="placeholder-text">放大后的视频将在此处显示</div></div></div>
</div>`;
  bindEvts();
  document.getElementById('upscale-btn').addEventListener('click',async()=>{
    const button=document.getElementById('upscale-btn'),key=getPageApiKey(),file=document.getElementById('file-upscale').files[0];
    if(!key){renderGenerationError('请先填入 Google Gemini API Key。');return;}
    if(!file){renderGenerationError('请先上传视频。');return;}
    if(file.size>30*1024*1024){renderGenerationError('浏览器直传视频请控制在 30MB 以内。');return;}
    setBusy(button,true,'✦ 开始重制');clearGeneratedVideoAssets();
    try{
      const format={duration:'8',aspectRatio:document.getElementById('upscale-aspect').value,resolution:document.getElementById('upscale-resolution').value};
      const item=await generateOmniVideo(key,document.getElementById('upscale-prompt').value,file,format,renderVideoProgress);
      renderVideoResults([item]);
    }catch(error){renderGenerationError(error.message||String(error));}
    finally{setBusy(button,false,'✦ 开始重制');}
  });
}

/* ============================================================
   PAGE 5: VIDEO MOTION
   ============================================================ */
function renderVideoMotion(root){
  const vp=window.VIDEO_PROMPTS;const at=window.ACTION_TEMPLATES;
  state.selectedModelId='models/gemini-omni-1.1-flash';
  root.innerHTML=H('🕺','动作模版 / 人物替换','选择动作模板或上传参考视频，替换为指定人物模特')+`
<div class="page-body">
<div class="left-panel">
<div class="tabs-row"><button class="tab-btn active" data-tab="template">动作模版</button><button class="tab-btn" data-tab="replace">人物替换</button></div>
<div id="tab-template">
${FB('选择动作模版','<div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-bottom:14px">'+at.map(t=>`<div class="section-card action-template" data-id="${t.id}" style="cursor:pointer;text-align:center;padding:14px"><div style="font-size:28px;margin-bottom:6px">${t.icon}</div><div style="font-size:13px;font-weight:500;margin-bottom:2px">${t.name}</div><div style="font-size:11px;color:var(--text-muted)">${t.desc}</div></div>`).join('')+'</div>')}
${UZ('motion-cloth','image/*','上传服装图片')}
<div style="margin-top:10px">${UZ('motion-model','image/*','上传模特参考图（可选）')}</div>
${FB('视频时长','<select class="form-select" id="motion-duration"><option value="5">5秒</option><option value="8">8秒</option><option value="10">10秒</option></select>')}
${FB('保存位置',SP('/outputs/motion/'))}
<button class="btn btn-primary" id="motion-gen-btn" style="margin-top:14px">✦ 生成动作视频</button>
</div>
<div id="tab-replace" style="display:none">
${UZ('orig-video','video/*','上传原始视频（含人物）')}
<div style="margin-top:10px">${UZ('target-face','image/*','上传目标人物/模特图片')}</div>
${FB('保持服装','<div class="toggle-row"><div class="toggle-label">保留原视频服装</div><div class="toggle-switch on"></div></div>')}
${FB('保存位置',SP('/outputs/replace/'))}
<button class="btn btn-primary" id="replace-btn" style="margin-top:14px">✦ 替换人物</button>
</div>
</div>
<div class="right-panel"><div id="result-area" class="result-placeholder"><div class="placeholder-icon">🕺</div><div class="placeholder-text">生成结果将在此处显示</div></div></div>
</div>`;
  bindEvts();
  let selectedAction=at[0];
  document.querySelectorAll('.action-template').forEach(card=>card.addEventListener('click',()=>{selectedAction=at.find(item=>item.id===card.dataset.id)||at[0];}));
  document.getElementById('motion-gen-btn').addEventListener('click',async()=>{
    const button=document.getElementById('motion-gen-btn'),key=getPageApiKey(),cloth=document.getElementById('file-motion-cloth').files[0],model=document.getElementById('file-motion-model').files[0];
    if(!key){renderGenerationError('请先在图片或视频生成页保存 Google Gemini API Key。');return;}
    if(!cloth){renderGenerationError('请先上传服装图片。');return;}
    setBusy(button,true,'✦ 生成动作视频');
    try{
      const prompt='Create a vertical ecommerce fashion video. The subject performs: '+selectedAction.name+' — '+selectedAction.desc+'. Use the first image as the exact clothing reference and the second image, if present, as the model identity. Preserve clothing design, logo, color and texture. Single coherent shot, realistic movement.';
      const item=await generateOmniVideo(key,prompt,model?[cloth,model]:cloth,{duration:document.getElementById('motion-duration').value,aspectRatio:'9:16',resolution:'720p'},renderVideoProgress);
      renderVideoResults([item]);
    }catch(error){renderGenerationError(error.message||String(error));}
    finally{setBusy(button,false,'✦ 生成动作视频');}
  });
  document.getElementById('replace-btn').addEventListener('click',async()=>{
    const button=document.getElementById('replace-btn'),key=getPageApiKey(),video=document.getElementById('file-orig-video').files[0],face=document.getElementById('file-target-face').files[0];
    if(!key){renderGenerationError('请先在图片或视频生成页保存 Google Gemini API Key。');return;}
    if(!video||!face){renderGenerationError('请同时上传原始视频和目标人物图片。');return;}
    if(video.size+face.size>30*1024*1024){renderGenerationError('视频与参考图合计请控制在 30MB 以内。');return;}
    setBusy(button,true,'✦ 替换人物');
    try{
      const prompt='Edit the source video using the supplied portrait as the adult subject identity reference. Keep the original clothing, action, camera movement, background, timing and audio as closely as possible. Produce a natural, consistent and photorealistic result.';
      const item=await generateOmniVideo(key,prompt,[video,face],{duration:'8',aspectRatio:'9:16',resolution:'720p'},renderVideoProgress);
      renderVideoResults([item]);
    }catch(error){renderGenerationError(error.message||String(error));}
    finally{setBusy(button,false,'✦ 替换人物');}
  });
}

/* ============================================================
   PAGE 6: DIGITAL HUMAN
   ============================================================ */
function renderDigitalHuman(root){
  const vp=window.VIDEO_PROMPTS;const dv=window.DIGITAL_HUMAN_VOICES;
  state.selectedModelId='models/gemini-omni-1.1-flash';
  root.innerHTML=H('🧑‍💻','数字人','创建品牌数字代言人，生成真人感视频讲解内容')+`
<div class="page-body">
<div class="left-panel">
${makeModelSel()}
${UZ('dh-face','image/*','上传人物照片生成数字人')}
<div class="section-card"><div class="section-card-title">🎙 数字人音色</div>
${dv.map((v,i)=>`<label style="display:flex;align-items:center;gap:10px;padding:10px;background:var(--bg-input);border-radius:var(--radius-sm);border:1px solid var(--border);cursor:pointer;margin-bottom:6px"><input type="radio" name="dh-voice" value="${v.id}" ${i===0?'checked':''} style="accent-color:var(--accent-gold)"><div style="flex:1"><div style="font-size:13px;color:var(--text-primary)">${v.name}</div><div style="font-size:11px;color:var(--text-muted)">${v.gender} · ${v.style}</div></div><button class="btn btn-ghost btn-sm">▶ 试听</button></label>`).join('')}
</div>
<div class="section-card"><div class="section-card-title">📝 讲解设置</div>
${FB('讲解文案','<textarea class="form-textarea" id="dh-script" rows="5" placeholder="输入数字人要播报的文案内容…&#10;例如：大家好，今天为大家介绍这款新品连衣裙，采用优质雪纺面料…"></textarea>')}
${FB('背景设置','<select class="form-select" id="dh-background"><option>虚化品牌背景</option><option>纯色背景</option><option>绿幕背景</option><option>服装展示间</option><option>电商直播风</option></select>')}
${FB('视频时长','<select class="form-select" id="dh-duration"><option value="5">5秒</option><option value="8">8秒</option><option value="10">10秒</option></select>')}
${FB('保存位置',SP('/outputs/digital-human/'))}
</div>
<button class="btn btn-primary" id="dh-btn">✦ 生成数字人视频</button>
</div>
<div class="right-panel"><div id="result-area" class="result-placeholder"><div class="placeholder-icon">🧑‍💻</div><div class="placeholder-text">数字人视频将在此处显示</div></div></div>
</div>`;
  bindEvts();
  document.getElementById('dh-btn').addEventListener('click',async()=>{
    const button=document.getElementById('dh-btn'),key=getPageApiKey(),face=document.getElementById('file-dh-face').files[0],script=document.getElementById('dh-script').value.trim();
    if(!key){renderGenerationError('请先填入 Google Gemini API Key。');return;}
    if(!face||!script){renderGenerationError('请上传人物照片并填写讲解文案。');return;}
    const voiceId=document.querySelector('input[name="dh-voice"]:checked').value,voice=dv.find(v=>v.id===voiceId)||dv[0];
    setBusy(button,true,'✦ 生成数字人视频');
    try{
      const prompt='Create a photorealistic vertical talking-presenter video using the supplied adult portrait as identity reference. Background: '+document.getElementById('dh-background').value+'. Voice direction: '+voice.gender+', '+voice.style+'. The presenter looks into camera with natural lip movement and says exactly in Mandarin Chinese: "'+script+'". Clean ecommerce presentation, stable face and natural gestures.';
      const item=await generateOmniVideo(key,prompt,face,{duration:document.getElementById('dh-duration').value,aspectRatio:'9:16',resolution:'720p'},renderVideoProgress);
      renderVideoResults([item]);
    }catch(error){renderGenerationError(error.message||String(error));}
    finally{setBusy(button,false,'✦ 生成数字人视频');}
  });
}

/* ============================================================
   PAGE 7: CHAT
   ============================================================ */
function renderChat(root){
  state.selectedModelId='models/gemini-3.8-flash';
  root.innerHTML=H('💬','AI 对话','与 AI 助手交流，获取创作建议、提示词优化')+`
<div class="chat-container">
<div class="chat-messages" id="chat-msgs">
<div class="chat-msg assistant"><div class="chat-avatar">✦</div>
<div class="chat-bubble">你好！我是 AI 创作助手 ✨<br>可以帮你：<br>• 优化图片生成提示词<br>• 规划服装拍摄方案<br>• 分析电商图片风格<br>• 解答创作中的问题<br><br>请问有什么可以帮到你？</div></div>
</div>
<div class="chat-input-area">
<textarea class="chat-input" id="chat-input" placeholder="输入问题，例如：帮我生成一套适合夏季连衣裙的提示词" rows="1"></textarea>
<button class="chat-send-btn" id="chat-send">➤</button>
</div>
</div>`;
  const inp=document.getElementById('chat-input');
  const sb=document.getElementById('chat-send');
  function ar(){inp.style.height='auto';inp.style.height=Math.min(inp.scrollHeight,140)+'px';}
  inp.addEventListener('input',ar);
  inp.addEventListener('keydown',e=>{if(e.key==='Enter'&&!e.shiftKey){e.preventDefault();send();}});
  sb.addEventListener('click',send);
  const history=[];
  async function send(){
    const t=inp.value.trim(),key=state.apiKey;if(!t)return;
    addMsg('user',t);history.push('用户：'+t);inp.value='';ar();sb.disabled=true;
    if(!key){addMsg('assistant','请先到“图片生成”或“视频生成”页面保存 Google Gemini API Key。');sb.disabled=false;return;}
    const pending=addMsg('assistant','正在思考…');
    try{
      const prompt='You are an expert ecommerce creative assistant. Reply in concise helpful Chinese. Help with Amazon/TikTok/Taobao fashion product images, prompts, video concepts and listing creative. Conversation:\n'+history.slice(-12).join('\n')+'\n助手：';
      const answer=await generateGeminiText(key,prompt);
      pending.querySelector('.chat-bubble').textContent=answer;history.push('助手：'+answer);
    }catch(error){pending.querySelector('.chat-bubble').textContent='请求失败：'+(error.message||String(error));}
    finally{sb.disabled=false;}
  }
  function addMsg(role,text){
    const msgs=document.getElementById('chat-msgs');
    const d=document.createElement('div');d.className='chat-msg '+role;
    const avatar=document.createElement('div');avatar.className='chat-avatar';avatar.textContent=role==='user'?'👤':'✦';
    const bubble=document.createElement('div');bubble.className='chat-bubble';bubble.style.whiteSpace='pre-wrap';bubble.textContent=text;
    d.append(avatar,bubble);msgs.appendChild(d);msgs.scrollTop=msgs.scrollHeight;return d;
  }
}

/* ============================================================
   PAGE 8: IMAGE DEWATERMARK
   ============================================================ */
function renderImageDewatermark(root){
  state.selectedModelId='models/gemini-3.1-flash-image';
  root.innerHTML=H('🗑','自有图片清理','仅处理你拥有权利的图片；Gemini 会生成式重绘被遮挡区域')+`
<div class="page-body">
<div class="left-panel">
${makeModelSel()}
${UZ('dw-img','image/*','上传含水印的图片')}
<div class="section-card"><div class="section-card-title">⚙️ 去水印设置</div>
${FB('清理类型','<select class="form-select" id="dw-type"><option>文字水印</option><option>图案水印</option><option>半透明水印</option><option>角落标记</option><option>画面瑕疵</option></select>')}
${FB('输出比例','<select class="form-select" id="dw-ratio"><option>1:1</option><option>3:4</option><option>4:3</option><option>9:16</option><option>16:9</option></select>')}
<label style="display:flex;gap:8px;align-items:flex-start;font-size:12px;color:var(--text-secondary);margin:10px 0"><input type="checkbox" id="dw-rights" style="accent-color:var(--accent-gold);margin-top:3px">我确认拥有该图片及其编辑权利</label>
${FB('保存位置',SP('/outputs/dewatermark/'))}
</div>
<button class="btn btn-primary" id="dw-btn">✦ 去除水印</button>
</div>
<div class="right-panel"><div id="result-area" class="result-placeholder"><div class="placeholder-icon">🗑</div><div class="placeholder-text">处理结果将在此处显示</div></div></div>
</div>`;
  bindEvts();
  document.getElementById('dw-btn').addEventListener('click',async()=>{
    const button=document.getElementById('dw-btn'),key=getPageApiKey(),file=document.getElementById('file-dw-img').files[0];
    if(!key){renderGenerationError('请先填入 Google Gemini API Key。');return;}
    if(!file){renderGenerationError('请先上传图片。');return;}
    if(!document.getElementById('dw-rights').checked){renderGenerationError('请确认你拥有该图片及其编辑权利。');return;}
    setBusy(button,true,'✦ 清理图片');renderGenerationProgress(0,1);
    try{
      const part=await fileToInlinePart(file);
      const prompt='Edit the supplied image owned by the user. Remove only the '+document.getElementById('dw-type').value+' and reconstruct the covered area naturally. Preserve the product, person, composition, colors and all unrelated details. Do not add new text, logos or objects.';
      const image=await generateGeminiImage(key,'gemini-3.1-flash-image',prompt,[part],document.getElementById('dw-ratio').value,1);
      renderGeneratedResults([image],[]);
    }catch(error){renderGenerationError(error.message||String(error));}
    finally{setBusy(button,false,'✦ 清理图片');}
  });
}

/* ============================================================
   PAGE 9: VIDEO DEWATERMARK
   ============================================================ */
function renderVideoDewatermark(root){
  state.selectedModelId='models/gemini-omni-1.1-flash';
  root.innerHTML=H('✂️','自有视频清理','仅处理你拥有权利的视频；属于生成式重制，并非逐像素无损修复')+`
<div class="page-body">
<div class="left-panel">
${makeModelSel()}
${UZ('vdw','video/*','上传含水印的视频')}
<div class="section-card"><div class="section-card-title">⚙️ 去水印设置</div>
${FB('清理类型','<select class="form-select" id="vdw-type"><option>固定位置文字水印</option><option>动态水印</option><option>台标 Logo</option><option>字幕文字</option><option>画面瑕疵</option></select>')}
${FB('画面比例','<select class="form-select" id="vdw-aspect"><option value="16:9">16:9 横屏</option><option value="9:16">9:16 竖屏</option></select>')}
<label style="display:flex;gap:8px;align-items:flex-start;font-size:12px;color:var(--text-secondary);margin:10px 0"><input type="checkbox" id="vdw-rights" style="accent-color:var(--accent-gold);margin-top:3px">我确认拥有该视频及其编辑权利</label>
${FB('保存位置',SP('/outputs/video-dw/'))}
</div>
<button class="btn btn-primary" id="vdw-btn">✦ 去除视频水印</button>
</div>
<div class="right-panel"><div id="result-area" class="result-placeholder"><div class="placeholder-icon">✂️</div><div class="placeholder-text">处理结果将在此处显示</div></div></div>
</div>`;
  bindEvts();
  document.getElementById('vdw-btn').addEventListener('click',async()=>{
    const button=document.getElementById('vdw-btn'),key=getPageApiKey(),file=document.getElementById('file-vdw').files[0];
    if(!key){renderGenerationError('请先填入 Google Gemini API Key。');return;}
    if(!file){renderGenerationError('请先上传视频。');return;}
    if(!document.getElementById('vdw-rights').checked){renderGenerationError('请确认你拥有该视频及其编辑权利。');return;}
    if(file.size>30*1024*1024){renderGenerationError('浏览器直传视频请控制在 30MB 以内。');return;}
    setBusy(button,true,'✦ 清理视频');
    try{
      const prompt='Edit this user-owned source video. Remove only the '+document.getElementById('vdw-type').value+' and reconstruct the covered area naturally. Preserve people, product, clothing, motion, camera, timing, background and audio as closely as possible. Do not add new text or logos.';
      const item=await generateOmniVideo(key,prompt,file,{duration:'8',aspectRatio:document.getElementById('vdw-aspect').value,resolution:'720p'},renderVideoProgress);
      renderVideoResults([item]);
    }catch(error){renderGenerationError(error.message||String(error));}
    finally{setBusy(button,false,'✦ 清理视频');}
  });
}

/* ============================================================
   PAGE 10: BATCH GEN
   ============================================================ */
function renderBatchGen(root){
  state.selectedModelId='models/gemini-3.1-flash-image';
  root.innerHTML=H('⚡','批量生成','批量上传服装图片，按统一提示词真实生成')+`
<div class="page-body"><div class="left-panel">
${makeModelSel()}
<div class="section-card"><div class="section-card-title">批量任务</div>
${FB('批量上传图片','<div class="upload-zone"><input id="batch-files" type="file" accept="image/*" multiple/><div class="upload-icon">📂</div><div class="upload-title">选择多张服装图片</div><div class="upload-hint">单次最多10张，文件合计建议不超过30MB</div></div>')}
${FB('统一提示词','<textarea class="form-textarea" id="batch-prompt" rows="5" placeholder="描述模特、动作、场景和光线；模型会严格参考每张服装图"></textarea>')}
${FB('图片比例','<select class="form-select" id="batch-ratio"><option>3:4</option><option>9:16</option><option>1:1</option><option>4:3</option><option>16:9</option></select>')}
${FB('每张生成数',makeCtr('batch-count',1,1,3,'张'))}
</div><button class="btn btn-primary" id="batch-run-btn">⚡ 开始批量生成</button>
</div><div class="right-panel"><div id="result-area" class="result-placeholder"><div class="placeholder-icon">⚡</div><div class="placeholder-text">真实批量结果将在此处显示</div></div></div></div>`;
  bindEvts();
  document.getElementById('batch-run-btn').addEventListener('click',async()=>{
    const button=document.getElementById('batch-run-btn'),key=getPageApiKey(),files=Array.from(document.getElementById('batch-files').files).slice(0,10),prompt=document.getElementById('batch-prompt').value.trim();
    if(!key){renderGenerationError('请先填入 Google Gemini API Key。');return;}
    if(!files.length||!prompt){renderGenerationError('请上传图片并填写统一提示词。');return;}
    const per=Math.max(1,Math.min(3,parseInt(document.getElementById('counter-batch-count').value||1,10)||1)),total=files.length*per,results=[],failures=[];
    setBusy(button,true,'⚡ 开始批量生成');
    try{
      let done=0;
      for(const file of files){
        const part=await fileToInlinePart(file);
        for(let i=0;i<per;i++){
          try{results.push(await generateGeminiImage(key,'gemini-3.1-flash-image',prompt+' Use the supplied image as the exact garment/product reference.',[part],document.getElementById('batch-ratio').value,i+1));}
          catch(error){failures.push(file.name+': '+(error.message||String(error)));}
          done++;renderGenerationProgress(done,total);
        }
      }
      if(!results.length)throw new Error(failures[0]||'没有生成任何图片。');
      renderGeneratedResults(results,failures);
    }catch(error){renderGenerationError(error.message||String(error));}
    finally{setBusy(button,false,'⚡ 开始批量生成');}
  });
}

function renderBatchGenLegacy(root){
  const jobs=[
    {name:'春季连衣裙主图',type:'图片',count:9,status:'done',time:'2min 14s'},
    {name:'男装西装系列',type:'图片',count:6,status:'done',time:'1min 58s'},
    {name:'夏款T恤动态视频',type:'视频',count:3,status:'running',time:'--'},
    {name:'外套详情页',type:'图片',count:12,status:'pending',time:'--'},
  ];
  const statusMap={done:'✅ 完成',running:'⏳ 进行中',pending:'🕐 待处理',failed:'❌ 失败'};
  root.innerHTML=H('⚡','批量生成','批量导入服装图片，一键生成所有模特展示图')+`
<div class="page-body">
<div class="left-panel">
<div class="section-card"><div class="section-card-title">创建批量任务</div>
${FB('任务名称','<input class="form-input" placeholder="输入任务名称…"/>')}
${FB('批量上传图片','<div class="upload-zone"><input type="file" accept="image/*" multiple/><div class="upload-icon">📂</div><div class="upload-title">批量上传服装图片</div><div class="upload-hint">支持多选，最多100张</div></div>')}
${FB('生成类型','<select class="form-select"><option>图片生成</option><option>视频生成</option></select>')}
${FB('提示词模版','<select class="form-select"><option>女装 — INS风玄关对镜自拍</option><option>女装 — 暖光卧室他拍</option><option>女装 — 明亮街景KPop风</option><option>女装 — 清新元气风</option><option>男装 — 电商白底幽灵图</option><option>男装 — 暖光室内对镜自拍（戴口罩）</option><option>男装 — 机场出行街拍</option><option>男装 — 日照金山旅拍</option><option>自定义模版</option></select>')}
${FB('图片比例',makeRatioSel(state.aspectRatio))}
${FB('每图生成数',makeCtr('batch-count',3,1,9,'张'))}
${FB('保存位置',SP('/outputs/batch/'))}
</div>
<button class="btn btn-primary">⚡ 加入队列</button>
</div>
<div class="right-panel">
<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:16px">
<div style="font-size:14px;font-weight:500">任务队列</div>
<button class="btn btn-secondary btn-sm">清空已完成</button>
</div>
<div style="overflow:auto;border-radius:var(--radius-md);border:1px solid var(--border)">
<table class="batch-table"><thead><tr><th>任务名称</th><th>类型</th><th>数量</th><th>状态</th><th>耗时</th><th>操作</th></tr></thead>
<tbody>${jobs.map(j=>`<tr><td style="color:var(--text-primary)">${j.name}</td><td style="color:var(--text-muted)">${j.type}</td><td>${j.count}张</td><td><span class="status-badge status-${j.status}">${statusMap[j.status]}</span></td><td style="color:var(--text-muted);font-size:12px">${j.time}</td><td>${j.status==='done'?'<button class="btn btn-ghost btn-sm">查看</button>':''}${j.status==='running'?'<button class="btn btn-ghost btn-sm">暂停</button>':''}<button class="btn btn-ghost btn-sm">删除</button></td></tr>`).join('')}</tbody>
</table>
</div>
<div class="section-card" style="margin-top:20px"><div class="section-card-title">整体进度</div>
<div style="display:flex;gap:20px;margin-bottom:12px">
<div style="text-align:center"><div style="font-size:24px;font-weight:700;color:var(--accent-green)">2</div><div style="font-size:11px;color:var(--text-muted)">已完成</div></div>
<div style="text-align:center"><div style="font-size:24px;font-weight:700;color:var(--accent-blue)">1</div><div style="font-size:11px;color:var(--text-muted)">进行中</div></div>
<div style="text-align:center"><div style="font-size:24px;font-weight:700;color:var(--text-muted)">1</div><div style="font-size:11px;color:var(--text-muted)">待处理</div></div>
</div>
<div class="progress-bar"><div class="progress-fill" style="width:55%"></div></div>
</div>
</div>
</div>`;
  bindEvts();
}

/* ============================================================
   PAGE 11: INFINITE CANVAS
   ============================================================ */
function renderInfiniteCanvas(root){
  state.selectedModelId='models/gemini-3.1-flash-image';
  root.innerHTML=H('🗺','无限画布','服装模特工作流设计 — 可视化节点编排')+`
<div style="flex:1;position:relative;overflow:hidden">
<div class="canvas-toolbar">
<button class="canvas-tool active">🖱 选择</button>
<input id="canvas-file" type="file" accept="image/*" style="max-width:180px;font-size:11px;color:var(--text-secondary)">
<input id="canvas-prompt" class="form-input" style="width:280px;height:34px" placeholder="输入工作流生成提示词">
<div style="width:1px;background:var(--border);height:20px;margin:0 4px"></div>
<button class="canvas-tool" id="canvas-add">➕ 添加节点</button>
<div style="width:1px;background:var(--border);height:20px;margin:0 4px"></div>
<button class="canvas-tool" id="canvas-save">💾 保存</button>
<button class="canvas-tool" id="canvas-run">▶ 运行</button>
</div>
<div id="canvas-status" style="position:absolute;right:18px;top:58px;z-index:5;font-size:12px;color:var(--accent-gold2)"></div>
<div class="canvas-workspace" id="canvas">
<div class="canvas-grid"></div>
${buildCanvasNodes()}
</div>
</div>`;
  initCanvas();
  document.querySelectorAll('.canvas-tool').forEach(btn=>{btn.addEventListener('click',()=>{document.querySelectorAll('.canvas-tool').forEach(b=>b.classList.remove('active'));btn.classList.add('active');});});
  const saved=JSON.parse(localStorage.getItem('ai_canvas_nodes')||'{}');
  Object.entries(saved).forEach(([id,pos])=>{const node=document.getElementById(id);if(node){node.style.left=pos.left;node.style.top=pos.top;}});
  document.getElementById('canvas-save').addEventListener('click',()=>{
    const data={};document.querySelectorAll('.canvas-node').forEach(node=>data[node.id]={left:node.style.left,top:node.style.top,title:node.querySelector('div').textContent});
    localStorage.setItem('ai_canvas_nodes',JSON.stringify(data));document.getElementById('canvas-status').textContent='✓ 画布已保存到本地';
  });
  document.getElementById('canvas-add').addEventListener('click',()=>{
    const canvas=document.getElementById('canvas'),node=document.createElement('div');node.className='canvas-node';node.id='custom-'+Date.now();node.style.cssText='position:absolute;left:180px;top:340px;width:180px;background:#202638;border:1px solid rgba(255,255,255,.1);border-radius:8px;padding:14px;cursor:move;z-index:2';node.innerHTML='<div style="font-size:13px;font-weight:600">🧩 自定义节点</div><div style="font-size:11px;color:var(--text-muted);margin-top:8px">双击编辑名称</div>';canvas.appendChild(node);initCanvasNode(node);
  });
  document.getElementById('canvas-run').addEventListener('click',async()=>{
    const key=state.apiKey,file=document.getElementById('canvas-file').files[0],prompt=document.getElementById('canvas-prompt').value.trim(),status=document.getElementById('canvas-status');
    if(!key||!file||!prompt){status.textContent='请先保存 API Key，并选择图片、填写提示词';return;}
    status.textContent='⏳ 工作流运行中…';
    try{
      const part=await fileToInlinePart(file),image=await generateGeminiImage(key,'gemini-3.1-flash-image',prompt,[part],'3:4',1),url=base64ImageToUrl(image),canvas=document.getElementById('canvas'),node=document.createElement('div');
      node.className='canvas-node';node.id='result-'+Date.now();node.style.cssText='position:absolute;left:1080px;top:100px;width:240px;background:#1a3525;border:1px solid var(--accent-green);border-radius:8px;padding:10px;z-index:3';node.innerHTML='<div style="font-size:12px;color:var(--accent-green);margin-bottom:8px">✅ 工作流真实输出</div><img src="'+url+'" style="width:100%;border-radius:6px"><button class="btn btn-secondary btn-sm" style="width:100%;margin-top:8px">⬇ 下载</button>';node.querySelector('button').addEventListener('click',()=>triggerImageDownload({url,mimeType:image.mimeType},0));canvas.appendChild(node);initCanvasNode(node);status.textContent='✓ 工作流完成';
    }catch(error){status.textContent='失败：'+(error.message||String(error));}
  });
}
function buildCanvasNodes(){
  const nodes=[
    {id:'n1',x:80,y:80,title:'📂 上传服装图',type:'input',w:180,color:'#1a2535'},
    {id:'n2',x:340,y:60,title:'🎨 选择模版',type:'config',w:180,color:'#2a1a35'},
    {id:'n3',x:600,y:80,title:'🖼 图片生成',type:'process',w:180,color:'#1a3525'},
    {id:'n4',x:860,y:60,title:'🔍 质量筛选',type:'filter',w:180,color:'#352a1a'},
    {id:'n5',x:340,y:220,title:'⚙ 参数设置',type:'config',w:180,color:'#2a1a35'},
    {id:'n6',x:600,y:230,title:'🔄 批量处理',type:'process',w:180,color:'#1a3525'},
    {id:'n7',x:860,y:220,title:'💾 输出保存',type:'output',w:180,color:'#1a1a35'},
  ];
  const lines=[['n1','n3',170,120,600,120],['n2','n3',520,100,600,120],['n3','n4',780,120,860,100],['n4','n7',1040,100,860,260],['n5','n6',520,260,600,270],['n6','n7',780,270,860,260]];
  const svg=`<svg style="position:absolute;inset:0;width:100%;height:100%;pointer-events:none;z-index:1"><defs><marker id="arr" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto"><path d="M0,0 L10,5 L0,10 z" fill="rgba(201,168,76,0.5)"/></marker></defs>${lines.map(([,,x1,y1,x2,y2])=>`<path d="M${x1},${y1} C${(x1+x2)/2},${y1} ${(x1+x2)/2},${y2} ${x2},${y2}" stroke="rgba(201,168,76,0.35)" stroke-width="1.5" fill="none" marker-end="url(#arr)"/>`).join('')}</svg>`;
  return svg+nodes.map(n=>`<div class="canvas-node" id="${n.id}" style="position:absolute;left:${n.x}px;top:${n.y}px;width:${n.w}px;background:${n.color};border:1px solid rgba(255,255,255,0.1);border-radius:var(--radius-md);padding:14px;cursor:move;z-index:2;box-shadow:var(--shadow-card);user-select:none"><div style="font-size:13px;font-weight:600;margin-bottom:8px;color:var(--text-primary)">${n.title}</div><div style="font-size:11px;color:var(--text-muted)">双击编辑节点配置</div><div style="margin-top:8px;display:flex;gap:4px"><div style="width:8px;height:8px;border-radius:50%;background:${n.type==='output'?'var(--accent-green)':n.type==='input'?'var(--accent-blue)':'var(--accent-gold)'}"></div><span style="font-size:10px;color:var(--text-muted)">${n.type}</span></div></div>`).join('');
}
function initCanvas(){
  const canvas=document.getElementById('canvas');if(!canvas)return;
  let pan=false,sx,sy,sl,st;
  canvas.addEventListener('mousedown',e=>{if(e.target===canvas||e.target.classList.contains('canvas-grid')){pan=true;sx=e.pageX;sy=e.pageY;sl=canvas.scrollLeft;st=canvas.scrollTop;}});
  document.addEventListener('mousemove',e=>{if(!pan)return;canvas.scrollLeft=sl-(e.pageX-sx);canvas.scrollTop=st-(e.pageY-sy);});
  document.addEventListener('mouseup',()=>pan=false);
  document.querySelectorAll('.canvas-node').forEach(node=>{
    initCanvasNode(node);
  });
}
function initCanvasNode(node){
  if(node.dataset.bound)return;node.dataset.bound='1';let drag=false,ox,oy;
  node.addEventListener('mousedown',e=>{if(e.target.closest('button'))return;e.stopPropagation();drag=true;ox=e.clientX-node.offsetLeft;oy=e.clientY-node.offsetTop;});
  document.addEventListener('mousemove',e=>{if(!drag)return;node.style.left=(e.clientX-ox)+'px';node.style.top=(e.clientY-oy)+'px';});
  document.addEventListener('mouseup',()=>drag=false);
  node.addEventListener('dblclick',()=>{const title=node.querySelector('div'),value=prompt('节点名称',title.textContent);if(value)title.textContent=value;});
}

/* ============================================================
   PAGE 12: ECOMMERCE DETAIL
   ============================================================ */
function renderEcommerceDetail(root){
  state.selectedModelId='models/gemini-3.8-flash';
  root.innerHTML=H('🛒','电商详情页生成','一键生成完整电商产品详情页，包含主图、细节图、尺码表')+`
<div class="page-body">
<div class="left-panel">
${makeModelSel()}
<div class="section-card"><div class="section-card-title">商品信息</div>
${FB('商品名称','<input class="form-input" id="detail-name" placeholder="例如：2025春季新款雪纺连衣裙"/>')}
${FB('商品卖点','<textarea class="form-textarea" id="detail-points" rows="3" placeholder="核心卖点，每行一条&#10;例如：高级雪纺面料，飘逸舒适&#10;收腰版型，显瘦显高"></textarea>')}
${FB('价格区间','<input class="form-input" id="detail-price" placeholder="例如：128-368元"/>')}
${FB('目标人群','<select class="form-select" id="detail-audience"><option>18-25岁年轻女性</option><option>25-35岁职场女性</option><option>35岁以上成熟女性</option><option>全年龄段</option></select>')}
</div>
<div class="section-card"><div class="section-card-title">图片素材</div>
${UZ('detail-main','image/*','主图（服装平铺/模特图）')}
<div style="margin-top:10px">${UZ('detail-extra','image/*','细节图（领口、版型、面料等，最多8张）')}</div>
</div>
<div class="section-card"><div class="section-card-title">页面设置</div>
${FB('详情页风格','<select class="form-select" id="detail-style"><option>轻奢高端风</option><option>简约清新风</option><option>国潮复古风</option><option>少女粉嫩风</option><option>商务极简风</option></select>')}
${FB('平台适配','<select class="form-select" id="detail-platform"><option>淘宝 / 天猫</option><option>京东</option><option>拼多多</option><option>抖音小店</option><option>通用</option></select>')}
${FB('包含模块','<div id="detail-modules" style="display:flex;flex-direction:column;gap:6px">'+['主图轮播','产品卖点','细节展示','尺码对照表','模特展示','买家评价区','搭配推荐'].map(m=>`<label style="display:flex;align-items:center;gap:8px;font-size:13px;color:var(--text-secondary);cursor:pointer"><input type="checkbox" value="${m}" checked style="accent-color:var(--accent-gold)"> ${m}</label>`).join('')+'</div>')}
${FB('保存位置',SP('/outputs/ecommerce/'))}
</div>
<button class="btn btn-primary" id="detail-btn">✦ 生成详情页</button>
</div>
<div class="right-panel"><div id="result-area" class="result-placeholder"><div class="placeholder-icon">🛒</div><div class="placeholder-text">电商详情页将在此处预览</div></div></div>
</div>`;
  bindEvts();
  document.getElementById('file-detail-extra').multiple=true;
  document.getElementById('detail-btn').addEventListener('click',async()=>{
    const button=document.getElementById('detail-btn'),key=getPageApiKey(),main=document.getElementById('file-detail-main').files[0],extras=Array.from(document.getElementById('file-detail-extra').files).slice(0,8);
    const name=document.getElementById('detail-name').value.trim(),points=document.getElementById('detail-points').value.trim(),price=document.getElementById('detail-price').value.trim(),audience=document.getElementById('detail-audience').value,style=document.getElementById('detail-style').value,platform=document.getElementById('detail-platform').value;
    const modules=Array.from(document.querySelectorAll('#detail-modules input:checked')).map(input=>input.value);
    if(!key){renderGenerationError('请先填入 Google Gemini API Key。');return;}
    if(!main||!name){renderGenerationError('请填写商品名称并上传商品主图。');return;}
    setBusy(button,true,'✦ 生成详情页');
    try{
      const prompt=`你是资深中文电商详情页策划。请分析上传的商品图片，并结合以下信息生成可直接使用的详情页内容。不得虚构图片无法验证的材质成分、认证、疗效、销量或评价；不确定内容要明确写“请按实物信息补充”。\n商品名称：${name}\n用户卖点：${points||'未提供，请基于可见特征谨慎概括'}\n价格：${price||'未提供'}\n目标人群：${audience}\n风格：${style}\n平台：${platform}\n模块：${modules.join('、')}\n只返回一个合法 JSON 对象，不要 Markdown，结构严格为：{"headline":"","subheadline":"","selling_points":[""],"description":"","visual_notes":[""],"size_guide":{"note":"","rows":[{"size":"S","suggestion":""}]},"care":[""],"modules":[{"title":"","body":""}],"compliance_note":""}`;
      const raw=await generateGeminiText(key,prompt,[main,...extras]),data=parseJsonFromText(raw),mainUrl=URL.createObjectURL(main),mainDataUrl=await fileToDataUrl(main);
      const selling=Array.isArray(data.selling_points)?data.selling_points:[],visualNotes=Array.isArray(data.visual_notes)?data.visual_notes:[],care=Array.isArray(data.care)?data.care:[],contentModules=Array.isArray(data.modules)?data.modules:[],sizeRows=data.size_guide&&Array.isArray(data.size_guide.rows)?data.size_guide.rows:[];
      const preview=document.createElement('div');preview.style.cssText='border:1px solid var(--border);border-radius:var(--radius-md);overflow:hidden;background:#fff;color:#29241f';
      preview.innerHTML=`<img src="${mainUrl}" alt="商品主图" style="display:block;width:100%;max-height:520px;object-fit:contain;background:#f4f1ec"><div style="padding:28px"><div style="font-size:12px;letter-spacing:2px;color:#9b7d48">${escapeHtml(style)} · ${escapeHtml(platform)}</div><h1 style="font-size:28px;margin:10px 0 6px">${escapeHtml(data.headline||name)}</h1><p style="color:#806f5b;margin:0 0 22px">${escapeHtml(data.subheadline||'')}</p><div style="display:grid;gap:10px">${selling.map(item=>`<div style="padding:12px 14px;background:#f8f5f0;border-radius:8px">✓ ${escapeHtml(item)}</div>`).join('')}</div><h2 style="margin-top:28px">商品描述</h2><p style="line-height:1.8;white-space:pre-wrap">${escapeHtml(data.description||'')}</p>${visualNotes.length?`<h2>图片观察</h2><ul>${visualNotes.map(item=>`<li style="margin:7px 0">${escapeHtml(item)}</li>`).join('')}</ul>`:''}${sizeRows.length?`<h2>尺码建议</h2><p>${escapeHtml(data.size_guide.note||'')}</p><table style="width:100%;border-collapse:collapse">${sizeRows.map(row=>`<tr><td style="border:1px solid #ddd;padding:9px">${escapeHtml(row.size)}</td><td style="border:1px solid #ddd;padding:9px">${escapeHtml(row.suggestion)}</td></tr>`).join('')}</table>`:''}${care.length?`<h2>护理建议</h2><ul>${care.map(item=>`<li>${escapeHtml(item)}</li>`).join('')}</ul>`:''}${contentModules.map(item=>`<h2>${escapeHtml(item.title)}</h2><p style="line-height:1.8;white-space:pre-wrap">${escapeHtml(item.body)}</p>`).join('')}<p style="margin-top:28px;padding-top:16px;border-top:1px solid #eee;font-size:12px;color:#8b8177">${escapeHtml(data.compliance_note||'请以商品实物与最终发布信息为准。')}</p></div>`;
      const area=document.getElementById('result-area');area.className='';area.innerHTML='';
      const bar=document.createElement('div');bar.style.cssText='display:flex;justify-content:space-between;align-items:center;margin-bottom:14px;gap:10px';bar.innerHTML='<span style="color:var(--accent-green);font-size:13px">✅ 已按商品图生成真实详情内容</span>';
      const download=document.createElement('button');download.className='btn btn-secondary btn-sm';download.textContent='⬇ 下载 HTML';
      download.addEventListener('click',()=>{const body=preview.innerHTML.replace(mainUrl,mainDataUrl),html='<!doctype html><html lang="zh-CN"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>'+escapeHtml(name)+'</title></head><body style="margin:0;background:#eee;font-family:-apple-system,BlinkMacSystemFont,Segoe UI,sans-serif"><main style="max-width:760px;margin:auto;background:white">'+body+'</main></body></html>';downloadTextFile((name||'商品详情页')+'.html',html,'text/html;charset=utf-8');});
      bar.appendChild(download);area.append(bar,preview);
    }catch(error){renderGenerationError(error.message||String(error));}
    finally{setBusy(button,false,'✦ 生成详情页');}
  });
}

/* ---- Start ---- */
document.addEventListener('DOMContentLoaded',init);
})();

