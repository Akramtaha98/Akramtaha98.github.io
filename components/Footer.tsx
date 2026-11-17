import { contact, links, site } from '@/content/site';
import styles from './Footer.module.css';

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={`${styles.inner} page`}>
        <div>
          <p className={styles.prompt}>Want to work on grounded, multilingual AI together?</p>
          <a href={links.email} className={styles.email}>
            {site.email}
          </a>
        </div>
        <ul className={styles.links}>
          {contact.profiles.map((p) => (
            <li key={p.label}>
              <a href={p.href} target="_blank" rel="noopener noreferrer">
                {p.label}
              </a>
            </li>
          ))}
        </ul>
      </div>
      <div className={`${styles.base} page`}>
        <p>
          © {new Date().getFullYear()} {site.name}
        </p>
        <p>Every answer on this site cites its source.</p>
      </div>
    </footer>
  );
}
