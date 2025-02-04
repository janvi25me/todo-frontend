const Footer = () => {
  return (
    <footer className="bg-gray-800 text-white py-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Links Section */}
          <div>
            <h3 className="text-lg font-bold mb-4">Quick Links</h3>
            <ul>
              <li>
                <a href="/" className="hover:text-orange-500">
                  Home
                </a>
              </li>
              <li>
                <a href="/product" className="hover:text-orange-500">
                  Shop
                </a>
              </li>
              <li>
                <a href="/about" className="hover:text-orange-500">
                  About
                </a>
              </li>
              <li>
                <a href="/contact" className="hover:text-orange-500">
                  Contact
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-bold mb-4">Contact Us</h3>
            <p>123 Store Street, Cityville, USA</p>
            <p>Email: support@mystore.com</p>
            <p>Phone: (123) 456-7890</p>
          </div>

          <div>
            <h3 className="text-lg font-bold mb-4">Follow Us</h3>
            <div className="flex space-x-4">
              <a href="#" className="hover:text-orange-500">
                <i className="fab fa-facebook"></i>
              </a>
              <a href="#" className="hover:text-orange-500">
                <i className="fab fa-twitter"></i>
              </a>
              <a href="#" className="hover:text-orange-500">
                <i className="fab fa-instagram"></i>
              </a>
              <a href="#" className="hover:text-orange-500">
                <i className="fab fa-linkedin"></i>
              </a>
            </div>
          </div>
        </div>

        <div className="mt-8 text-center">
          <p>&copy; {new Date().getFullYear()} myStore. All Rights Reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
