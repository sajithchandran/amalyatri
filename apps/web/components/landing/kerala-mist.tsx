import styles from './kerala-mist.module.css';

/**
 * <KeralaMist /> — a CSS-only evocative scene used as the hero panel
 * placeholder. Drop in real licensed photography by replacing this
 * component with a Next/Image.
 */
export function KeralaMist() {
  return (
    <div className={styles.scene} aria-hidden>
      <div className={styles.sun} />
      <div className={styles.treeRow}>
        <div className={styles.canopy} />
      </div>
      <div className={styles.water} />
      <div className={styles.caption}>
        <span className={styles.captionTag}>Amal Tamara · Kerala</span>
        <strong className={styles.captionTitle}>The stillness before the day begins</strong>
      </div>
    </div>
  );
}
