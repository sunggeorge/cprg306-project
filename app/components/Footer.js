const Footer = () => {
  const getCurrentYear = () => {
    return new Date().getFullYear();
  };

  return (
    <footer className="bg-gray-800 py-4 mt-8">
      <div className="container mx-auto text-center text-white">
        &copy; {getCurrentYear()} SAIT Recipes Platform. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
