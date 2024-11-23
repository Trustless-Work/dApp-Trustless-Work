import Link from "next/link";

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-gray-300 py-8 px-4">
      <div className="container mx-auto flex flex-wrap justify-between items-start gap-8">
        {/* Logo */}
        <div className="flex items-center">
          <img src="/logo.png" alt="Logo" className="h-10" />
        </div>

        {/* Contact Info */}
        <div>
          <h4 className="font-semibold text-lg mb-2">Contact</h4>
          <p>
            Email:{" "}
            <a
              href="mailto:example@example.com"
              className="text-blue-600 hover:underline dark:text-blue-400"
            >
              example@example.com
            </a>
          </p>
          <p>
            Website:{" "}
            <Link
              href="https://example.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline dark:text-blue-400"
            >
              example.com
            </Link>
          </p>
        </div>

        {/* Team Members */}
        <div>
          <h4 className="font-semibold text-lg mb-2">Team Members</h4>
          <ul>
            <li>Joel Vargas</li>
            <li>Armando Cortés</li>
            <li>Caleb Loría</li>
            <li>Alberto Chaves</li>
          </ul>
        </div>

        {/* Social Links */}
        <div>
          <h4 className="font-semibold text-lg mb-2">Social</h4>
          <div className="flex space-x-4">
            <a
              href="[LinkedIn URL]"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline dark:text-blue-400"
            >
              LinkedIn
            </a>
            <a
              href="[Twitter URL]"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline dark:text-blue-400"
            >
              X
            </a>
          </div>
        </div>
      </div>

      {/* Footer Bottom */}
      <div className="mt-8 text-center border-t border-gray-300 dark:border-gray-700 pt-4">
        <p>© {currentYear} All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
