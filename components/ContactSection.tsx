import { MessageSquare, Mail, Instagram, Facebook, MapPin, Clock, Phone } from 'lucide-react'

export default function ContactSection() {
  return (
    <section id="contact" className="py-16 bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Get in touch with us!
          </h2>
          <p className="text-lg text-gray-300 max-w-2xl mx-auto">
            Ready to start your martial arts journey? Contact us today to learn more about our classes 
            and schedule your first session.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-12">
          {/* Contact Information */}
          <div className="space-y-8">
            <div className="flex items-start space-x-4">
              <MessageSquare className="w-6 h-6 text-accent-500 mt-1 flex-shrink-0" />
              <div>
                <h3 className="text-lg font-semibold mb-2">WhatsApp</h3>
                <a href="#" className="text-accent-500 hover:text-accent-400 transition-colors">
                  +1 (555) 123-4567
                </a>
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <Mail className="w-6 h-6 text-accent-500 mt-1 flex-shrink-0" />
              <div>
                <h3 className="text-lg font-semibold mb-2">Email</h3>
                <a href="mailto:info@martialarts.com" className="text-accent-500 hover:text-accent-400 transition-colors">
                  info@martialarts.com
                </a>
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <Instagram className="w-6 h-6 text-accent-500 mt-1 flex-shrink-0" />
              <div>
                <h3 className="text-lg font-semibold mb-2">Instagram</h3>
                <a href="https://www.instagram.com/akiraxtaekwondo/" className="text-accent-500 hover:text-accent-400 transition-colors">
                  @akiraxtaekwondo
                </a>
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <svg className="w-6 h-6 text-accent-500 mt-1 flex-shrink-0" viewBox="0 0 24 24" fill="currentColor">
                <path d="M19.589 6.686a4.793 4.793 0 0 1-3.77-4.245V2h-3.445v13.672a2.896 2.896 0 0 1-2.909 2.909 2.896 2.896 0 0 1-2.909-2.909 2.896 2.896 0 0 1 2.909-2.909c.183 0 .363.018.534.052V9.325a6.47 6.47 0 0 0-.534-.027C6.27 9.298 3.636 11.931 3.636 15.126c0 3.204 2.634 5.837 5.837 5.837 3.204 0 5.837-2.633 5.837-5.837V8.154a7.27 7.27 0 0 0 4.28 1.72v-3.188z"/>
              </svg>
              <div>
                <h3 className="text-lg font-semibold mb-2">TikTok</h3>
                <a href="https://www.tiktok.com/@akirax_taekwondo" className="text-accent-500 hover:text-accent-400 transition-colors">
                  @akirax_taekwondo
                </a>
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <MapPin className="w-6 h-6 text-accent-500 mt-1 flex-shrink-0" />
              <div>
                <h3 className="text-lg font-semibold mb-2">Location</h3>
                <p className="text-gray-300">
                  123 Main Street<br />
                  Your City, State 12345
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <Clock className="w-6 h-6 text-accent-500 mt-1 flex-shrink-0" />
              <div>
                <h3 className="text-lg font-semibold mb-2">Operating Hours</h3>
                <div className="text-gray-300 space-y-1">
                  <p>Monday - Friday: 3:00 PM - 9:00 PM</p>
                  <p>Saturday: 9:00 AM - 6:00 PM</p>
                  <p>Sunday: 9:00 AM - 4:00 PM</p>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="bg-gray-800 p-8 rounded-lg">
            <h3 className="text-2xl font-bold mb-6">Send us a message</h3>
            <form className="space-y-6">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-2">
                  Name (Required)
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  required
                  className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-white"
                  placeholder="Your full name"
                />
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">
                  Email (Required)
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  required
                  className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-white"
                  placeholder="your@email.com"
                />
              </div>

              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-gray-300 mb-2">
                  Phone Number
                </label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-white"
                  placeholder="+65 9XXX XXXX"
                />
              </div>

              <div>
                <label htmlFor="class" className="block text-sm font-medium text-gray-300 mb-2">
                  Interested Class
                </label>
                <select
                  id="class"
                  name="class"
                  className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-white"
                >
                  <option value="">Select a class</option>
                  <option value="beginners">Beginners (3-5 years)</option>
                  <option value="youth">Youth (6-12 years)</option>
                  <option value="adult">Adult Programs</option>
                  <option value="intensive">Intensive Training</option>
                  <option value="competition">Competition Team</option>
                </select>
              </div>

              <div>
                <label htmlFor="message" className="block text-sm font-medium text-gray-300 mb-2">
                  Message
                </label>
                <textarea
                  id="message"
                  name="message"
                  rows={4}
                  className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-white"
                  placeholder="Tell us about your goals and any questions you have..."
                ></textarea>
              </div>

              <button
                type="submit"
                className="w-full bg-primary-600 hover:bg-primary-700 text-white py-3 px-6 rounded-lg font-semibold transition-colors"
              >
                Send Message
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  )
}
