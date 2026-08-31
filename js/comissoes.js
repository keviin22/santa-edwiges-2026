const cardsComissao = document.querySelectorAll('.card-comissoes');

cardsComissao.forEach((cardComissao) => {
  const nomeComissao = cardComissao.querySelector('.title-card-back')?.textContent.trim()
    || cardComissao.querySelector('.card-face h3')?.textContent.trim()
    || 'comissão';

  function alternarCard() {
    const estaVirado = cardComissao.classList.toggle('is-flipped');
    cardComissao.setAttribute('aria-pressed', String(estaVirado));
    cardComissao.setAttribute(
      'aria-label',
      estaVirado
        ? `Voltar ao resumo da ${nomeComissao}`
        : `Exibir detalhes da ${nomeComissao}`
    );
  }

  cardComissao.setAttribute('aria-label', `Exibir detalhes da ${nomeComissao}`);
  cardComissao.addEventListener('click', alternarCard);
  cardComissao.addEventListener('keydown', (event) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      alternarCard();
    }
  });
});
