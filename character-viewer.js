// Character Viewer JavaScript
// Development mode: use local character data
const DEV_MODE = true;
const CHARACTER_NAME = 'Karpath'; // Use Karpath from player_data
const ACTOR_ID = 'foITsszSuDbwhkhE'; // Fallback for production API

// Cache configuration
const CACHE_KEY = DEV_MODE ? `character_${CHARACTER_NAME}` : `character_${ACTOR_ID}`;
const CACHE_VERSION = '1.2'; // Updated for local image support

// DOM Elements
const loading = document.getElementById('loading');
const errorState = document.getElementById('error-state');
const characterDisplay = document.getElementById('character-display');
const errorMessage = document.getElementById('error-message');
const loadingText = document.getElementById('loading-text');

// Tab functionality
function initializeTabs() {
    const tabButtons = document.querySelectorAll('.tab-button[data-tab]');
    const tabContents = document.querySelectorAll('.tab-content');

    tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            const tabId = button.getAttribute('data-tab');

            // Remove active class from all buttons and contents
            tabButtons.forEach(btn => btn.classList.remove('active'));
            tabContents.forEach(content => content.classList.remove('active'));

            // Add active class to clicked button and corresponding content
            button.classList.add('active');
            document.getElementById(tabId).classList.add('active');
        });
    });
}

// Display character data
function displayCharacter(character) {
    // Character Header
    document.getElementById('character-name').textContent = character.name || 'Unknown';
    document.getElementById('character-species').textContent = character.species || 'Human';
    document.getElementById('character-origin').textContent = character.origin || 'Unknown';
    document.getElementById('character-faction').textContent = character.faction || 'Unknown';
    document.getElementById('character-role').textContent = character.role || 'Unknown';

    // Character image
    const imageElement = document.getElementById('character-image');
    console.log('Character image data:', character.image);
    if (character.image) {
        console.log('Setting image src to:', character.image);
        imageElement.src = character.image;
        imageElement.alt = `${character.name} Portrait`;
        imageElement.style.display = 'block';

        // Add error handling for image loading
        imageElement.onerror = function() {
            console.error('Failed to load image:', character.image);
            this.style.display = 'none';
        };

        imageElement.onload = function() {
            console.log('Image loaded successfully:', character.image);
        };
    } else {
        console.log('No character image provided');
        imageElement.style.display = 'none';
    }

    // Characteristics
    const characteristics = character.characteristics || {};
    Object.keys(characteristics).forEach(key => {
        const statElement = document.getElementById(`stat-${key}`);
        if (statElement) {
            const char = characteristics[key];
            statElement.textContent = char.total || char.starting || 0;

            // Add tooltip showing breakdown
            statElement.title = `Starting: ${char.starting || 0}, Advances: ${char.advances || 0}, Modifier: ${char.modifier || 0}`;
        }
    });

    // Resources
    const fate = character.fate || {};
    document.getElementById('fate-current').textContent = fate.current || 0;
    document.getElementById('fate-max').textContent = fate.max || 0;

    const wounds = character.wounds || {};
    document.getElementById('wounds-current').textContent = wounds.current || 0;
    document.getElementById('wounds-max').textContent = wounds.max || 0;

    const corruption = character.corruption || {};
    document.getElementById('corruption-current').textContent = corruption.current || 0;
    document.getElementById('corruption-max').textContent = corruption.max || 0;

    document.getElementById('solars').textContent = character.solars || 0;

    // Skills
    displaySkills(character.skills || {});

    // Specializations
    displaySpecializations(character.specializations || []);

    // Equipment
    displayEquipment(character.equipment || {});

    // Talents
    displayTalents(character.talents || []);
}

function displaySkills(skills) {
    const skillsList = document.getElementById('skills-list');
    skillsList.innerHTML = '';

    Object.keys(skills).forEach(skillKey => {
        const skill = skills[skillKey];
        const skillElement = document.createElement('div');
        skillElement.className = 'skill-item';

        const skillName = skillKey.charAt(0).toUpperCase() + skillKey.slice(1);
        const characteristic = skill.characteristic ? skill.characteristic.toUpperCase() : '';

        skillElement.innerHTML = `
            <div class="skill-name">${skillName} (${characteristic})</div>
            <div class="skill-advances">Advances: ${skill.advances || 0}</div>
        `;

        skillsList.appendChild(skillElement);
    });

    if (Object.keys(skills).length === 0) {
        skillsList.innerHTML = '<div class="no-data">No trained skills</div>';
    }
}

function displaySpecializations(specializations) {
    const specList = document.getElementById('specializations-list');
    specList.innerHTML = '';

    specializations.forEach(spec => {
        const specElement = document.createElement('div');
        specElement.className = 'specialization-item';

        specElement.innerHTML = `
            <div class="spec-name">${spec.name}</div>
            <div class="spec-skill">Skill: ${spec.skill || 'Unknown'}</div>
            <div class="spec-advances">Advances: ${spec.advances || 1}</div>
        `;

        specList.appendChild(specElement);
    });

    if (specializations.length === 0) {
        specList.innerHTML = '<div class="no-data">No specializations</div>';
    }
}

function displayEquipment(equipment) {
    // Weapons
    const weaponsList = document.getElementById('weapons-list');
    weaponsList.innerHTML = '';

    (equipment.weapons || []).forEach(weapon => {
        const weaponElement = document.createElement('div');
        weaponElement.className = `equipment-item ${weapon.equipped ? 'equipped' : ''}`;

        weaponElement.innerHTML = `
            <div class="equipment-name">${weapon.name}</div>
            <div class="equipment-details">
                <span>Damage: ${weapon.damage}</span>
                <span>Range: ${weapon.range}</span>
                ${weapon.equipped ? '<span class="equipped-badge">EQUIPPED</span>' : ''}
            </div>
            ${weapon.traits && weapon.traits.length > 0 ?
                `<div class="weapon-traits">Traits: ${weapon.traits.join(', ')}</div>` : ''}
        `;

        weaponsList.appendChild(weaponElement);
    });

    if ((equipment.weapons || []).length === 0) {
        weaponsList.innerHTML = '<div class="no-data">No weapons</div>';
    }

    // Armor
    const armorList = document.getElementById('armor-list');
    armorList.innerHTML = '';

    (equipment.armor || []).forEach(armor => {
        const armorElement = document.createElement('div');
        armorElement.className = `equipment-item ${armor.equipped ? 'equipped' : ''}`;

        armorElement.innerHTML = `
            <div class="equipment-name">${armor.name}</div>
            <div class="equipment-details">
                <span>Armor: ${armor.armour || 0}</span>
                ${armor.equipped ? '<span class="equipped-badge">EQUIPPED</span>' : ''}
            </div>
            ${armor.locations && armor.locations.length > 0 ?
                `<div class="armor-locations">Locations: ${armor.locations.join(', ')}</div>` : ''}
        `;

        armorList.appendChild(armorElement);
    });

    if ((equipment.armor || []).length === 0) {
        armorList.innerHTML = '<div class="no-data">No armor</div>';
    }

    // Equipment
    const equipmentList = document.getElementById('equipment-list');
    equipmentList.innerHTML = '';

    (equipment.equipment || []).forEach(item => {
        const itemElement = document.createElement('div');
        itemElement.className = `equipment-item ${item.equipped ? 'equipped' : ''}`;

        let usesText = '';
        if (item.uses !== null && item.maxUses !== null) {
            usesText = `<span>Uses: ${item.uses}/${item.maxUses}</span>`;
        }

        itemElement.innerHTML = `
            <div class="equipment-name">${item.name}</div>
            <div class="equipment-details">
                ${usesText}
                ${item.equipped ? '<span class="equipped-badge">EQUIPPED</span>' : ''}
            </div>
        `;

        equipmentList.appendChild(itemElement);
    });

    if ((equipment.equipment || []).length === 0) {
        equipmentList.innerHTML = '<div class="no-data">No equipment</div>';
    }

    // Augmetics
    const augmeticsList = document.getElementById('augmetics-list');
    augmeticsList.innerHTML = '';

    (equipment.augmetics || []).forEach(augmetic => {
        const augmeticElement = document.createElement('div');
        augmeticElement.className = `equipment-item ${augmetic.equipped ? 'equipped' : ''}`;

        augmeticElement.innerHTML = `
            <div class="equipment-name">${augmetic.name}</div>
            <div class="equipment-details">
                <span>Cost: ${augmetic.cost || 0} Solars</span>
                <span>Availability: ${augmetic.availability || 'Common'}</span>
                ${augmetic.equipped ? '<span class="equipped-badge">EQUIPPED</span>' : ''}
            </div>
        `;

        augmeticsList.appendChild(augmeticElement);
    });

    if ((equipment.augmetics || []).length === 0) {
        augmeticsList.innerHTML = '<div class="no-data">No augmetics</div>';
    }
}

function displayTalents(talents) {
    const talentsList = document.getElementById('talents-list');
    talentsList.innerHTML = '';

    talents.forEach(talent => {
        const talentElement = document.createElement('div');
        talentElement.className = 'talent-item';

        talentElement.innerHTML = `
            <div class="talent-name">${talent.name}</div>
            <div class="talent-details">
                <span>Taken: ${talent.taken || 1}</span>
                <span>XP Cost: ${talent.xpCost || 0}</span>
            </div>
        `;

        talentsList.appendChild(talentElement);
    });

    if (talents.length === 0) {
        talentsList.innerHTML = '<div class="no-data">No talents</div>';
    }
}

// Show error state
function showError(message) {
    loading.style.display = 'none';
    characterDisplay.style.display = 'none';
    errorMessage.textContent = message;
    errorState.style.display = 'block';
}

// Show character data
function showCharacter() {
    loading.style.display = 'none';
    errorState.style.display = 'none';
    characterDisplay.style.display = 'block';
    updateCacheStatus();
}

// Update cache status display
function updateCacheStatus() {
    const cacheStatusElement = document.getElementById('cache-status');
    try {
        const cached = localStorage.getItem(CACHE_KEY);
        if (cached) {
            const data = JSON.parse(cached);
            if (data.timestamp) {
                const cacheAge = Date.now() - data.timestamp;
                const hoursAgo = Math.floor(cacheAge / (1000 * 60 * 60));
                const daysAgo = Math.floor(hoursAgo / 24);

                let statusText = '';
                if (daysAgo > 0) {
                    statusText = `Data from ${daysAgo} day${daysAgo > 1 ? 's' : ''} ago`;
                } else if (hoursAgo > 0) {
                    statusText = `Data from ${hoursAgo} hour${hoursAgo > 1 ? 's' : ''} ago`;
                } else {
                    statusText = 'Data from less than 1 hour ago';
                }

                cacheStatusElement.textContent = statusText;
                cacheStatusElement.style.display = 'block';
            } else {
                cacheStatusElement.style.display = 'none';
            }
        } else {
            cacheStatusElement.style.display = 'none';
        }
    } catch (error) {
        cacheStatusElement.style.display = 'none';
    }
}

// Cache management functions
function getCachedCharacter() {
    try {
        const cached = localStorage.getItem(CACHE_KEY);
        if (!cached) return null;

        const data = JSON.parse(cached);

        // Check version compatibility
        if (data.version !== CACHE_VERSION) {
            localStorage.removeItem(CACHE_KEY);
            return null;
        }

        // No expiry check - cache persists until manual update
        return data.character;
    } catch (error) {
        console.warn('Error reading cache:', error);
        localStorage.removeItem(CACHE_KEY);
        return null;
    }
}

function setCachedCharacter(character) {
    try {
        const cacheData = {
            version: CACHE_VERSION,
            timestamp: Date.now(),
            character: character
        };
        localStorage.setItem(CACHE_KEY, JSON.stringify(cacheData));
    } catch (error) {
        console.warn('Error saving to cache:', error);
    }
}

function clearCache() {
    try {
        localStorage.removeItem(CACHE_KEY);
    } catch (error) {
        console.warn('Error clearing cache:', error);
    }
}

// Fetch character data from API
async function fetchCharacterFromAPI() {
    const endpoint = DEV_MODE
        ? `/api/dev/characters/${CHARACTER_NAME}`
        : `/api/actors/${ACTOR_ID}/parsed`;

    const response = await fetch(endpoint);

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `HTTP ${response.status}`);
    }

    return await response.json();
}

// Load character data (with caching)
async function loadCharacter(forceRefresh = false) {
    // Show loading state
    loading.style.display = 'block';
    errorState.style.display = 'none';
    characterDisplay.style.display = 'none';

    try {
        let character = null;

        if (!forceRefresh) {
            // Try to load from cache first
            character = getCachedCharacter();
            if (character) {
                loadingText.textContent = '>>> LOADING FROM CACHE...';
                console.log('Loading character from cache');
                displayCharacter(character);
                showCharacter();
                return;
            }
        }

        // Cache miss or force refresh - fetch from API
        loadingText.textContent = forceRefresh ?
            '>>> UPDATING FROM FOUNDRY...' :
            '>>> ACCESSING IMPERIAL RECORDS...';

        console.log(forceRefresh ? 'Force refreshing character from API' : 'Loading character from API');
        character = await fetchCharacterFromAPI();

        // Cache the result
        setCachedCharacter(character);

        displayCharacter(character);
        showCharacter();

    } catch (error) {
        console.error('Error loading character:', error);
        showError(`Failed to load character data: ${error.message}`);
    }
}

// Refresh character data (force API call)
async function refreshCharacter() {
    await loadCharacter(true);
}

// Initialize page
document.addEventListener('DOMContentLoaded', () => {
    initializeTabs();
    loadCharacter();
});

// Global functions for HTML onclick handlers
window.loadCharacter = loadCharacter;
window.refreshCharacter = refreshCharacter;