export type Province = "Koshi" | "Madhesh" | "Bagmati" | "Gandaki" | "Lumbini" | "Karnali" | "Sudurpashchim";

type Districts = {
  [district: string]: string[]; // Districts with an array of municipalities
};

type LocationInfo = {
  [province in Province]: Districts;
};

export const locationInfo: LocationInfo = {
  "Koshi": {
    "Bhojpur": [
      "Bhojpur Municipality",
      "Shadananda Municipality",
      "Aamchok Rural Municipality",
      "Arun Rural Municipality",
      "Hatuwagadhi Rural Municipality",
      "Pauwadungma Rural Municipality",
      "Ramprasad Rai Rural Municipality",
      "Salpasilicho Rural Municipality",
      "Temkemaiyum Rural Municipality"
    ],
    "Dhankuta": [
      "Dhankuta Municipality",
      "Pakhribas Municipality",
      "Chhathar Jorpati Rural Municipality",
      "Chaubise Rural Municipality",
      "Mahalaxmi Rural Municipality",
      "Sangurigadhi Rural Municipality"
    ],
    "Ilam": [
      "Ilam Municipality",
      "Deumai Municipality",
      "Mai Municipality",
      "Suryodaya Municipality",
      "Sambhunath Municipality",
      "Fikkal Rural Municipality",
      "Kanyam Rural Municipality",
      "Bhojpur Rural Municipality"
    ],
    "Jhapa": [
      "Bhadrapur Municipality",
      "Damak Municipality",
      "Mechinagar Municipality",
      "Arjundhara Municipality",
      "Kankai Municipality",
      "Shivasatakshi Municipality",
      "Gauradaha Municipality",
      "Birtamod Municipality",
      "Sundar Haraicha Municipality",
      "Kankai Municipality"
    ],
    "Khotang": [
      "Diktel Rupakot Majhuwagadhi Municipality",
      "Halesi Tuwachung Municipality",
      "Khotehang Rural Municipality",
      "Siddhicharan Municipality",
      "Bhotechaur Rural Municipality"
    ],
    "Morang": [
      "Biratnagar Metropolitan City",
      "Belbari Municipality",
      "Letang Municipality",
      "Pathari Sanischare Municipality",
      "Ratuwamai Municipality",
      "Sunawarshi Municipality",
      "Duhabi Municipality",
      "Dharan Sub-Metropolitan City",
      "Inaruwa Municipality"
    ],
    "Okhaldhunga": [
      "Siddhicharan Municipality",
      "Mahalaxmi Municipality",
      "Khiji Chandeshwori Municipality"
    ],
    "Panchthar": [
      "Phidim Municipality",
      "Sundarpokhari Rural Municipality",
      "Chandragadhi Rural Municipality"
    ],
    "Sankhuwasabha": [
      "Khandbari Municipality",
      "Chainpur Municipality",
      "Dharan Sub-Metropolitan City"
    ],
    "Solukhumbu": [
      "Solu Dudhkunda Municipality",
      "Chheplung Rural Municipality",
      "Salleri Municipality"
    ],
    "Sunsari": [
      "Inaruwa Municipality",
      "Itahari Sub-Metropolitan City",
      "Dharan Sub-Metropolitan City",
      "Duhabi Municipality",
      "Barahachhetra Municipality",
      "Sundar Haraicha Municipality"
    ],
    "Taplejung": [
      "Phungling Municipality",
      "Sundar Haraicha Municipality"
    ],
    "Terhathum": [
      "Myanglung Municipality",
      "Kuhin Rural Municipality"
    ],
    "Udayapur": [
      "Triyuga Municipality",
      "Katari Municipality",
      "Chaudandigadhi Municipality"
    ]
  },
  "Madhesh": {
    "Bara": [
      "Kalaiya Sub-Metropolitan City",
      "Jeetpur Simara Sub-Metropolitan City",
      "Kolhabi Municipality",
      "Parwanipur Rural Municipality",
      "Pacharauta Rural Municipality",
      "Mahagadhimai Municipality",
      "Simara Municipality",
      "Nijgadh Municipality"
    ],
    "Dhanusha": [
      "Janakpur Sub-Metropolitan City",
      "Ganeshman Charnath Municipality",
      "Dhanusadham Municipality",
      "Kamala Municipality",
      "Mithila Municipality",
      "Sabaila Municipality",
      "Bideha Municipality"
    ],
    "Mahottari": [
      "Jaleshwar Municipality",
      "Bardibas Municipality",
      "Gaushala Municipality",
      "Balawa Municipality",
      "Loharpatti Municipality"
    ],
    "Parsa": [
      "Birgunj Metropolitan City",
      "Bahudarmai Municipality",
      "Paragadhi Municipality",
      "Pokhariya Municipality",
      "Parsa Municipality"
    ],
    "Rautahat": [
      "Gaur Municipality",
      "Garuda Municipality",
      "Chandrapur Municipality",
      "Madhav Narayan Municipality",
      "Rajdevi Municipality",
      "Maulapur Municipality"
    ],
    "Saptari": [
      "Rajbiraj Municipality",
      "Shambhunath Municipality",
      "Kanchanrup Municipality",
      "Dakneshwori Municipality",
      "Bodebarsain Municipality"
    ],
    "Sarlahi": [
      "Malangwa Municipality",
      "Haripur Municipality",
      "Ishworpur Municipality",
      "Lalbandi Municipality",
      "Barhathwa Municipality"
    ],
    "Siraha": [
      "Lahan Municipality",
      "Siraha Municipality",
      "Golbazar Municipality",
      "Mirchaiya Municipality",
      "Dhangadhimai Municipality",
      "Sukhipur Municipality"
    ]
  },
  "Bagmati": {
    "Kathmandu": [
      "Kathmandu Metropolitan City",
      "Kirtipur Municipality",
      "Nagarjun Municipality",
      "Tokha Municipality",
      "Tarakeshwar Municipality",
      "Shankharapur Municipality"
    ],
    "Bhaktapur": [
      "Bhaktapur Municipality",
      "Suryabinayak Municipality",
      "Changunarayan Municipality"
    ],
    "Chitwan": [
      "Bharatpur Metropolitan City",
      "Ratnanagar Municipality",
      "Khairahani Municipality",
      "Rapti Municipality"
    ],
    "Dhading": [
      "Dhading Municipality",
      "Gajuri Municipality",
      "Benighat Rorang Municipality"
    ],
    "Dolakha": [
      "Charikot Municipality",
      "Jiri Municipality",
      "Bigu Rural Municipality"
    ],
    "Lalitpur": [
      "Lalitpur Metropolitan City",
      "Godawari Municipality",
      "Mahankal Municipality",
      "Bagmati Municipality"
    ]
  },
  "Gandaki": {
    "Baglung": [
      "Baglung Municipality",
      "Jaimini Municipality",
      "Dhorpatan Municipality",
      "Bareng Rural Municipality"
    ],
    "Gorkha": [
      "Gorkha Municipality",
      "Barpak Rural Municipality",
      "Sundarbazar Municipality",
      "Palungtar Municipality"
    ],
    "Kaski": [
      "Pokhara Metropolitan City",
      "Madi Municipality",
      "Annapurna Rural Municipality",
      "Kaski Rural Municipality"
    ],
    "Lamjung": [
      "Besisahar Municipality",
      "Sundar Bazar Municipality",
      "Marsyangdi Rural Municipality"
    ],
    "Manang": [
      "Chame Municipality",
      "Narphu Rural Municipality",
      "Manang Rural Municipality"
    ],
    "Mustang": [
      "Jomsom Municipality",
      "Thak Khola Rural Municipality"
    ],
    "Myagdi": [
      "Beni Municipality",
      "Malika Rural Municipality",
      "Dhaulagiri Rural Municipality"
    ],
    "Nawalpur": [
      "Bardaghat Municipality",
      "Siddhartha Nagar Municipality",
      "Devchuli Municipality"
    ],
    "Parbat": [
      "Kusma Municipality",
      "Modi Rural Municipality",
      "Jaljala Rural Municipality"
    ],
    "Syangja": [
      "Waling Municipality",
      "Arjun Chaupari Municipality",
      "Chandraoukhola Rural Municipality"
    ],
    "Tanahun": [
      "Damauli Municipality",
      "Bansgadhi Municipality",
      "Byas Municipality"
    ]
  },
  "Lumbini": {
    "Arghakhanchi": [
      "Sandhikharka Municipality",
      "Bhaluwang Rural Municipality"
    ],
    "Banke": [
      "Nepalgunj Sub-Metropolitan City",
      "Kohalpur Municipality",
      "Rapti Municipality"
    ],
    "Bardiya": [
      "Gulariya Municipality",
      "Thakurbaba Municipality",
      "Bansgadhi Municipality"
    ],
    "Dang": [
      "Tulsipur Sub-Metropolitan City",
      "Dangisharan Rural Municipality",
      "Salyan Rural Municipality"
    ],
    "Gulmi": [
      "Tiwari Municipality",
      "Satyawati Municipality",
      "Gulmi Rural Municipality"
    ],
    "Kapilvastu": [
      "Taulihawa Municipality",
      "Siddharthanagar Municipality",
      "Banganga Municipality"
    ],
    "Palpa": [
      "Tansen Municipality",
      "Ranjha Municipality",
      "Nayagaun Municipality"
    ],
    "Pyuthan": [
      "Pyuthan Municipality",
      "Siddhartha Rural Municipality",
      "Kusma Rural Municipality"
    ],
    "Rupandehi": [
      "Lumbini Sanskritik Municipality",
      "Bhairahawa Municipality",
      "Siddharthanagar Municipality"
    ]
  },
  "Karnali": {
    "Bardiya": [
      "Bardiya Municipality",
      "Thakurbaba Municipality",
      "Rajapur Municipality",
      "Madhuwan Municipality"
    ],
    "Dailekh": [
      "Dailekh Municipality",
      "Chaurjahari Municipality",
      "Dullu Municipality"
    ],
    "Jajarkot": [
      "Jajarkot Municipality",
      "Chhedagad Municipality",
      "Bheriganga Municipality"
    ],
    "Jumla": [
      "Jumla Municipality",
      "Chandannath Municipality",
      "Kohalpur Municipality"
    ],
    "Kalikot": [
      "Manma Municipality",
      "Kalikot Municipality",
      "Khulalu Municipality"
    ],
    "Mugu": [
      "Gamgadhi Municipality",
      "Chhayanath Rara Municipality",
      "Mugu Rural Municipality"
    ],
    "Rukum": [
      "Rukumkot Municipality",
      "Salyan Municipality",
      "Liwang Municipality"
    ],
    "Salyan": [
      "Salyan Municipality",
      "Khubu Municipality",
      "Mugri Rural Municipality"
    ]
  },
  "Sudurpashchim": {
    "Baitadi": [
      "Baitadi Municipality",
      "Dasharathchand Municipality"
    ],
    "Dadeldhura": [
      "Amargadhi Municipality",
      "Dadeldhura Municipality"
    ],
    "Darchula": [
      "Darchula Municipality",
      "Mahakali Rural Municipality"
    ],
    "Kailali": [
      "Dhangadhi Sub-Metropolitan City",
      "Tikapur Municipality",
      "Bachhauli Municipality"
    ],
    "Kanchanpur": [
      "Mahendranagar Municipality",
      "Shikhar Municipality",
      "Krishnapur Municipality"
    ]
  }
};
