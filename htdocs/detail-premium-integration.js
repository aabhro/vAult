// Premium Detail Integration for Vault
// Add this to your app.js to enable the premium detail modal

/**
 * Opens the premium detail modal with movie/show data
 * @param {Object} media - Media object with TMDB data
 */
function openDetailPremium(media) {
  const data = {
    title: media.title || media.name,
    posterUrl: media.poster_path ? `https://image.tmdb.org/t/p/w342${media.poster_path}` : '',
    backdropUrl: media.backdrop_path ? `https://image.tmdb.org/t/p/w1280${media.backdrop_path}` : '',
    rating: media.vote_average,
    year: media.release_date ? new Date(media.release_date).getFullYear() : new Date().getFullYear(),
    type: media.media_type === 'tv' ? 'TV Show' : 'Movie',
    runtime: media.runtime ? `${Math.floor(media.runtime / 60)}h ${media.runtime % 60}m` : '2h 15m',
    overview: media.overview,
    trailerUrl: getTrailerUrl(media.id, media.media_type),
    playUrl: `player.html?id=${media.id}&type=${media.media_type}`,
    badge: media.vote_average >= 8 ? 'Highly Rated' : 'Featured',
  };

  // Call the global function from detail-premium.html
  if (window.openDetailPremium) {
    window.openDetailPremium(data);
  }
}

/**
 * Get YouTube trailer URL for a media item
 * @param {number} id - TMDB media ID
 * @param {string} type - 'movie' or 'tv'
 * @returns {string} YouTube embed URL
 */
function getTrailerUrl(id, type) {
  // This would typically fetch from TMDB API
  // For now, returning a placeholder that should be replaced with real data
  return `https://www.youtube.com/embed/dQw4w9WgXcQ?controls=0&modestbranding=1&rel=0`;
}

/**
 * Replace existing card click handlers with premium modal
 * Add event delegation to card containers
 */
function initPremiumDetailListeners() {
  // Listen for clicks on movie/TV cards
  document.addEventListener('click', (e) => {
    const card = e.target.closest('[data-media-id]');
    if (!card) return;

    const mediaId = card.dataset.mediaId;
    const mediaType = card.dataset.mediaType || 'movie';

    // Fetch media details and open premium modal
    fetchAndOpenDetail(mediaId, mediaType);
  });
}

/**
 * Fetch media details from TMDB and open premium modal
 * @param {number} id - TMDB media ID
 * @param {string} type - 'movie' or 'tv'
 */
async function fetchAndOpenDetail(id, type) {
  try {
    const apiKey = CONFIG?.TMDB_API_KEY;
    if (!apiKey) {
      console.error('TMDB API key not configured');
      return;
    }

    const endpoint = `https://api.themoviedb.org/3/${type}/${id}?api_key=${apiKey}&append_to_response=videos`;
    const response = await fetch(endpoint);
    const media = await response.json();

    // Extract trailer URL from videos
    if (media.videos && media.videos.results) {
      const trailer = media.videos.results.find(v => v.type === 'Trailer' && v.site === 'YouTube');
      if (trailer) {
        media.trailerId = trailer.key;
      }
    }

    media.media_type = type;
    openDetailPremium(media);
  } catch (error) {
    console.error('Failed to fetch media details:', error);
  }
}

/**
 * Initialize premium detail modal on page load
 */
function initPremiumDetailModal() {
  // Load the premium detail component
  fetch('detail-premium.html')
    .then(res => res.text())
    .then(html => {
      // Insert premium detail modal into the page
      const container = document.createElement('div');
      container.innerHTML = html;
      document.body.appendChild(container);

      // Link the CSS
      const link = document.createElement('link');
      link.rel = 'stylesheet';
      link.href = 'detail-premium.css';
      document.head.appendChild(link);

      // Initialize listeners after modal is loaded
      initPremiumDetailListeners();
    })
    .catch(err => console.error('Failed to load premium detail modal:', err));
}

// Hook into existing card rendering
// Replace the old detail modal opening logic with:
// Instead of: showDetailModal(media)
// Use: openDetailPremium(media)

/**
 * Example: Update card rendering to use premium detail
 * This should replace or wrap your existing createCard/renderCard function
 */
function createCardWithPremiumDetail(media) {
  const card = document.createElement('div');
  card.className = 'card';
  card.dataset.mediaId = media.id;
  card.dataset.mediaType = media.media_type || 'movie';

  // Make card clickable to open premium detail
  card.style.cursor = 'pointer';

  card.innerHTML = `
    <div class="card-image">
      <img 
        src="https://image.tmdb.org/t/p/w342${media.poster_path}" 
        alt="${media.title || media.name}"
        loading="lazy"
      />
      <div class="card-overlay">
        <button class="card-play-btn" onclick="event.stopPropagation(); openDetailPremium(${JSON.stringify(media).replace(/"/g, '&quot;')})">
          <svg width="32" height="32" viewBox="0 0 24 24" fill="currentColor">
            <polygon points="5 3 19 12 5 21" />
          </svg>
        </button>
      </div>
    </div>
    <div class="card-info">
      <h3 class="card-title">${media.title || media.name}</h3>
      <div class="card-meta">
        <span class="card-rating">★ ${media.vote_average?.toFixed(1)}</span>
        <span class="card-year">${new Date(media.release_date || media.first_air_date).getFullYear()}</span>
      </div>
    </div>
  `;

  // Open premium detail on card click
  card.addEventListener('click', () => {
    openDetailPremium(media);
  });

  return card;
}

// Export functions for use in other modules
window.premiumDetail = {
  open: openDetailPremium,
  close: () => window.closeDetailPremium?.(),
  init: initPremiumDetailModal,
};

// Auto-initialize on DOM ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initPremiumDetailModal);
} else {
  initPremiumDetailModal();
}
