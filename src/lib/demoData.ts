import { Member, Hymn, Announcement, DailyHymn } from '../types';

export const initialHymns: Hymn[] = [
  {
    id: 'hymn-1',
    hymn_number: 1,
    title: 'Holy, Holy, Holy! Lord God Almighty',
    language: 'English',
    lyrics: `Holy, holy, holy! Lord God Almighty!
Early in the morning our song shall rise to Thee;
Holy, holy, holy, merciful and mighty!
God in three Persons, blessed Trinity!

Holy, holy, holy! All the saints adore Thee,
Casting down their golden crowns around the glassy sea;
Cherubim and seraphim falling down before Thee,
Which wert, and art, and evermore shalt be.

Holy, holy, holy! Though the darkness hide Thee,
Though the eye of sinful man Thy glory may not see;
Only Thou art holy; there is none beside Thee,
Perfect in power, in love, and purity.

Holy, holy, holy! Lord God Almighty!
All Thy works shall praise Thy Name, in earth, and sky, and sea;
Holy, holy, holy; merciful and mighty!
God in three Persons, blessed Trinity!`
  },
  {
    id: 'hymn-2',
    hymn_number: 23,
    title: 'Great Is Thy Faithfulness',
    language: 'English',
    lyrics: `Great is Thy faithfulness, O God my Father,
There is no shadow of turning with Thee;
Thou changest not, Thy compassions, they fail not;
As Thou hast been Thou forever wilt be.

Refrain:
Great is Thy faithfulness! Great is Thy faithfulness!
Morning by morning new mercies I see;
All I have needed Thy hand hath provided—
Great is Thy faithfulness, Lord, unto me!

Summer and winter, and springtime and harvest,
Sun, moon and stars in their courses above,
Join with all nature in manifold witness
To Thy great faithfulness, mercy and love.

Pardon for sin and a peace that endureth,
Thine own dear presence to cheer and to guide;
Strength for today and bright hope for tomorrow,
Blessings all mine, with ten thousand beside!`
  },
  {
    id: 'hymn-3',
    hymn_number: 54,
    title: 'Mwamba Wenye Imara (Rock of Ages)',
    language: 'Swahili',
    lyrics: `Mwamba wenye imara, Kwako nitajificha;
Maji hayo na damu, Yaliyotoka humu,
Yanioshe kabisa, Sitoke na hatia.

Kazi zangu zote pia, Hazikutosha sheria;
Nijapolia sana, Na kufanya bidii,
Hayaishi makosa; Ndiwe wa kuokoa.

Sina cha mkononi, Naja msalabani;
Nili uchi nivike, Nili mnyonge nishike;
Nili mchafu nioshe, Nisipate kufa vema.

Nikungojapo hapa, Nifumbapo macho pia;
Niingiapo juu, Nikuonapo Wewe;
Mwamba wenye imara, Kwako nitajificha.`
  },
  {
    id: 'hymn-4',
    hymn_number: 88,
    title: 'Blessed Assurance, Jesus Is Mine',
    language: 'English',
    lyrics: `Blessed assurance, Jesus is mine!
O what a foretaste of glory divine!
Heir of salvation, purchase of God,
Born of His Spirit, washed in His blood.

Refrain:
This is my story, this is my song,
Praising my Savior all the day long;
This is my story, this is my song,
Praising my Savior all the day long.

Perfect submission, perfect delight,
Visions of rapture now burst on my sight;
Angels descending, bring from above
Echoes of mercy, whispers of love.

Perfect submission, all is at rest,
I in my Savior am happy and blest;
Watching and waiting, looking above,
Filled with His goodness, lost in His love.`
  },
  {
    id: 'hymn-5',
    hymn_number: 112,
    title: 'Yesu Kwetu Ni Rafiki (What a Friend We Have in Jesus)',
    language: 'Swahili',
    lyrics: `Yesu kwetu ni Rafiki, Hutuombea mema;
Tupateje masumbuko, Yasiyotupasa kamwe?
Yote haya ni kwa sababu, Hatumwombi Mungu wetu;
Kila jambo kwa maombi, Tungepeleka Kwake.

Je, una majaribu mengi? Na taabu kila siku?
Usikate tamaa kamwe, Mpelekee Mwokozi.
Yeye ni Rafiki mwema, Hawezi kukuacha kamwe;
Yote unayoyapata, Mweleze Yesu Kristo.

Je, umechoka na mzigo, Wa mahangaiko mengi?
Yesu ndiye kimbilio, Mwambie katika sala.
Je, marafiki wakutupa? Mwendee Bwana Yesu;
Atakukumbatia kweli, Utapata faraja.`
  }
];

export const initialAnnouncements: Announcement[] = [
  {
    id: 'ann-1',
    title: 'Annual Thanksgiving & Harvest Celebration',
    body: 'We warmly invite all congregants, families, and neighbors to our upcoming Annual Thanksgiving & Harvest Celebration this coming Sunday. Join us for a combined service at 10:00 AM followed by community fellowship luncheon in the courtyard.',
    is_pinned: true,
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2).toISOString()
  },
  {
    id: 'ann-2',
    title: 'Medical Camp & Community Health Day',
    body: 'Our Outreach & Missions ministry is partnering with local medical practitioners to provide free basic medical check-ups, eye screenings, and health wellness counsel this Saturday from 9:00 AM to 3:00 PM at the Church grounds.',
    is_pinned: true,
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5).toISOString()
  },
  {
    id: 'ann-3',
    title: 'Choir & Praise Team Auditions',
    body: 'Passionate about singing or playing an instrument? The Tumaini Praise Choir is welcoming new voices for soprano, alto, tenor, and bass sections, as well as instrumentalists. Rehearsals begin Wednesday at 5:00 PM.',
    is_pinned: false,
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 7).toISOString()
  },
  {
    id: 'ann-4',
    title: 'Sunday School Teachers Refresher Workshop',
    body: 'All children ministry volunteers and teachers are reminded of the curriculum planning and child safety workshop scheduled for next Saturday morning at 10:00 AM in Hall B.',
    is_pinned: false,
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 10).toISOString()
  }
];

export const initialMembers: Member[] = [
  {
    id: 'mem-1',
    full_name: 'Grace Wanjiru Kamau',
    phone: '+254 712 345 678',
    email: 'grace.kamau@example.com',
    gender: 'Female',
    date_of_birth: '1984-06-15',
    residence: 'Kilimani, Nairobi',
    ministry: 'Choir & Praise',
    join_date: '2019-02-10',
    status: 'active',
    created_at: '2019-02-10T08:00:00Z'
  },
  {
    id: 'mem-2',
    full_name: 'David Omondi Otieno',
    phone: '+254 722 987 654',
    email: 'david.otieno@example.com',
    gender: 'Male',
    date_of_birth: '1976-11-20',
    residence: 'Westlands, Nairobi',
    ministry: 'Men\'s Fellowship',
    join_date: '2018-05-14',
    status: 'active',
    created_at: '2018-05-14T09:30:00Z'
  },
  {
    id: 'mem-3',
    full_name: 'Faith Chebet Koech',
    phone: '+254 701 555 432',
    email: 'faith.koech@example.com',
    gender: 'Female',
    date_of_birth: '1995-03-28',
    residence: 'Ngong Road, Nairobi',
    ministry: 'Youth Fellowship',
    join_date: '2021-08-22',
    status: 'active',
    created_at: '2021-08-22T10:15:00Z'
  },
  {
    id: 'mem-4',
    full_name: 'Elder Moses Mutua',
    phone: '+254 733 112 233',
    email: 'moses.mutua@example.com',
    gender: 'Male',
    date_of_birth: '1962-09-04',
    residence: 'Lavington, Nairobi',
    ministry: 'Intercessory Prayer',
    join_date: '2015-01-11',
    status: 'active',
    created_at: '2015-01-11T07:45:00Z'
  },
  {
    id: 'mem-5',
    full_name: 'Mary Achieng Okello',
    phone: '+254 711 778 899',
    email: 'mary.okello@example.com',
    gender: 'Female',
    date_of_birth: '1990-12-03',
    residence: 'South B, Nairobi',
    ministry: 'Sunday School',
    join_date: '2022-04-17',
    status: 'active',
    created_at: '2022-04-17T11:00:00Z'
  },
  {
    id: 'mem-6',
    full_name: 'Samuel Kiprop',
    phone: '+254 720 443 322',
    email: 'samuel.kiprop@example.com',
    gender: 'Male',
    date_of_birth: '1988-08-19',
    residence: 'Runda, Nairobi',
    ministry: 'Ushering & Hospitality',
    join_date: '2023-01-15',
    status: 'active',
    created_at: '2023-01-15T08:30:00Z'
  },
  {
    id: 'mem-7',
    full_name: 'Esther Nyambura Njoroge',
    phone: '+254 714 667 889',
    email: 'esther.njoroge@example.com',
    gender: 'Female',
    date_of_birth: '1979-05-09',
    residence: 'Parklands, Nairobi',
    ministry: 'Women of Hope',
    join_date: '2020-09-06',
    status: 'inactive',
    created_at: '2020-09-06T10:00:00Z'
  }
];

export const getLocalTodayDateString = (): string => {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

export const initialDailyHymns: DailyHymn[] = [
  {
    id: 'daily-1',
    hymn_id: 'hymn-2', // Great is Thy Faithfulness
    hymn_date: getLocalTodayDateString(),
    created_at: new Date().toISOString(),
    hymns: initialHymns[1]
  },
  {
    id: 'daily-2',
    hymn_id: 'hymn-1',
    hymn_date: '2026-10-17',
    created_at: new Date().toISOString(),
    hymns: initialHymns[0]
  },
  {
    id: 'daily-3',
    hymn_id: 'hymn-3',
    hymn_date: '2026-10-16',
    created_at: new Date().toISOString(),
    hymns: initialHymns[2]
  }
];
