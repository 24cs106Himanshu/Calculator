// Gaming Wiki JavaScript Functionality

class GameWiki {
    constructor() {
        this.currentSection = 'home';
        this.games = [];
        this.guides = [];
        this.init();
    }

    init() {
        this.setupNavigation();
        this.setupSearch();
        this.setupModal();
        this.loadSampleData();
        this.setupCommunityTabs();
        this.setupGuideCategories();
        this.setupFilters();
    }

    setupNavigation() {
        const navLinks = document.querySelectorAll('.nav-link');
        navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const section = link.dataset.section;
                this.showSection(section);
                this.updateActiveNav(link);
            });
        });
    }

    showSection(sectionName) {
        // Hide all sections
        document.querySelectorAll('.content-section').forEach(section => {
            section.classList.remove('active');
        });
        
        // Show selected section
        const targetSection = document.getElementById(`${sectionName}-section`);
        if (targetSection) {
            targetSection.classList.add('active');
            this.currentSection = sectionName;
            
            // Load section-specific content
            this.loadSectionContent(sectionName);
        }
    }

    updateActiveNav(activeLink) {
        document.querySelectorAll('.nav-link').forEach(link => {
            link.classList.remove('active');
        });
        activeLink.classList.add('active');
    }

    setupSearch() {
        const searchInput = document.getElementById('search-input');
        const searchBtn = document.getElementById('search-btn');
        
        const performSearch = () => {
            const query = searchInput.value.trim();
            if (query) {
                this.search(query);
            }
        };

        searchBtn.addEventListener('click', performSearch);
        searchInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                performSearch();
            }
        });
    }

    search(query) {
        console.log(`Searching for: ${query}`);
        // Implement search functionality
        const results = this.performSearch(query);
        this.displaySearchResults(results);
    }

    performSearch(query) {
        const allContent = [
            ...this.games.map(game => ({...game, type: 'game'})),
            ...this.guides.map(guide => ({...guide, type: 'guide'}))
        ];

        return allContent.filter(item => 
            item.title.toLowerCase().includes(query.toLowerCase()) ||
            item.description.toLowerCase().includes(query.toLowerCase()) ||
            (item.tags && item.tags.some(tag => tag.toLowerCase().includes(query.toLowerCase())))
        );
    }

    displaySearchResults(results) {
        // Show search results in games section for now
        this.showSection('games');
        this.renderGames(results.filter(r => r.type === 'game'));
    }

    setupModal() {
        const modal = document.getElementById('game-modal');
        const closeBtn = document.querySelector('.close');
        
        closeBtn.addEventListener('click', () => {
            modal.style.display = 'none';
        });
        
        window.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.style.display = 'none';
            }
        });
    }

    showGameModal(gameId) {
        const game = this.games.find(g => g.id === gameId);
        if (game) {
            const modal = document.getElementById('game-modal');
            const content = document.getElementById('game-detail-content');
            content.innerHTML = this.generateGameDetailHTML(game);
            modal.style.display = 'block';
        }
    }

    generateGameDetailHTML(game) {
        return `
            <div class="game-detail">
                <div class="game-header">
                    <div class="game-image">
                        <div class="game-placeholder">
                            <i class="${game.icon}"></i>
                        </div>
                    </div>
                    <div class="game-info">
                        <h1>${game.title}</h1>
                        <p class="game-description">${game.description}</p>
                        <div class="game-meta">
                            <span><strong>Platform:</strong> ${game.platform}</span>
                            <span><strong>Genre:</strong> ${game.genre}</span>
                            <span><strong>Release:</strong> ${game.releaseDate}</span>
                        </div>
                        <div class="game-tags">
                            ${game.tags.map(tag => `<span class="tag">${tag}</span>`).join('')}
                        </div>
                    </div>
                </div>
                
                <div class="game-sections">
                    <div class="section-tabs">
                        <button class="section-tab active" data-tab="gameplay">Gameplay</button>
                        <button class="section-tab" data-tab="characters">Characters</button>
                        <button class="section-tab" data-tab="maps">Maps</button>
                        <button class="section-tab" data-tab="guides">Guides</button>
                        <button class="section-tab" data-tab="achievements">Achievements</button>
                    </div>
                    
                    <div class="section-content">
                        <div class="tab-pane active" id="gameplay-tab">
                            <h3>Gameplay Overview</h3>
                            <p>${game.gameplay || 'Detailed gameplay information coming soon...'}</p>
                        </div>
                        <div class="tab-pane" id="characters-tab">
                            <h3>Characters</h3>
                            <div class="characters-grid">
                                ${this.generateCharactersHTML(game.characters || [])}
                            </div>
                        </div>
                        <div class="tab-pane" id="maps-tab">
                            <h3>Maps & Locations</h3>
                            <div class="maps-grid">
                                ${this.generateMapsHTML(game.maps || [])}
                            </div>
                        </div>
                        <div class="tab-pane" id="guides-tab">
                            <h3>Related Guides</h3>
                            <div class="related-guides">
                                ${this.generateRelatedGuidesHTML(game.id)}
                            </div>
                        </div>
                        <div class="tab-pane" id="achievements-tab">
                            <h3>Achievements</h3>
                            <div class="achievements-list">
                                ${this.generateAchievementsHTML(game.achievements || [])}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    generateCharactersHTML(characters) {
        if (characters.length === 0) {
            return '<p>Character information coming soon...</p>';
        }
        return characters.map(char => `
            <div class="character-card">
                <div class="character-icon">
                    <i class="fas fa-user"></i>
                </div>
                <h4>${char.name}</h4>
                <p>${char.description}</p>
            </div>
        `).join('');
    }

    generateMapsHTML(maps) {
        if (maps.length === 0) {
            return '<p>Interactive maps coming soon...</p>';
        }
        return maps.map(map => `
            <div class="map-card">
                <div class="map-preview">
                    <i class="fas fa-map"></i>
                </div>
                <h4>${map.name}</h4>
                <p>${map.description}</p>
                <button class="btn-primary">View Interactive Map</button>
            </div>
        `).join('');
    }

    generateRelatedGuidesHTML(gameId) {
        const relatedGuides = this.guides.filter(guide => guide.gameId === gameId);
        if (relatedGuides.length === 0) {
            return '<p>No guides available yet. Be the first to contribute!</p>';
        }
        return relatedGuides.map(guide => `
            <div class="guide-item">
                <div class="guide-header">
                    <h4>${guide.title}</h4>
                    <button class="ai-summary-btn" onclick="generateAISummary('${guide.id}')">
                        <i class="fas fa-robot"></i> AI Summary
                    </button>
                </div>
                <p>${guide.description}</p>
                <div class="ai-summary" id="summary-${guide.id}" style="display: none;">
                    <div class="summary-content">
                        <!-- AI summary will be loaded here -->
                    </div>
                </div>
                <div class="guide-meta">
                    <span><i class="fas fa-eye"></i> ${guide.views}</span>
                    <span><i class="fas fa-thumbs-up"></i> ${guide.likes}</span>
                </div>
            </div>
        `).join('');
    }

    generateAchievementsHTML(achievements) {
        if (achievements.length === 0) {
            return '<p>Achievement data coming soon...</p>';
        }
        return achievements.map(achievement => `
            <div class="achievement-item ${achievement.unlocked ? 'unlocked' : ''}">
                <div class="achievement-icon">
                    <i class="${achievement.icon}"></i>
                </div>
                <div class="achievement-info">
                    <h4>${achievement.name}</h4>
                    <p>${achievement.description}</p>
                    <div class="achievement-progress">
                        <div class="progress-bar">
                            <div class="progress-fill" style="width: ${achievement.progress}%"></div>
                        </div>
                        <span>${achievement.progress}%</span>
                    </div>
                </div>
            </div>
        `).join('');
    }

    setupCommunityTabs() {
        const tabButtons = document.querySelectorAll('.tab-btn');
        tabButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                const tabName = btn.dataset.tab;
                this.showCommunityTab(tabName);
                this.updateActiveTab(btn);
            });
        });
    }

    showCommunityTab(tabName) {
        document.querySelectorAll('.tab-content').forEach(content => {
            content.classList.remove('active');
        });
        
        const targetTab = document.getElementById(`${tabName}-tab`);
        if (targetTab) {
            targetTab.classList.add('active');
            this.loadCommunityContent(tabName);
        }
    }

    updateActiveTab(activeBtn) {
        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        activeBtn.classList.add('active');
    }

    setupGuideCategories() {
        const categoryButtons = document.querySelectorAll('.category-btn');
        categoryButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                const category = btn.dataset.category;
                this.filterGuides(category);
                this.updateActiveCategory(btn);
            });
        });
    }

    updateActiveCategory(activeBtn) {
        document.querySelectorAll('.category-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        activeBtn.classList.add('active');
    }

    filterGuides(category) {
        let filteredGuides = this.guides;
        if (category !== 'all') {
            filteredGuides = this.guides.filter(guide => guide.category === category);
        }
        this.renderGuides(filteredGuides);
    }

    setupFilters() {
        const platformFilter = document.getElementById('platform-filter');
        const genreFilter = document.getElementById('genre-filter');
        
        if (platformFilter) {
            platformFilter.addEventListener('change', () => {
                this.applyFilters();
            });
        }
        
        if (genreFilter) {
            genreFilter.addEventListener('change', () => {
                this.applyFilters();
            });
        }
    }

    applyFilters() {
        const platform = document.getElementById('platform-filter')?.value || '';
        const genre = document.getElementById('genre-filter')?.value || '';
        
        let filteredGames = this.games;
        
        if (platform) {
            filteredGames = filteredGames.filter(game => 
                game.platform.toLowerCase().includes(platform.toLowerCase())
            );
        }
        
        if (genre) {
            filteredGames = filteredGames.filter(game => 
                game.genre.toLowerCase().includes(genre.toLowerCase())
            );
        }
        
        this.renderGames(filteredGames);
    }

    loadSectionContent(sectionName) {
        switch(sectionName) {
            case 'games':
                this.renderGames(this.games);
                break;
            case 'guides':
                this.renderGuides(this.guides);
                break;
            case 'community':
                this.loadCommunityContent('forums');
                break;
        }
    }

    renderGames(games) {
        const gamesGrid = document.getElementById('games-grid');
        if (!gamesGrid) return;
        
        gamesGrid.innerHTML = games.map(game => `
            <div class="game-card" data-game-id="${game.id}">
                <div class="card-image">
                    <div class="game-placeholder">
                        <i class="${game.icon}"></i>
                    </div>
                </div>
                <div class="card-content">
                    <h3>${game.title}</h3>
                    <p>${game.description}</p>
                    <div class="card-tags">
                        ${game.tags.map(tag => `<span class="tag">${tag}</span>`).join('')}
                    </div>
                    <div class="card-meta">
                        <span><i class="fas fa-gamepad"></i> ${game.platform}</span>
                        <span><i class="fas fa-star"></i> ${game.rating}/10</span>
                    </div>
                </div>
            </div>
        `).join('');
        
        // Add click listeners to game cards
        gamesGrid.querySelectorAll('.game-card').forEach(card => {
            card.addEventListener('click', () => {
                const gameId = card.dataset.gameId;
                this.showGameModal(gameId);
            });
        });
    }

    renderGuides(guides) {
        const guidesGrid = document.getElementById('guides-grid');
        if (!guidesGrid) return;
        
        guidesGrid.innerHTML = guides.map(guide => `
            <div class="guide-card">
                <div class="card-image">
                    <div class="guide-placeholder">
                        <i class="${guide.icon}"></i>
                    </div>
                </div>
                <div class="card-content">
                    <h3>${guide.title}</h3>
                    <p>${guide.description}</p>
                    <div class="card-meta">
                        <span><i class="fas fa-eye"></i> ${guide.views}</span>
                        <span><i class="fas fa-thumbs-up"></i> ${guide.likes}</span>
                        <span><i class="fas fa-clock"></i> ${guide.readTime}</span>
                    </div>
                </div>
            </div>
        `).join('');
    }

    loadCommunityContent(tabName) {
        const tabContent = document.getElementById(`${tabName}-tab`);
        if (!tabContent) return;
        
        switch(tabName) {
            case 'forums':
                tabContent.innerHTML = this.generateForumsHTML();
                break;
            case 'polls':
                tabContent.innerHTML = this.generatePollsHTML();
                break;
            case 'fanart':
                tabContent.innerHTML = this.generateFanArtHTML();
                break;
            case 'leaderboard':
                tabContent.innerHTML = this.generateLeaderboardHTML();
                break;
        }
    }

    generateForumsHTML() {
        return `
            <div class="forums-list">
                <div class="forum-category">
                    <h3><i class="fas fa-gamepad"></i> General Gaming</h3>
                    <div class="forum-topics">
                        <div class="topic-item">
                            <div class="topic-info">
                                <h4>Best games of 2024 discussion</h4>
                                <p>What are your top picks for this year?</p>
                                <div class="topic-meta">
                                    <span>by GameMaster92</span>
                                    <span>47 replies</span>
                                    <span>2 hours ago</span>
                                </div>
                            </div>
                        </div>
                        <div class="topic-item">
                            <div class="topic-info">
                                <h4>Looking for co-op game recommendations</h4>
                                <p>Need suggestions for games to play with friends</p>
                                <div class="topic-meta">
                                    <span>by CoopGamer</span>
                                    <span>23 replies</span>
                                    <span>5 hours ago</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                
                <div class="forum-category">
                    <h3><i class="fas fa-trophy"></i> Game-Specific</h3>
                    <div class="forum-topics">
                        <div class="topic-item">
                            <div class="topic-info">
                                <h4>Cyberpunk 2077 - Best builds for 2.0</h4>
                                <p>Share your favorite character builds</p>
                                <div class="topic-meta">
                                    <span>by CyberNinja</span>
                                    <span>89 replies</span>
                                    <span>1 day ago</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    generatePollsHTML() {
        return `
            <div class="polls-container">
                <div class="poll-item">
                    <h3>Game of the Year 2024</h3>
                    <div class="poll-options">
                        <div class="poll-option">
                            <span class="option-text">Baldur's Gate 3</span>
                            <div class="option-bar">
                                <div class="option-fill" style="width: 45%"></div>
                            </div>
                            <span class="option-percentage">45%</span>
                        </div>
                        <div class="poll-option">
                            <span class="option-text">Spider-Man 2</span>
                            <div class="option-bar">
                                <div class="option-fill" style="width: 30%"></div>
                            </div>
                            <span class="option-percentage">30%</span>
                        </div>
                        <div class="poll-option">
                            <span class="option-text">Alan Wake 2</span>
                            <div class="option-bar">
                                <div class="option-fill" style="width: 25%"></div>
                            </div>
                            <span class="option-percentage">25%</span>
                        </div>
                    </div>
                    <div class="poll-meta">
                        <span>2,847 votes</span>
                        <button class="btn-primary">Vote</button>
                    </div>
                </div>
                
                <div class="poll-item">
                    <h3>Best Gaming Platform</h3>
                    <div class="poll-options">
                        <div class="poll-option">
                            <span class="option-text">PC</span>
                            <div class="option-bar">
                                <div class="option-fill" style="width: 55%"></div>
                            </div>
                            <span class="option-percentage">55%</span>
                        </div>
                        <div class="poll-option">
                            <span class="option-text">PlayStation 5</span>
                            <div class="option-bar">
                                <div class="option-fill" style="width: 25%"></div>
                            </div>
                            <span class="option-percentage">25%</span>
                        </div>
                        <div class="poll-option">
                            <span class="option-text">Xbox Series X</span>
                            <div class="option-bar">
                                <div class="option-fill" style="width: 20%"></div>
                            </div>
                            <span class="option-percentage">20%</span>
                        </div>
                    </div>
                    <div class="poll-meta">
                        <span>1,523 votes</span>
                        <button class="btn-primary">Vote</button>
                    </div>
                </div>
            </div>
        `;
    }

    generateFanArtHTML() {
        return `
            <div class="fanart-gallery">
                <div class="gallery-filters">
                    <button class="filter-btn active">All</button>
                    <button class="filter-btn">Fan Art</button>
                    <button class="filter-btn">Mods</button>
                    <button class="filter-btn">Screenshots</button>
                </div>
                
                <div class="gallery-grid">
                    <div class="gallery-item">
                        <div class="gallery-image">
                            <div class="image-placeholder">
                                <i class="fas fa-image"></i>
                            </div>
                        </div>
                        <div class="gallery-info">
                            <h4>Cyberpunk Night City Art</h4>
                            <p>by DigitalArtist</p>
                            <div class="gallery-stats">
                                <span><i class="fas fa-heart"></i> 234</span>
                                <span><i class="fas fa-eye"></i> 1.2K</span>
                            </div>
                        </div>
                    </div>
                    
                    <div class="gallery-item">
                        <div class="gallery-image">
                            <div class="image-placeholder">
                                <i class="fas fa-cog"></i>
                            </div>
                        </div>
                        <div class="gallery-info">
                            <h4>Enhanced Graphics Mod</h4>
                            <p>by ModMaster</p>
                            <div class="gallery-stats">
                                <span><i class="fas fa-download"></i> 5.7K</span>
                                <span><i class="fas fa-star"></i> 4.8</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    generateLeaderboardHTML() {
        return `
            <div class="leaderboard">
                <div class="leaderboard-header">
                    <h3><i class="fas fa-crown"></i> Top Contributors</h3>
                    <select class="leaderboard-filter">
                        <option>This Month</option>
                        <option>All Time</option>
                        <option>This Week</option>
                    </select>
                </div>
                
                <div class="leaderboard-list">
                    <div class="leaderboard-item rank-1">
                        <div class="rank-badge">1</div>
                        <div class="contributor-info">
                            <h4>GameMaster92</h4>
                            <p>Lore Master • Guide Creator</p>
                        </div>
                        <div class="contributor-stats">
                            <span>1,247 contributions</span>
                            <span>15.2K reputation</span>
                        </div>
                    </div>
                    
                    <div class="leaderboard-item rank-2">
                        <div class="rank-badge">2</div>
                        <div class="contributor-info">
                            <h4>MapExplorer</h4>
                            <p>Map Maker • Achievement Hunter</p>
                        </div>
                        <div class="contributor-stats">
                            <span>892 contributions</span>
                            <span>12.8K reputation</span>
                        </div>
                    </div>
                    
                    <div class="leaderboard-item rank-3">
                        <div class="rank-badge">3</div>
                        <div class="contributor-info">
                            <h4>StrategyPro</h4>
                            <p>Guide Master • Build Expert</p>
                        </div>
                        <div class="contributor-stats">
                            <span>756 contributions</span>
                            <span>9.4K reputation</span>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    loadSampleData() {
        // Sample Games Data
        this.games = [
            {
                id: 'cyberpunk2077',
                title: 'Cyberpunk 2077',
                description: 'Open-world action-adventure story set in Night City',
                platform: 'PC, PlayStation, Xbox',
                genre: 'RPG',
                releaseDate: '2020',
                rating: 8.5,
                icon: 'fas fa-robot',
                tags: ['RPG', 'Open World', 'Sci-Fi'],
                gameplay: 'Cyberpunk 2077 is an action role-playing video game played in a first-person perspective as V, a mercenary whose voice, face, hairstyles, body type and modifications, background, and clothing are customisable.',
                characters: [
                    { name: 'V', description: 'Main protagonist, customizable mercenary' },
                    { name: 'Johnny Silverhand', description: 'Digital ghost of a rockerboy terrorist' }
                ],
                maps: [
                    { name: 'Night City', description: 'The sprawling metropolis where the game takes place' }
                ],
                achievements: [
                    { name: 'The Star', description: 'Complete The Star ending', progress: 100, unlocked: true, icon: 'fas fa-star' },
                    { name: 'Breathtaking', description: 'Take your first steps in Night City', progress: 100, unlocked: true, icon: 'fas fa-walking' }
                ]
            },
            {
                id: 'eldenring',
                title: 'Elden Ring',
                description: 'Action RPG fantasy game in the Lands Between',
                platform: 'PC, PlayStation, Xbox',
                genre: 'Action RPG',
                releaseDate: '2022',
                rating: 9.5,
                icon: 'fas fa-ring',
                tags: ['Souls-like', 'Fantasy', 'Open World'],
                gameplay: 'Elden Ring features a vast open world with seamless exploration and challenging combat.',
                characters: [
                    { name: 'Tarnished', description: 'The player character seeking to become Elden Lord' },
                    { name: 'Melina', description: 'Mysterious maiden who aids the Tarnished' }
                ]
            },
            {
                id: 'baldursgate3',
                title: "Baldur's Gate 3",
                description: 'Turn-based RPG based on Dungeons & Dragons',
                platform: 'PC, PlayStation',
                genre: 'RPG',
                releaseDate: '2023',
                rating: 9.8,
                icon: 'fas fa-dice-d20',
                tags: ['RPG', 'Turn-based', 'Fantasy', 'D&D']
            },
            {
                id: 'hogwartslegacy',
                title: 'Hogwarts Legacy',
                description: 'Action RPG set in the Harry Potter universe',
                platform: 'PC, PlayStation, Xbox, Nintendo Switch',
                genre: 'Action RPG',
                releaseDate: '2023',
                rating: 8.2,
                icon: 'fas fa-magic',
                tags: ['RPG', 'Magic', 'Open World', 'Harry Potter']
            }
        ];

        // Sample Guides Data
        this.guides = [
            {
                id: 'cyberpunk-builds',
                gameId: 'cyberpunk2077',
                title: 'Best Character Builds for Cyberpunk 2077',
                description: 'Complete guide to the most effective builds',
                category: 'builds',
                views: '24.5K',
                likes: '2.1K',
                readTime: '15 min',
                icon: 'fas fa-cogs'
            },
            {
                id: 'elden-ring-bosses',
                gameId: 'eldenring',
                title: 'Elden Ring Boss Guide',
                description: 'Strategies for defeating every boss',
                category: 'walkthrough',
                views: '45.2K',
                likes: '4.8K',
                readTime: '30 min',
                icon: 'fas fa-sword'
            },
            {
                id: 'bg3-romance',
                gameId: 'baldursgate3',
                title: "Baldur's Gate 3 Romance Guide",
                description: 'Complete romance options and requirements',
                category: 'walkthrough',
                views: '67.3K',
                likes: '5.2K',
                readTime: '20 min',
                icon: 'fas fa-heart'
            },
            {
                id: 'hogwarts-achievements',
                gameId: 'hogwartslegacy',
                title: 'Hogwarts Legacy Achievement Guide',
                description: 'How to unlock all achievements and trophies',
                category: 'achievements',
                views: '18.7K',
                likes: '1.5K',
                readTime: '25 min',
                icon: 'fas fa-trophy'
            }
        ];
    }
}

// Initialize the application
document.addEventListener('DOMContentLoaded', () => {
    window.gameWiki = new GameWiki();
    
    // Setup game modal tabs
    document.addEventListener('click', (e) => {
        if (e.target.classList.contains('section-tab')) {
            const tabName = e.target.dataset.tab;
            
            // Update active tab
            document.querySelectorAll('.section-tab').forEach(tab => {
                tab.classList.remove('active');
            });
            e.target.classList.add('active');
            
            // Show corresponding content
            document.querySelectorAll('.tab-pane').forEach(pane => {
                pane.classList.remove('active');
            });
            document.getElementById(`${tabName}-tab`).classList.add('active');
        }
    });
    
    // Add some interactive animations
    document.addEventListener('mouseover', (e) => {
        if (e.target.classList.contains('featured-card') || 
            e.target.classList.contains('game-card') || 
            e.target.classList.contains('guide-card')) {
            e.target.style.transform = 'translateY(-5px)';
        }
    });
    
    document.addEventListener('mouseout', (e) => {
        if (e.target.classList.contains('featured-card') || 
            e.target.classList.contains('game-card') || 
            e.target.classList.contains('guide-card')) {
            e.target.style.transform = 'translateY(0)';
        }
    });
});

// Utility functions
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.classList.add('show');
    }, 100);
    
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 3000);
}

function formatNumber(num) {
    if (num >= 1000000) {
        return (num / 1000000).toFixed(1) + 'M';
    } else if (num >= 1000) {
        return (num / 1000).toFixed(1) + 'K';
    }
    return num.toString();
}

// AI Summary functionality
function generateAISummary(guideId) {
    const summaryDiv = document.getElementById(`summary-${guideId}`);
    const btn = event.target.closest('.ai-summary-btn');
    
    if (summaryDiv.style.display === 'none') {
        // Show loading state
        btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Generating...';
        btn.disabled = true;
        
        // Simulate AI processing
        setTimeout(() => {
            const guide = window.gameWiki?.guides.find(g => g.id === guideId);
            if (guide) {
                const summary = generateGuideSummary(guide);
                summaryDiv.querySelector('.summary-content').innerHTML = summary;
                summaryDiv.style.display = 'block';
                btn.innerHTML = '<i class="fas fa-robot"></i> Hide Summary';
                btn.disabled = false;
            }
        }, 2000);
    } else {
        summaryDiv.style.display = 'none';
        btn.innerHTML = '<i class="fas fa-robot"></i> AI Summary';
    }
}

function generateGuideSummary(guide) {
    const summaries = {
        'cyberpunk-builds': `
            <div class="ai-summary-content">
                <h5><i class="fas fa-brain"></i> AI-Generated Summary</h5>
                <div class="summary-points">
                    <div class="summary-point">
                        <i class="fas fa-star"></i>
                        <span><strong>Best Build:</strong> Netrunner focusing on Intelligence and Technical Ability for maximum hacking potential.</span>
                    </div>
                    <div class="summary-point">
                        <i class="fas fa-sword"></i>
                        <span><strong>Combat Style:</strong> Stealth-based approach using quickhacks and mantis blades for silent takedowns.</span>
                    </div>
                    <div class="summary-point">
                        <i class="fas fa-cog"></i>
                        <span><strong>Key Equipment:</strong> Legendary cyberdeck, optical camo, and upgraded mantis blades.</span>
                    </div>
                    <div class="summary-point">
                        <i class="fas fa-clock"></i>
                        <span><strong>Time Investment:</strong> 15-20 hours to fully develop this build to endgame level.</span>
                    </div>
                </div>
                <div class="summary-footer">
                    <small><i class="fas fa-info-circle"></i> This summary was generated by AI and may not reflect all guide details.</small>
                </div>
            </div>
        `,
        'elden-ring-bosses': `
            <div class="ai-summary-content">
                <h5><i class="fas fa-brain"></i> AI-Generated Summary</h5>
                <div class="summary-points">
                    <div class="summary-point">
                        <i class="fas fa-shield-alt"></i>
                        <span><strong>Defense Strategy:</strong> Learn boss attack patterns and use i-frames effectively during dodging.</span>
                    </div>
                    <div class="summary-point">
                        <i class="fas fa-magic"></i>
                        <span><strong>Magic Builds:</strong> Sorcery and incantations are highly effective against most bosses when properly upgraded.</span>
                    </div>
                    <div class="summary-point">
                        <i class="fas fa-users"></i>
                        <span><strong>Co-op Tips:</strong> Summoning spirits or players can significantly reduce boss difficulty.</span>
                    </div>
                    <div class="summary-point">
                        <i class="fas fa-level-up-alt"></i>
                        <span><strong>Preparation:</strong> Level vigor to 40+ and upgrade weapons to +15 or higher before major bosses.</span>
                    </div>
                </div>
                <div class="summary-footer">
                    <small><i class="fas fa-info-circle"></i> This summary was generated by AI and may not reflect all guide details.</small>
                </div>
            </div>
        `,
        'bg3-romance': `
            <div class="ai-summary-content">
                <h5><i class="fas fa-brain"></i> AI-Generated Summary</h5>
                <div class="summary-points">
                    <div class="summary-point">
                        <i class="fas fa-heart"></i>
                        <span><strong>Romance Options:</strong> 10 main companions available for romance with unique storylines and requirements.</span>
                    </div>
                    <div class="summary-point">
                        <i class="fas fa-comments"></i>
                        <span><strong>Dialogue Choices:</strong> Approval ratings matter - choose responses that align with companion values.</span>
                    </div>
                    <div class="summary-point">
                        <i class="fas fa-gift"></i>
                        <span><strong>Gifts & Actions:</strong> Specific actions and gifts can boost approval and unlock romance scenes.</span>
                    </div>
                    <div class="summary-point">
                        <i class="fas fa-exclamation-triangle"></i>
                        <span><strong>Missable Content:</strong> Some romance scenes can be missed if certain story conditions aren't met.</span>
                    </div>
                </div>
                <div class="summary-footer">
                    <small><i class="fas fa-info-circle"></i> This summary was generated by AI and may not reflect all guide details.</small>
                </div>
            </div>
        `,
        'hogwarts-achievements': `
            <div class="ai-summary-content">
                <h5><i class="fas fa-brain"></i> AI-Generated Summary</h5>
                <div class="summary-points">
                    <div class="summary-point">
                        <i class="fas fa-trophy"></i>
                        <span><strong>Total Achievements:</strong> 46 achievements including story, exploration, and challenge-based objectives.</span>
                    </div>
                    <div class="summary-point">
                        <i class="fas fa-search"></i>
                        <span><strong>Collectibles:</strong> Find all Demiguise Statues, Field Guide Pages, and Ancient Magic Hotspots.</span>
                    </div>
                    <div class="summary-point">
                        <i class="fas fa-magic"></i>
                        <span><strong>Spell Mastery:</strong> Learn and use all available spells, including unforgivable curses.</span>
                    </div>
                    <div class="summary-point">
                        <i class="fas fa-clock"></i>
                        <span><strong>Completion Time:</strong> 40-60 hours required for 100% achievement completion.</span>
                    </div>
                </div>
                <div class="summary-footer">
                    <small><i class="fas fa-info-circle"></i> This summary was generated by AI and may not reflect all guide details.</small>
                </div>
            </div>
        `
    };
    
    return summaries[guideId] || `
        <div class="ai-summary-content">
            <h5><i class="fas fa-brain"></i> AI-Generated Summary</h5>
            <div class="summary-points">
                <div class="summary-point">
                    <i class="fas fa-info"></i>
                    <span><strong>Key Points:</strong> This guide covers essential strategies and tips for optimal gameplay.</span>
                </div>
                <div class="summary-point">
                    <i class="fas fa-target"></i>
                    <span><strong>Target Audience:</strong> Suitable for both beginners and experienced players.</span>
                </div>
                <div class="summary-point">
                    <i class="fas fa-clock"></i>
                    <span><strong>Estimated Time:</strong> Following this guide should take approximately 2-3 hours.</span>
                </div>
            </div>
            <div class="summary-footer">
                <small><i class="fas fa-info-circle"></i> This summary was generated by AI and may not reflect all guide details.</small>
            </div>
        </div>
    `;
}