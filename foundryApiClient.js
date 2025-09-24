(function () {
  const actorInput = document.getElementById('actorIdInput');
  const actorButton = document.getElementById('fetchActorButton');
  const actorResult = document.getElementById('actorResult');

  if (!actorInput || !actorButton || !actorResult) {
    return;
  }

  function setResult(message, state) {
    actorResult.textContent = message;
    actorResult.classList.remove('success', 'error');
    if (state) {
      actorResult.classList.add(state);
    }
  }

  async function requestActor(actorId) {
    const response = await fetch(`/api/actors/${encodeURIComponent(actorId)}`);
    let payload = null;

    try {
      payload = await response.json();
    } catch (error) {
      payload = null;
    }

    if (!response.ok) {
      const message = payload && payload.error ? payload.error : 'Unable to retrieve actor.';
      const details = payload && payload.details ? payload.details : null;
      let detailText = '';

      if (details) {
        if (typeof details === 'string') {
          detailText = `\n${details}`;
        } else {
          detailText = `\n${JSON.stringify(details, null, 2)}`;
        }
      }

      setResult(`${message}${detailText}`, 'error');
      return;
    }

    const actorData = payload && payload.actor ? payload.actor : payload;
    setResult(JSON.stringify(actorData, null, 2), 'success');
  }

  actorButton.addEventListener('click', async () => {
    const actorId = actorInput.value.trim();

    if (!actorId) {
      setResult('Enter an actor ID to fetch.', 'error');
      actorInput.focus();
      return;
    }

    setResult('Fetching actor data...', null);

    try {
      await requestActor(actorId);
    } catch (error) {
      setResult(`Failed to contact server.\n${error.message}`, 'error');
    }
  });

  actorInput.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      actorButton.click();
    }
  });
})();

