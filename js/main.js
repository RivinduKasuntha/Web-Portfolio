// Hamburger menu
const menuBtn = document.getElementById('menu-btn');
const menu = document.getElementById('menu');
function setMenu(open) {
  menu.classList.toggle('open', open);
  menuBtn.classList.toggle('open', open);
  menuBtn.setAttribute('aria-expanded', open);
  menuBtn.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
}
menuBtn.addEventListener('click', () => setMenu(!menu.classList.contains('open')));
menu.querySelectorAll('a').forEach(a => a.addEventListener('click', () => setMenu(false)));
document.addEventListener('keydown', e => { if (e.key === 'Escape') setMenu(false); });

// Dark mode toggle (saved, defaults to system setting)
const themeBtn = document.getElementById('theme-toggle');
function setTheme(t, save) {
  document.documentElement.dataset.theme = t;
  document.getElementById('theme-icon').innerHTML = t === 'dark' ? '&#9728;' : '&#9790;';
  themeBtn.setAttribute('aria-pressed', t === 'dark');
  themeBtn.setAttribute('aria-label', t === 'dark' ? 'Switch to light mode' : 'Switch to dark mode');
  if (save) { try { localStorage.setItem('theme', t); } catch (e) {} }
}
let start = document.documentElement.dataset.theme;
if (!start) start = matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
setTheme(start, false);
themeBtn.addEventListener('click', () =>
  setTheme(document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark', true));

// Projects: load JSON, filter, modal
const gallery = document.getElementById('gallery');
if (gallery) {
  const modal = document.getElementById('modal');
  let items = [];
  function render(cat) {
    gallery.innerHTML = '';
    items.filter(i => cat === 'All' || i.category === cat).forEach(i => {
      const card = document.createElement('button');
      card.className = 'card';
      card.innerHTML = `<img src="${i.image}" alt="${i.title} interface preview" loading="lazy">
        <span class="tag">${i.category}</span><h3>${i.title}</h3>`;
      card.addEventListener('click', () => {
        document.getElementById('modal-img').src = i.image;
        document.getElementById('modal-img').alt = i.title + ' interface preview';
        document.getElementById('modal-title').textContent = i.title;
        document.getElementById('modal-desc').textContent = i.description;
        modal.showModal();
      });
      gallery.appendChild(card);
    });
  }
  fetch('data/portfolio.json').then(r => r.json()).then(data => {
    items = data;
    const filters = document.getElementById('filters');
    ['All', ...new Set(data.map(i => i.category))].forEach((c, n) => {
      const b = document.createElement('button');
      b.textContent = c;
      if (n === 0) b.classList.add('on');
      b.addEventListener('click', () => {
        filters.querySelectorAll('button').forEach(x => x.classList.remove('on'));
        b.classList.add('on');
        render(c);
      });
      filters.appendChild(b);
    });
    render('All');
  }).catch(() => { gallery.textContent = 'Could not load projects. Run a local server (see README).'; });
  document.getElementById('modal-close').addEventListener('click', () => modal.close());
  modal.addEventListener('click', e => { if (e.target === modal) modal.close(); });
}
