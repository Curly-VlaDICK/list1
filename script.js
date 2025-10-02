document.addEventListener('DOMContentLoaded', () => {
    const phrases = [
        "Здра́вствуй!",
        "Приве́т!",
        "Дава́й познако́мимся, меня́ зову́т Влад. Как тебя́ зову́т?",
        "Меня́ зову́т Ка́тя.",
        "Прия́тно познако́миться.",
        "И мне о́чень прия́тно.",
        "Ка́тя, ско́лько тебе́ лет?",
        "Мне 21, а тебе́?",
        "Мне 20.",
        "Влад, отку́да ты?",
        "Я из Биробиджа́на, а ты?",
        "Я из Владивосто́ка."
    ];

    const phraseBank = document.getElementById('phrase-bank');
    const sequenceArea = document.getElementById('sequence-area');
    const checkButton = document.getElementById('check-button');
    const resetButton = document.getElementById('reset-button');
    const resultMessage = document.getElementById('result-message');

    let draggablePhrases = []; //  Храним элементы фраз, чтобы можно было их вернуть

    function populatePhraseBank() {
        const shuffledPhrases = [...phrases].sort(() => Math.random() - 0.5);

        shuffledPhrases.forEach(phraseText => {
            const phraseElement = document.createElement('div');
            phraseElement.textContent = phraseText;
            phraseElement.classList.add('phrase');
            phraseElement.draggable = true;

            phraseElement.addEventListener('dragstart', (event) => {
                event.dataTransfer.setData('text', phraseText);
                event.dataTransfer.setData('source', 'phrase-bank'); //  Указываем, откуда элемент
            });

            phraseBank.appendChild(phraseElement);
            draggablePhrases.push(phraseElement);
        });
    }

    function allowDrop(event) {
        event.preventDefault();
    }

    function drop(event) {
        event.preventDefault();
        const phraseText = event.dataTransfer.getData('text');
        const source = event.dataTransfer.getData('source');

        //  Нужно найти элемент, соответствующий тексту, чтобы его переместить

        const phraseElement = draggablePhrases.find(el => el.textContent === phraseText);

        if (phraseElement) {
            if (event.target === phraseBank || event.target.parentNode === phraseBank)
             {
                // Вернуть в phrase-bank
                phraseBank.appendChild(phraseElement);
                event.dataTransfer.setData('source', 'phrase-bank');
             }
             else{
                // Переместить в sequence-area
                sequenceArea.appendChild(phraseElement);
                event.dataTransfer.setData('source', 'sequence-area');
             }
        }
    }

    function checkOrder() {
        const currentOrder = Array.from(sequenceArea.children).map(el => el.textContent);
        let allCorrect = true;

        Array.from(sequenceArea.children).forEach((phraseElement, index) => {
            if (currentOrder[index] === phrases[index]) {
                phraseElement.classList.add('correct');
                phraseElement.classList.remove('incorrect');
            } else {
                phraseElement.classList.add('incorrect');
                phraseElement.classList.remove('correct');
                allCorrect = false;
            }
        });
    }

    function resetGame() {
        //  Возвращаем все фразы в банк фраз
        draggablePhrases.forEach(phraseElement => {
            phraseBank.appendChild(phraseElement);
            phraseElement.classList.remove('correct', 'incorrect'); //  Удаляем классы
        });

        //  Очищаем sequence area
        sequenceArea.innerHTML = '';

        //  Перемешиваем фразы в банке
        phraseBank.innerHTML = '';
        draggablePhrases = [];  // Очищаем массив
        populatePhraseBank();

        resultMessage.textContent = ''; //  Очищаем сообщение
    }

    phraseBank.addEventListener('dragover', allowDrop);
    phraseBank.addEventListener('drop', drop);

    sequenceArea.addEventListener('dragover', allowDrop);
    sequenceArea.addEventListener('drop', drop);

    checkButton.addEventListener('click', checkOrder);
    resetButton.addEventListener('click', resetGame);

    populatePhraseBank();
});
