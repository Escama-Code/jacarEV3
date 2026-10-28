(() => {
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];

  const busca = $('#busca');
  const status = $('#busca-status');
  const menu = $('#menu-lateral');
  const btnMenu = $('#btn-menu');

  function normalizar(s) {
    return (s || '').toLowerCase().normalize('NFD').replace(/\p{M}/gu, '');
  }

  function filtrar() {
    const q = normalizar(busca?.value || '').trim();
    const cmds = $$('.cmd');
    let visiveis = 0;
    cmds.forEach((el) => {
      const hay = normalizar(el.dataset.nome + ' ' + el.textContent);
      const ok = !q || hay.includes(q);
      el.classList.toggle('oculto', !ok);
      if (ok) visiveis++;
    });
    $$('.secao').forEach((sec) => {
      if (sec.id === 'inicio' || sec.id === 'comecando') {
        sec.classList.remove('sem-resultado');
        return;
      }
      const algum = sec.querySelector('.cmd:not(.oculto)');
      const soIntro = !sec.querySelector('.cmd');
      sec.classList.toggle('sem-resultado', !soIntro && !algum && !!q);
    });
    if (status) {
      status.textContent = q
        ? (visiveis ? visiveis + ' comando(s) encontrado(s)' : 'Nenhum comando correspondente')
        : '';
    }
  }

  busca?.addEventListener('input', filtrar);
  busca?.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') { busca.value = ''; filtrar(); busca.blur(); }
  });

  // Copiar exemplo do card
  document.addEventListener('click', async (e) => {
    const btn = e.target.closest('.copiar');
    if (!btn) return;
    const art = btn.closest('.cmd');
    const code = art?.querySelector('pre code');
    const texto = code?.textContent || '';
    try {
      await navigator.clipboard.writeText(texto.trim());
      const old = btn.textContent;
      btn.textContent = 'Copiado!';
      btn.classList.add('ok');
      setTimeout(() => { btn.textContent = old; btn.classList.remove('ok'); }, 1400);
    } catch (_) {
      btn.textContent = 'Erro';
      setTimeout(() => { btn.textContent = 'Copiar'; }, 1400);
    }
  });

  // Menu mobile
  btnMenu?.addEventListener('click', () => {
    const aberto = menu?.classList.toggle('aberto');
    btnMenu.setAttribute('aria-expanded', aberto ? 'true' : 'false');
  });
  menu?.querySelectorAll('a').forEach((a) => {
    a.addEventListener('click', () => {
      menu.classList.remove('aberto');
      btnMenu?.setAttribute('aria-expanded', 'false');
    });
  });

  // Highlight seção ativa no menu
  const links = $$('.menu-lateral a[href^="#"]');
  const secoes = links
    .map((a) => document.getElementById(a.getAttribute('href').slice(1)))
    .filter(Boolean);

  function marcarAtivo() {
    let atual = secoes[0];
    const y = window.scrollY + 100;
    for (const s of secoes) {
      if (s.offsetTop <= y) atual = s;
    }
    links.forEach((a) => {
      const on = atual && a.getAttribute('href') === '#' + atual.id;
      a.classList.toggle('ativo', !!on);
    });
  }
  window.addEventListener('scroll', marcarAtivo, { passive: true });
  marcarAtivo();
})();
