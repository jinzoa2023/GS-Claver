document.addEventListener('DOMContentLoaded', function () {
    const songForm = document.getElementById('song-form');
    
    // Load songs from backend
    loadSongs();

    // Add new song
    songForm.addEventListener('submit', async function (e) {
        e.preventDefault();
        const songTitle = document.getElementById('song-title').value.trim();
        const category = document.getElementById('song-category').value;

        if (songTitle && category) {
            try {
                const response = await fetch('/add-song', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ 
                        title: songTitle,
                        category: category 
                    }),
                });
                const data = await response.json();
                
                if (data.status === 'success') {
                    addSongToList(songTitle, category);
                    songForm.reset();
                } else {
                    alert('Error adding song: ' + data.message);
                }
            } catch (error) {
                alert('Error adding song: ' + error);
            }
        }
    });

    // Add song to the specific category list
    function addSongToList(songTitle, category) {
        const listId = `${category}-list`;
        const songList = document.getElementById(listId);
        
        if (songList) {
            const li = document.createElement('li');
            li.innerHTML = `
                <a href="https://www.ultimate-guitar.com/search.php?search_type=title&value=${encodeURIComponent(songTitle)}" 
                   target="_blank" rel="noopener noreferrer">
                    ${songTitle}
                </a>
                <button class="delete-btn" data-category="${category}">
                    <i class="fas fa-trash"></i>
                </button>
            `;
            songList.appendChild(li);
        }
    }

    // Handle song deletion
    document.querySelectorAll('.song-list').forEach(list => {
        list.addEventListener('click', async function(e) {
            if (e.target.closest('.delete-btn')) {
                const li = e.target.closest('li');
                const songTitle = li.querySelector('a').textContent.trim();
                const category = e.target.closest('.delete-btn').dataset.category;
                
                if (confirm('Are you sure you want to delete this song?')) {
                    // Here you would add an API call to delete from backend
                    li.remove();
                }
            }
        });
    });

    // Load songs from backend
    async function loadSongs() {
        try {
            const response = await fetch('/get-songs');
            const data = await response.json();
            
            if (data.status === 'success') {
                data.songs.forEach(song => {
                    addSongToList(song.title, song.category);
                });
            } else {
                alert('Error loading songs: ' + data.message);
            }
        } catch (error) {
            alert('Error loading songs: ' + error);
        }
    }
});

document.addEventListener('DOMContentLoaded', function() {
    const verseForm = document.getElementById('verse-form');
    const versesList = document.getElementById('verses-list');
    const filterButtons = document.querySelectorAll('.filter-btn');

    if (verseForm) {
        verseForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const reference = document.getElementById('verse-reference').value;
            const category = document.getElementById('verse-category').value;
            const text = document.getElementById('verse-text').value;
            const notes = document.getElementById('verse-notes').value;

            addVerseCard({
                reference,
                category,
                text,
                notes
            });

            verseForm.reset();
        });
    }

    function addVerseCard(verse) {
        const verseCard = document.createElement('div');
        verseCard.className = 'verse-card';
        verseCard.dataset.category = verse.category;
        
        verseCard.innerHTML = `
            <div class="reference">${verse.reference}</div>
            <span class="category">${verse.category}</span>
            <div class="text">"${verse.text}"</div>
            ${verse.notes ? `<div class="notes">${verse.notes}</div>` : ''}
            <button class="delete-btn" onclick="this.parentElement.remove()">
                <i class="fas fa-trash"></i>
            </button>
        `;

        versesList.prepend(verseCard);
    }

    // Filter functionality
    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            const category = this.dataset.category;
            
            // Update active button
            filterButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');

            // Filter verses
            const verses = document.querySelectorAll('.verse-card');
            verses.forEach(verse => {
                if (category === 'all' || verse.dataset.category === category) {
                    verse.style.display = '';
                } else {
                    verse.style.display = 'none';
                }
            });
        });
    });

    // Devotional Form Handling
    const devotionalForm = document.getElementById('devotional-form');
    const devotionalsList = document.getElementById('devotionals-list');

    if (devotionalForm) {
        devotionalForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const date = document.getElementById('devotional-date').value;
            const title = document.getElementById('devotional-title').value;
            const verse = document.getElementById('devotional-verse').value;
            const content = document.getElementById('devotional-content').value;
            const application = document.getElementById('devotional-application').value;

            addDevotionalCard({
                date,
                title,
                verse,
                content,
                application
            });

            devotionalForm.reset();
        });
    }

    function addDevotionalCard(devotional) {
        const card = document.createElement('div');
        card.className = 'devotional-card';
        
        card.innerHTML = `
            <div class="date"><i class="fas fa-calendar"></i> ${formatDate(devotional.date)}</div>
            <div class="title">${devotional.title}</div>
            <div class="verse"><i class="fas fa-book-bible"></i> ${devotional.verse}</div>
            <div class="content">${devotional.content}</div>
            <div class="application">
                <strong><i class="fas fa-lightbulb"></i> Application:</strong><br>
                ${devotional.application}
            </div>
            <button class="delete-btn" onclick="this.parentElement.remove()">
                <i class="fas fa-trash"></i>
            </button>
        `;

        devotionalsList.prepend(card);
    }

    // Cell Group Form Handling
    const cellGroupForm = document.getElementById('cell-group-form');
    const cellGroupList = document.getElementById('cell-group-list');

    if (cellGroupForm) {
        cellGroupForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const date = document.getElementById('meeting-date').value;
            const time = document.getElementById('meeting-time').value;
            const location = document.getElementById('meeting-location').value;
            const topic = document.getElementById('meeting-topic').value;
            const notes = document.getElementById('meeting-notes').value;
            const prayerRequests = document.getElementById('prayer-requests').value;

            addMeetingCard({
                date,
                time,
                location,
                topic,
                notes,
                prayerRequests
            });

            cellGroupForm.reset();
        });
    }

    function addMeetingCard(meeting) {
        const card = document.createElement('div');
        card.className = 'meeting-card';
        
        card.innerHTML = `
            <div class="date-time">
                <i class="fas fa-calendar"></i> ${formatDate(meeting.date)} 
                <i class="fas fa-clock"></i> ${formatTime(meeting.time)}
            </div>
            <div class="topic">${meeting.topic}</div>
            <div class="location">
                <i class="fas fa-map-marker-alt"></i> ${meeting.location}
            </div>
            <div class="notes">${meeting.notes}</div>
            ${meeting.prayerRequests ? `
                <div class="prayer-requests">
                    <strong><i class="fas fa-pray"></i> Prayer Requests:</strong><br>
                    ${meeting.prayerRequests}
                </div>
            ` : ''}
            <button class="delete-btn" onclick="this.parentElement.remove()">
                <i class="fas fa-trash"></i>
            </button>
        `;

        cellGroupList.prepend(card);
    }

    // Helper functions
    function formatDate(dateString) {
        return new Date(dateString).toLocaleDateString();
    }

    function formatTime(timeString) {
        return timeString;
    }
}); 