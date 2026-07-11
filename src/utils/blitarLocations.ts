export interface Region {
  name: string;
  districts: string[];
}

export const blitarLocations: Region[] = [
  {
    name: 'Kota Blitar',
    districts: [
      'Kepanjenkidul',
      'Sananwetan',
      'Sukorejo',
    ],
  },
  {
    name: 'Kabupaten Blitar',
    districts: [
      'Bakung',
      'Binangun',
      'Doko',
      'Gandusari',
      'Garum',
      'Kademangan',
      'Kanigoro',
      'Kesamben',
      'Nglegok',
      'Panggungrejo',
      'Ponggok',
      'Sanankulon',
      'Selopuro',
      'Selorejo',
      'Srengat',
      'Sutojayan',
      'Talun',
      'Udanawu',
      'Wates',
      'Wlingi',
      'Wonodadi',
      'Wonotirto',
    ],
  },
];