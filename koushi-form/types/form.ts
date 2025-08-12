export interface SeminarInfo {
  unitName: string;
  unitSlug: string;
  seminarDate: string;
  dayOfWeek: number;
}

export interface Address {
  zipCode: string;
  prefecture: string;
  city: string;
  street: string;
  buildingName?: string;
}

export interface SpeakerInfo {
  name: string;
  nameKana: string;
  companyName: string;
  position?: string;
  ethicsGroup?: string;
  ethicsPosition?: string;
  address: Address;
  mobile: string;
  email: string;
}

export interface SpeechInfo {
  theme: string;
  subTheme?: string;
  content: string;
  profile: string;
  ethicsHistory?: string;
  profileImageUrl?: string; // Google Drive URL
}

export interface PresentationStyle {
  handout: 'bring' | 'none' | 'print';
  handoutFileUrl?: string; // Google Drive URL
  projector: 'use' | 'not-use'; // 使用する/使用しない
  projectorDetails?: { // プロジェクター「使用しない」時のみ表示
    device: 'bring' | 'prepare' | 'none'; // スライド投影用のデバイス
    deviceOS?: 'Windows' | 'Mac' | 'iOS' | 'Android';
    cable?: 'HDMI' | 'VGA'; // 15ピン = VGA
  };
  whiteboard: 'use' | 'not-use'; // 使用する/使用しない
}

export interface Accommodation {
  stay: 'none' | 'need-smoking' | 'need-non-smoking'; // 必要なし/必要あり（喫煙）/必要あり（禁煙）
  photography: 'allowed' | 'not-allowed'; // 可/不可
  sns: 'allowed' | 'not-allowed'; // 可/不可
  notes?: string; // その他連絡事項（自由入力）
}

export interface FormData {
  seminarInfo: SeminarInfo;
  speakerInfo: SpeakerInfo;
  speechInfo: SpeechInfo;
  presentationStyle: PresentationStyle;
  accommodation: Accommodation;
}

export const defaultFormData: FormData = {
  seminarInfo: {
    unitName: '',
    unitSlug: '',
    seminarDate: '',
    dayOfWeek: -1,
  },
  speakerInfo: {
    name: '',
    nameKana: '',
    companyName: '',
    position: '',
    ethicsGroup: '',
    ethicsPosition: '',
    address: {
      zipCode: '',
      prefecture: '',
      city: '',
      street: '',
      buildingName: '',
    },
    mobile: '',
    email: '',
  },
  speechInfo: {
    theme: '',
    subTheme: '',
    content: '',
    profile: '',
    ethicsHistory: '',
    profileImageUrl: undefined,
  },
  presentationStyle: {
    handout: 'none',
    handoutFileUrl: undefined,
    projector: 'not-use',
    projectorDetails: undefined,
    whiteboard: 'not-use',
  },
  accommodation: {
    stay: 'none',
    photography: 'allowed', // 初期値は「可」
    sns: 'allowed',
    notes: '',
  },
};