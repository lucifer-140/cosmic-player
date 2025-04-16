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

    // === Static Lyrics Database ===
    const lyricsDatabase = {
        "Stay Here - Joker Xue": `黑暗里 月亮落了地
        应该悲伤叹息 身体却没了力气
        因为彼此怀疑 我们漂浮在这里
        我们曾有引力 怎么没人记起
        
        Stay Here
        I want you stay with me
        用尽最后的空气
        Stay Here
        I want you stay with me
        反正也没人回应
        Stay Here Stay Stay
        Stay Stay Stay Stay Stay Stay
        Stay Here
        I want you stay with me
        在听不见的夜里
        Stay Here
        I want you stay with me
        像没人看的电影
        
        看 天空在闪
        来的太晚
        Stay Here stay with me
        就这样漫无目的
        Stay Here stay with me
        像坠入最深的海底
        Stay Here
        I want you stay with me
        向着稀薄的光明
        Stay Here
        I want you stay with me
        换个清白的姓名 再叫醒`,
        
        "小孩 - Joker Xue": `嘲笑我有多简单 像番茄加两个蛋
        闭上眼就睡 多自然
        想著你有多困难 从宇宙找颗尘埃
        揉进我眼眶 多小孩
        丢掉的你又想要拿什么缅怀
        是不是不需要猜 又来的突然
        你就对我说明白 就让我看明白
        从什么时候我像小孩
        我的天台从来热爱
        不需要猜 别让我猜
        你就对我说明白 就让我看明白
        从什么时候我像小孩
        我的天台从来热爱
        不需要猜 别让我
        
        想著你有多困难 从宇宙找颗尘埃
        揉进我眼眶 多小孩
        丢掉的你又想要拿什么缅怀
        是不是不需要猜 又来的突然
        你就对我说明白 就让我看明白
        从什么时候我像小孩
        我的天台从来热爱
        不需要猜 别让我猜
        你就对我说明白 就让我看明白
        从什么时候我像小孩
        我的天台从来热爱
        不需要猜 别让我猜
        谁需要爱 就坦白
        别让我一个人
        你就对我说明白 就让我更明白
        从什么时候我像小孩
        我的天台从来热爱
        不需要猜 别让我猜`,
        
        "绅士 - Joker Xue": `好久没见了 什么角色呢
        细心装扮著 白色衬衫的袖扣是你送的
        尽量表现著像不在意的
        频繁暴露了自欺欺人者
        越掩饰越深刻 你说我说听说
        忍著言不由衷的段落
        我反正决定自己难过
        我想摸你的头发 只是简单的试探啊
        我想给你个拥抱 像以前一样可以吗
        你退半步的动作认真的吗
        小小的动作伤害还那么大
        我只能扮演个绅士 才能和你说说话
        我能送你回家吗 可能外面要下雨啦
        我能给你个拥抱 像朋友一样可以吗
        我忍不住从背后抱了一下
        尺度掌握在不能说想你啊
        你就当刚认识的绅士
        闹了个笑话吧
        
        尽量表现著善解人意的
        频繁暴露了不欲人知的
        越掩饰越深刻
        想说听说别说
        忍著言不由衷的段落
        我反正注定留在角落
        我想摸你的头发 只是简单的试探啊
        我想给你个拥抱 像以前一样可以吗
        你退半步的动作认真的吗
        小小的动作伤害还那么大
        我只能扮演个绅士
        才能和你说说话
        我能送你回家吗 可能外面要下雨啦
        我能给你个拥抱 像朋友一样可以吗
        我忍不住从背后抱了一下
        尺度掌握在不能说想你啊
        你就当刚认识的绅士 闹了个笑话吧
        你能给我只左手 牵你到马路那头吗
        我会像以前一样 看著来往的车子啊
        我们的距离在眉间皱了下
        迅速还原成路人的样子啊
        越有礼貌我越害怕
        绅士要放得下`
    };
    

    // === Fullscreen Logic ===
    const fullscreenBtn = document.querySelector('.fullscreen-btn') || document.querySelector('.player-controls').appendChild(createFullscreenBtn());
    const fullscreenView = document.querySelector('.fullscreen-view');

    // Create fullscreen button if it doesn't exist
    function createFullscreenBtn() {
        const btn = document.createElement('button');
        btn.className = 'control-btn fullscreen-btn';
        btn.innerHTML = '<img src="asset/song.png" alt="Fullscreen" class="control-icon">';
        return btn;
    }

    fullscreenBtn.addEventListener('click', function () {
        this.classList.toggle('active');
        fullscreenView.classList.toggle('active');

        if (fullscreenView.classList.contains('active')) {
            updateFullscreenView();
            // Hide main content and right sidebar
            document.querySelector('.layout__main').style.visibility = 'hidden';
            document.querySelector('.layout__right-sidebar').style.visibility = 'hidden';
        } else {
            // Show main content and right sidebar
            document.querySelector('.layout__main').style.visibility = 'visible';
            document.querySelector('.layout__right-sidebar').style.visibility = 'visible';
        }
    });

    // Tab switching logic
    document.querySelectorAll('.fs-tab').forEach(tab => {
        tab.addEventListener('click', function () {
            document.querySelectorAll('.fs-tab').forEach(t => t.classList.remove('active'));
            this.classList.add('active');

            const tabId = this.getAttribute('data-tab');
            document.querySelectorAll('.fs-tab-content').forEach(content => {
                content.classList.remove('active');
                if (content.id === tabId) {
                    content.classList.add('active');
                }
            });
        });
    });

    // Update fullscreen player content
    function updateFullscreenView() {
        const miniPlayer = document.querySelector('.floating-player');
        const songTitle = miniPlayer.querySelector('.song-title')?.textContent || 'No song selected';
        const songArtist = miniPlayer.querySelector('.song-artist')?.textContent || 'Select a song to play';
        const songCover = miniPlayer.querySelector('.song-cover img')?.src || 'asset/no-cover.png';

        fullscreenView.querySelector('.fs-song-title').textContent = songTitle;
        fullscreenView.querySelector('.fs-song-artist').textContent = songArtist;
        fullscreenView.querySelector('.fs-cover-image').src = songCover;

        // Update lyrics
        const key = `${songTitle} - ${songArtist}`;
        const lyrics = lyricsDatabase[key] || "Lyrics will appear here when available";
        fullscreenView.querySelector('.fs-lyrics').textContent = lyrics;
    }

    const modal = document.getElementById('playlistModal');
    const createModal = document.getElementById('createPlaylistModal');

    const openBtn = document.querySelector('.btn-add-playlist');
    const closeBtn = document.getElementById('closeModal');
    const createBtn = document.querySelector('.create-playlist-btn');
    const closeCreateBtn = document.getElementById('closeCreateModal');

    // Open first modal
    openBtn.addEventListener('click', () => {
        modal.style.display = 'flex';
    });

    // Close first modal
    closeBtn.addEventListener('click', () => {
        modal.style.display = 'none';
    });

    // Open second modal (Create)
    createBtn.addEventListener('click', () => {
        modal.style.display = 'none';
        createModal.style.display = 'flex';
    });

    // Close second modal
    closeCreateBtn.addEventListener('click', () => {
        createModal.style.display = 'none';
    });

    // Optional: click outside to close
    window.addEventListener('click', (e) => {
        if (e.target === modal) modal.style.display = 'none';
        if (e.target === createModal) createModal.style.display = 'none';
    });

    const hideScrollbars = () => {
        document.documentElement.style.setProperty('--scrollbar-width', '0px');
        document.body.style.overflow = 'hidden';
        
        const style = document.createElement('style');
        style.textContent = `
          *::-webkit-scrollbar {
            display: none !important;
            width: 0 !important;
            height: 0 !important;
            background: transparent !important;
        }
        `;
        document.head.appendChild(style);
    };
    
    hideScrollbars();
    setTimeout(hideScrollbars, 100);
    window.addEventListener('resize', hideScrollbars);

});

