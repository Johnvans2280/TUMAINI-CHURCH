import React from 'react';
import { Link } from 'react-router-dom';
import { churchConfig } from '../config/church';
import { MapPin, Phone, Mail, Clock, Heart } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-[#1F2A44] text-slate-300 dark:bg-[#0D121C] border-t border-slate-800 transition-colors">
      {/* Scripture Banner */}
      <div className="bg-[#182136] dark:bg-[#0A0E17] py-6 px-4 border-b border-slate-800/80">
        <div className="max-w-4xl mx-auto text-center">
          <blockquote className="font-serif-church italic text-lg sm:text-xl text-[#FAF7F2]/90 leading-relaxed">
            "{churchConfig.verse.text}"
          </blockquote>
          <p className="mt-2 text-xs font-semibold text-[#C8963E] tracking-wider uppercase">
            — {churchConfig.verse.reference}
          </p>
        </div>
      </div>

      {/* Main Footer Links & Info */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Col 1: Brand & Tagline */}
          <div className="space-y-4">
            <h2 className="text-2xl font-bold font-serif-church text-white">
              {churchConfig.name}
            </h2>
            <p className="text-sm text-slate-400 leading-relaxed">
              {churchConfig.tagline}. {churchConfig.mission}
            </p>
            <div className="pt-2">
              <span className="inline-flex items-center gap-1.5 text-xs text-[#C8963E] font-medium bg-[#C8963E]/10 px-3 py-1.5 rounded-full border border-[#C8963E]/20">
                <Heart className="w-3.5 h-3.5" />
                <span>All are warmly welcome</span>
              </span>
            </div>
          </div>

          {/* Col 2: Quick Links */}
          <div className="space-y-3">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-white">
              Quick Links
            </h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/" className="hover:text-[#C8963E] transition-colors">
                  Home & Worship Times
                </Link>
              </li>
              <li>
                <Link to="/hymns" className="hover:text-[#C8963E] transition-colors">
                  Today's Hymn & Archive
                </Link>
              </li>
              <li>
                <Link to="/updates" className="hover:text-[#C8963E] transition-colors">
                  Church Announcements
                </Link>
              </li>
              <li>
                <Link to="/about" className="hover:text-[#C8963E] transition-colors">
                  About Our Church
                </Link>
              </li>
              <li>
                <Link to="/login" className="hover:text-[#C8963E] transition-colors">
                  Admin & Secretary Portal
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Service Times Summary */}
          <div className="space-y-3">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-white">
              Sunday Services
            </h3>
            <div className="space-y-2.5 text-xs text-slate-400">
              {churchConfig.serviceTimes.slice(0, 2).map((st, i) => (
                <div key={i} className="bg-slate-800/40 p-2.5 rounded-lg border border-slate-700/50">
                  <p className="font-semibold text-slate-200">{st.title}</p>
                  <p className="text-[#C8963E] font-medium mt-0.5">{st.time}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Col 4: Contact & Office */}
          <div className="space-y-3">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-white">
              Visit & Contact
            </h3>
            <ul className="space-y-2.5 text-xs text-slate-400">
              <li className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-[#C8963E] shrink-0 mt-0.5" />
                <span>{churchConfig.contact.address}, {churchConfig.contact.city}</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-[#C8963E] shrink-0" />
                <span>{churchConfig.contact.phone}</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-[#C8963E] shrink-0" />
                <span>{churchConfig.contact.email}</span>
              </li>
              <li className="flex items-start gap-2.5">
                <Clock className="w-4 h-4 text-[#C8963E] shrink-0 mt-0.5" />
                <span>Office: {churchConfig.contact.officeHours}</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-6 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
          <p>
            © {new Date().getFullYear()} {churchConfig.name}. All rights reserved.
          </p>
          <p className="text-slate-400">
            A community of hope, faith, and love.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
