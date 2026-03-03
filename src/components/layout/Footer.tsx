import Link from 'next/link'

const contactInfo = {
  address: '26, Avenue Mers Sultan Appt N°3 Etage 1, Casablanca-Maroc',
  phones: ['+212 670 085 699', '+212 631 995 242'],
  email: 'Contact@manuaf.com',
  hours: 'Lun-Ven: 8:30 – 18:00',
}

const footerLinks = {
  liens: [
    { href: '/', label: 'Accueil' },
    { href: '/produits/pieces', label: 'Pièces de rechange' },
    { href: '/produits/chariots/location', label: 'Chariots de location' },
    { href: '/produits/chariots/occasion', label: "Chariots d'occasion" },
    { href: '/services', label: 'Services' },
    { href: '/qui-sommes-nous', label: 'Qui sommes-nous' },
    { href: '/blog', label: 'Blog' },
    { href: '/contact', label: 'Contact' },
  ],
  produits: [
    { href: '/demander-chariot', label: 'Demander un chariot' },
    { href: '/produits/chariots/location', label: 'Location de chariots' },
    { href: '/produits/chariots/occasion', label: "Chariots d'occasion" },
    { href: '/produits/pieces/batteries', label: 'Batteries' },
    { href: '/produits/pieces/accessoires', label: 'Accessoires' },
    { href: '/produits/pieces/commandes', label: 'Pièces de rechange' },
  ],
  services: [
    { href: '/services?service=maintenance', label: 'Maintenance' },
    { href: '/services?service=reconditionnement', label: 'Reconditionnement' },
    { href: '/services?service=location', label: 'Location' },
  ],
}

export function Footer() {
  return (
    <footer role="contentinfo" className="bg-[var(--grey)]">
      {/* Main footer content — design token spacing */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12 sm:py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-8 lg:gap-12">
            {/* Logo & Contact */}
            <div className="sm:col-span-2 lg:col-span-2">
              <Link
                href="/"
                className="inline-block mb-3 sm:mb-4 h-12 sm:h-14 w-[200px] sm:w-[220px] flex items-center"
              >
                <img
                  src="/images/NEW-logo-MANUAF-1-.png"
                  alt="MANUAF"
                  width={220}
                  height={64}
                  className="h-full w-auto max-w-full object-contain object-left"
                  onError={(e) => {
                    e.currentTarget.style.display = 'none'
                    const fallback = e.currentTarget.nextElementSibling
                    if (fallback) (fallback as HTMLElement).style.display = 'inline'
                  }}
                />
                <span className="text-xl sm:text-2xl font-bold text-[var(--accent)]" style={{ display: 'none' }}>
                  MANUAF
                </span>
              </Link>
              <p className="text-white/70 text-xs sm:text-sm mb-4 uppercase tracking-wider font-medium">
                We lighten your load
              </p>
              <div className="space-y-3 text-xs sm:text-sm text-white/80">
                <p className="flex items-start gap-2">
                  <svg className="w-4 h-4 mt-0.5 text-[var(--accent)] flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <span className="leading-relaxed">{contactInfo.address}</span>
                </p>
                <div className="flex items-start gap-2">
                  <svg className="w-4 h-4 mt-0.5 text-[var(--accent)] flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                  <div>
                    {contactInfo.phones.map((phone) => (
                      <a key={phone} href={`tel:${phone.replace(/\s/g, '')}`} className="block hover:text-white transition-colors">
                        {phone}
                      </a>
                    ))}
                  </div>
                </div>
                <a href={`mailto:${contactInfo.email}`} className="flex items-center gap-2 hover:text-white transition-colors">
                  <svg className="w-4 h-4 text-[var(--accent)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  {contactInfo.email}
                </a>
              </div>
            </div>

            {/* Links */}
            <div>
              <h2 className="text-white font-bold uppercase tracking-wider mb-2">
                Liens
              </h2>
              <ul className="space-y-2" role="list">
                {footerLinks.liens.map((link) => (
                  <li key={link.href + link.label}>
                    <Link
                      href={link.href}
                      className="text-white/80 hover:text-white text-xs sm:text-sm transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white rounded"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Products */}
            <div>
              <h2 className="text-white font-bold uppercase tracking-wider mb-2">
                Nos Produits
              </h2>
              <ul className="space-y-2" role="list">
                {footerLinks.produits.map((link, idx) => (
                  <li key={idx}>
                    <Link
                      href={link.href}
                      className="text-white/80 hover:text-white text-xs sm:text-sm transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white rounded"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Services + Legal */}
            <div>
              <h2 className="text-white font-bold uppercase tracking-wider mb-2">
                Nos Services
              </h2>
              <ul className="space-y-2 mb-6" role="list">
                {footerLinks.services.map((link, idx) => (
                  <li key={idx}>
                    <Link
                      href={link.href}
                      className="text-white/80 hover:text-white text-xs sm:text-sm transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white rounded"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
              <div className="flex flex-col gap-2 text-xs sm:text-sm">
                <Link href="/mentions-legales" className="text-white/60 hover:text-white transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white rounded">
                  Mentions légales
                </Link>
                <Link href="/confidentialite" className="text-white/60 hover:text-white transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white rounded">
                  Confidentialité
                </Link>
              </div>
            </div>

            {/* Social */}
            <div>
              <h2 className="text-white font-bold uppercase tracking-wider mb-2">
                Suivez-nous
              </h2>
              <div className="flex gap-2 sm:gap-3" role="list">
                <a href="https://www.facebook.com" target="_blank" rel="noopener noreferrer" className="w-10 h-10 bg-white/10 flex items-center justify-center hover:bg-[var(--accent)] transition-colors rounded focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white" aria-label="Facebook">
                  <svg className="w-4 h-4 sm:w-5 sm:h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                  </svg>
                </a>
                <a href="https://www.instagram.com" target="_blank" rel="noopener noreferrer" className="w-10 h-10 bg-white/10 flex items-center justify-center hover:bg-[var(--accent)] transition-colors rounded focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white" aria-label="Instagram">
                  <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073z"/></svg>
                </a>
                <a href="https://www.linkedin.com" target="_blank" rel="noopener noreferrer" className="w-10 h-10 bg-white/10 flex items-center justify-center hover:bg-[var(--accent)] transition-colors rounded focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white" aria-label="LinkedIn">
                  <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
                </a>
              </div>
            </div>
          </div>
        </div>

      {/* Copyright bar */}
      <div className="h-[1cm] min-h-[2.5rem] bg-black flex items-center justify-center px-4">
        <p className="text-white text-xs sm:text-sm text-center" suppressHydrationWarning>
          © {new Date().getFullYear()} MANUAF. Tous droits réservés
        </p>
      </div>
    </footer>
  )
}
