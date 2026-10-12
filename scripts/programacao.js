(() => {
  const panel = document.getElementById('today-panel');
  const days = [...document.querySelectorAll('#programacao .day[data-date]')];
  if (!panel || !days.length) return;

  const timeZone = 'America/Sao_Paulo';
  const fullDateFormatter = new Intl.DateTimeFormat('pt-BR', {
    timeZone,
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });
  const datePartsFormatter = new Intl.DateTimeFormat('en-US', {
    timeZone,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  });
  const shortDateFormatter = new Intl.DateTimeFormat('pt-BR', {
    timeZone,
    day: 'numeric',
    month: 'long'
  });
  const number = document.getElementById('today-number');
  const month = document.getElementById('today-month');
  const fullDate = document.getElementById('today-full-date');
  const message = document.getElementById('today-message');
  const link = document.getElementById('today-link');

  function dateKey(date) {
    const parts = Object.fromEntries(
      datePartsFormatter.formatToParts(date).map(({ type, value }) => [type, value])
    );
    return `${parts.year}-${parts.month}-${parts.day}`;
  }

  function scheduledDate(day) {
    return shortDateFormatter.format(new Date(`${day.dataset.date}T12:00:00-03:00`));
  }

  function updateToday() {
    const now = new Date();
    const today = dateKey(now);
    const todayDay = days.find(day => day.dataset.date === today);
    const nextDay = days.find(day => day.dataset.date > today);

    days.forEach(day => {
      day.classList.remove('is-today');
      day.removeAttribute('aria-current');
      if (day.id === 'programacao-hoje' || day.id === 'proxima-programacao') {
        day.removeAttribute('id');
      }
      day.querySelector('.day-today-label')?.remove();
    });

    const todayParts = Object.fromEntries(
      datePartsFormatter.formatToParts(now).map(({ type, value }) => [type, value])
    );
    number.textContent = String(Number(todayParts.day));
    month.textContent = new Intl.DateTimeFormat('pt-BR', { timeZone, month: 'short' })
      .format(now).replace('.', '');
    fullDate.dateTime = today;
    fullDate.textContent = fullDateFormatter.format(now);

    if (todayDay) {
      const title = todayDay.querySelector('h2').textContent.trim();
      message.textContent = `${title}. Confira as celebrações e atividades de hoje.`;
      todayDay.classList.add('is-today');
      todayDay.setAttribute('aria-current', 'date');
      todayDay.id = 'programacao-hoje';
      const label = document.createElement('span');
      label.className = 'day-today-label';
      label.textContent = 'Hoje';
      todayDay.querySelector('.day-card').prepend(label);
      link.href = '#programacao-hoje';
      link.textContent = 'Ver programação de hoje';
      link.hidden = false;
    } else if (nextDay) {
      message.textContent = `A próxima data da programação é ${scheduledDate(nextDay)}.`;
      nextDay.id = 'proxima-programacao';
      link.href = '#proxima-programacao';
      link.textContent = 'Ver próxima data';
      link.hidden = false;
    } else {
      message.textContent = 'A programação da Festa de Santa Edwiges 2026 terminou em 18 de outubro.';
      link.hidden = true;
    }

    panel.hidden = false;
  }

  updateToday();
  setInterval(updateToday, 60_000);
  document.addEventListener('visibilitychange', () => {
    if (!document.hidden) updateToday();
  });
})();
