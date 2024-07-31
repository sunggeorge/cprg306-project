import styles from './Footer.module.css';

const Footer = () => {
  const getCurrentYear = () => {
    return new Date().getFullYear();
  };

  return (
    <footer className={styles.footer}>
      <div className="container">
        &copy; {getCurrentYear()} SAIT Recipes Platform. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
