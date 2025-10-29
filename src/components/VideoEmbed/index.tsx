import React, { useState } from 'react';
import styles from './styles.module.css';

interface VideoEmbedProps {
  src: string;
  title: string;
  description?: string;
  type?: 'youtube' | 'vimeo' | 'local' | 'loom';
  thumbnail?: string;
  duration?: string;
  height?: string;
  width?: string;
  autoplay?: boolean;
  showControls?: boolean;
}

const VideoEmbed: React.FC<VideoEmbedProps> = ({
  src,
  title,
  description,
  type = 'youtube',
  thumbnail,
  duration,
  height = '400px',
  width = '100%',
  autoplay = false,
  showControls = true
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);

  const getEmbedUrl = (src: string, type: string) => {
    switch (type) {
      case 'youtube':
        const youtubeId = extractYouTubeId(src);
        return `https://www.youtube.com/embed/${youtubeId}?rel=0&modestbranding=1${autoplay ? '&autoplay=1' : ''}${!showControls ? '&controls=0' : ''}`;

      case 'vimeo':
        const vimeoId = extractVimeoId(src);
        return `https://player.vimeo.com/video/${vimeoId}?title=0&byline=0&portrait=0${autoplay ? '&autoplay=1' : ''}`;

      case 'loom':
        const loomId = extractLoomId(src);
        return `https://www.loom.com/embed/${loomId}`;

      case 'local':
      default:
        return src;
    }
  };

  const extractYouTubeId = (url: string): string => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : url;
  };

  const extractVimeoId = (url: string): string => {
    const regExp = /(?:vimeo)\.com.*(?:videos|video|channels|)\/([\d]+)/i;
    const match = url.match(regExp);
    return match ? match[1] : url;
  };

  const extractLoomId = (url: string): string => {
    const regExp = /loom\.com\/share\/([a-zA-Z0-9]+)/;
    const match = url.match(regExp);
    return match ? match[1] : url;
  };

  const getThumbnailUrl = (src: string, type: string, customThumbnail?: string): string => {
    if (customThumbnail) return customThumbnail;

    switch (type) {
      case 'youtube':
        const youtubeId = extractYouTubeId(src);
        return `https://img.youtube.com/vi/${youtubeId}/maxresdefault.jpg`;

      case 'vimeo':
        // Vimeo thumbnails require API call, so return placeholder
        return '/img/video-placeholder.jpg';

      default:
        return '/img/video-placeholder.jpg';
    }
  };

  const handleLoad = () => {
    setIsLoaded(true);
  };

  const handleError = () => {
    setHasError(true);
  };

  const embedUrl = getEmbedUrl(src, type);
  const thumbnailUrl = getThumbnailUrl(src, type, thumbnail);

  if (type === 'local') {
    return (
      <div className={styles.videoContainer}>
        <div className={styles.videoHeader}>
          <h3>{title}</h3>
          {description && <p>{description}</p>}
          {duration && <span className={styles.duration}>Duration: {duration}</span>}
        </div>

        <div className={styles.videoWrapper} style={{ height }}>
          <video
            width={width}
            height={height}
            controls={showControls}
            autoPlay={autoplay}
            className={styles.video}
            onLoadedData={handleLoad}
            onError={handleError}
          >
            <source src={src} type="video/mp4" />
            <source src={src.replace('.mp4', '.webm')} type="video/webm" />
            Your browser does not support the video tag.
          </video>

          {hasError && (
            <div className={styles.errorMessage}>
              <p>Video could not be loaded. Please check the file format or try refreshing the page.</p>
            </div>
          )}
        </div>

        <div className={styles.videoFooter}>
          <small>💡 Tip: Use spacebar to play/pause, arrow keys to seek</small>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.videoContainer}>
      <div className={styles.videoHeader}>
        <h3>{title}</h3>
        {description && <p>{description}</p>}
        <div className={styles.videoMeta}>
          {duration && <span className={styles.duration}>⏱️ {duration}</span>}
          {type && <span className={styles.platform}>{type.toUpperCase()}</span>}
        </div>
      </div>

      <div className={styles.videoWrapper} style={{ height }}>
        <iframe
          src={embedUrl}
          title={title}
          width={width}
          height={height}
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          className={styles.video}
          onLoad={handleLoad}
          onError={handleError}
        />

        {!isLoaded && (
          <div className={styles.loadingOverlay}>
            <div className={styles.loadingSpinner}></div>
            <p>Loading video...</p>
          </div>
        )}

        {hasError && (
          <div className={styles.errorMessage}>
            <p>Video could not be loaded. Please check the URL or try refreshing the page.</p>
          </div>
        )}
      </div>

      <div className={styles.videoFooter}>
        <small>
          🎥 {type === 'youtube' && 'Watch on YouTube'}
          {type === 'vimeo' && 'Watch on Vimeo'}
          {type === 'loom' && 'Watch on Loom'}
          {' • Full screen available'}
        </small>
      </div>
    </div>
  );
};

export default VideoEmbed;