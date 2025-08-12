export interface Unit {
  name: string;
  slug: string;
  dayOfWeek: number; // 0: 日曜日, 1: 月曜日, ..., 6: 土曜日
}

export const UNITS: Record<string, Unit> = {
  otsu: {
    name: '大津市倫理法人会',
    slug: 'otsu',
    dayOfWeek: 5, // 金曜日
  },
  'otsu-minami': {
    name: '大津市南倫理法人会',
    slug: 'otsu-minami',
    dayOfWeek: 6, // 土曜日
  },
  kusatsu: {
    name: '草津市倫理法人会',
    slug: 'kusatsu',
    dayOfWeek: 2, // 火曜日
  },
  ritto: {
    name: '栗東市倫理法人会',
    slug: 'ritto',
    dayOfWeek: 5, // 金曜日
  },
  moriyama: {
    name: '守山市倫理法人会',
    slug: 'moriyama',
    dayOfWeek: 4, // 木曜日
  },
  'omi-hachiman': {
    name: '近江八幡市倫理法人会',
    slug: 'omi-hachiman',
    dayOfWeek: 2, // 火曜日
  },
  koka: {
    name: '甲賀市倫理法人会',
    slug: 'koka',
    dayOfWeek: 3, // 水曜日
  },
  higashiomi: {
    name: '東近江市倫理法人会',
    slug: 'higashiomi',
    dayOfWeek: 4, // 木曜日
  },
  hikone: {
    name: '彦根市倫理法人会',
    slug: 'hikone',
    dayOfWeek: 6, // 土曜日
  },
  nagahama: {
    name: '長浜市倫理法人会',
    slug: 'nagahama',
    dayOfWeek: 3, // 水曜日
  },
};