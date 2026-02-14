// ============================================
// QMI Search Module
// js/search.js
// ============================================

import { supabase } from "./supabase.js";

let allResults = [];
let filteredResults = [];

// ============================================
// MAIN SEARCH FUNCTION
// ============================================
window.search = async function() {
  const query = document.getElementById('q').value.trim();
  const resultsContainer = document.getElementById('res');
  const searchBtn = document.querySelector('.search-btn');
  const btnText = document.getElementById('searchBtnText');
  
  if (!query) {
    showEmptyState('Please enter a search term');
    return;
  }

  // Show loading state
  searchBtn.disabled = true;
  btnText.innerHTML = '<span class="spinner" style="width: 16px; height: 16px; border-width: 2px; margin-right: 0.5rem;"></span>Searching...';
  resultsContainer.innerHTML = '<div class="loading"><div class="spinner"></div><p>Searching companies...</p></div>';

  try {
    // Search in research table
    const { data, error } = await supabase
      .from('research')
      .select('*')
      .or(`company.ilike.%${query}%,country.ilike.%${query}%`)
      .order('created_at', { ascending: false });

    if (error) throw error;

    allResults = data || [];
    filteredResults = allResults;
    
    displayResults(filteredResults);
    updateStats(filteredResults.length, query);

  } catch (error) {
    console.error('Search error:', error);
    resultsContainer.innerHTML = `
      <div class="empty-state">
        <div class="empty-state-icon">⚠️</div>
        <h3>Search Error</h3>
        <p>${error.message}</p>
      </div>
    `;
    document.getElementById('resultsStats').textContent = '';
  } finally {
    searchBtn.disabled = false;
    btnText.textContent = 'Search';
  }
};

// ============================================
// DISPLAY RESULTS
// ============================================
function displayResults(results) {
  const container = document.getElementById('res');

  if (results.length === 0) {
    showEmptyState('No companies found. Try a different search term.');
    return;
  }

  container.innerHTML = results.map(item => {
    // Extract research content (first 150 characters)
    const excerpt = item.research ? 
      (item.research.substring(0, 150) + '...') : 
      'Research available';
    
    return `
      <a href="company.html?id=${item.id}" class="result-card">
        <div class="result-header">
          <div>
            <div class="result-title">${item.company}</div>
          </div>
        </div>
        <div class="result-meta">
          <span class="result-badge">${item.country}</span>
          <span class="result-badge">Added ${formatDate(item.created_at)}</span>
        </div>
        <div class="result-description">${excerpt}</div>
        <div class="result-footer">
          <span>Created ${formatDate(item.created_at)}</span>
          <span class="view-link">View Research →</span>
        </div>
      </a>
    `;
  }).join('');
}

// ============================================
// APPLY FILTERS
// ============================================
window.applyFilters = function() {
  const region = document.getElementById('regionFilter')?.value.toLowerCase();
  const sort = document.getElementById('sortFilter')?.value;

  // Filter by region/country
  filteredResults = allResults.filter(item => {
    const matchRegion = !region || item.country.toLowerCase().includes(region);
    return matchRegion;
  });

  // Apply sorting
  if (sort === 'recent') {
    filteredResults.sort((a, b) => 
      new Date(b.created_at) - new Date(a.created_at)
    );
  } else if (sort === 'alphabetical') {
    filteredResults.sort((a, b) => 
      a.company.localeCompare(b.company)
    );
  } else {
    // Default: most relevant (keep original order)
    filteredResults.sort((a, b) => 
      new Date(b.created_at) - new Date(a.created_at)
    );
  }

  displayResults(filteredResults);
  updateStats(filteredResults.length, document.getElementById('q').value);
};

// ============================================
// UPDATE SEARCH STATS
// ============================================
function updateStats(count, query) {
  const statsEl = document.getElementById('resultsStats');
  if (statsEl) {
    if (count > 0) {
      statsEl.textContent = `Found ${count} ${count === 1 ? 'result' : 'results'} for "${query}"`;
    } else {
      statsEl.textContent = '';
    }
  }
}

// ============================================
// SHOW EMPTY STATE
// ============================================
function showEmptyState(message) {
  const container = document.getElementById('res');
  container.innerHTML = `
    <div class="empty-state">
      <div class="empty-state-icon">🔍</div>
      <h3>No Results</h3>
      <p>${message}</p>
    </div>
  `;
  const statsEl = document.getElementById('resultsStats');
  if (statsEl) {
    statsEl.textContent = '';
  }
}

// ============================================
// FORMAT DATE (RELATIVE TIME)
// ============================================
function formatDate(dateString) {
  const date = new Date(dateString);
  const now = new Date();
  const diffTime = Math.abs(now - date);
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  if (diffDays === 0) {
    return 'Today';
  } else if (diffDays === 1) {
    return 'Yesterday';
  } else if (diffDays < 7) {
    return `${diffDays}d ago`;
  } else if (diffDays < 30) {
    const weeks = Math.floor(diffDays / 7);
    return `${weeks}w ago`;
  } else if (diffDays < 365) {
    const months = Math.floor(diffDays / 30);
    return `${months}mo ago`;
  } else {
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric' 
    });
  }
}

// ============================================
// LOAD ALL COMPANIES (INITIAL LOAD)
// ============================================
async function loadAllCompanies() {
  try {
    const { data, error } = await supabase
      .from('research')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(50); // Show latest 50 companies

    if (error) throw error;

    if (data && data.length > 0) {
      allResults = data;
      filteredResults = data;
      displayResults(filteredResults);
      
      const statsEl = document.getElementById('resultsStats');
      if (statsEl) {
        statsEl.textContent = `Showing ${data.length} recent companies`;
      }
    }
  } catch (error) {
    console.error('Error loading companies:', error);
  }
}

// ============================================
// EVENT LISTENERS
// ============================================

// Search on Enter key
const searchInput = document.getElementById('q');
if (searchInput) {
  searchInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
      search();
    }
  });

  // Auto-focus on search input
  searchInput.focus();
}

// Auto-search if query parameter exists in URL
const urlParams = new URLSearchParams(window.location.search);
const queryParam = urlParams.get('q');
if (queryParam) {
  searchInput.value = queryParam;
  search();
} else {
  // Load all companies by default
  loadAllCompanies();
}

// ============================================
// EXPORT FUNCTIONS (if needed elsewhere)
// ============================================
export { search, applyFilters, formatDate };
