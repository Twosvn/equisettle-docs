import React from 'react';
import styles from './styles.module.css';

interface DiagramEmbedProps {
  src: string;
  title: string;
  description?: string;
  height?: string;
  width?: string;
}

const DiagramEmbed: React.FC<DiagramEmbedProps> = ({
  src,
  title,
  description,
  height = '600px',
  width = '100%'
}) => {
  return (
    <div className={styles.diagramContainer}>
      <div className={styles.diagramHeader}>
        <h3>{title}</h3>
        {description && <p>{description}</p>}
      </div>

      <div className={styles.diagramFrame}>
        <iframe
          src={src}
          width={width}
          height={height}
          frameBorder="0"
          allowFullScreen
          title={title}
          className={styles.diagram}
        />
      </div>

      <div className={styles.diagramFooter}>
        <small>
          💡 Tip: Click and drag to navigate, use scroll wheel to zoom
        </small>
      </div>
    </div>
  );
};

export default DiagramEmbed;