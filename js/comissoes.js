document.querySelectorAll('.card-comissoes').forEach((card, index) => {
  const face = card.querySelector('.card-face');
  const back = card.querySelector('.card-back');
  if (!face || !back) return;

  const name = face.querySelector('h2')?.textContent.trim() || 'comissão';
  const toggle = document.createElement('button');
  toggle.type = 'button';
  toggle.className = 'card-toggle';
  back.id = `comissao-detalhes-${index + 1}`;
  toggle.setAttribute('aria-controls', back.id);

  function setExpanded(expanded) {
    card.classList.toggle('is-flipped', expanded);
    face.inert = expanded;
    back.inert = !expanded;
    face.setAttribute('aria-hidden', String(expanded));
    back.setAttribute('aria-hidden', String(!expanded));
    toggle.setAttribute('aria-expanded', String(expanded));
    toggle.textContent = expanded ? 'Voltar ao resumo' : 'Exibir detalhes';
    toggle.setAttribute('aria-label', `${toggle.textContent}: ${name}`);
  }

  // O botão fica fora das faces para manter o foco ao virar o cartão.
  card.appendChild(toggle);
  card.querySelectorAll('.flip-hint').forEach((hint) => hint.remove());
  card.classList.add('is-enhanced');
  setExpanded(false);

  toggle.addEventListener('click', () => {
    setExpanded(toggle.getAttribute('aria-expanded') !== 'true');
  });

  card.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && card.classList.contains('is-flipped')) {
      event.preventDefault();
      toggle.focus();
      setExpanded(false);
    }
  });
});
