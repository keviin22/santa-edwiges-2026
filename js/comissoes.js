const cardsComissao = document.querySelectorAll('.card-comissoes');

cardsComissao.forEach((cardComissao) => {
  const cardInner = cardComissao.querySelector('.card-inner');
  const cardFace = cardComissao.querySelector('.card-face');
  const cardBack = cardComissao.querySelector('.card-back');
  const nomeComissao = cardComissao.querySelector('.title-card-back')?.textContent.trim()
    || cardComissao.querySelector('.card-face h3')?.textContent.trim()
    || 'comissão';

  function ajustarAltura(face) {
    // O verso é absoluto e tem `inset: 0`, então medimos uma cópia sem
    // essas restrições para obter a altura natural de todo o conteúdo.
    const copia = face.cloneNode(true);
    copia.style.position = 'absolute';
    copia.style.inset = 'auto';
    copia.style.width = '100%';
    copia.style.height = 'auto';
    copia.style.transform = 'none';
    copia.style.visibility = 'hidden';
    copia.style.pointerEvents = 'none';
    cardInner.appendChild(copia);
    const altura = copia.offsetHeight;
    copia.remove();

    cardInner.style.height = `${altura}px`;
  }

  function alternarCard() {
    const estaVirado = cardComissao.classList.toggle('is-flipped');
    ajustarAltura(estaVirado ? cardBack : cardFace);
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
