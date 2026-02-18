// Search functionality
console.log('search.js loaded');

(function() {
    const searchInput = document.getElementById('searchInput');
    const searchResults = document.getElementById('searchResults');
    
    if (!searchInput || !searchResults) {
        console.error('Search elements not found!', {searchInput, searchResults});
        return;
    }
    
    console.log('Search elements found!');
    let searchTimeout = null;

    // Build search index
    function buildSearchIndex() {
        const sections = document.querySelectorAll('section');
        const searchIndex = [];

        sections.forEach(section => {
            const sectionId = section.id;
            const heading = section.querySelector('h2, h3, h1');
            const paragraphs = section.querySelectorAll('p, li, h4, .uniform-card, .menu-item, div, span');

            if (heading && sectionId) {
                const title = heading.textContent.trim();
                const content = Array.from(paragraphs)
                    .map(p => p.textContent.trim())
                    .join(' ')
                    .substring(0, 1000); // Increased from 500 to 1000

                if (title) {
                    searchIndex.push({
                        id: sectionId,
                        title: title,
                        content: content
                    });
                }
            }
        });

        console.log('Search index built:', searchIndex.length, 'items');
        return searchIndex;
    }

    const searchIndex = buildSearchIndex();

    // Perform search
    function performSearch(query) {
        if (!query || query.length < 2) {
            searchResults.innerHTML = '';
            searchResults.classList.remove('active');
            return;
        }

        const lowerQuery = query.toLowerCase();
        const results = searchIndex.filter(item => {
            return item.title.toLowerCase().includes(lowerQuery) ||
                item.content.toLowerCase().includes(lowerQuery);
        });

        console.log('Search results:', results.length);
        displayResults(results, query);
    }

    // Display results
    function displayResults(results, query) {
        searchResults.innerHTML = '';

        if (results.length === 0) {
            searchResults.innerHTML = '<div class="search-no-results">Inga resultat hittades</div>';
            searchResults.classList.add('active');
            return;
        }

        results.forEach(result => {
            const div = document.createElement('div');
            div.className = 'search-result-item';
            
            const titleText = result.title.replace(new RegExp(`(${query})`, 'gi'), '<mark>$1</mark>');
            const snippetText = result.content.substring(0, 150).replace(new RegExp(`(${query})`, 'gi'), '<mark>$1</mark>');
            
            div.innerHTML = `
                <div class="search-result-title">${titleText}</div>
                <div class="search-result-snippet">${snippetText}...</div>
            `;
            
            div.addEventListener('click', () => {
                const targetSection = document.querySelector(`#${result.id}`);
                if (targetSection) {
                    searchResults.classList.remove('active');
                    searchResults.innerHTML = '';
                    searchInput.value = '';
                    searchInput.blur();

                    const navbar = document.querySelector('.navbar');
                    const navbarHeight = navbar ? navbar.offsetHeight : 80;
                    const targetPosition = targetSection.offsetTop - navbarHeight - 20;

                    window.scrollTo({
                        top: targetPosition,
                        behavior: 'smooth'
                    });
                }
            });
            
            searchResults.appendChild(div);
        });

        searchResults.classList.add('active');
    }

    // Event listeners
    searchInput.addEventListener('input', (e) => {
        console.log('Search input:', e.target.value);
        clearTimeout(searchTimeout);
        searchTimeout = setTimeout(() => {
            performSearch(e.target.value);
        }, 300);
    });

    document.addEventListener('click', (e) => {
        if (!e.target.closest('.search-container')) {
            searchResults.classList.remove('active');
            searchResults.innerHTML = '';
        }
    });

    searchResults.addEventListener('click', (e) => {
        e.stopPropagation();
    });

    searchInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            const firstResult = searchResults.querySelector('.search-result-item');
            if (firstResult) {
                firstResult.click();
            }
        }
    });
    
    console.log('Search initialized successfully!');
})();
