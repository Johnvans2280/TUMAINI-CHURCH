import React from 'react';
import { churchConfig } from '../config/church';
import { MapPin, Phone, Mail, Clock, ShieldCheck, Heart, Users, Compass } from 'lucide-react';

export const About: React.FC = () => {
  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-14 space-y-16">
      {/* 1. Header & Story Split */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
        <div className="lg:col-span-7 space-y-6">
          <div className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-[#C8963E]">
            <Heart className="w-3.5 h-3.5" />
            <span>Our Heritage & Vision</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-bold font-serif-church text-[#1F2A44] dark:text-white leading-tight">
            About {churchConfig.name}
          </h1>

          <p className="text-lg text-[#5B6270] dark:text-slate-300 leading-relaxed font-light">
            Founded on the unfailing promises of Christ, Tumaini Church is a welcoming spiritual sanctuary dedicated to worship, discipleship, and communal service. The word <em className="text-[#C8963E] font-medium not-italic">"Tumaini"</em> is the Swahili word for <strong className="font-semibold text-[#1F2A44] dark:text-white">Hope</strong>.
          </p>

          <p className="text-sm sm:text-base text-[#5B6270] dark:text-slate-300 leading-relaxed">
            Our congregation embraces believers from all walks of life. Whether you are taking your first steps in faith or looking for a home church to raise your family, you will find warmth, sound Biblical teaching, vibrant choral worship, and genuine fellowship here.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
            <div className="bg-white dark:bg-[#1A2335] p-4 rounded-2xl border border-slate-200 dark:border-slate-800">
              <Users className="w-5 h-5 text-[#C8963E] mb-2" />
              <h3 className="font-semibold text-sm text-[#1F2A44] dark:text-white">One Family</h3>
              <p className="text-xs text-[#5B6270] dark:text-slate-400 mt-0.5">Diverse people united by God's love</p>
            </div>
            <div className="bg-white dark:bg-[#1A2335] p-4 rounded-2xl border border-slate-200 dark:border-slate-800">
              <Compass className="w-5 h-5 text-[#C8963E] mb-2" />
              <h3 className="font-semibold text-sm text-[#1F2A44] dark:text-white">Gospel Grounded</h3>
              <p className="text-xs text-[#5B6270] dark:text-slate-400 mt-0.5">Uncompromising truth of Scripture</p>
            </div>
            <div className="bg-white dark:bg-[#1A2335] p-4 rounded-2xl border border-slate-200 dark:border-slate-800">
              <ShieldCheck className="w-5 h-5 text-[#C8963E] mb-2" />
              <h3 className="font-semibold text-sm text-[#1F2A44] dark:text-white">Active Ministry</h3>
              <p className="text-xs text-[#5B6270] dark:text-slate-400 mt-0.5">Serving our local neighborhood</p>
            </div>
          </div>
        </div>

        {/* Community Image */}
        <div className="lg:col-span-5">
          <div className="rounded-3xl overflow-hidden shadow-xl border border-slate-200/80 dark:border-slate-800">
            <img
              src="/src/assets/images/church_community_fellowship_1792311944289.jpg"
              alt="Tumaini Church congregation community fellowship"
              className="w-full h-80 sm:h-96 object-cover"
              referrerPolicy="no-referrer"
            />
            <div className="bg-white dark:bg-[#1A2335] p-4 text-center border-t border-slate-200 dark:border-slate-800">
              <p className="text-xs font-medium text-slate-600 dark:text-slate-300">
                Congregation fellowship and Sunday greeting at Tumaini Church
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Church Leadership & Ministries */}
      <section className="space-y-6">
        <div className="text-center max-w-xl mx-auto space-y-2">
          <h2 className="text-2xl sm:text-3xl font-bold font-serif-church text-[#1F2A44] dark:text-white">
            Ministries of Hope
          </h2>
          <p className="text-sm text-[#5B6270] dark:text-slate-400">
            Get involved and grow in your spiritual gifts through our active ministries.
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {churchConfig.ministries.map((min, index) => (
            <div
              key={index}
              className="bg-white dark:bg-[#1A2335] p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800 text-center hover:border-[#C8963E] transition-colors"
            >
              <p className="text-sm font-semibold text-[#1F2A44] dark:text-white">
                {min}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* 3. Location, Contact, and Visit Info */}
      <section className="bg-white dark:bg-[#1A2335] rounded-3xl p-6 sm:p-10 shadow-sm border border-slate-200/80 dark:border-slate-800">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          <div className="space-y-4">
            <h2 className="text-2xl sm:text-3xl font-bold font-serif-church text-[#1F2A44] dark:text-white">
              Plan Your Visit
            </h2>
            <p className="text-sm text-[#5B6270] dark:text-slate-300 leading-relaxed">
              We look forward to welcoming you this coming Sunday. Our church grounds feature ample secure parking, an accessible sanctuary entrance, and a dedicated team ready to assist first-time visitors.
            </p>

            <ul className="space-y-3 text-sm text-[#1F2A44] dark:text-slate-200 pt-2">
              <li className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-[#C8963E] shrink-0 mt-0.5" />
                <div>
                  <strong className="block font-semibold">Church Address</strong>
                  <span className="text-xs text-slate-500 dark:text-slate-400">{churchConfig.contact.address}, {churchConfig.contact.city}</span>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <Phone className="w-5 h-5 text-[#C8963E] shrink-0 mt-0.5" />
                <div>
                  <strong className="block font-semibold">Phone Lines</strong>
                  <span className="text-xs text-slate-500 dark:text-slate-400">{churchConfig.contact.phone} / {churchConfig.contact.alternatePhone}</span>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <Mail className="w-5 h-5 text-[#C8963E] shrink-0 mt-0.5" />
                <div>
                  <strong className="block font-semibold">Email Enquiries</strong>
                  <span className="text-xs text-slate-500 dark:text-slate-400">{churchConfig.contact.email}</span>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <Clock className="w-5 h-5 text-[#C8963E] shrink-0 mt-0.5" />
                <div>
                  <strong className="block font-semibold">Parish Secretariat Hours</strong>
                  <span className="text-xs text-slate-500 dark:text-slate-400">{churchConfig.contact.officeHours}</span>
                </div>
              </li>
            </ul>
          </div>

          {/* Interactive Map Visual Placeholder */}
          <div className="bg-[#FAF7F2] dark:bg-[#111724] rounded-2xl p-6 border border-slate-200 dark:border-slate-800 text-center space-y-3">
            <div className="w-12 h-12 rounded-xl bg-[#C8963E]/20 text-[#C8963E] flex items-center justify-center mx-auto">
              <MapPin className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold font-serif-church text-[#1F2A44] dark:text-white">
              Tumaini Sanctuary Grounds
            </h3>
            <p className="text-xs text-[#5B6270] dark:text-slate-400 max-w-xs mx-auto">
              Located near Community Greens, with direct access via Hope Avenue.
            </p>
            <div className="pt-2">
              <a
                href={`https://maps.google.com/?q=${encodeURIComponent(churchConfig.name + ' ' + churchConfig.contact.city)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 min-h-[44px] px-5 py-2.5 rounded-xl bg-[#1F2A44] dark:bg-[#C8963E] text-white dark:text-[#1F2A44] font-semibold text-xs shadow-sm hover:opacity-90 transition-all"
              >
                <span>Open in Google Maps</span>
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;
