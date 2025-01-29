document.getElementById('Pesquisar-btn').addEventListener('click', function () {
    const query = document.getElementById('Pesquisar-input').value.trim();
    const resultsContainer = document.getElementById('results');

    if (!query) {
        resultsContainer.innerHTML = '<p class="no-results">Por favor digite algo para buscar.</p>';
        return;
    }

    fetch(`https://openlibrary.org/search.json?q=${encodeURIComponent(query)}`)
        .then(response => response.json())
        .then(data => {
            resultsContainer.innerHTML = '';

            if (data.docs && data.docs.length > 0) {
                const translateText = async (text) => {
                    const response = await fetch("https://api.mymemory.translated.net/get?q=" + encodeURIComponent(text) + "&langpair=en|pt-BR");
                    const translation = await response.json();
                    return translation.responseData.translatedText;
                };

                data.docs.forEach(async book => {
                    const title = book.title || 'Título não disponível';
                    const author = book.author_name ? book.author_name.join(', ') : 'Autor desconhecido';
                    const description = book.first_sentence ? book.first_sentence.join(' ') : 'Biografia não disponível.';

                    const translatedDescription = await translateText(description);

                    const li = document.createElement('li');
                    li.innerHTML = `
                        <strong>Título:</strong> ${title}<br>
                        <strong>Autor:</strong> ${author}<br>
                        <strong>Biografia:</strong> ${translatedDescription}
                    `;
                    resultsContainer.appendChild(li);
                });
            } else {
                resultsContainer.innerHTML = '<p class="no-results">Nenhum resultado encontrado. Tente outro nome.</p>';
            }
        })
        .catch(error => {
            resultsContainer.innerHTML = '<p class="no-results">Ocorreu um erro ao buscar os dados. Por favor, tente novamente mais tarde.</p>';
            console.error('Erro ao buscar dados:', error);
        });
});
