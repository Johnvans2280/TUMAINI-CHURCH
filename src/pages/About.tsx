import React from 'react';
import { useSiteSettings } from '../context/SettingsContext';
import { MapPin, Phone, Mail, Clock, Heart, Users, Compass, ShieldCheck } from 'lucide-react';

export const About: React.FC = () => {
  const { settings } = useSiteSettings();

  const churchName = settings?.church_name || 'Our Church';
  const tagline = settings?.tagline;
  const aboutText = settings?.about;
  const location = settings?.location;
  const phone = settings?.phone;
  const email = settings?.email;
  const serviceTimes = settings?.service_times;

  const hasContactInfo = Boolean(location || phone || email || serviceTimes);

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-14 space-y-16">
      {/* 1. Header & Story Split */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
        <div className="lg:col-span-7 space-y-6">
          {tagline && (
            <div className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-[#C8963E]">
              <Heart className="w-3.5 h-3.5" />
              <span>{tagline}</span>
            </div>
          )}

          <h1 className="text-3xl sm:text-5xl font-bold font-serif-church text-[#1F2A44] dark:text-white leading-tight">
            About {churchName}
          </h1>

          {aboutText ? (
            <p className="text-lg text-[#5B6270] dark:text-slate-300 leading-relaxed font-light whitespace-pre-line">
              {aboutText}
            </p>
          ) : (
            <p className="text-lg text-[#5B6270] dark:text-slate-300 leading-relaxed font-light">
              Welcome to {churchName}. We are a dedicated fellowship of believers devoted to worship, prayer, and mutual care in Christ.
            </p>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
            <div className="bg-white dark:bg-[#1A2335] p-4 rounded-2xl border border-slate-200 dark:border-slate-800">
              <Users className="w-5 h-5 text-[#C8963E] mb-2" />
              <h3 className="font-semibold text-sm text-[#1F2A44] dark:text-white">One Fellowship</h3>
              <p className="text-xs text-[#5B6270] dark:text-slate-400 mt-0.5">United in love, prayer, and grace</p>
            </div>
            <div className="bg-white dark:bg-[#1A2335] p-4 rounded-2xl border border-slate-200 dark:border-slate-800">
              <Compass className="w-5 h-5 text-[#C8963E] mb-2" />
              <h3 className="font-semibold text-sm text-[#1F2A44] dark:text-white">Biblical Faith</h3>
              <p className="text-xs text-[#5B6270] dark:text-slate-400 mt-0.5">Anchored in the truth of Scripture</p>
            </div>
            <div className="bg-white dark:bg-[#1A2335] p-4 rounded-2xl border border-slate-200 dark:border-slate-800">
              <ShieldCheck className="w-5 h-5 text-[#C8963E] mb-2" />
              <h3 className="font-semibold text-sm text-[#1F2A44] dark:text-white">Loving Service</h3>
              <p className="text-xs text-[#5B6270] dark:text-slate-400 mt-0.5">Serving our neighbors and community</p>
            </div>
          </div>
        </div>

        {/* Community Fellowship Visual */}
        <div className="lg:col-span-5">
          <div className="rounded-3xl overflow-hidden shadow-xl border border-slate-200/80 dark:border-slate-800">
            <img
              src="/src/assets/images/church_community_fellowship_1792311944289.jpg"
              alt="Church fellowship and community"
              className="w-full h-80 sm:h-96 object-cover"
              referrerPolicy="no-referrer"
            />
            <div className="bg-white dark:bg-[#1A2335] p-4 text-center border-t border-slate-200 dark:border-slate-800">
              <p className="text-xs font-medium text-slate-600 dark:text-slate-300">
                Warm welcome and community fellowship
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Location, Contact, and Visit Info (Hidden if no contact info in site_settings) */}
      {hasContactInfo && (
        <section className="bg-white dark:bg-[#1A2335] rounded-3xl p-6 sm:p-10 shadow-sm border border-slate-200/80 dark:border-slate-800">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
            <div className="space-y-4">
              <h2 className="text-2xl sm:text-3xl font-bold font-serif-church text-[#1F2A44] dark:text-white">
                Contact & Visit
              </h2>
              <p className="text-sm text-[#5B6270] dark:text-slate-300 leading-relaxed">
                We are always glad to connect with visitors, newcomers, and community members.
              </p>

              <ul className="space-y-3 text-sm text-[#1F2A44] dark:text-slate-200 pt-2">
                {location && (
                  <li className="flex items-start gap-3">
                    <MapPin className="w-5 h-5 text-[#C8963E] shrink-0 mt-0.5" />
                    <div>
                      <strong className="block font-semibold">Location</strong>
                      <span className="text-xs text-slate-500 dark:text-slate-400">{location}</span>
                    </div>
                  </li>
                )}
                {phone && (
                  <li className="flex items-start gap-3">
                    <Phone className="w-5 h-5 text-[#C8963E] shrink-0 mt-0.5" />
                    <div>
                      <strong className="block font-semibold">Phone</strong>
                      <a href={`tel:${phone}`} className="text-xs text-slate-500 dark:text-slate-400 hover:underline">
                        {phone}
                      </a>
                    </div>
                  </li>
                )}
                {email && (
                  <li className="flex items-start gap-3">
                    <Mail className="w-5 h-5 text-[#C8963E] shrink-0 mt-0.5" />
                    <div>
                      <strong className="block font-semibold">Email</strong>
                      <a href={`mailto:${email}`} className="text-xs text-slate-500 dark:text-slate-400 hover:underline">
                        {email}
                      </a>
                    </div>
                  </li>
                )}
                {serviceTimes && (
                  <li className="flex items-start gap-3">
                    <Clock className="w-5 h-5 text-[#C8963E] shrink-0 mt-0.5" />
                    <div>
                      <strong className="block font-semibold">Worship Times</strong>
                      <span className="text-xs text-slate-500 dark:text-slate-400 whitespace-pre-line">
                        {serviceTimes}
                      </span>
                    </div>
                  </li>
                )}
              </ul>
            </div>

            {/* Map Direction Card (only shown if location exists) */}
            {location && (
              <div className="bg-[#FAF7F2] dark:bg-[#111724] rounded-2xl p-6 border border-slate-200 dark:border-slate-800 text-center space-y-3">
                <div className="w-12 h-12 rounded-xl bg-[#C8963E]/20 text-[#C8963E] flex items-center justify-center mx-auto">
                  <MapPin className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold font-serif-church text-[#1F2A44] dark:text-white">
                  {churchName}
                </h3>
                <p className="text-xs text-[#5B6270] dark:text-slate-400 max-w-xs mx-auto">
                  {location}
                </p>
                <div className="pt-2">
                  <a
                    href={`https://maps.google.com/?q=${encodeURIComponent(churchName + ' ' + location)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 min-h-[44px] px-5 py-2.5 rounded-xl bg-[#1F2A44] dark:bg-[#C8963E] text-white dark:text-[#1F2A44] font-semibold text-xs shadow-sm hover:opacity-90 transition-all"
                  >
                    <span>Open in Google Maps</span>
                  </a>
                </div>
              </div>
            )}
          </div>
        </section>
      )}
    </div>
  );
};

export default About;
