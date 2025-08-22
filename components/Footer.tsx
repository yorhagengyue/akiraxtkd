import { Heart } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="bg-gray-800 text-white py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
          <div className="flex items-center space-x-2">
            <span>Proudly powered by</span>
            <span className="font-semibold">React & Next.js</span>
          </div>
          
          <div className="flex items-center space-x-2 text-gray-400">
            <span>Made with</span>
            <Heart className="w-4 h-4 text-red-500" />
            <span>for martial arts excellence</span>
          </div>
          
          <div className="text-gray-400 text-sm">
            © 2024 Akira X Taekwondo. All rights reserved.
          </div>
        </div>
        
        <div className="mt-8 pt-8 border-t border-gray-700">
          <div className="grid md:grid-cols-4 gap-8 text-sm">
            <div>
              <h4 className="font-semibold mb-3">Quick Links</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#welcome" className="hover:text-white transition-colors">Welcome</a></li>
                <li><a href="#about" className="hover:text-white transition-colors">About</a></li>
                <li><a href="#classes" className="hover:text-white transition-colors">Classes</a></li>
                <li><a href="#contact" className="hover:text-white transition-colors">Contact</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-3">Programs</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">Beginners</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Youth Classes</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Adult Programs</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Competition Team</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-3">About Us</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">Our Team</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Locations</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Awards</a></li>
                <li><a href="#" className="hover:text-white transition-colors">News</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-3">Connect</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="https://wa.me/6587668794" className="hover:text-white transition-colors">WhatsApp</a></li>
                <li><a href="mailto:teamakiraxtaekwondo@gmail.com" className="hover:text-white transition-colors">Email</a></li>
                <li><a href="https://www.instagram.com/akiraxtaekwondo/" className="hover:text-white transition-colors">Instagram</a></li>
                <li><a href="https://www.tiktok.com/@akirax_taekwondo" className="hover:text-white transition-colors">TikTok</a></li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
