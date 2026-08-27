export interface NavItem {
  title: string;
  url: string;
  desc: string;
  icon?: string;
}

export interface CategoryData {
  id: string;
  name: string;
  icon: string;
  items: NavItem[];
}

export interface CryptoPrices {
  btcPrice: string;
  ethPrice: string;
  ethBtcPrice: string;
  lastUpdated?: Date;
  loading: boolean;
}
