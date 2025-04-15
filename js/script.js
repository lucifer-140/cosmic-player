document.addEventListener('DOMContentLoaded', function () {
    const audioElement = new Audio();
    const progressBar = document.querySelector('.progress-bar');
    const songTitleElement = document.querySelector('.song-title');
    const songArtistElement = document.querySelector('.song-artist');
    const songCoverElement = document.querySelector('.song-cover');
    const playButton = document.querySelector('.play-btn');
    const playIcon = playButton.querySelector('img');
    
    // Initialize progress bar at 0
    progressBar.value = 0;
    
    // Current song information
    let currentSong = null;
    
    // Play/Pause Button
    playButton.addEventListener('click', function() {
        togglePlayPause();
    });
    
    // Function to toggle play/pause
    function togglePlayPause() {
        if (audioElement.paused) {
            if (!currentSong) {
                // If no song is selected, play the first one
                const firstSongCard = document.querySelector('.media-card');
                if (firstSongCard) {
                    playSongFromCard(firstSongCard);
                }
                return;
            }
            audioElement.play();
            playIcon.src = 'asset/pause.png';
            playIcon.alt = 'Pause';
        } else {
            audioElement.pause();
            playIcon.src = 'asset/start.png';
            playIcon.alt = 'Start';
        }
    }
    
    // Function to play song from card
    function playSongFromCard(card) {
        const songFile = card.getAttribute('data-file');
        const songName = card.getAttribute('data-song');
        const artistName = card.getAttribute('data-artist');
        const coverImage = card.getAttribute('data-cover') || card.querySelector('.media-img img').src;
        
        currentSong = {
            file: songFile,
            name: songName,
            artist: artistName,
            cover: coverImage
        };
        
        // Show progress bar
        document.querySelector('.progress-bar-container').style.display = 'block';
        
        // Update player UI
        const songCoverElement = document.querySelector('.song-cover');
        songCoverElement.innerHTML = `<img src="${coverImage}" alt="${songName}" class="img-fluid">`;
        songCoverElement.classList.remove('no-song');
        
        document.querySelector('.song-title').textContent = songName;
        document.querySelector('.song-artist').textContent = artistName;
        
        // Enable buttons
        document.querySelectorAll('.player-controls button').forEach(btn => {
            btn.disabled = false;
        });
        
        audioElement.src = songFile;
        audioElement.play();
        updatePlayButton(true);
    }
    
    function updatePlayButton(isPlaying) {
        const playIcon = document.querySelector('.play-btn img');
        playIcon.src = isPlaying ? 'asset/pause.png' : 'asset/start.png';
        playIcon.alt = isPlaying ? 'Pause' : 'Play';
    }

    // When no song is playing
    function resetPlayerToDefault() {
        document.querySelector('.progress-bar-container').style.display = 'none';
        document.querySelector('.progress-bar').value = 0;
        
        const songCoverElement = document.querySelector('.song-cover');
        songCoverElement.innerHTML = '<img src="asset/no-cover.png" alt="No song selected" class="img-fluid">';
        songCoverElement.classList.add('no-song');
        
        document.querySelector('.song-title').textContent = 'No song selected';
        document.querySelector('.song-artist').textContent = 'Select a song to play';
        
        // Disable buttons
        document.querySelectorAll('.player-controls button').forEach(btn => {
            if (!btn.classList.contains('volume-btn')) {
                btn.disabled = true;
            }
        });
        
        updatePlayButton(false);
        currentSong = null;
    }

    // Initialize with default state
    resetPlayerToDefault();

    // Handle song end
    audioElement.addEventListener('ended', function() {
        updatePlayButton(false);
    });

    // Add click event to all song cards
    document.querySelectorAll('.media-card').forEach(card => {
        card.addEventListener('click', function(e) {
            // Check if click was on the play overlay or its children
            const playOverlay = this.querySelector('.play-overlay');
            if (playOverlay && playOverlay.contains(e.target)) {
                playSongFromCard(this);
            }
        });
    });
    
    // Update progress bar as music plays
    audioElement.addEventListener('timeupdate', function() {
        const currentTime = audioElement.currentTime;
        const duration = audioElement.duration;
        
        if (duration) {
            const progress = (currentTime / duration) * 100;
            progressBar.value = progress;
        }
    });
    
    // Allow seeking by clicking on progress bar
    progressBar.addEventListener('input', function() {
        const seekTime = (audioElement.duration * this.value) / 100;
        audioElement.currentTime = seekTime;
    });
    
    // Make progress bar clickable
    progressBar.addEventListener('click', function(e) {
        const percent = e.offsetX / this.offsetWidth;
        progressBar.value = percent * 100;
        audioElement.currentTime = audioElement.duration * percent;
    });
    
    // Volume Control (keep your existing volume control code)
    const volumeBtn = document.querySelector('.volume-btn');
    const volumeIcon = volumeBtn.querySelector('img');
    const volumeSlider = document.querySelector('.volume-slider');
    let lastVolume = 0.7;
    
    audioElement.volume = volumeSlider.value;
    updateVolumeIcon();
    
    volumeSlider.addEventListener('input', function() {
        if (!audioElement.muted) {
            audioElement.volume = this.value;
            lastVolume = this.value;
        }
        updateVolumeIcon();
    });
    
    volumeBtn.addEventListener('click', function() {
        if (audioElement.muted) {
            audioElement.muted = false;
            audioElement.volume = lastVolume;
            volumeSlider.value = lastVolume;
        } else {
            lastVolume = audioElement.volume;
            audioElement.muted = true;
            volumeSlider.value = 0;
        }
        updateVolumeIcon();
    });
    
    function updateVolumeIcon() {
        volumeIcon.src = audioElement.muted || audioElement.volume === 0 
            ? 'asset/volume-off.png' 
            : 'asset/volume.png';
        volumeIcon.alt = audioElement.muted ? 'Muted' : 'Volume';
    }
    
    audioElement.addEventListener('volumechange', function() {
        if (!audioElement.muted) {
            volumeSlider.value = audioElement.volume;
        }
        updateVolumeIcon();
    });
    
    // Handle song end
    audioElement.addEventListener('ended', function() {
        playIcon.src = 'asset/start.png';
        playIcon.alt = 'Start';
        // You could add auto-play next song functionality here
    });
    
    // Prev/Next buttons (basic implementation)
    document.querySelector('.prev-btn').addEventListener('click', function() {
        const currentCard = document.querySelector('.media-card.playing');
        if (currentCard) {
            const prevCard = currentCard.previousElementSibling;
            if (prevCard && prevCard.classList.contains('media-card')) {
                playSongFromCard(prevCard);
            }
        }
    });
    
    document.querySelector('.next-btn').addEventListener('click', function() {
        const currentCard = document.querySelector('.media-card.playing');
        if (currentCard) {
            const nextCard = currentCard.nextElementSibling;
            if (nextCard && nextCard.classList.contains('media-card')) {
                playSongFromCard(nextCard);
            }
        }
    });
});