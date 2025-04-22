document.addEventListener('DOMContentLoaded', function () {
    console.log("DOM fully loaded. Initializing scripts...");

    // --- Start: Element Selectors ---
    let activeFriendPopover = null; // Untuk melacak popover teman yang aktif

    // --- Audio Player Elements ---
    const audioElement = new Audio();
    const progressBar = document.querySelector('.progress-bar');
    const progressBarContainer = document.querySelector('.progress-bar-container');
    const playerSongTitleElement = document.querySelector('.floating-player .player-info .song-details .song-title');
    const playerSongArtistElement = document.querySelector('.floating-player .player-info .song-details .song-artist');
    const playerSongCoverElement = document.querySelector('.floating-player .player-info .song-cover');
    const playButton = document.querySelector('.play-btn');
    const playIcon = playButton?.querySelector('img'); // Optional chaining
    const volumeBtn = document.querySelector('.volume-btn');
    const volumeIcon = volumeBtn?.querySelector('img'); // Optional chaining
    const volumeSlider = document.querySelector('.volume-slider');
    const prevBtn = document.querySelector('.prev-btn');
    const nextBtn = document.querySelector('.next-btn');
    const fullscreenBtn = document.querySelector('.fullscreen-btn');
    const floatingPlayerControls = document.querySelectorAll('.floating-player .player-controls button');

    // --- View Containers ---
    const mainScroll = document.querySelector('.main-scroll'); // Main scrollable area
    const layoutContainer = document.querySelector('.layout'); // Main layout for friend activity toggle
    const mainContentSections = document.querySelectorAll('.main-content-section'); // Sections in home view
    const playlistDetailView = document.getElementById('playlistDetailView');
    const notificationView = document.getElementById('notificationView');
    const fullPlayerView = document.getElementById('fullPlayerView');
    const addFriendView = document.getElementById('addFriendView');
    const profileView = document.getElementById('profileView');
    const editProfileView = document.getElementById('editProfileView');
    const artistDetailView = document.getElementById('artistDetailView');
    const artistListView = document.getElementById('artistListView'); // Added for consistency
    const albumListView = document.getElementById('albumListView');
    const albumDetailView = document.getElementById('albumDetailView');
    const likedMusicView = document.getElementById('likedMusicView');
    const flowSection = document.getElementById('flowSection');
    const friendActivitySection = document.getElementById('friendActivitySection');
    const flowParticipantsSidebar = document.getElementById('flowParticipantsSidebar'); // Assuming this ID exists
    const rightSidebarDefaultContent = document.getElementById('rightSidebarDefaultContent'); // Assuming this ID exists for the container holding flow/friend activity

    // --- Sidebar & Header Elements ---
    const logoImage = document.querySelector('.sidebar__logo');
    const forYouLink = document.getElementById('sidebarForYouLink');
    const sidebarPlaylistList = document.getElementById('sidebarPlaylistList');
    let playlistLinks = document.querySelectorAll('.playlist-link'); // Will be updated
    const sidebarArtistsLink = document.querySelector('.sidebar-artists-link');
    const sidebarAlbumsLink = document.getElementById('sidebarAlbumsLink');
    const specificLikedMusicLink = document.getElementById('sidebarLikedMusicLink'); // Use this one
    const addFriendBtnSidebar = document.getElementById('addFriendBtnSidebar');
    const notificationIcon = document.querySelector('.user__notifications-toggle');
    const friendToggleButton = document.getElementById('friendActivityToggle');
    const profileDropdownItem = document.querySelector('.dropdown-item-profile');

    // --- Playlist Detail View Elements ---
    const playlistDetailTitles = document.querySelectorAll('#playlistDetailView .playlist-title-main');
    const playlistCoverLarge = playlistDetailView?.querySelector('.playlist-cover-large');
    const playlistCreatorMain = playlistDetailView?.querySelector('.playlist-creator-main');
    const editPlaylistBtn = document.getElementById('editPlaylistBtn');

    // --- Artist Detail View Elements ---
    const artistPhotoElement = artistDetailView?.querySelector('.artist-photo');
    const artistNameElement = artistDetailView?.querySelector('.artist-name');
    const artistSongCountElement = artistDetailView?.querySelector('.artist-song-count');
    const artistPlayButton = artistDetailView?.querySelector('.artist-header .btn-primary');
    const artistSongListContainer = artistDetailView?.querySelector('.artist-song-list');
    const backToMainLinkInArtist = artistDetailView?.querySelector('.back-to-main'); // Should probably be back-to-artist-list

    // --- Album Detail View Elements ---
    const albumCoverLargeElement = albumDetailView?.querySelector('.album-cover-large');
    const albumNameElement = albumDetailView?.querySelector('.album-name');
    const albumArtistElement = albumDetailView?.querySelector('.album-artist');
    const albumSongListContainer = albumDetailView?.querySelector('.album-song-list');
    const albumPlayButton = albumDetailView?.querySelector('.btn-play-album');
    const backToAlbumListLink = albumDetailView?.querySelector('.back-to-album-list');

    // --- Liked Music View Elements ---
    const likedSongCountElement = document.getElementById('likedSongCount');
    const playLikedMusicBtn = likedMusicView?.querySelector('.btn-play-liked');
    const likedSongsContainer = likedMusicView?.querySelector('.liked-songs-container');

    // --- Profile & Edit Profile Elements ---
    const editProfileIcon = document.getElementById('editProfileIcon');
    const cancelEditProfileButton = document.getElementById('cancelEditProfile');
    const backToProfileLinkInEdit = editProfileView?.querySelector('.back-to-profile');
    const saveProfileButton = document.getElementById('saveProfile');
    const editUsernameInput = document.getElementById('editUsername');
    const editEmailInput = document.getElementById('editEmail');
    const editPasswordInput = document.getElementById('editPassword');

    // --- Full Player View Elements ---
    const fullPlayerCoverImg = fullPlayerView?.querySelector('.full-player-cover');
    const fullPlayerTitle = fullPlayerView?.querySelector('.full-player-title');
    const fullPlayerArtist = fullPlayerView?.querySelector('.full-player-artist');
    const addToPlaylistBtnFullPlayer = document.getElementById('addToPlaylistBtnFullPlayer');
    const fullPlayerUpNextList = fullPlayerView?.querySelector('.up-next-list');

    // --- Modal Elements ---
    // Edit Playlist Modal
    const editPlaylistModalElement = document.getElementById('editPlaylistModal');
    const playlistNameInput = document.getElementById('playlistNameInput');
    const savePlaylistNameBtn = document.getElementById('savePlaylistNameBtn');
    let editPlaylistModalInstance = null;
    // Select Playlist Modal
    const selectPlaylistModalElement = document.getElementById('selectPlaylistModal');
    const selectPlaylistModalList = document.getElementById('selectPlaylistModalList');
    const newPlaylistBtnFromModal = document.getElementById('newPlaylistBtnFromModal');
    let selectPlaylistModalInstance = null;
    // Create New Playlist Modal
    const createNewPlaylistModalElement = document.getElementById('createNewPlaylistModal');
    const newPlaylistTitleInput = document.getElementById('newPlaylistTitleInput');
    const newPlaylistDescInput = document.getElementById('newPlaylistDescInput');
    const saveNewPlaylistBtn = document.getElementById('saveNewPlaylistBtn');
    let createNewPlaylistModalInstance = null;

    // --- Flow/Jam Elements ---
    const startFlowBtn = document.getElementById('startFlowBtn');
    const leaveJamBtn = flowSection?.querySelector('.btn-jam-leave');
    const inviteToFlowBtn = document.getElementById('inviteToFlowBtn'); // Corrected selector
    const backToFlowViewBtn = document.getElementById('backToFlowViewBtn');

    // --- End: Element Selectors ---
    const addPlaylistIcon = document.querySelector('.add__playlist'); // <-- Tambahkan ini
    

    // --- Start: State Variables ---
    let currentSong = null; // { file, name, artist, cover, sourceElement }
    let lastVolume = 0.7;
    let currentPlaylistItems = []; // Song items in the current playlist view
    let currentArtistSongItems = []; // Song items in the current artist view
    let currentAlbumSongItems = []; // Song items in the current album view
    let currentLikedSongItems = []; // Song items in the liked music view
    let currentEditingPlaylistLinkElement = null; // Sidebar link of the playlist being viewed/edited
    const friendActivityStorageKey = 'friendActivityHiddenState';
    // --- End: State Variables ---


    // --- Start: Helper Functions ---

    /**
     * Displays temporary feedback message (toast/snackbar style).
     * @param {string} message - The message to display.
     */
    function showTemporaryFeedback(message) {
        let feedbackElement = document.getElementById('temporaryFeedback');
        if (!feedbackElement) {
            feedbackElement = document.createElement('div');
            feedbackElement.id = 'temporaryFeedback';
            // Basic styling - should be defined in CSS
            feedbackElement.style.position = 'fixed';
            feedbackElement.style.left = '50%';
            feedbackElement.style.transform = 'translateX(-50%)';
            feedbackElement.style.backgroundColor = 'rgba(0, 0, 0, 0.8)';
            feedbackElement.style.color = 'white';
            feedbackElement.style.padding = '10px 20px';
            feedbackElement.style.borderRadius = '5px';
            feedbackElement.style.zIndex = '1060'; // Above modals
            feedbackElement.style.transition = 'opacity 0.3s ease-in-out, bottom 0.3s ease-in-out';
            feedbackElement.style.opacity = '0';
            document.body.appendChild(feedbackElement);
        }

        feedbackElement.textContent = message;
        const endBottom = '150px'; // Position above floating player
        const startBottom = '120px';

        feedbackElement.style.bottom = startBottom;
        feedbackElement.style.opacity = '0';

        setTimeout(() => {
            feedbackElement.style.opacity = '1';
            feedbackElement.style.bottom = endBottom;
        }, 50);

        setTimeout(() => {
            feedbackElement.style.opacity = '0';
            feedbackElement.style.bottom = startBottom;
        }, 3000);
    }

    /**
     * Extracts song data from a media card element.
     * @param {HTMLElement} cardElement - The media card element.
     * @returns {object|null} Song data object or null if invalid.
     */
    function extractSongDataFromCard(cardElement) {
        if (!cardElement) return null;
        const songFile = cardElement.getAttribute('data-file');
        const songName = cardElement.getAttribute('data-song');
        const artistName = cardElement.getAttribute('data-artist');
        const coverImage = cardElement.getAttribute('data-cover') || cardElement.querySelector('.media-img img')?.src || 'asset/no-cover.png';

        if (!songFile || !songName || !artistName) {
            console.warn("[extractSongDataFromCard] Missing data attributes on media-card:", cardElement);
            return null;
        }
        return { file: songFile, name: songName, artist: artistName, cover: coverImage };
    }

    /**
     * Extracts song data from a song item element (.song-item or .song-item-simple).
     * @param {HTMLElement} itemElement - The song item element.
     * @returns {object|null} Song data object or null if invalid.
     */
    function extractSongDataFromItem(itemElement) {
        if (!itemElement) return null;
        const songFile = itemElement.getAttribute('data-song-file') || itemElement.getAttribute('data-file');
        const songName = itemElement.getAttribute('data-song')
            || itemElement.querySelector('.song-item-title')?.textContent.trim()
            || itemElement.querySelector('.fw-medium.small')?.textContent.trim();
        const artistName = itemElement.getAttribute('data-artist')
            || itemElement.querySelector('.song-item-artist')?.textContent.trim()
            || itemElement.querySelector('.text-muted.extra-small')?.textContent.trim();
        const coverElement = itemElement.querySelector('.song-item-cover img, img');
        const coverImage = itemElement.getAttribute('data-cover') || coverElement?.src || 'asset/no-cover.png';

        if (!songFile) {
            console.warn("[extractSongDataFromItem] Missing data-song-file or data-file attribute on song item:", itemElement);
            return null;
        }
        return { file: songFile, name: songName || 'Unknown Song', artist: artistName || 'Unknown Artist', cover: coverImage };
    }

    /**
     * Updates the volume icon based on mute status and volume level.
     */
    function updateVolumeIcon() {
        if (!volumeIcon || !audioElement) return;

        const isMuted = audioElement.muted;
        const currentVolume = audioElement.volume;

        if (volumeSlider) {
            volumeSlider.value = isMuted ? 0 : currentVolume;
            const percentage = isMuted ? 0 : currentVolume * 100;
            volumeSlider.style.background = `linear-gradient(to top, #8A7EBE ${percentage}%, #e0e0e0 ${percentage}%)`;
        }

        if (isMuted || currentVolume === 0) {
            volumeIcon.src = 'asset/volume-off.png';
            volumeIcon.alt = 'Muted';
        } else {
            volumeIcon.src = 'asset/volume.png';
            volumeIcon.alt = 'Volume';
        }
    }

    /**
     * Updates the play/pause button icon and related UI elements.
     * @param {boolean} isPlaying - Whether the audio is currently playing.
     */
    function updatePlayButtonIcon(isPlaying) {
        if (playIcon) {
            playIcon.src = isPlaying ? 'asset/pause.png' : 'asset/start.png';
            playIcon.alt = isPlaying ? 'Pause' : 'Play';
        }

        // Clear previous indicators
        document.querySelectorAll('.song-item-listening-icon').forEach(icon => icon.style.display = 'none');
        document.querySelectorAll('.song-item.playing, .song-item-simple.playing, .media-card.playing').forEach(el => el.classList.remove('playing'));
        clearNowPlayingInFullView(); // Clear highlight in full player

        if (isPlaying && currentSong?.sourceElement) {
            // Show indicator on the source element
            currentSong.sourceElement.classList.add('playing');
            const listeningIcon = currentSong.sourceElement.querySelector('.song-item-listening-icon');
            if (listeningIcon) {
                listeningIcon.style.display = 'inline-block';
            }
            // Highlight in full player view if visible
            if (fullPlayerView?.style.display === 'flex') {
                highlightNowPlayingInFullView(currentSong.sourceElement);
            }
        }
    }

    /**
     * Resets the player UI to its default state (no song playing).
     */
    function resetPlayerToDefault() {
        console.log("Resetting player to default.");
        if (progressBarContainer) progressBarContainer.style.display = 'none';
        if (progressBar) progressBar.value = 0;

        if (playerSongCoverElement) {
            playerSongCoverElement.innerHTML = '<img src="asset/no-cover.png" alt="No song selected" class="img-fluid">';
            playerSongCoverElement.classList.add('no-song');
        }
        if (playerSongTitleElement) playerSongTitleElement.textContent = 'No song selected';
        if (playerSongArtistElement) playerSongArtistElement.textContent = 'Select a song to play';

        // Disable buttons except volume and fullscreen (if initially enabled)
        floatingPlayerControls.forEach(btn => {
            if (!btn.classList.contains('volume-btn') /* && !btn.classList.contains('fullscreen-btn') */) {
                btn.disabled = true;
            }
        });
        if (fullscreenBtn) fullscreenBtn.disabled = true; // Disable fullscreen if no song
        if (addToPlaylistBtnFullPlayer) addToPlaylistBtnFullPlayer.disabled = true;

        updatePlayButtonIcon(false);
        currentSong = null;
        // Ensure all playing indicators are removed
        document.querySelectorAll('.song-item.playing, .song-item-simple.playing, .media-card.playing').forEach(el => el.classList.remove('playing'));
        document.querySelectorAll('.song-item-listening-icon').forEach(icon => icon.style.display = 'none');
        clearNowPlayingInFullView();
    }

    /**
     * Determines the current list of song elements and context based on the source element.
     * @returns {{songListSource: HTMLElement[], sourceContext: string|null}}
     */
    function getCurrentSongListAndContext() {
        let songListSource = [];
        let sourceContext = null;

        if (!currentSong?.sourceElement) {
            console.warn("[getCurrentSongList] No current song or source element.");
            return { songListSource, sourceContext };
        }

        const source = currentSong.sourceElement;

        if (source.closest('#playlistDetailView .song-list')) {
            songListSource = Array.from(playlistDetailView.querySelectorAll('.song-list .song-item[data-song-file]'));
            sourceContext = 'playlist';
        } else if (source.closest('#artistDetailView .artist-song-list')) {
            songListSource = Array.from(artistDetailView.querySelectorAll('.artist-song-list .song-item[data-song-file]'));
            sourceContext = 'artist';
        } else if (source.closest('#albumDetailView .album-song-list')) { // Added Album context
            songListSource = Array.from(albumDetailView.querySelectorAll('.album-song-list .song-item[data-song-file]'));
            sourceContext = 'album';
        } else if (source.closest('#likedMusicView .liked-songs-container')) { // Added Liked Music context
            songListSource = Array.from(likedMusicView.querySelectorAll('.liked-songs-container .song-item[data-song-file]'));
            sourceContext = 'liked';
        } else if (source.classList.contains('media-card')) {
            const parentSection = source.closest('.section');
            songListSource = parentSection
                ? Array.from(parentSection.querySelectorAll('.media-card[data-file]'))
                : Array.from(document.querySelectorAll('.main-content-section .media-card[data-file]'));
            sourceContext = 'media-card';
        } else if (source.closest('#fullPlayerView .up-next-list')) {
            songListSource = Array.from(fullPlayerView.querySelectorAll('.up-next-list .song-item-simple[data-song-file]'));
            sourceContext = 'full-player-upnext';
        } else {
            console.warn("[getCurrentSongList] Could not determine song list context from source element:", source);
            // Fallback to a broader selection might be too unpredictable. Return empty.
            sourceContext = 'unknown';
        }

        console.log(`[getCurrentSongList] Context: ${sourceContext}, List length: ${songListSource.length}`);
        return { songListSource, sourceContext };
    }

    // --- End: Helper Functions ---


    // --- Start: Core Audio Playback ---

    /**
     * Plays the specified song.
     * @param {object} songData - The song data { file, name, artist, cover }.
     * @param {HTMLElement} [sourceElement=null] - The element that triggered the play action.
     */
    function playSong(songData, sourceElement = null) {
        if (!audioElement) {
            console.error("[playSong] Audio element is missing!");
            return;
        }
        if (!songData?.file) {
            console.error("[playSong] Invalid songData:", songData);
            showTemporaryFeedback("Data lagu tidak valid.");
            return;
        }

        console.log(`[playSong] Playing: ${songData.name} by ${songData.artist}`);
        currentSong = { ...songData, sourceElement: sourceElement };

        // Update Floating Player UI
        if (progressBarContainer) progressBarContainer.style.display = 'block';
        if (playerSongCoverElement) {
            playerSongCoverElement.innerHTML = `<img src="${songData.cover}" alt="${songData.name}" class="img-fluid" onerror="this.src='asset/no-cover.png';">`;
            playerSongCoverElement.classList.remove('no-song');
        }
        if (playerSongTitleElement) playerSongTitleElement.textContent = songData.name;
        if (playerSongArtistElement) playerSongArtistElement.textContent = songData.artist;

        // Enable controls
        floatingPlayerControls.forEach(btn => btn.disabled = false);
        if (fullscreenBtn) fullscreenBtn.disabled = false;
        if (addToPlaylistBtnFullPlayer) addToPlaylistBtnFullPlayer.disabled = false;

        // Play Audio
        audioElement.src = songData.file;
        audioElement.play()
            .then(() => {
                console.log("[playSong] Playback started.");
                updatePlayButtonIcon(true);
            })
            .catch(e => {
                console.error("[playSong] Error playing audio:", e);
                updatePlayButtonIcon(false);
                resetPlayerToDefault(); // Reset if playback fails immediately
                showTemporaryFeedback(`Error memainkan lagu: ${e.message}`);
            });

        // Update Full Player if visible
        if (fullPlayerView?.style.display === 'flex') {
            updateFullPlayerContent();
        }
    }

    /**
     * Toggles between play and pause states.
     */
    function togglePlayPause() {
        if (!audioElement) return;

        if (audioElement.paused) {
            if (!currentSong) {
                // Try to play the first available song if none is selected
                console.log("[togglePlayPause] No current song. Trying to play first available.");
                const firstPlayableElement = document.querySelector('.media-card[data-file], .song-item[data-song-file]');
                if (firstPlayableElement) {
                    const songData = firstPlayableElement.classList.contains('media-card')
                        ? extractSongDataFromCard(firstPlayableElement)
                        : extractSongDataFromItem(firstPlayableElement);
                    if (songData) playSong(songData, firstPlayableElement);
                } else {
                    console.log("[togglePlayPause] No available songs found.");
                    showTemporaryFeedback("Tidak ada lagu yang bisa diputar.");
                }
            } else {
                // Resume playback
                audioElement.play().catch(e => {
                    console.error("[togglePlayPause] Error resuming audio:", e);
                    showTemporaryFeedback(`Error melanjutkan lagu: ${e.message}`);
                });
                updatePlayButtonIcon(true);
            }
        } else {
            // Pause playback
            audioElement.pause();
            updatePlayButtonIcon(false);
        }
    }

    /**
     * Plays the next song in the current context (playlist, album, artist, etc.).
     */
    function playNextSong() {
        console.log("[playNextSong] Triggered.");
        if (!currentSong) {
            resetPlayerToDefault();
            return;
        }

        const { songListSource } = getCurrentSongListAndContext();
        if (songListSource.length === 0) {
            resetPlayerToDefault();
            return;
        }

        const currentIndex = songListSource.findIndex(item => {
            const itemFile = item.getAttribute('data-song-file') || item.getAttribute('data-file');
            return itemFile === currentSong.file;
        });

        if (currentIndex !== -1 && currentIndex < songListSource.length - 1) {
            const nextElement = songListSource[currentIndex + 1];
            const songData = nextElement.classList.contains('media-card')
                ? extractSongDataFromCard(nextElement)
                : extractSongDataFromItem(nextElement);
            if (songData) {
                playSong(songData, nextElement);
            } else {
                console.error("[playNextSong] Could not extract data from next element:", nextElement);
                showTemporaryFeedback("Gagal memuat lagu berikutnya.");
                resetPlayerToDefault();
            }
        } else {
            console.log("[playNextSong] End of list reached or current song not found.");
            resetPlayerToDefault(); // Stop at the end of the list
        }
    }

    /**
     * Plays the previous song or restarts the current song.
     */
    function playPreviousSong() {
        console.log("[playPreviousSong] Triggered.");
        if (!currentSong || !audioElement) {
            resetPlayerToDefault();
            return;
        }

        // Restart current song if played for more than 3 seconds
        if (audioElement.currentTime > 3) {
            console.log("[playPreviousSong] Restarting current song.");
            audioElement.currentTime = 0;
            if (audioElement.paused) togglePlayPause(); // Resume if paused
            return;
        }

        const { songListSource } = getCurrentSongListAndContext();
        if (songListSource.length === 0) {
            resetPlayerToDefault();
            return;
        }

        const currentIndex = songListSource.findIndex(item => {
            const itemFile = item.getAttribute('data-song-file') || item.getAttribute('data-file');
            return itemFile === currentSong.file;
        });

        if (currentIndex > 0) {
            const prevElement = songListSource[currentIndex - 1];
            const songData = prevElement.classList.contains('media-card')
                ? extractSongDataFromCard(prevElement)
                : extractSongDataFromItem(prevElement);
            if (songData) {
                playSong(songData, prevElement);
            } else {
                console.error("[playPreviousSong] Could not extract data from previous element:", prevElement);
                showTemporaryFeedback("Gagal memuat lagu sebelumnya.");
                resetPlayerToDefault();
            }
        } else {
            // If it's the first song, restart it (or do nothing if already at the beginning)
            console.log("[playPreviousSong] First song in list. Restarting.");
            audioElement.currentTime = 0;
            if (audioElement.paused) togglePlayPause();
        }
    }

    // --- End: Core Audio Playback ---


    // --- Start: View Management ---

    /**
     * Hides all primary view containers within the main scroll area.
     */
    function hideAllViews() {
        console.log("[hideAllViews] Hiding all main views.");
        const viewsToHide = [
            playlistDetailView, notificationView, fullPlayerView, addFriendView,
            profileView, editProfileView, artistDetailView, artistListView,
            albumListView, albumDetailView, likedMusicView,
            ...mainContentSections // Hide generic home sections too
        ];
        viewsToHide.forEach(view => {
            if (view) view.style.display = 'none';
        });
        // Also hide specific sections if they aren't covered above
        if (flowSection) flowSection.style.display = 'none';
        if (friendActivitySection) friendActivitySection.style.display = 'block'; // Default friend activity state might be visible
        if (flowParticipantsSidebar) flowParticipantsSidebar.style.display = 'none';
        if (rightSidebarDefaultContent) rightSidebarDefaultContent.style.display = 'block'; // Show default right sidebar content
    }

    /**
     * Applies the stored or default state for the Friend Activity sidebar visibility.
     */
    function applyFriendActivityState() {
        if (!layoutContainer) return;
        const savedState = localStorage.getItem(friendActivityStorageKey);
        const shouldBeHidden = savedState === 'hidden';
        const isFullPlayerVisible = fullPlayerView?.style.display === 'flex';

        console.log(`[FriendActivity] Applying state. Saved: ${savedState}. Should be hidden: ${shouldBeHidden}. Full player active: ${isFullPlayerVisible}`);

        if (isFullPlayerVisible) {
            layoutContainer.classList.add('friend-activity-hidden'); // Always hide if full player is active
        } else {
            if (shouldBeHidden) {
                layoutContainer.classList.add('friend-activity-hidden');
            } else {
                layoutContainer.classList.remove('friend-activity-hidden');
            }
        }
    }

    /**
     * Activates the specified sidebar link item.
     * @param {HTMLElement} linkElement - The sidebar link element to activate.
     */
    function setActiveSidebarLink(linkElement) {
        document.querySelectorAll('.sidebar .list-item-box.active').forEach(activeItem => {
            activeItem.classList.remove('active');
        });
        linkElement?.closest('.list-item-box')?.classList.add('active');
    }

    /**
     * Shows the main content view (Home).
     */
    function showMainContentView() {
        console.log("[showMainContentView] Showing home view.");
        hideAllViews();
        mainContentSections.forEach(section => {
            // Ensure only sections meant for the home view are shown
            const sectionId = section.id;
            const isSpecialView = ['playlistDetailView', 'notificationView', 'fullPlayerView', 'addFriendView', 'profileView', 'editProfileView', 'artistDetailView', 'artistListView', 'albumListView', 'albumDetailView', 'likedMusicView'].includes(sectionId);
            if (!isSpecialView && section) {
                section.style.display = 'block';
            }
        });
        setActiveSidebarLink(forYouLink);
        if (mainScroll) mainScroll.scrollTop = 0;
        applyFriendActivityState();
        currentEditingPlaylistLinkElement = null; // Reset editing context
    }

    /**
     * Shows the Playlist Detail view.
     * @param {string} playlistName - Name of the playlist.
     * @param {HTMLElement} playlistLinkElement - The sidebar link element clicked.
     */
    function showPlaylistDetailView(playlistName, playlistLinkElement) {
        console.log(`[showPlaylistDetailView] Showing playlist: "${playlistName}"`);
        hideAllViews();
        if (!playlistDetailView) {
            console.error("[showPlaylistDetailView] Element #playlistDetailView not found.");
            return;
        }

        currentEditingPlaylistLinkElement = playlistLinkElement; // Store context for editing

        // Update Header
        if (playlistCoverLarge) {
            playlistCoverLarge.src = playlistLinkElement?.getAttribute('data-playlist-cover') || 'asset/cover.jpg';
            playlistCoverLarge.alt = playlistName;
        }
        playlistDetailTitles.forEach(titleElement => {
            if (titleElement) titleElement.textContent = playlistName;
        });
        if (playlistCreatorMain) {
            const creatorText = playlistLinkElement?.querySelector('.playlist__creator')?.textContent || `Made by You`; // Default creator
            // TODO: Get actual song count dynamically if possible
            const songCount = playlistDetailView.querySelectorAll('.song-list .song-item').length;
            playlistCreatorMain.textContent = `${creatorText} • ${songCount} songs`;
        }

        playlistDetailView.style.display = 'block';
        setupPlaylistSongItemListeners(); // Attach listeners to songs in this view
        setActiveSidebarLink(playlistLinkElement);
        if (mainScroll) mainScroll.scrollTop = 0;
        applyFriendActivityState();
    }

    /** Shows the Notification view. */
    function showNotificationView() {
        console.log("[showNotificationView] Showing notifications.");
        hideAllViews();
        if (notificationView) {
            notificationView.style.display = 'block';
            if (mainScroll) mainScroll.scrollTop = 0;
            setActiveSidebarLink(null); // No specific sidebar link for notifications
            applyFriendActivityState();
        } else {
            console.error("[showNotificationView] Element #notificationView not found.");
        }
    }

    /** Shows the Add Friend view. */
    function showAddFriendView() {
        console.log("[showAddFriendView] Showing Add Friend view.");
        hideAllViews();
        if (addFriendView) {
            addFriendView.style.display = 'block';
            if (mainScroll) mainScroll.scrollTop = 0;
            setActiveSidebarLink(null); // No specific sidebar link
            applyFriendActivityState();
        } else {
            console.error("[showAddFriendView] Element #addFriendView not found.");
        }
    }

    /** Shows the Profile view. */
    function showProfileView() {
        console.log("[showProfileView] Showing Profile view.");
        hideAllViews();
        if (profileView) {
            profileView.style.display = 'block';
            // Optional: Update profile info dynamically here if needed
            if (mainScroll) mainScroll.scrollTop = 0;
            setActiveSidebarLink(null); // Or highlight profile item if it's in the sidebar
            applyFriendActivityState();
        } else {
            console.error("[showProfileView] Element #profileView not found.");
        }
    }

    /** Shows the Edit Profile view. */
    function showEditProfileView() {
        console.log("[showEditProfileView] Showing Edit Profile view.");
        hideAllViews();
        if (editProfileView) {
            editProfileView.style.display = 'block';
            // Optional: Populate form with current data
            // const currentUsername = profileView?.querySelector('.profile-name h3')?.textContent.trim();
            // if (editUsernameInput) editUsernameInput.value = currentUsername || '';
            // ... populate other fields ...
            if (mainScroll) mainScroll.scrollTop = 0;
            setActiveSidebarLink(null);
            applyFriendActivityState();
        } else {
            console.error("[showEditProfileView] Element #editProfileView not found.");
        }
    }

    /** Shows the Artist List view. */
    function showArtistListView() {
        console.log("[showArtistListView] Showing artist list.");
        hideAllViews();
        if (artistListView) {
            artistListView.style.display = 'block';
            // TODO: Load/update artist list content if dynamic
            if (mainScroll) mainScroll.scrollTop = 0;
            setActiveSidebarLink(sidebarArtistsLink);
            applyFriendActivityState();
        } else {
            console.error("[showArtistListView] Element #artistListView not found.");
        }
    }

    /**
     * Shows the Artist Detail view.
     * @param {object} artistData - Data for the artist { id, name, photo, songCount }.
     */
    function showArtistDetailView(artistData) {
        console.log(`[showArtistDetailView] Showing artist:`, artistData);
        hideAllViews();
        if (!artistDetailView) {
            console.error("[showArtistDetailView] Element #artistDetailView not found.");
            return;
        }

        // Update Header
        if (artistPhotoElement) artistPhotoElement.src = artistData?.photo || 'asset/artist-placeholder.jpg';
        if (artistNameElement) artistNameElement.textContent = artistData?.name || 'Unknown Artist';
        // TODO: Get actual song count dynamically
        const songCount = artistDetailView.querySelectorAll('.artist-song-list .song-item').length;
        if (artistSongCountElement) artistSongCountElement.textContent = `${songCount} Songs`;

        // TODO: Load songs for this artist dynamically if needed
        // fetch(`/api/artists/${artistData.id}/songs`).then(...)

        artistDetailView.style.display = 'block';
        setupArtistSongItemListeners(); // Attach listeners to songs
        setActiveSidebarLink(sidebarArtistsLink); // Keep Artists link active
        if (mainScroll) mainScroll.scrollTop = 0;
        applyFriendActivityState();
    }

    /** Shows the Album List view. */
    function showAlbumListView() {
        console.log("[showAlbumListView] Showing album list.");
        hideAllViews();
        if (albumListView) {
            albumListView.style.display = 'block';
            // TODO: Load/update album list content if dynamic
            if (mainScroll) mainScroll.scrollTop = 0;
            setActiveSidebarLink(sidebarAlbumsLink);
            applyFriendActivityState();
        } else {
            console.error("[showAlbumListView] Element #albumListView not found.");
        }
    }

    /**
     * Shows the Album Detail view.
     * @param {object} albumData - Data for the album { id, name, cover, artist, year, songCount }.
     */
    function showAlbumDetailView(albumData) {
        console.log(`[showAlbumDetailView] Showing album:`, albumData);
        hideAllViews();
        if (!albumDetailView) {
            console.error("[showAlbumDetailView] Element #albumDetailView not found.");
            return;
        }

        // Update Header
        if (albumCoverLargeElement) {
            albumCoverLargeElement.src = albumData?.cover || 'asset/album.png';
            albumCoverLargeElement.alt = albumData?.name || 'Album Cover';
        }
        if (albumNameElement) albumNameElement.textContent = albumData?.name || 'Unknown Album';
        if (albumArtistElement) {
            const artistName = albumData?.artist || 'Unknown Artist';
            const year = albumData?.year || '';
            // TODO: Get actual song count dynamically
            const songCount = albumDetailView.querySelectorAll('.album-song-list .song-item').length;
            albumArtistElement.textContent = `${artistName}${year ? ` • ${year}` : ''} • ${songCount} Songs`;
        }

        // TODO: Load songs for this album dynamically if needed
        // fetch(`/api/albums/${albumData.id}/songs`).then(...)

        albumDetailView.style.display = 'block';
        setupAlbumSongItemListeners(); // Attach listeners to songs
        setActiveSidebarLink(sidebarAlbumsLink); // Keep Albums link active
        if (mainScroll) mainScroll.scrollTop = 0;
        applyFriendActivityState();
    }

    /** Shows the Liked Music view. */
    function showLikedMusicView() {
        console.log("[showLikedMusicView] Showing liked music.");
        hideAllViews();
        if (likedMusicView) {
            likedMusicView.style.display = 'block';
            // TODO: Load liked songs dynamically if needed
            const songCount = likedMusicView.querySelectorAll('.liked-songs-container .song-item').length;
            if (likedSongCountElement) likedSongCountElement.textContent = songCount;

            setupLikedSongItemListeners(); // Attach listeners
            setActiveSidebarLink(specificLikedMusicLink);
            if (mainScroll) mainScroll.scrollTop = 0;
            applyFriendActivityState();
        } else {
            console.error("[showLikedMusicView] Element #likedMusicView not found.");
        }
    }

    /** Shows the Full Screen Player view. */
    function showFullPlayer() {
        if (!fullPlayerView || !currentSong) {
            console.log("Cannot show full player: view element missing or no song playing.");
            showTemporaryFeedback("Pilih lagu untuk menampilkan pemutar layar penuh.");
            return;
        }
        console.log("Showing full player view.");
        hideAllViews(); // Hide other main views
        updateFullPlayerContent(); // Update content before showing
        fullPlayerView.style.display = 'flex';
        if (mainScroll) mainScroll.scrollTop = 0;
        // Force hide friend activity sidebar
        if (layoutContainer) layoutContainer.classList.add('friend-activity-hidden');
        setActiveSidebarLink(null); // No specific sidebar link
    }

    // --- End: View Management ---


    // --- Start: Full Player Content Update ---

    /** Updates the content of the full screen player view. */
    function updateFullPlayerContent() {
        if (!fullPlayerView) return;

        if (!currentSong) {
            // Reset full player if no song
            if (fullPlayerCoverImg) fullPlayerCoverImg.src = 'asset/no-cover.png';
            if (fullPlayerTitle) fullPlayerTitle.textContent = 'Tidak ada lagu';
            if (fullPlayerArtist) fullPlayerArtist.textContent = 'Pilih lagu untuk diputar';
            if (fullPlayerUpNextList) fullPlayerUpNextList.innerHTML = '<p class="small text-muted mb-2">Tidak ada lagu dalam antrian.</p>';
            return;
        }

        console.log("[updateFullPlayerContent] Updating for:", currentSong.name);
        // Update cover, title, artist
        if (fullPlayerCoverImg) {
            fullPlayerCoverImg.src = currentSong.cover || 'asset/no-cover.png';
            fullPlayerCoverImg.alt = currentSong.name;
        }
        if (fullPlayerTitle) fullPlayerTitle.textContent = currentSong.name;
        if (fullPlayerArtist) fullPlayerArtist.textContent = currentSong.artist;

        // Update 'Up Next' list
        if (fullPlayerUpNextList) {
            const { songListSource, sourceContext } = getCurrentSongListAndContext();
            let upNextHTML = '';
            let sourceDescription = "Antrian"; // Default description

            // Determine source description based on context
            if (sourceContext === 'playlist' && currentEditingPlaylistLinkElement) {
                sourceDescription = `Memutar dari ${currentEditingPlaylistLinkElement.getAttribute('data-playlist-name') || 'Playlist'}`;
            } else if (sourceContext === 'artist' && artistNameElement) {
                sourceDescription = `Memutar dari ${artistNameElement.textContent || 'Artist'}`;
            } else if (sourceContext === 'album' && albumNameElement) {
                sourceDescription = `Memutar dari ${albumNameElement.textContent || 'Album'}`;
            } else if (sourceContext === 'liked') {
                sourceDescription = `Memutar dari Lagu yang Disukai`;
            } else if (sourceContext === 'media-card') {
                const sectionTitle = currentSong.sourceElement?.closest('.section')?.querySelector('.section-title')?.textContent;
                sourceDescription = `Memutar dari ${sectionTitle || 'Rekomendasi'}`;
            } else if (sourceContext === 'full-player-upnext') {
                 const existingDesc = fullPlayerUpNextList.querySelector('p.small.text-muted');
                 sourceDescription = existingDesc ? existingDesc.textContent : "Antrian";
            }

            upNextHTML += `<p class="small text-muted mb-2">${sourceDescription}</p>`;

            const currentSongIndex = songListSource.findIndex(item => {
                const itemFile = item.getAttribute('data-song-file') || item.getAttribute('data-file');
                return itemFile === currentSong.file;
            });

            songListSource.forEach((item, index) => {
                // Only show current song and upcoming songs
                if (currentSongIndex === -1 || index >= currentSongIndex) {
                    const songData = item.classList.contains('media-card')
                        ? extractSongDataFromCard(item)
                        : extractSongDataFromItem(item);

                    if (songData) {
                        const isNowPlaying = (index === currentSongIndex);
                        upNextHTML += `
                            <div class="song-item-simple d-flex justify-content-between align-items-center mb-2 ${isNowPlaying ? 'now-playing' : ''}"
                                data-song-file="${songData.file}" data-song="${songData.name}" data-artist="${songData.artist}" data-cover="${songData.cover}"
                                style="cursor: ${isNowPlaying ? 'default' : 'pointer'};">
                               <div class="d-flex align-items-center">
                                    <img src="${songData.cover}" width="38" height="38" class="me-2 rounded" alt="${songData.name}" onerror="this.src='asset/no-cover.png';">
                                    <div>
                                         <div class="fw-medium small">${songData.name}</div>
                                         <div class="text-muted extra-small">${songData.artist}</div>
                                    </div>
                               </div>
                               ${isNowPlaying
                                    ? '<span class="listening-indicator text-primary small"><i class="fas fa-volume-high"></i></span>'
                                    : '<div class="text-muted small">--:--</div>' /* Placeholder for duration */
                                }
                            </div>
                        `;
                    }
                }
            });

            fullPlayerUpNextList.innerHTML = upNextHTML || '<p class="small text-muted mb-2">Tidak ada lagu dalam antrian.</p>';
            setupFullPlayerUpNextListeners(); // Attach listeners after updating HTML
            highlightNowPlayingInFullView(); // Ensure highlight is applied
        }
    }

    /** Highlights the currently playing song in the full player's 'Up Next' list. */
    function highlightNowPlayingInFullView() {
        if (!fullPlayerView || !currentSong || !fullPlayerUpNextList) return;

        // Clear previous highlight
        clearNowPlayingInFullView();

        // Find the item corresponding to the current song's file
        const correspondingItem = fullPlayerUpNextList.querySelector(`.song-item-simple[data-song-file="${currentSong.file}"]`);

        if (correspondingItem) {
            correspondingItem.classList.add('now-playing');
            // Ensure listening indicator is present
            let indicator = correspondingItem.querySelector('.listening-indicator');
            if (!indicator) {
                const durationPlaceholder = correspondingItem.querySelector('.text-muted.small');
                if (durationPlaceholder) durationPlaceholder.remove(); // Remove duration placeholder

                indicator = document.createElement('span');
                indicator.className = 'listening-indicator text-primary small';
                indicator.innerHTML = '<i class="fas fa-volume-high"></i>';
                // Append to the main div, not inside the text div
                correspondingItem.appendChild(indicator);
            }
        } else {
            // console.warn("[highlightNowPlayingInFullView] Could not find corresponding item for file:", currentSong.file);
        }
    }

    /** Clears the 'now-playing' highlight and listening indicator in the full player's 'Up Next' list. */
    function clearNowPlayingInFullView() {
        if (!fullPlayerView || !fullPlayerUpNextList) return;
        fullPlayerUpNextList.querySelectorAll('.song-item-simple.now-playing').forEach(item => {
            item.classList.remove('now-playing');
            const indicator = item.querySelector('.listening-indicator');
            if (indicator) {
                indicator.remove();
                // Add back duration placeholder if needed (optional)
                if (!item.querySelector('.text-muted.small')) {
                    const durationPlaceholder = document.createElement('div');
                    durationPlaceholder.className = 'text-muted small';
                    durationPlaceholder.textContent = '--:--';
                    item.appendChild(durationPlaceholder);
                }
            }
        });
    }

    // --- End: Full Player Content Update ---


    // --- Start: Modal Management ---

    /** Initializes Bootstrap modal instances. */
    function initializeModals() {
        try {
            if (typeof bootstrap === 'undefined') {
                console.error("Bootstrap JS not loaded. Modals will not work.");
                return;
            }
            if (editPlaylistModalElement) {
                editPlaylistModalInstance = new bootstrap.Modal(editPlaylistModalElement);
                console.log("EditPlaylistModal initialized.");
            }
            if (selectPlaylistModalElement) {
                selectPlaylistModalInstance = new bootstrap.Modal(selectPlaylistModalElement);
                console.log("SelectPlaylistModal initialized.");
            }
            if (createNewPlaylistModalElement) {
                createNewPlaylistModalInstance = new bootstrap.Modal(createNewPlaylistModalElement);
                console.log("CreateNewPlaylistModal initialized.");
            }
        } catch (e) {
            console.error("Error initializing Bootstrap Modals.", e);
        }
    }

    /** Populates the 'Select Playlist' modal with current playlists. */
    function populateSelectPlaylistModal() {
        if (!selectPlaylistModalList) return;
        console.log("[AddPlaylist] Populating select playlist modal.");
        selectPlaylistModalList.innerHTML = ''; // Clear previous list
        playlistLinks = document.querySelectorAll('.playlist-link'); // Get current links

        if (playlistLinks.length === 0) {
            selectPlaylistModalList.innerHTML = '<p class="text-muted text-center small p-3">Belum ada playlist.</p>';
        } else {
            playlistLinks.forEach(link => {
                const playlistName = link.getAttribute('data-playlist-name') || link.querySelector('.playlist__name')?.textContent || 'Unnamed Playlist';
                const playlistId = link.getAttribute('data-playlist-id') || playlistName; // Use name as fallback ID

                const listItem = document.createElement('button');
                listItem.type = 'button';
                listItem.className = 'list-group-item list-group-item-action select-playlist-item';
                listItem.textContent = playlistName;
                listItem.setAttribute('data-playlist-id', playlistId);

                listItem.addEventListener('click', () => handlePlaylistSelection(playlistId, playlistName));
                selectPlaylistModalList.appendChild(listItem);
            });
        }
    }

    /**
     * Handles the selection of a playlist from the modal.
     * @param {string} playlistId - The ID (or name fallback) of the selected playlist.
     * @param {string} playlistName - The name of the selected playlist.
     */
    function handlePlaylistSelection(playlistId, playlistName) {
        if (!currentSong) {
            showTemporaryFeedback("Tidak ada lagu yang sedang diputar untuk ditambahkan.");
            return;
        }
        console.log(`[AddPlaylist] SIMULASI: Adding "${currentSong.name}" to playlist ID: "${playlistId}" (Name: "${playlistName}")`);
        // --- TODO: Implement Backend Logic ---
        // Send { songData: currentSong, playlistId: playlistId } to your backend/storage.
        // Example: fetch('/api/playlists/add-song', { method: 'POST', body: JSON.stringify(...) })
        // ---

        showTemporaryFeedback(`"${currentSong.name}" ditambahkan ke ${playlistName}`);
        selectPlaylistModalInstance?.hide();
    }

    /**
     * Handles the creation of a new playlist from the modal.
     * @param {string} title - The title for the new playlist.
     * @param {string} description - The description for the new playlist.
     * @returns {boolean} True if creation simulation was successful, false otherwise.
     */
    function handleCreateNewPlaylist(title, description) {
        if (!title) {
            showTemporaryFeedback("Judul playlist tidak boleh kosong!");
            return false;
        }

        console.log(`[AddPlaylist] SIMULASI: Creating playlist "${title}" desc: "${description}"`);
        // --- TODO: Implement Backend Logic ---
        // Send { title, description } to backend, get back a new playlist ID.
        // Example: fetch('/api/playlists/create', { method: 'POST', ... }).then(res => res.json()).then(data => { const newPlaylistId = data.id; ... })
        const newPlaylistId = `playlist-${Date.now()}`; // Simulated ID
        // ---

        // Visually add to sidebar
        if (sidebarPlaylistList) {
            const newPlaylistLinkItem = document.createElement('li');
            newPlaylistLinkItem.className = 'list-item-box';
            newPlaylistLinkItem.innerHTML = `
                <a href="#" class="text-decoration-none text-dark d-block playlist-link"
                   data-playlist-id="${newPlaylistId}" data-playlist-name="${title}">
                   <div class="playlist__text">
                        <p class="playlist__name mb-0">${title}</p>
                        <p class="playlist__creator text-muted mb-0">Made By You</p>
                   </div>
                </a>
            `;
            sidebarPlaylistList.appendChild(newPlaylistLinkItem);
            attachPlaylistLinkListeners(); // Re-attach listeners to include the new one
        }

        // Add current song to the newly created playlist (simulation)
        if (currentSong) {
            console.log(`[AddPlaylist] SIMULASI: Adding "${currentSong.name}" to new playlist ID: "${newPlaylistId}"`);
            // --- TODO: Implement Backend Logic ---
            // Send { songData: currentSong, playlistId: newPlaylistId } to backend.
            // ---
        }

        createNewPlaylistModalInstance?.hide();
        showTemporaryFeedback(`Playlist "${title}" dibuat${currentSong ? ' & lagu ditambahkan' : ''}!`);

        // Clear the form
        if (newPlaylistTitleInput) newPlaylistTitleInput.value = '';
        if (newPlaylistDescInput) newPlaylistDescInput.value = '';

        return true;
    }

    // --- End: Modal Management ---


    // --- Start: Event Listener Setup Functions ---

    /** Attaches listeners to audio element events. */
    function setupAudioListeners() {
        if (!audioElement) return;

        audioElement.addEventListener('timeupdate', () => {
            if (!progressBar || !audioElement.duration || !isFinite(audioElement.duration)) return;
            progressBar.value = (audioElement.currentTime / audioElement.duration) * 100;
        });

        audioElement.addEventListener('ended', playNextSong);

        audioElement.addEventListener('volumechange', updateVolumeIcon);

        audioElement.addEventListener('error', (e) => {
            console.error("[AudioEvent] Audio Element Error:", audioElement.error, e);
            showTemporaryFeedback("Gagal memuat lagu, mencoba lagu berikutnya...");
            // Optionally reset or try next song after a short delay
            setTimeout(playNextSong, 1000);
        });

        audioElement.addEventListener('stalled', () => console.warn("[AudioEvent] Audio stalled (network issue?)."));
        audioElement.addEventListener('suspend', () => console.warn("[AudioEvent] Audio suspended (download stopped?)."));
    }

    /** Attaches listeners to player control buttons and sliders. */
    function setupPlayerControlListeners() {
        if (playButton) playButton.addEventListener('click', togglePlayPause);
        if (prevBtn) prevBtn.addEventListener('click', playPreviousSong);
        if (nextBtn) nextBtn.addEventListener('click', playNextSong);

        if (progressBar) {
            progressBar.addEventListener('input', function() { // Seek while dragging
                if (audioElement?.duration && isFinite(audioElement.duration)) {
                    const seekTime = (audioElement.duration * parseFloat(this.value)) / 100;
                    // Don't set currentTime directly on input, wait for 'change' or 'click'
                    // to avoid performance issues on some browsers.
                    // For smoother seeking preview, you might need a more complex approach.
                }
            });
            progressBar.addEventListener('change', function() { // Seek when drag finishes
                 if (audioElement?.duration && isFinite(audioElement.duration)) {
                     const seekTime = (audioElement.duration * parseFloat(this.value)) / 100;
                     console.log(`Progress bar changed, seeking to: ${seekTime}s`);
                     audioElement.currentTime = seekTime;
                 }
            });
             progressBar.addEventListener('click', function(e) { // Seek on click
                 if (audioElement?.duration && isFinite(audioElement.duration)) {
                     const rect = this.getBoundingClientRect();
                     const offsetX = e.clientX - rect.left;
                     const percent = offsetX / this.offsetWidth;
                     const seekTime = audioElement.duration * percent;
                     console.log(`Progress bar clicked, seeking to: ${seekTime}s`);
                     audioElement.currentTime = seekTime;
                     this.value = percent * 100; // Update slider visual immediately
                 }
             });
        }

        if (volumeSlider) {
            volumeSlider.addEventListener('input', function() {
                if (!audioElement) return;
                const newVolume = parseFloat(this.value);
                audioElement.muted = false; // Unmute when slider is moved
                audioElement.volume = newVolume;
                if (newVolume > 0) {
                    lastVolume = newVolume;
                    localStorage.setItem('playerLastVolume', lastVolume.toString());
                }
                // updateVolumeIcon() is called by the 'volumechange' event on audioElement
            });
        }

        if (volumeBtn) {
            volumeBtn.addEventListener('click', () => {
                if (!audioElement) return;
                if (audioElement.muted) {
                    audioElement.muted = false;
                    // Restore last volume, ensure it's not 0
                    audioElement.volume = (lastVolume > 0.01) ? lastVolume : 0.1;
                } else {
                    // Save current volume before muting if it's audible
                    if (audioElement.volume > 0.01) {
                        lastVolume = audioElement.volume;
                        localStorage.setItem('playerLastVolume', lastVolume.toString());
                    }
                    audioElement.muted = true;
                }
                // updateVolumeIcon() is called by the 'volumechange' event
            });
        }

        if (fullscreenBtn) {
            fullscreenBtn.addEventListener('click', () => {
                if (!currentSong) {
                    showTemporaryFeedback("Tidak ada lagu yang sedang diputar.");
                    return;
                }
                if (fullPlayerView?.style.display === 'flex') {
                    showMainContentView(); // Or implement logic to return to the previous view
                } else {
                    showFullPlayer();
                }
            });
        }
    }

    /** Attaches listeners for view navigation (sidebar links, back buttons, etc.). */
    function setupViewNavigationListeners() {
        // Sidebar Links
        if (forYouLink) forYouLink.addEventListener('click', (e) => { e.preventDefault(); showMainContentView(); });
        if (logoImage) logoImage.addEventListener('click', (e) => { e.preventDefault(); showMainContentView(); });
        if (sidebarArtistsLink) sidebarArtistsLink.addEventListener('click', (e) => { e.preventDefault(); showArtistListView(); });
        if (sidebarAlbumsLink) sidebarAlbumsLink.addEventListener('click', (e) => { e.preventDefault(); showAlbumListView(); });
        if (specificLikedMusicLink) specificLikedMusicLink.addEventListener('click', (e) => { e.preventDefault(); showLikedMusicView(); });

        // Header Icons & Dropdowns
        if (notificationIcon) {
            notificationIcon.addEventListener('click', () => {
                const isNotificationVisible = notificationView?.style.display !== 'none';
                if (isNotificationVisible) {
                    showMainContentView();
                } else {
                    showNotificationView();
                }
            });
        }
        if (friendToggleButton && layoutContainer) {
            friendToggleButton.addEventListener('click', () => {
                if (fullPlayerView?.style.display === 'flex') {
                    showTemporaryFeedback("Tutup pemutar layar penuh untuk menampilkan Aktivitas Teman.");
                    return; // Don't toggle if full player is active
                }
                layoutContainer.classList.toggle('friend-activity-hidden');
                const isNowHidden = layoutContainer.classList.contains('friend-activity-hidden');
                localStorage.setItem(friendActivityStorageKey, isNowHidden ? 'hidden' : 'visible');
                console.log(`[FriendActivityToggle] Toggled. New state: ${isNowHidden ? 'hidden' : 'visible'}`);
            });
        }
        if (profileDropdownItem) profileDropdownItem.addEventListener('click', (e) => { e.preventDefault(); showProfileView(); });

        // Back Buttons / Links within views
        if (backToProfileLinkInEdit) backToProfileLinkInEdit.addEventListener('click', (e) => { e.preventDefault(); showProfileView(); });
        if (cancelEditProfileButton) cancelEditProfileButton.addEventListener('click', showProfileView);
        if (backToMainLinkInArtist) backToMainLinkInArtist.addEventListener('click', (e) => { e.preventDefault(); showArtistListView(); }); // Go back to list
        if (backToAlbumListLink) backToAlbumListLink.addEventListener('click', (e) => { e.preventDefault(); showAlbumListView(); });

        // Add Friend Button in Sidebar
        if (addFriendBtnSidebar) addFriendBtnSidebar.addEventListener('click', showAddFriendView);

        // Flow/Jam Buttons
        if (startFlowBtn && friendActivitySection && flowSection) {
            startFlowBtn.addEventListener('click', () => {
                friendActivitySection.style.display = 'none';
                flowSection.style.display = 'block';
            });
        }
        if (leaveJamBtn && friendActivitySection && flowSection) {
            leaveJamBtn.addEventListener('click', () => {
                flowSection.style.display = 'none';
                friendActivitySection.style.display = 'block';
            });
        }
        if (inviteToFlowBtn && rightSidebarDefaultContent && flowParticipantsSidebar) {
            inviteToFlowBtn.addEventListener('click', () => {
                rightSidebarDefaultContent.style.display = 'none';
                flowParticipantsSidebar.style.display = 'flex'; // Or 'block'
                // TODO: Load participants
            });
        }
        if (backToFlowViewBtn && rightSidebarDefaultContent && flowParticipantsSidebar && flowSection) {
            backToFlowViewBtn.addEventListener('click', () => {
                flowParticipantsSidebar.style.display = 'none';
                rightSidebarDefaultContent.style.display = 'block'; // Or 'flex'
                flowSection.style.display = 'block'; // Ensure flow is visible
                if(friendActivitySection) friendActivitySection.style.display = 'none';
            });
        }
    }

    /** Attaches listeners related to modals. */
    function setupModalListeners() {
            // --- Add Playlist Icon Click --- // <-- Tambahkan bagian ini
        if (addPlaylistIcon && createNewPlaylistModalInstance) {
            addPlaylistIcon.addEventListener('click', (event) => {
                event.preventDefault(); // Mencegah perilaku default jika ada
                console.log("Add playlist icon clicked, opening modal.");

                // Opsional: Kosongkan form setiap kali modal dibuka
                if (newPlaylistTitleInput) newPlaylistTitleInput.value = '';
                if (newPlaylistDescInput) newPlaylistDescInput.value = '';

                // Tampilkan modal
                createNewPlaylistModalInstance.show();
            });
        } else {
            // Beri peringatan jika elemen atau instance tidak ditemukan saat inisialisasi
            if (!addPlaylistIcon) console.warn("Element '.add__playlist' not found during setup.");
            if (!createNewPlaylistModalInstance) console.warn("CreateNewPlaylistModalInstance not initialized during setup.");
            console.warn("DEBUG: Failed condition check. addPlaylistIcon:", addPlaylistIcon, "createNewPlaylistModalInstance:", createNewPlaylistModalInstance); // <-- Tambahkan ini

        }
        // --- End Add Playlist Icon Click --- //

        // Edit Playlist Modal
        if (editPlaylistBtn && editPlaylistModalInstance && playlistNameInput && savePlaylistNameBtn) {
            editPlaylistBtn.addEventListener('click', () => {
                if (!currentEditingPlaylistLinkElement) {
                    showTemporaryFeedback("Pilih playlist untuk mengedit.");
                    return;
                }
                const currentName = currentEditingPlaylistLinkElement.getAttribute('data-playlist-name') || playlistDetailTitles[0]?.textContent.trim() || '';
                playlistNameInput.value = currentName;
                editPlaylistModalInstance.show();
            });

            savePlaylistNameBtn.addEventListener('click', () => {
                const newName = playlistNameInput.value.trim();
                if (newName) {
                    // Update UI
                    playlistDetailTitles.forEach(title => { title.textContent = newName; });
                    if (currentEditingPlaylistLinkElement) {
                        currentEditingPlaylistLinkElement.setAttribute('data-playlist-name', newName);
                        const sidebarName = currentEditingPlaylistLinkElement.querySelector('.playlist__name');
                        if (sidebarName) sidebarName.textContent = newName;
                    }
                    // --- TODO: Backend Update ---
                    const playlistId = currentEditingPlaylistLinkElement?.getAttribute('data-playlist-id');
                    console.log(`SIMULASI: Updating playlist ID ${playlistId} to name "${newName}"`);
                    // fetch(`/api/playlists/${playlistId}/rename`, { method: 'POST', body: JSON.stringify({ name: newName }) })
                    // ---
                    editPlaylistModalInstance.hide();
                    showTemporaryFeedback(`Nama playlist diubah menjadi "${newName}".`);
                } else {
                    showTemporaryFeedback("Nama playlist tidak boleh kosong!");
                }
            });

            editPlaylistModalElement?.addEventListener('hidden.bs.modal', () => {
                if (playlistNameInput) playlistNameInput.value = ''; // Clear input on close
            });
        }

        // Add to Playlist Button (Full Player) -> Select Playlist Modal
        if (addToPlaylistBtnFullPlayer && selectPlaylistModalInstance) {
            addToPlaylistBtnFullPlayer.addEventListener('click', () => {
                if (!currentSong) {
                    showTemporaryFeedback("Tidak ada lagu yang sedang diputar.");
                    return;
                }
                populateSelectPlaylistModal();
                selectPlaylistModalInstance.show();
            });
        }

        // Select Playlist Modal -> Create New Playlist Modal
        if (newPlaylistBtnFromModal && selectPlaylistModalInstance && createNewPlaylistModalInstance) {
            newPlaylistBtnFromModal.addEventListener('click', () => {
                selectPlaylistModalInstance.hide();
                // Clear create form before showing
                if (newPlaylistTitleInput) newPlaylistTitleInput.value = '';
                if (newPlaylistDescInput) newPlaylistDescInput.value = '';
                createNewPlaylistModalInstance.show();
            });
        }

        // Create New Playlist Modal -> Save Action
        if (saveNewPlaylistBtn && createNewPlaylistModalInstance) {
            saveNewPlaylistBtn.addEventListener('click', () => {
                const title = newPlaylistTitleInput?.value.trim() || '';
                const description = newPlaylistDescInput?.value.trim() || '';
                handleCreateNewPlaylist(title, description); // This function handles closing the modal on success
            });
        }
    }

    /** Attaches listeners for interactive elements within views (song items, cards, buttons). */
    function setupViewInteractionListeners() {
        // --- Generic Song Item Click Handler ---
        const handleSongItemClick = (event) => {
            // Ignore clicks on interactive elements within the item (like buttons)
            if (event.target.closest('button, a:not(.song-item-link)')) { // Adjust selector as needed
                console.log("[handleSongItemClick] Clicked on inner button/link, ignoring play.");
                return;
            }
            const songItem = event.currentTarget; // Use currentTarget to get the element the listener is attached to
            const songData = extractSongDataFromItem(songItem);
            if (songData) {
                playSong(songData, songItem);
            } else {
                console.error("[handleSongItemClick] Could not extract data from clicked song item:", songItem);
                showTemporaryFeedback("Gagal memutar lagu.");
            }
        };

        // --- Playlist Song Items ---
        window.setupPlaylistSongItemListeners = () => { // Make global for dynamic updates if needed, or call internally
            if (!playlistDetailView) return;
            const items = playlistDetailView.querySelectorAll('.song-list .song-item[data-song-file]');
            console.log(`[PlaylistItems] Attaching listeners to ${items.length} items.`);
            items.forEach(item => {
                item.removeEventListener('click', handleSongItemClick); // Prevent duplicates
                item.addEventListener('click', handleSongItemClick);
                // Add listeners for like buttons etc. here if needed
            });
        };

        // --- Artist Song Items ---
        window.setupArtistSongItemListeners = () => {
            if (!artistSongListContainer) return;
            const items = artistSongListContainer.querySelectorAll('.song-item[data-song-file]');
            console.log(`[ArtistItems] Attaching listeners to ${items.length} items.`);
            items.forEach(item => {
                item.removeEventListener('click', handleSongItemClick);
                item.addEventListener('click', handleSongItemClick);
            });
        };

        // --- Album Song Items ---
        window.setupAlbumSongItemListeners = () => {
            if (!albumSongListContainer) return;
            const items = albumSongListContainer.querySelectorAll('.song-item[data-song-file]');
            console.log(`[AlbumItems] Attaching listeners to ${items.length} items.`);
            items.forEach(item => {
                item.removeEventListener('click', handleSongItemClick);
                item.addEventListener('click', handleSongItemClick);
            });
        };

         // --- Liked Song Items ---
         window.setupLikedSongItemListeners = () => {
             if (!likedSongsContainer) return;
             const items = likedSongsContainer.querySelectorAll('.song-item[data-song-file]');
             console.log(`[LikedItems] Attaching listeners to ${items.length} items.`);
             items.forEach(item => {
                 item.removeEventListener('click', handleSongItemClick); // Remove previous listener
                 item.addEventListener('click', handleSongItemClick); // Add current listener

                 // Example: Like button within the item
                 const likeBtn = item.querySelector('.like-btn'); // Assuming a .like-btn class
                 if (likeBtn) {
                     likeBtn.removeEventListener('click', handleLikeButtonClick); // Prevent duplicates
                     likeBtn.addEventListener('click', handleLikeButtonClick);
                 }
             });
         };

         const handleLikeButtonClick = (event) => {
             event.stopPropagation(); // Prevent song playing when like is clicked
             const button = event.currentTarget;
             const songItem = button.closest('.song-item');
             const songData = extractSongDataFromItem(songItem);
             button.classList.toggle('active'); // Toggle visual state
             const isLiked = button.classList.contains('active');
             console.log(`[LikeToggle] Song "${songData?.name}" Liked: ${isLiked}`);
             // --- TODO: Backend Update ---
             // Send request to backend to update like status for songData.file or ID
             // fetch(`/api/songs/like`, { method: 'POST', body: JSON.stringify({ songId: songData.id, liked: isLiked }) });
             // ---
             // If in Liked Songs view and unliked, you might want to remove the item visually
             if (!isLiked && likedMusicView?.style.display === 'block') {
                 // Optional: Add animation before removing
                 songItem?.remove();
                 // Update count
                 const songCount = likedSongsContainer?.querySelectorAll('.song-item').length || 0;
                 if (likedSongCountElement) likedSongCountElement.textContent = songCount;
             }
         };


        // --- Media Cards (Home, Artist List, Album List) ---
        // Use event delegation on parent containers for dynamically loaded content
        const handleMediaCardClick = (event) => {
            const card = event.target.closest('.media-card');
            if (!card) return; // Click wasn't on or inside a media card

            // Check if it's a song card (playable)
            if (card.hasAttribute('data-file')) {
                // Check if the click was on the play overlay or the card itself (not other links/buttons inside)
                const playOverlay = card.querySelector('.play-overlay');
                const isPlayAction = event.target === card || playOverlay?.contains(event.target);

                if (isPlayAction) {
                    const songData = extractSongDataFromCard(card);
                    if (songData) {
                        playSong(songData, card);
                    } else {
                        console.error("[MediaCardClick] Could not extract song data from card:", card);
                        showTemporaryFeedback("Gagal memutar lagu.");
                    }
                } else {
                     console.log("[MediaCardClick] Clicked inside song card, but not on play trigger.");
                }
            }
            // Check if it's an artist card
            else if (card.hasAttribute('data-artist-id')) {
                const artistData = {
                    id: card.getAttribute('data-artist-id'),
                    name: card.getAttribute('data-artist-name') || card.querySelector('.media-title')?.textContent.trim(),
                    photo: card.getAttribute('data-artist-photo') || card.querySelector('.media-img img')?.src,
                };
                if (artistData.id) {
                    showArtistDetailView(artistData);
                } else {
                     console.warn("[MediaCardClick] Artist card missing data-artist-id:", card);
                }
            }
            // Check if it's an album card
            else if (card.hasAttribute('data-album-id')) {
                const albumData = {
                    id: card.getAttribute('data-album-id'),
                    name: card.getAttribute('data-album-name') || card.querySelector('.media-title')?.textContent.trim(),
                    cover: card.getAttribute('data-album-cover') || card.querySelector('.media-img img')?.src,
                    artist: card.getAttribute('data-album-artist') || card.querySelector('.media-subtitle')?.textContent.trim(),
                    year: card.getAttribute('data-album-year'),
                    // songCount: card.getAttribute('data-album-song-count') // Get count if available
                };
                 if (albumData.id) {
                     showAlbumDetailView(albumData);
                 } else {
                      console.warn("[MediaCardClick] Album card missing data-album-id:", card);
                 }
            }
        };

        // Attach delegated listeners
        mainScroll?.addEventListener('click', handleMediaCardClick); // For home sections
        artistListView?.addEventListener('click', handleMediaCardClick); // For artist list
        albumListView?.addEventListener('click', handleMediaCardClick); // For album list


        // --- Playlist Links in Sidebar ---
        window.attachPlaylistLinkListeners = () => {
            playlistLinks = document.querySelectorAll('.playlist-link'); // Update nodelist
            console.log(`[PlaylistLinks] Attaching listeners to ${playlistLinks.length} links.`);
            playlistLinks.forEach(link => {
                link.removeEventListener('click', handlePlaylistLinkClick); // Prevent duplicates
                link.addEventListener('click', handlePlaylistLinkClick);
            });
        };
        const handlePlaylistLinkClick = (event) => {
            event.preventDefault();
            const link = event.currentTarget;
            const playlistName = link.getAttribute('data-playlist-name') || link.textContent.trim();
            showPlaylistDetailView(playlistName, link);
        };

        // --- Full Player 'Up Next' Item Clicks ---
        window.setupFullPlayerUpNextListeners = () => {
            if (!fullPlayerUpNextList) return;
            fullPlayerUpNextList.querySelectorAll('.song-item-simple:not(.now-playing)').forEach(item => {
                item.removeEventListener('click', handleUpNextClick); // Prevent duplicates
                item.addEventListener('click', handleUpNextClick);
            });
        };
        const handleUpNextClick = (event) => {
            const item = event.currentTarget;
            const songData = extractSongDataFromItem(item);
            if (songData) {
                playSong(songData, item);
            } else {
                console.error("[UpNextClick] Missing data on clicked item:", item);
                showTemporaryFeedback("Gagal memutar lagu dari antrian.");
            }
        };

        // --- Profile Edit Icon ---
        if (editProfileIcon) editProfileIcon.addEventListener('click', (e) => { e.preventDefault(); showEditProfileView(); });

        // --- Profile Save Button ---
        if (saveProfileButton) {
            saveProfileButton.addEventListener('click', (e) => {
                e.preventDefault(); // Prevent default form submission
                const editedUsername = editUsernameInput?.value.trim();
                const editedEmail = editEmailInput?.value.trim();
                // Password handling needs careful consideration (hashing, security)
                // const editedPassword = editPasswordInput?.value;

                console.log("SIMULASI: Saving profile data:", { username: editedUsername, email: editedEmail });
                // --- TODO: Backend Update ---
                // Send data to backend API
                // fetch('/api/profile/update', { method: 'POST', body: JSON.stringify(...) })
                // ---
                showTemporaryFeedback("SIMULASI: Perubahan profile disimpan.");
                showProfileView(); // Go back to profile view
            });
        }

        // --- Artist/Album/Liked Music Play Buttons ---
        if (artistPlayButton) {
            artistPlayButton.addEventListener('click', () => {
                const firstSong = artistSongListContainer?.querySelector('.song-item[data-song-file]');
                if (firstSong) {
                    const songData = extractSongDataFromItem(firstSong);
                    if (songData) playSong(songData, firstSong);
                    else showTemporaryFeedback("Gagal memuat lagu pertama artis.");
                } else {
                    showTemporaryFeedback("Tidak ada lagu untuk artis ini.");
                }
            });
        }
        if (albumPlayButton) {
            albumPlayButton.addEventListener('click', () => {
                const firstSong = albumSongListContainer?.querySelector('.song-item[data-song-file]');
                if (firstSong) {
                    const songData = extractSongDataFromItem(firstSong);
                    if (songData) playSong(songData, firstSong);
                    else showTemporaryFeedback("Gagal memuat lagu pertama album.");
                } else {
                    showTemporaryFeedback("Tidak ada lagu di album ini.");
                }
            });
        }
        if (playLikedMusicBtn) {
            playLikedMusicBtn.addEventListener('click', () => {
                const firstSong = likedSongsContainer?.querySelector('.song-item[data-song-file]');
                if (firstSong) {
                    const songData = extractSongDataFromItem(firstSong);
                    if (songData) playSong(songData, firstSong);
                    else showTemporaryFeedback("Gagal memuat lagu pertama.");
                } else {
                    showTemporaryFeedback("Tidak ada lagu yang disukai.");
                }
            });
        }

        // --- Dropdown Fix (Keep original logic if it works) ---
        document.querySelectorAll('.dropdown').forEach(dropdown => {
            const menu = dropdown.querySelector('.dropdown-menu');
            const toggle = dropdown.querySelector('[data-bs-toggle="dropdown"]');
            if (!menu || !toggle) return;

            let originalRect = null;
            toggle.addEventListener('show.bs.dropdown', () => {
                // Store original position *before* Bootstrap modifies it for display
                // Need to make it visible briefly without transition to measure
                menu.style.transition = 'none';
                menu.style.display = 'block'; // Or visibility: visible; opacity: 0;
                menu.style.opacity = '0'; // Keep invisible
                originalRect = menu.getBoundingClientRect();
                menu.style.display = ''; // Let Bootstrap handle display
                menu.style.opacity = '';
                menu.style.transition = ''; // Restore transition
            });

            toggle.addEventListener('shown.bs.dropdown', () => {
                if (!originalRect) return;
                const currentRect = menu.getBoundingClientRect();
                const diffY = originalRect.top - currentRect.top;
                const diffX = originalRect.left - currentRect.left;

                // Apply transform to keep it visually in place before animating
                menu.style.transform = `translate(${diffX}px, ${diffY}px) scaleY(0)`;
                menu.style.opacity = '0';
                menu.style.transformOrigin = 'top center'; // Or adjust as needed

                // Force reflow before animation
                void menu.offsetWidth;

                // Animate in
                menu.style.transition = 'transform 0.2s ease-out, opacity 0.2s ease-out'; // Adjust timing/easing
                menu.style.transform = `translate(0, 0) scaleY(1)`;
                menu.style.opacity = '1';
            });

             toggle.addEventListener('hide.bs.dropdown', (event) => {
                 // Optional: Animate out - Bootstrap might handle this okay
                 // event.preventDefault(); // Stop immediate hide if animating out manually
                 // menu.style.transform = `translate(0, -10px) scaleY(1)`; // Example out animation
                 // menu.style.opacity = '0';
                 // setTimeout(() => menu.classList.remove('show'), 200); // Hide after animation
             });
             menu.addEventListener('transitionend', () => {
                 // Clean up inline styles after transitions if needed
                 if (!menu.classList.contains('show')) {
                     menu.style.transform = '';
                     menu.style.opacity = '';
                     menu.style.transition = '';
                     menu.style.transformOrigin = '';
                 }
             });
        });

    }

    // --- End: Event Listener Setup Functions ---

    /** Handles clicks on friend items in the activity sidebar to show invite popover. */
function setupFriendActivityListeners() {
    const friendActivitySection = document.getElementById('friendActivitySection');
    if (!friendActivitySection) {
        console.warn("Friend activity section not found.");
        return;
    }

    // Gunakan event delegation untuk efisiensi
    friendActivitySection.addEventListener('click', (event) => {
        const friendBox = event.target.closest('.friends__box'); // Cari elemen .friends__box terdekat

        if (friendBox) {
            event.stopPropagation(); // Hentikan event agar tidak memicu listener lain (misal penutup popover)

            const friendNameElement = friendBox.querySelector('.friends__name');
            const friendName = friendNameElement ? friendNameElement.textContent.trim() : 'Friend'; // Ambil nama teman

            // --- Tutup popover lain yang mungkin terbuka ---
            if (activeFriendPopover && activeFriendPopover._element !== friendBox) {
                activeFriendPopover.dispose(); // Hancurkan instance popover lama
                activeFriendPopover = null;
            }
            // Jika mengklik teman yang sama lagi, tutup popovernya
            if (activeFriendPopover && activeFriendPopover._element === friendBox) {
                activeFriendPopover.dispose();
                activeFriendPopover = null;
                return; // Hentikan eksekusi lebih lanjut
            }
            // --- End: Tutup popover lain ---

            // Konten HTML untuk popover
            const popoverContentHTML = `
                <button class="btn btn-sm btn-primary invite-to-flow-btn" data-friend-name="${friendName}">
                    Invite ${friendName} to Flow
                </button>
            `;

            // Buat instance Popover baru
            const popover = new bootstrap.Popover(friendBox, {
                content: popoverContentHTML,
                html: true,        // Izinkan HTML dalam konten
                placement: 'left', // Posisi popover (bisa 'top', 'bottom', 'right')
                trigger: 'manual', // Kita akan menampilkannya secara manual
                sanitize: false    // Izinkan tombol (hati-hati jika konten dinamis dari user)
            });

            // Tampilkan popover
            popover.show();
            activeFriendPopover = popover; // Simpan referensi popover yang aktif

            // Tambahkan listener untuk tombol invite di dalam popover (delegasi)
            // Kita tambahkan ini sekali saja di luar loop/listener ini (lihat langkah 3)

        } else {
            // Jika klik di luar friendBox tapi di dalam friendActivitySection, tutup popover aktif
            if (activeFriendPopover && !event.target.closest('.popover')) {
                 activeFriendPopover.dispose();
                 activeFriendPopover = null;
            }
        }
    });

    // Tambahkan listener untuk menutup popover jika diklik di luar area popover/teman
    document.addEventListener('click', (event) => {
        if (activeFriendPopover) {
            const popoverElement = document.querySelector('.popover'); // Cari elemen popover yang sedang tampil
            // Cek apakah klik terjadi di luar elemen teman DAN di luar popover itu sendiri
            if (!activeFriendPopover._element.contains(event.target) && (!popoverElement || !popoverElement.contains(event.target))) {
                activeFriendPopover.dispose();
                activeFriendPopover = null;
            }
        }
    });

    // Listener untuk tombol "Invite to Flow" (gunakan event delegation)
    document.body.addEventListener('click', (event) => {
        if (event.target.classList.contains('invite-to-flow-btn')) {
            const friendName = event.target.dataset.friendName;
            console.log(`Invite button clicked for: ${friendName}`);
            // TODO: Tambahkan logika untuk mengundang teman ke Flow di sini
            alert(`Mengundang ${friendName} ke Flow... (Implementasi belum ada)`);

            // Tutup popover setelah diklik
            if (activeFriendPopover) {
                activeFriendPopover.dispose();
                activeFriendPopover = null;
            }
        }
    });

    console.log("Friend activity listeners set up.");
}


    // --- Start: Initialization ---

    function initializeApp() {
        console.log("Initializing application...");

        // Initial UI State
        resetPlayerToDefault();
        if (progressBar) progressBar.value = 0;

        // Load saved volume
        const savedVolume = localStorage.getItem('playerLastVolume');
        if (savedVolume !== null && audioElement) {
            lastVolume = parseFloat(savedVolume);
            audioElement.volume = lastVolume;
        } else if (audioElement) {
            audioElement.volume = lastVolume; // Use default
        }
        updateVolumeIcon(); // Update icon based on loaded/default volume

        // Initialize Modals
        initializeModals();

        // Apply Persisted State
        applyFriendActivityState();
        setupFriendActivityListeners(); // <-- Panggil fungsi baru di sini

        // Setup Event Listeners
        setupAudioListeners();
        setupPlayerControlListeners();
        setupViewNavigationListeners();
        setupModalListeners();
        setupViewInteractionListeners(); // Sets up song item clicks, card clicks etc.

        // Attach initial listeners for dynamic elements
        attachPlaylistLinkListeners(); // For existing playlists
        // Call setup functions for initially visible song lists (if any)
        // e.g., if liked music is shown by default: setupLikedSongItemListeners();

        // Show Initial View
        showMainContentView();

        console.log("Initialization complete.");
    }

    initializeApp(); // Run the initialization

    // --- End: Initialization ---

}); // End of DOMContentLoaded
