const $=(s,root=document)=>root.querySelector(s), $$=(s,root=document)=>[...root.querySelectorAll(s)];
const revealObserver=new IntersectionObserver(entries=>entries.forEach(entry=>{if(entry.isIntersecting){entry.target.classList.add('visible');revealObserver.unobserve(entry.target)}}),{threshold:.12});
$$('.reveal').forEach(el=>revealObserver.observe(el));
const menu=$('.menu-toggle'),nav=$('.nav');
menu.addEventListener('click',()=>{const open=nav.classList.toggle('open');menu.setAttribute('aria-expanded',String(open))});
$$('.nav a').forEach(a=>a.addEventListener('click',()=>{nav.classList.remove('open');menu.setAttribute('aria-expanded','false')}));
$$('.filter').forEach(btn=>btn.addEventListener('click',()=>{$$('.filter').forEach(b=>b.classList.remove('active'));btn.classList.add('active');const filter=btn.dataset.filter;$$('.product-card').forEach(card=>{card.hidden=filter!=='all'&&card.dataset.category!==filter})}));
let cart=[];
const overlay=$('.cart-overlay'),items=$('.cart-items');
function money(v){return v.toLocaleString('pt-BR',{style:'currency',currency:'BRL'})}
function renderCart(){ $('.bag-count').textContent=cart.reduce((n,p)=>n+p.qty,0);if(!cart.length){items.innerHTML='<p class="empty-cart">Sua sacola está vazia.</p>'}else{items.innerHTML=cart.map((p,i)=>`<div class="cart-item"><div><strong>${p.name}</strong><br><span>${p.qty} × ${money(p.price)}</span></div><button data-remove="${i}">REMOVER</button></div>`).join('')}$('.cart-total').textContent=money(cart.reduce((n,p)=>n+p.price*p.qty,0));$$('[data-remove]').forEach(b=>b.addEventListener('click',()=>{cart.splice(Number(b.dataset.remove),1);renderCart()}))}
function toast(msg){const el=$('.toast');el.textContent=msg;el.classList.add('show');setTimeout(()=>el.classList.remove('show'),2200)}
$$('.quick-add').forEach(btn=>btn.addEventListener('click',()=>{const card=btn.closest('.product-card'),name=card.dataset.name,price=Number(card.dataset.price),found=cart.find(p=>p.name===name);if(found)found.qty++;else cart.push({name,price,qty:1});renderCart();toast(`${name} adicionado à sacola`)}));
function openCart(){overlay.classList.add('open');overlay.setAttribute('aria-hidden','false');document.body.style.overflow='hidden'}
function closeCart(){overlay.classList.remove('open');overlay.setAttribute('aria-hidden','true');document.body.style.overflow=''}
$('.bag-button').addEventListener('click',openCart);$('.cart-close').addEventListener('click',closeCart);overlay.addEventListener('click',e=>{if(e.target===overlay)closeCart()});document.addEventListener('keydown',e=>{if(e.key==='Escape')closeCart()});
$('.checkout').addEventListener('click',()=>toast(cart.length?'Checkout ainda precisa ser conectado a um canal de vendas.':'Adicione produtos à sua sacola.'));
$('#newsletter').addEventListener('submit',e=>{e.preventDefault();$('.form-message').textContent='Obrigado! Cadastro demonstrativo recebido.';e.target.reset()});
$('#year').textContent=new Date().getFullYear();renderCart();