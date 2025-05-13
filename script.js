document.addEventListener('DOMContentLoaded', () => {
    const cardPool = document.getElementById('card-pool');
    const selectedCardsContainer = document.getElementById('selected-cards');
    const resetButton = document.getElementById('reset-button');
    const selectedCountSpan = document.getElementById('selected-count');
    const infoText = document.getElementById('info-text');
    const noSelectedText = document.getElementById('no-selected-text');

    const TOTAL_CARDS = 44;
    const MAX_SELECTED_CARDS = 10;
    const IMAGE_FOLDER = 'images'; // Görsellerin bulunduğu klasör
    const IMAGE_EXTENSION = '.jpg'; // Görsel uzantısı (.jpg ise değiştirin)

    let selectedCards = new Set(); // Seçilen kartların ID'lerini tutar (benzersiz)

    // Başlangıçta kartları oluştur
    function initializeCards() {
        for (let i = 1; i <= TOTAL_CARDS; i++) {
            const card = document.createElement('div');
            card.classList.add('card');
            card.dataset.cardId = i; // Kart ID'sini data attribute olarak ekle

            const cardNumberSpan = document.createElement('span');
            cardNumberSpan.classList.add('card-number');
            cardNumberSpan.textContent = `${i}`;
            card.appendChild(cardNumberSpan);

            const img = document.createElement('img');
            const imagePath = `${IMAGE_FOLDER}/${i}${IMAGE_EXTENSION}`;
            img.src = imagePath;
            img.alt = `Kart ${i}`;
            // Resim yüklenemezse numaranın görünür kalmasını sağla
            img.onerror = () => {
                img.style.display = 'none'; // Kırık resim ikonunu gizle
                cardNumberSpan.style.backgroundColor = 'transparent'; // Numarayı daha belirgin yap
                console.warn(`Görsel yüklenemedi: ${imagePath}`);
            };
            card.appendChild(img);


            card.addEventListener('click', handleCardClick);
            cardPool.appendChild(card);
        }
    }

    // Kart tıklama işlevi
    function handleCardClick(event) {
        const clickedCard = event.currentTarget; // Tıklanan .card div'i
        const cardId = clickedCard.dataset.cardId;

        // Zaten seçili mi veya limit dolu mu kontrol et
        if (clickedCard.classList.contains('disabled')) {
            return; // Zaten seçili veya pasifse işlem yapma
        }

        if (selectedCards.size >= MAX_SELECTED_CARDS) {
            alert(`En fazla ${MAX_SELECTED_CARDS} kart seçebilirsiniz.`);
            return;
        }

        // Kartı seç
        selectCard(cardId, clickedCard);
    }

    // Kart seçme mantığı
    function selectCard(cardId, originalCardElement) {
        // Orijinal kartı pasif yap
        originalCardElement.classList.add('disabled');

        // Seçilen kartlar setine ekle
        selectedCards.add(cardId);

        // Seçilen alana kartın kopyasını ekle
        const selectedClone = originalCardElement.cloneNode(true); // Derin kopya (içeriğiyle birlikte)
        selectedClone.classList.remove('disabled'); // Seçilen alandaki kopya pasif olmamalı
        selectedClone.removeEventListener('click', handleCardClick); // Klonun tıklanmasını engelle
        selectedClone.style.cursor = 'default'; // İmleci normale çevir

        selectedCardsContainer.appendChild(selectedClone);

        // "Henüz kart seçilmedi" yazısını gizle (eğer varsa)
        if (noSelectedText) {
            noSelectedText.style.display = 'none';
        }

        updateSelectedCount();
    }

    // Seçim sıfırlama işlevi
    function resetSelection() {
        // Seçilen kartlar alanını temizle
        selectedCardsContainer.innerHTML = ''; // İçeriği boşalt
        selectedCardsContainer.appendChild(noSelectedText); // "Henüz kart seçilmedi" yazısını geri ekle
        noSelectedText.style.display = 'block'; // Görünür yap

        // Kart havuzundaki kartların 'disabled' sınıfını kaldır
        const poolCards = cardPool.querySelectorAll('.card');
        poolCards.forEach(card => {
            card.classList.remove('disabled');
        });

        // Seçilen kartlar set'ini temizle
        selectedCards.clear();

        updateSelectedCount();
    }

    // Seçilen kart sayısını güncelle
    function updateSelectedCount() {
        selectedCountSpan.textContent = selectedCards.size;
        infoText.textContent = `Lütfen en fazla ${MAX_SELECTED_CARDS} kart seçin. Seçilen Kartlar: ${selectedCards.size}/${MAX_SELECTED_CARDS}`;
    }

    // Olay dinleyicileri ekle
    resetButton.addEventListener('click', resetSelection);

    // Başlat
    initializeCards();
    updateSelectedCount(); // Başlangıç sayısını göster (0)

});