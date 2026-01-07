'use client';

import { useState } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { FiPhone, FiMail, FiMapPin, FiClock, FiSend } from 'react-icons/fi';

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate form submission
    await new Promise((resolve) => setTimeout(resolve, 1500));

    alert('Thank you for contacting us! We will get back to you soon.');
    setFormData({
      name: '',
      email: '',
      phone: '',
      subject: '',
      message: '',
    });
    setIsSubmitting(false);
  };

  const contactInfo = [
    {
      icon: FiPhone,
      title: 'Phone',
      details: [`+${process.env.NEXT_PUBLIC_PHONE || '250788308043'}`],
      link: `tel:+${process.env.NEXT_PUBLIC_PHONE || '250788308043'}`,
    },
    {
      icon: FiMail,
      title: 'Email',
      details: [process.env.NEXT_PUBLIC_EMAIL || 'info@macssrealestaterw.com'],
      link: `mailto:${process.env.NEXT_PUBLIC_EMAIL || 'info@macssrealestaterw.com'}`,
    },
    {
      icon: FiMapPin,
      title: 'Office Address',
      details: ['Kigali, Rwanda', 'Gasabo District'],
      link: null,
    },
    {
      icon: FiClock,
      title: 'Working Hours',
      details: ['Mon - Fri: 8:00 AM - 6:00 PM', 'Sat: 9:00 AM - 3:00 PM'],
      link: null,
    },
  ];

  return (
    <>
      <Header />
      <main className="min-h-screen bg-gray-50">
        {/* Hero Section */}
        <section className="bg-gradient-to-br from-primary-600 to-primary-700 py-16 lg:py-24">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center text-white">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4">
                Get in Touch
              </h1>
              <p className="text-lg md:text-xl text-white/90 max-w-3xl mx-auto">
                Have a question or ready to find your dream property? We're here to help you every step of the way.
              </p>
            </div>
          </div>
        </section>

        {/* Contact Info Cards */}
        <section className="pb-8 -mt-8">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {contactInfo.map((info, index) => (
                <div
                  key={index}
                  className="bg-white rounded-xl border-2 border-gray-200 p-4 hover:border-primary-400 transition-all"
                >
                  <div className="flex items-start gap-3">
                    <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <info.icon className="w-6 h-6 text-primary-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-sm font-bold text-gray-900 mb-1">{info.title}</h3>
                      <div className="space-y-0.5">
                        {info.details.map((detail, idx) => (
                          <p key={idx} className="text-xs text-gray-600 break-words">
                            {info.link && idx === 0 ? (
                              <a
                                href={info.link}
                                className="text-primary-600 hover:text-primary-700 font-medium"
                              >
                                {detail}
                              </a>
                            ) : (
                              detail
                            )}
                          </p>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Contact Form & Map Section */}
        <section className="py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid lg:grid-cols-2 gap-8">
              {/* Contact Form */}
              <div className="bg-white rounded-xl border-2 border-gray-200 p-8">
                <div className="mb-6">
                  <h2 className="text-3xl font-bold text-gray-900 mb-2">
                    Send Us a Message
                  </h2>
                  <p className="text-gray-600">
                    Fill out the form below and we'll get back to you as soon as possible.
                  </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Name */}
                  <div>
                    <label htmlFor="name" className="block text-sm font-semibold text-gray-900 mb-2">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      placeholder="John Doe"
                    />
                  </div>

                  {/* Email & Phone */}
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="email" className="block text-sm font-semibold text-gray-900 mb-2">
                        Email Address *
                      </label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                        placeholder="john@example.com"
                      />
                    </div>
                    <div>
                      <label htmlFor="phone" className="block text-sm font-semibold text-gray-900 mb-2">
                        Phone Number
                      </label>
                      <input
                        type="tel"
                        id="phone"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                        placeholder="+250 788 308 043"
                      />
                    </div>
                  </div>

                  {/* Subject */}
                  <div>
                    <label htmlFor="subject" className="block text-sm font-semibold text-gray-900 mb-2">
                      Subject *
                    </label>
                    <select
                      id="subject"
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white"
                    >
                      <option value="">Select a subject</option>
                      <option value="buying">Buying a Property</option>
                      <option value="selling">Selling a Property</option>
                      <option value="renting">Renting a Property</option>
                      <option value="property-inquiry">Property Inquiry</option>
                      <option value="general">General Inquiry</option>
                      <option value="support">Support</option>
                    </select>
                  </div>

                  {/* Message */}
                  <div>
                    <label htmlFor="message" className="block text-sm font-semibold text-gray-900 mb-2">
                      Message *
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      required
                      rows={6}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none"
                      placeholder="Tell us about your requirements..."
                    />
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full px-8 py-4 bg-primary-500 hover:bg-primary-600 text-white font-bold rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {isSubmitting ? (
                      <>
                        <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Sending...
                      </>
                    ) : (
                      <>
                        <FiSend className="w-5 h-5" />
                        Send Message
                      </>
                    )}
                  </button>
                </form>
              </div>

              {/* Map & Additional Info */}
              <div className="space-y-6">
                {/* Map */}
                <div className="bg-white rounded-xl border-2 border-gray-200 overflow-hidden h-[400px]">
                  <iframe
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d127641.82846034855!2d30.01885159999999!3d-1.9440727!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x19dca4258ed8e797%3A0xe776fb44643dcde!2sKigali%2C%20Rwanda!5e0!3m2!1sen!2sus!4v1234567890123!5m2!1sen!2sus"
                    width="100%"
                    height="100%"
                    style={{ border: 0 }}
                    allowFullScreen
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                  ></iframe>
                </div>

                {/* Quick Contact Options */}
                <div className="bg-white rounded-xl border-2 border-gray-200 p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-4">
                    Prefer to Talk Directly?
                  </h3>

                  <div className="flex items-center justify-center gap-4">
                    {/* Call Icon */}
                    <a
                      href={`tel:+${process.env.NEXT_PUBLIC_PHONE || '250788308043'}`}
                      className="group flex flex-col items-center gap-2"
                    >
                      <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center hover:bg-primary-500 transition-all">
                        <FiPhone className="w-7 h-7 text-primary-600 group-hover:text-white transition-colors" />
                      </div>
                      <span className="text-xs text-gray-700 font-medium">Call Us Now</span>
                    </a>

                    {/* WhatsApp Icon */}
                    <a
                      href={`https://wa.me/${process.env.NEXT_PUBLIC_WHATSAPP || '250788308043'}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group flex flex-col items-center gap-2"
                    >
                      <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center hover:bg-green-500 transition-all">
                        <svg className="w-7 h-7 text-green-600 group-hover:text-white transition-colors" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
                        </svg>
                      </div>
                      <span className="text-xs text-gray-700 font-medium">Chat on WhatsApp</span>
                    </a>

                    {/* Email Icon */}
                    <a
                      href={`mailto:${process.env.NEXT_PUBLIC_EMAIL || 'info@macssrealestaterw.com'}`}
                      className="group flex flex-col items-center gap-2"
                    >
                      <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center hover:bg-gray-700 transition-all">
                        <FiMail className="w-7 h-7 text-gray-700 group-hover:text-white transition-colors" />
                      </div>
                      <span className="text-xs text-gray-700 font-medium">Send an Email</span>
                    </a>
                  </div>
                </div>

                {/* Office Hours */}
                <div className="bg-gradient-to-br from-primary-600 to-primary-700 rounded-xl p-6 text-white">
                  <h3 className="text-xl font-bold mb-4">Visit Our Office</h3>
                  <p className="text-white/90 mb-4">
                    We welcome you to visit our office during business hours. Our team is ready to assist you with all your real estate needs.
                  </p>
                  <div className="space-y-2 text-sm">
                    <p className="flex items-center gap-2">
                      <FiClock className="w-4 h-4" />
                      Monday - Friday: 8:00 AM - 6:00 PM
                    </p>
                    <p className="flex items-center gap-2">
                      <FiClock className="w-4 h-4" />
                      Saturday: 9:00 AM - 3:00 PM
                    </p>
                    <p className="flex items-center gap-2">
                      <FiClock className="w-4 h-4" />
                      Sunday: Closed
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
