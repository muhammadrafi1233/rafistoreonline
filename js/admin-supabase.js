// Admin dashboard + sinkron katalog dari Supabase
const SUPABASE_URL = 'https://vejdthyqxfjzqpjxfqnd.supabase.co';
const SUPABASE_PUBLISHABLE_KEY = 'sb_publishable_YH7YBDHlWrTCoxhMlEHJ5w_GYNXr4WL';
const supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);

let adminProducts = [];
let adminCurrentProduct = null;
let adminActiveCategory = 'all';
let adminDirty = false;
const adminCategoryMeta = {
  item:      { label: 'Item Upgrade', color: '#2f8f46', icon: '🧱' },
  bahanalat: { label: 'Bahan & Alat', color: '#b5790f', icon: '🌾' },
  voucher:   { label: 'Voucher',      color: '#8e44ad', icon: '🎟️' },
  coin:      { label: 'Coin',         color: '#c98a00', icon: '<svg class="rh-coin" viewBox="0 0 48 48" aria-hidden="true"><circle cx="24" cy="24" r="21" fill="#F7B733" stroke="#C98A00" stroke-width="2.5"/><circle cx="24" cy="24" r="15" fill="#FFD978"/></svg>' },
  akun:      { label: 'Akun Hayday',  color: '#2f6fa8', icon: '👤' }
};
const ADMIN_FALLBACK_IMG = 'data:image/svg+xml;utf8,' + encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" width="80" height="80"><rect width="80" height="80" fill="#e8eee9"/></svg>');
function catMeta(cat){ return adminCategoryMeta[cat] || { label: cat || '-', color: '#667169', icon: '📦' } }

/* ================= PENGATURAN ANGKA TESTIMONI (site_settings di Supabase) ================= */
const SITE_SETTINGS_TABLE = 'site_settings';
const TX_COUNTER_KEY = 'transaction_counter';

// Ambil angka counter dari Supabase supaya tampil sama untuk semua pengunjung.
// Kalau tabel/baris belum ada, tetap pakai nilai default (9500) di runTransactionCounter().
async function loadTransactionCounterSetting(){
  try{
    const {data,error}=await supabaseClient.from(SITE_SETTINGS_TABLE).select('value').eq('key',TX_COUNTER_KEY).maybeSingle();
    if(error) throw error;
    if(data && data.value!==undefined && data.value!==null){
      const n=Number(data.value);
      if(!isNaN(n) && n>=0) transactionCounterTarget=n;
    }
  }catch(e){
    console.info('Belum ambil angka counter dari Supabase (pakai default). Detail:',e.message||e);
  }
}

async function openAdminSettingsPanel(){
  document.getElementById('adminNoSelection').style.display='none';
  document.getElementById('adminProductForm').style.display='none';
  document.getElementById('adminSettingsPanel').style.display='block';
  if(window.innerWidth<=900) setAdminMobileSidebar(false);
  setAdminStatus('Memuat pengaturan...','');
  await loadTransactionCounterSetting();
  document.getElementById('adminTxCounter').value=transactionCounterTarget;
  setAdminStatus('','');
}

async function saveAdminSettingsCounter(){
  const btn=document.getElementById('adminSettingsSaveBtn');
  const input=document.getElementById('adminTxCounter');
  const val=Number(input.value);
  if(isNaN(val) || val<0){ setAdminStatus('Isi angka yang valid dulu ya.','error'); return }
  btn.classList.add('loading');
  try{
    const {error}=await supabaseClient.from(SITE_SETTINGS_TABLE).upsert({key:TX_COUNTER_KEY,value:String(Math.round(val)),updated_at:new Date().toISOString()},{onConflict:'key'});
    if(error) throw error;
    transactionCounterTarget=Math.round(val);
    setAdminStatus('✓ Angka testimoni tersimpan ke Supabase.','ok');
  }catch(e){
    console.error(e);
    setAdminStatus('Gagal menyimpan: '+(e.message||e),'error');
  }finally{
    btn.classList.remove('loading');
  }
}

function adminConfigured(){return !SUPABASE_URL.includes('PASTE_')&&!SUPABASE_PUBLISHABLE_KEY.includes('PASTE_')}
function setAdminStatus(message,type){const el=document.getElementById('adminStatus');if(!el)return;el.textContent=message||'';el.className='admin-status'+(message?' show':'')+(type?' '+type:'')}
function sleepAdmin(ms){return new Promise(resolve=>setTimeout(resolve,ms))}
async function runAdminLoginSuccessAnimation(){
  const el=document.getElementById('adminAuthSuccess');
  const text=document.getElementById('adminAuthSuccessText');
  if(!el)return;
  el.classList.remove('success','scanning');
  el.classList.add('show','scanning');
  el.setAttribute('aria-hidden','false');
  if(text)text.textContent='Memverifikasi identitas…';
  await sleepAdmin(820);
  el.classList.remove('scanning');
  el.classList.add('success');
  if(text)text.textContent='Identitas terverifikasi';
  await sleepAdmin(780);
  el.classList.remove('show','success');
  el.setAttribute('aria-hidden','true');
  await sleepAdmin(180);
}
async function runAdminLoginFailAnimation(message){
  const el=document.getElementById('adminAuthSuccess');
  const text=document.getElementById('adminAuthSuccessText');
  const title=el?el.querySelector('.admin-auth-title'):null;
  if(!el)return;
  el.classList.remove('success','failed','scanning');
  el.classList.add('show','scanning');
  el.setAttribute('aria-hidden','false');
  if(title)title.textContent='Akses Admin';
  if(text)text.textContent='Memeriksa akun…';
  await sleepAdmin(520);
  el.classList.remove('scanning');
  el.classList.add('failed');
  if(title)title.textContent='Login Gagal';
  if(text)text.textContent=message||'Email atau password salah';
  await sleepAdmin(900);
  el.classList.remove('show','failed');
  el.setAttribute('aria-hidden','true');
  if(title)title.textContent='Akses Admin';
  await sleepAdmin(120);
}
function showAdminLogin(){document.getElementById('adminLoginPanel').style.display='block';document.getElementById('adminDashboard').style.display='none';document.getElementById('adminStickyBar').classList.add('hidden')}
function showAdminDashboard(){document.getElementById('adminLoginPanel').style.display='none';document.getElementById('adminDashboard').style.display='block'}
function setAdminMobileSidebar(open){const sb=document.getElementById('adminSidebar');const tg=document.getElementById('adminMobileToggle');const lbl=document.getElementById('adminMobileToggleLabel');if(!sb||!tg)return;sb.classList.toggle('open',open);tg.classList.toggle('open',open);if(lbl)lbl.textContent=open?'📦 Sembunyikan Daftar':'📦 Daftar Produk ('+adminProducts.length+')'}
function setAdminDirty(v){adminDirty=v;const b=document.getElementById('adminUnsavedBadge');if(b)b.classList.toggle('show',!!v)}
function adminConfirm(title,msg){return new Promise(resolve=>{const ov=document.getElementById('adminConfirmOverlay');document.getElementById('adminConfirmTitle').textContent=title;document.getElementById('adminConfirmMsg').textContent=msg;ov.classList.add('show');const okBtn=document.getElementById('adminConfirmOk'),cancelBtn=document.getElementById('adminConfirmCancel');function cleanup(v){ov.classList.remove('show');okBtn.removeEventListener('click',onOk);cancelBtn.removeEventListener('click',onCancel);resolve(v)}function onOk(){cleanup(true)}function onCancel(){cleanup(false)}okBtn.addEventListener('click',onOk);cancelBtn.addEventListener('click',onCancel)})}
function setBtnLoading(btn,loading){if(!btn)return;btn.disabled=!!loading;btn.classList.toggle('is-loading',!!loading)}
function formatDbPrice(p){
  const dp=(p.display_price||'').trim();
  if(dp){
    const numericOnly=dp.replace(/[.,\s]/g,'');
    // Kalau isinya cuma angka (mis. admin ketik "2500" atau "2.500" tanpa "Rp"), format otomatis jadi Rupiah.
    if(/^\d+$/.test(numericOnly))return 'Rp'+Number(numericOnly).toLocaleString('id-ID');
    return dp; // sudah ada teks/format sendiri dari admin (mis. "Mulai Rp2.500"), pakai apa adanya.
  }
  return 'Rp'+Number(p.base_price||0).toLocaleString('id-ID');
}
function escAttr(s){return String(s??'').replace(/&/g,'&amp;').replace(/"/g,'&quot;').replace(/</g,'&lt;').replace(/>/g,'&gt;')}

async function verifyAdmin(){const {data:s}=await supabaseClient.auth.getSession();if(!s.session)return false;const {data,error}=await supabaseClient.rpc('is_admin');if(error)throw error;return data===true}

function findCatalogCard(slug){return document.querySelector('.card[data-product-slug="'+CSS.escape(slug)+'"]')}

function setCardButton(card,p){const btn=card&&card.querySelector('button.btn');if(!btn)return;const n=(p.name||'').replace(/\\/g,'\\\\').replace(/'/g,"\\'");if(p.product_type==='tiered')btn.setAttribute('onclick',"openBulkItemForm('"+n+"')");else if(p.product_type==='multi')btn.setAttribute('onclick',"openBahanMultiForm('"+n+"')");else if(p.product_type==='coin')btn.setAttribute('onclick',"openCoinForm('"+n+"')");else if(p.product_type==='account')btn.setAttribute('onclick',"openAkunCustomForm('"+n+"')");else btn.setAttribute('onclick',"openOrderForm('"+n+"')")}

function applyStockUI(card,p){
  const stock=Number(p.stock||0);
  const outOfStock=stock<=0;
  const lowStock=!outOfStock&&stock<=5;

  // Badge stok
  let badge=card.querySelector('[data-db-stock]')||card.querySelector('#barnCardStock');
  if(!badge){
    badge=document.createElement('span');
    badge.setAttribute('data-db-stock','1');
    const btnRef=card.querySelector('button.btn');
    if(btnRef)card.insertBefore(badge,btnRef);
  }
  badge.className='stock-badge '+(outOfStock?'out-of-stock':(lowStock?'low-stock':'in-stock'));
  badge.textContent=outOfStock?'❌ Stok Habis':(lowStock?'⚠️ Stok terbatas: '+stock:'✅ Stok: '+stock);

  // Ribbon SOLD OUT di atas gambar
  const wrap=card.querySelector('.card-img-wrap');
  if(wrap){
    let ribbon=wrap.querySelector('.sold-out-ribbon');
    if(!ribbon){
      ribbon=document.createElement('div');
      ribbon.className='sold-out-ribbon';
      ribbon.innerHTML='<span>SOLD OUT</span>';
      wrap.appendChild(ribbon);
    }
    ribbon.style.display=outOfStock?'flex':'none';
  }

  card.classList.toggle('is-sold-out',outOfStock);

  // Nonaktifkan tombol order saat stok habis
  const btn=card.querySelector('button.btn');
  if(btn){
    if(!btn.dataset.originalLabel)btn.dataset.originalLabel=btn.textContent.trim();
    if(outOfStock){
      btn.disabled=true;
      btn.setAttribute('aria-disabled','true');
      btn.textContent='Stok Habis';
    }else{
      btn.disabled=false;
      btn.removeAttribute('aria-disabled');
      btn.textContent=btn.dataset.originalLabel;
    }
  }
}

async function syncCatalogFromSupabase(){
  if(!adminConfigured())return;
  document.querySelectorAll('.card[data-product-slug]').forEach(c=>c.style.display='none');
  const {data:products,error}=await supabaseClient.from('products').select('*').order('category').order('sort_order');if(error)throw error;
  const ids=(products||[]).map(p=>p.id);
  let tiers=[],options=[],coins=[];
  if(ids.length){
    const [tr,op,co]=await Promise.all([
      supabaseClient.from('product_price_tiers').select('*').in('product_id',ids).order('min_qty'),
      supabaseClient.from('product_options').select('*').in('product_id',ids).order('sort_order'),
      supabaseClient.from('coin_configs').select('*').in('product_id',ids)
    ]);
    if(tr.error)throw tr.error;if(op.error)throw op.error;if(co.error)throw co.error;tiers=tr.data||[];options=op.data||[];coins=co.data||[];
  }
  (products||[]).forEach(p=>{
    const card=findCatalogCard(p.slug);if(card){
      card.style.display=p.is_active?'':'none';
      const h=card.querySelector('h2'),pr=card.querySelector('.price'),d=card.querySelector('.desc'),img=card.querySelector('img'),wrap=card.querySelector('.card-img-wrap');
      if(h)h.textContent=p.name||'';if(pr)pr.textContent=formatDbPrice(p);if(d)d.textContent=p.description||'';
      const _okImg=p.image_url&&!/phototourl\.com/i.test(p.image_url);if(img&&_okImg){img.src=p.image_url;img.alt=p.name||''}if(wrap&&_okImg){wrap.onclick=()=>openImageLightbox(p.image_url,p.name||'')}
      setCardButton(card,p);
      applyStockUI(card,p);
    }
    if(p.product_type==='tiered'){
      const tt=tiers.filter(x=>x.product_id===p.id).sort((a,b)=>a.min_qty-b.min_qty);
      if(tt.length)bulkItemConfig[p.name]={base:Number((tt.find(x=>Number(x.min_qty)===1)||{}).price??p.base_price??0),tier7:Number((tt.find(x=>Number(x.min_qty)===7)||{}).price??p.base_price??0),tier30:Number((tt.find(x=>Number(x.min_qty)===30)||{}).price??p.base_price??0)};
    }
    if(p.product_type==='multi'){
      const oo=options.filter(x=>x.product_id===p.id&&x.is_active!==false).sort((a,b)=>a.sort_order-b.sort_order);
      if(oo.length)bahanMultiConfig[p.name]={minMultiple:Number(oo[0].min_qty||1),items:oo.map(x=>({name:x.name,price:Number(x.price||0),stock:Number(x.stock||0),minQty:Number(x.min_qty||1),stepQty:Number(x.step_qty||1),priceUnitQty:Number(x.price_unit_qty||100)}))};
    }
    if(p.product_type==='coin'){
      const c=coins.find(x=>x.product_id===p.id);if(c)coinConfig[p.name]={unitStep:Number(c.unit_step),unitPrice:Number(c.unit_price),jasaPerStep:Number(c.jasa_per_step),maxAmount:Number(c.max_amount)};
    }
    if(p.product_type!=='tiered'&&p.product_type!=='multi'&&p.product_type!=='coin'&&p.product_type!=='account'){
      simpleProductConfig[p.name]={price:Number(p.base_price||0)};
    }
  });
  if(typeof window.applyCatalogTranslations==='function'){try{window.applyCatalogTranslations()}catch(e){}}
}

// Make Bahan calculations use the DB price-unit quantity (normally price per 100 pcs).
updateBahanMultiPreview=function(){const cfg=bahanMultiConfig[currentBahanCategory];if(!cfg)return;let total=0;cfg.items.forEach((it,idx)=>{const el=document.getElementById('bahanQty_'+idx);const qty=parseInt(el&&el.value,10)||0;total+=(qty/Number(it.priceUnitQty||100))*Number(it.price||0)});document.getElementById('bahanMultiLiveTotal').textContent=formatRupiah(total)};
addBahanMultiToCart=function(event){const cfg=bahanMultiConfig[currentBahanCategory];if(!cfg)return;const chosen=[];let invalid=false;cfg.items.forEach((it,idx)=>{const el=document.getElementById('bahanQty_'+idx);const qty=parseInt(el&&el.value,10)||0;if(qty>0){const min=Number(it.minQty||cfg.minMultiple||1),step=Number(it.stepQty||cfg.minMultiple||1);if(qty<min||((qty-min)%step!==0))invalid=true;chosen.push({name:it.name,qty,price:Number(it.price||0),unit:Number(it.priceUnitQty||100),idx})}});if(invalid){alert((typeof tr==='function')?tr('alert.bahanInvalid','Jumlah item belum sesuai minimal/kelipatannya.'):'Jumlah item belum sesuai minimal/kelipatannya.');return}if(!chosen.length){alert((typeof tr==='function')?tr('alert.pickOneItem','Pilih minimal 1 item dulu ya.'):'Pilih minimal 1 item dulu ya.');return}chosen.forEach(c=>cartItems.push({product:currentBahanCategory+' - '+c.name,qty:c.qty+' pcs',subtotal:(c.qty/c.unit)*c.price,_priceType:'bahan',_key:currentBahanCategory,_itemName:c.name,_qty:c.qty}));flyToCart(getBahanPriceOrigin(chosen[0].idx)||(event&&event.currentTarget)||(event&&event.target));saveCart();closeBahanMultiForm();setTimeout(function(){alert((typeof tr==='function')?tr('alert.addedToCart','Produk berhasil masuk ke keranjang.'):'Produk berhasil masuk ke keranjang.')},650)};

async function fetchAllAdminProducts(){const {data,error}=await supabaseClient.from('products').select('*').order('category').order('sort_order');if(error)throw error;adminProducts=data||[];renderAdminProductList();return adminProducts}
function renderAdminCategoryChips(){
  const wrap=document.getElementById('adminCategoryFilter');if(!wrap)return;
  const counts={};adminProducts.forEach(p=>{counts[p.category]=(counts[p.category]||0)+1});
  const cats=['all',...Object.keys(adminCategoryMeta)];
  wrap.innerHTML=cats.map(c=>{
    const label=c==='all'?'Semua':catMeta(c).label;const count=c==='all'?adminProducts.length:(counts[c]||0);
    return '<button type="button" class="admin-chip'+(adminActiveCategory===c?' active':'')+'" data-cat="'+c+'">'+(c==='all'?'':catMeta(c).icon+' ')+label+' <span class="a-count">'+count+'</span></button>';
  }).join('');
  wrap.querySelectorAll('[data-cat]').forEach(b=>b.addEventListener('click',()=>{adminActiveCategory=b.dataset.cat;renderAdminProductList()}));
}
function renderAdminProductList(){
  renderAdminCategoryChips();
  const q=(document.getElementById('adminSearch').value||'').toLowerCase().trim();
  const list=document.getElementById('adminProductList');
  const items=adminProducts.filter(p=>{
    const matchQ=!q||p.name.toLowerCase().includes(q)||p.category.toLowerCase().includes(q);
    const matchCat=adminActiveCategory==='all'||p.category===adminActiveCategory;
    return matchQ&&matchCat;
  });
  list.innerHTML=items.map(p=>{
    const m=catMeta(p.category);
    const stock=Number(p.stock||0);
    const stockLabel=(p.product_type==='multi'||p.product_type==='coin')?'':(' • '+(stock>0?('Stok '+stock):'Stok Habis'));
    return '<button type="button" class="admin-product-item '+(adminCurrentProduct&&adminCurrentProduct.id===p.id?'active':'')+'" data-id="'+p.id+'">'
      +'<img class="a-thumb" src="'+escAttr(p.image_url||ADMIN_FALLBACK_IMG)+'" onerror="this.src=\''+ADMIN_FALLBACK_IMG+'\'" alt="">'
      +'<div class="a-info"><span class="a-name">'+escAttr(p.name)+'</span>'
      +'<div class="a-meta"><span class="a-cat-tag" style="background:'+m.color+'22;color:'+m.color+'">'+m.icon+' '+escAttr(m.label)+'</span>'
      +'<span class="a-stock-tag">'+escAttr(formatDbPrice(p))+stockLabel+'</span></div></div>'
      +'<span class="admin-status-pill '+(p.is_active?'on':'off')+'">'+(p.is_active?'Aktif':'Nonaktif')+'</span>'
      +'</button>';
  }).join('')||'<div class="admin-empty"><span class="a-empty-emoji">🔍</span>Produk tidak ditemukan.</div>';
  list.querySelectorAll('[data-id]').forEach(b=>b.addEventListener('click',()=>loadAdminProduct(Number(b.dataset.id))));
  const lbl=document.getElementById('adminMobileToggleLabel');if(lbl&&!document.getElementById('adminSidebar').classList.contains('open'))lbl.textContent='📦 Daftar Produk ('+adminProducts.length+')';
}

async function loadAdminProduct(id){setAdminStatus('Memuat produk...','');const p=adminProducts.find(x=>x.id===id)||(await supabaseClient.from('products').select('*').eq('id',id).single()).data;if(!p)throw new Error('Produk tidak ditemukan.');adminCurrentProduct=p;renderAdminProductList();
  document.getElementById('adminSettingsPanel').style.display='none';document.getElementById('adminNoSelection').style.display='none';document.getElementById('adminProductForm').style.display='block';
  document.getElementById('adminProductId').value=p.id;document.getElementById('adminProductSlug').value=p.slug||'';document.getElementById('adminProductType').value=p.product_type||'normal';document.getElementById('adminName').value=p.name||'';document.getElementById('adminCategory').value=p.category||'item';document.getElementById('adminBasePrice').value=Number(p.base_price||0);document.getElementById('adminStock').value=Number(p.stock||0);document.getElementById('adminDisplayPrice').value=p.display_price||'';document.getElementById('adminSortOrder').value=Number(p.sort_order||0);document.getElementById('adminImageUrl').value=p.image_url||'';document.getElementById('adminDescription').value=p.description||'';document.getElementById('adminIsActive').checked=!!p.is_active;
  document.getElementById('adminPreviewImage').src=p.image_url||ADMIN_FALLBACK_IMG;document.getElementById('adminPreviewImage').onerror=function(){this.onerror=null;this.src=ADMIN_FALLBACK_IMG};document.getElementById('adminPreviewName').textContent=p.name||'';document.getElementById('adminPreviewMeta').textContent=catMeta(p.category).label+' • '+formatDbPrice(p)+' • stok '+Number(p.stock||0);
  updateAdminImagePreviewBox(p.image_url||'');
  document.getElementById('adminTierSection').style.display=p.product_type==='tiered'?'':'none';document.getElementById('adminOptionSection').style.display=p.product_type==='multi'?'':'none';document.getElementById('adminCoinSection').style.display=p.product_type==='coin'?'':'none';
  if(p.product_type==='tiered')await loadTierEditor(p.id);if(p.product_type==='multi')await loadOptionEditor(p.id);if(p.product_type==='coin')await loadCoinEditor(p.id);
  setAdminDirty(false);document.getElementById('adminStickyBar').classList.remove('hidden');if(window.innerWidth<=900)setAdminMobileSidebar(false);
  setAdminStatus('✓ '+p.name+' siap diedit.','ok')}
function updateAdminImagePreviewBox(url){const box=document.getElementById('adminImagePreviewBox');const img=document.getElementById('adminImagePreviewThumb');if(!box||!img)return;if(!url){box.classList.remove('has-img');img.removeAttribute('src');return}img.onerror=function(){box.classList.remove('has-img')};img.onload=function(){box.classList.add('has-img')};img.src=url}

async function loadTierEditor(pid){const {data,error}=await supabaseClient.from('product_price_tiers').select('*').eq('product_id',pid).order('min_qty');if(error)throw error;const el=document.getElementById('adminTierEditor');el.innerHTML=(data||[]).map(t=>'<div class="admin-row tier-row" data-tier-id="'+t.id+'"><div class="admin-field"><label>Label</label><input class="tier-label" value="'+escAttr(t.label||'')+'"></div><div class="admin-field"><label>Min Qty</label><input class="tier-min" type="number" min="1" value="'+Number(t.min_qty||1)+'"></div><div class="admin-field"><label>Max Qty</label><input class="tier-max" type="number" min="1" value="'+(t.max_qty==null?'':Number(t.max_qty))+'" placeholder="kosong = tanpa batas"></div><div class="admin-field"><label>Harga</label><input class="tier-price" type="number" min="0" value="'+Number(t.price||0)+'"></div></div>').join('')||'<div class="admin-empty">Belum ada tier.</div>'}
async function loadOptionEditor(pid){const {data,error}=await supabaseClient.from('product_options').select('*').eq('product_id',pid).order('sort_order');if(error)throw error;const el=document.getElementById('adminOptionEditor');el.innerHTML=(data||[]).map(o=>'<div class="admin-row option option-row" data-option-id="'+o.id+'"><div class="admin-field"><label>Nama</label><input class="opt-name" value="'+escAttr(o.name||'')+'"></div><div class="admin-field"><label>Harga</label><input class="opt-price" type="number" min="0" value="'+Number(o.price||0)+'"></div><div class="admin-field"><label>Stok</label><input class="opt-stock" type="number" min="0" value="'+Number(o.stock||0)+'"></div><div class="admin-field"><label>Min</label><input class="opt-min" type="number" min="1" value="'+Number(o.min_qty||1)+'"></div><div class="admin-field"><label>Step</label><input class="opt-step" type="number" min="1" value="'+Number(o.step_qty||1)+'"></div><div class="admin-field"><label>Harga per Qty</label><input class="opt-unit" type="number" min="1" value="'+Number(o.price_unit_qty||100)+'"></div><div class="admin-mini-check"><label><input class="opt-active" type="checkbox" '+(o.is_active?'checked':'')+'> Aktif</label></div></div>').join('')||'<div class="admin-empty">Belum ada opsi.</div>'}
async function loadCoinEditor(pid){const {data,error}=await supabaseClient.from('coin_configs').select('*').eq('product_id',pid).maybeSingle();if(error)throw error;const c=data||{};document.getElementById('adminCoinStep').value=Number(c.unit_step||0);document.getElementById('adminCoinUnitPrice').value=Number(c.unit_price||0);document.getElementById('adminCoinJasa').value=Number(c.jasa_per_step||0);document.getElementById('adminCoinMax').value=Number(c.max_amount||0)}

async function saveAdminProduct(){if(!(await verifyAdmin()))throw new Error('Sesi admin tidak valid. Login ulang.');const id=Number(document.getElementById('adminProductId').value),type=document.getElementById('adminProductType').value;
  const payload={name:document.getElementById('adminName').value.trim(),category:document.getElementById('adminCategory').value,base_price:Number(document.getElementById('adminBasePrice').value||0),stock:Number(document.getElementById('adminStock').value||0),display_price:document.getElementById('adminDisplayPrice').value.trim(),sort_order:Number(document.getElementById('adminSortOrder').value||0),image_url:document.getElementById('adminImageUrl').value.trim(),description:document.getElementById('adminDescription').value.trim(),is_active:document.getElementById('adminIsActive').checked,updated_at:new Date().toISOString()};
  const {error}=await supabaseClient.from('products').update(payload).eq('id',id);if(error)throw error;
  if(type==='tiered'){for(const r of document.querySelectorAll('.tier-row')){const mx=r.querySelector('.tier-max').value.trim();const {error:e}=await supabaseClient.from('product_price_tiers').update({label:r.querySelector('.tier-label').value.trim(),min_qty:Number(r.querySelector('.tier-min').value||1),max_qty:mx===''?null:Number(mx),price:Number(r.querySelector('.tier-price').value||0)}).eq('id',Number(r.dataset.tierId));if(e)throw e}}
  if(type==='multi'){for(const r of document.querySelectorAll('.option-row')){const {error:e}=await supabaseClient.from('product_options').update({name:r.querySelector('.opt-name').value.trim(),price:Number(r.querySelector('.opt-price').value||0),stock:Number(r.querySelector('.opt-stock').value||0),min_qty:Number(r.querySelector('.opt-min').value||1),step_qty:Number(r.querySelector('.opt-step').value||1),price_unit_qty:Number(r.querySelector('.opt-unit').value||1),is_active:r.querySelector('.opt-active').checked}).eq('id',Number(r.dataset.optionId));if(e)throw e}}
  if(type==='coin'){const coin={product_id:id,unit_step:Number(document.getElementById('adminCoinStep').value||1),unit_price:Number(document.getElementById('adminCoinUnitPrice').value||0),jasa_per_step:Number(document.getElementById('adminCoinJasa').value||0),max_amount:Number(document.getElementById('adminCoinMax').value||1),updated_at:new Date().toISOString()};const {error:e}=await supabaseClient.from('coin_configs').upsert(coin,{onConflict:'product_id'});if(e)throw e}
  await fetchAllAdminProducts();await loadAdminProduct(id);await syncCatalogFromSupabase();setAdminStatus('✓ Tersimpan ke Supabase dan katalog sudah diperbarui.','ok')}

async function openAdminPanel(){const o=document.getElementById('adminOverlay');o.classList.add('show');o.setAttribute('aria-hidden','false');if(!adminConfigured()){showAdminLogin();setAdminStatus('Isi SUPABASE_URL dan SUPABASE_PUBLISHABLE_KEY dulu.','error');return}try{if(await verifyAdmin()){showAdminDashboard();await fetchAllAdminProducts();if(!adminCurrentProduct&&adminProducts.length)await loadAdminProduct(adminProducts[0].id);else if(adminCurrentProduct)document.getElementById('adminStickyBar').classList.remove('hidden')}else{showAdminLogin();setAdminStatus('','')}}catch(e){console.error(e);showAdminLogin();setAdminStatus('Gagal mengecek admin: '+(e.message||e),'error')}}
function closeAdminPanel(){const o=document.getElementById('adminOverlay');o.classList.remove('show');o.setAttribute('aria-hidden','true');document.getElementById('adminStickyBar').classList.add('hidden')}

async function doSaveAdminProduct(){
  const saveBtn=document.getElementById('adminSaveBtn'),saveBtnM=document.getElementById('adminSaveBtnMobile');
  setBtnLoading(saveBtn,true);setBtnLoading(saveBtnM,true);setAdminStatus('Menyimpan...','');
  try{await saveAdminProduct();setAdminDirty(false)}
  catch(err){console.error(err);setAdminStatus('Gagal menyimpan: '+(err.message||err),'error')}
  finally{setBtnLoading(saveBtn,false);setBtnLoading(saveBtnM,false)}
}
async function doCloseOrLogoutGuard(action){
  if(adminDirty){const ok=await adminConfirm('Perubahan belum disimpan','Kamu punya perubahan yang belum disimpan pada produk ini. Yakin mau lanjut dan membuang perubahan tersebut?');if(!ok)return}
  action();
}

document.getElementById('adminCloseBtn').addEventListener('click',()=>doCloseOrLogoutGuard(()=>{setAdminDirty(false);closeAdminPanel()}));
document.getElementById('adminOverlay').addEventListener('click',function(e){if(e.target===this)doCloseOrLogoutGuard(()=>{setAdminDirty(false);closeAdminPanel()})});
document.getElementById('adminSearch').addEventListener('input',renderAdminProductList);

document.getElementById('adminPwToggle').addEventListener('click',function(){const inp=document.getElementById('adminPassword');const show=inp.type==='password';inp.type=show?'text':'password';this.textContent=show?'🙈':'👁️'});

document.getElementById('adminMobileToggle').addEventListener('click',function(){const sb=document.getElementById('adminSidebar');setAdminMobileSidebar(!sb.classList.contains('open'))});

document.getElementById('adminImageUrl').addEventListener('input',function(){updateAdminImagePreviewBox(this.value.trim());document.getElementById('adminPreviewImage').src=this.value.trim()||ADMIN_FALLBACK_IMG});

document.getElementById('adminProductForm').addEventListener('input',function(e){if(e.target.id!=='adminSearch')setAdminDirty(true)});
document.getElementById('adminProductForm').addEventListener('change',function(e){setAdminDirty(true)});

document.getElementById('adminLoginForm').addEventListener('submit',async function(e){
  e.preventDefault();const btn=document.getElementById('adminLoginBtn');setBtnLoading(btn,true);setAdminStatus('Sedang login...','');
  try{
    const {error}=await supabaseClient.auth.signInWithPassword({email:document.getElementById('adminEmail').value.trim(),password:document.getElementById('adminPassword').value});
    if(error)throw error;
    if(!(await verifyAdmin())){await supabaseClient.auth.signOut();throw new Error('Akun ini bukan admin.')}
    setAdminStatus('','');
    await runAdminLoginSuccessAnimation();
    showAdminDashboard();await fetchAllAdminProducts();if(adminProducts.length)await loadAdminProduct(adminProducts[0].id);
    setAdminStatus('✓ Login berhasil.','ok');
  }catch(err){
    console.error(err);
    await runAdminLoginFailAnimation('Email atau password salah');
    setAdminStatus('Login dibatalkan. Silakan coba lagi.','error');
    document.getElementById('adminPassword').value='';
  }
  finally{setBtnLoading(btn,false)}
});

document.getElementById('adminProductForm').addEventListener('submit',async function(e){e.preventDefault();await doSaveAdminProduct()});
document.getElementById('adminSaveBtnMobile').addEventListener('click',doSaveAdminProduct);

document.getElementById('adminReloadBtn').addEventListener('click',reloadCurrentAdminProduct);
document.getElementById('adminReloadBtnMobile').addEventListener('click',reloadCurrentAdminProduct);
async function reloadCurrentAdminProduct(){try{if(adminCurrentProduct)await loadAdminProduct(adminCurrentProduct.id)}catch(e){setAdminStatus('Gagal memuat ulang: '+(e.message||e),'error')}}

document.getElementById('adminRefreshAllBtn').addEventListener('click',async()=>{try{await fetchAllAdminProducts();await syncCatalogFromSupabase();setAdminStatus('✓ Data diperbarui.','ok')}catch(e){setAdminStatus('Refresh gagal: '+(e.message||e),'error')}});
document.getElementById('adminSettingsBtn').addEventListener('click',openAdminSettingsPanel);
document.getElementById('adminSettingsReloadBtn').addEventListener('click',openAdminSettingsPanel);
document.getElementById('adminSettingsSaveBtn').addEventListener('click',saveAdminSettingsCounter);

document.getElementById('adminLogoutBtn').addEventListener('click',()=>doCloseOrLogoutGuard(async()=>{
  await supabaseClient.auth.signOut();adminCurrentProduct=null;setAdminDirty(false);showAdminLogin();document.getElementById('adminPassword').value='';setAdminStatus('Logout berhasil.','ok');
}));

async function initSupabaseWebsite(){if(!adminConfigured()){console.info('Supabase belum dikonfigurasi.');return}try{await syncCatalogFromSupabase();await loadTransactionCounterSetting();console.log('Supabase tersambung. Semua katalog berhasil disinkronkan.')}catch(e){console.error('Sinkronisasi Supabase gagal:',e)}}
initSupabaseWebsite();
