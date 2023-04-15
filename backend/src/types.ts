export type IntraUser = {
  id: number;
  login: string;
  email: string;
  first_name: string;
  last_name: string;
  image: ImageType;
  staff: boolean;
};

export type ImageType = {
  url: string;
  versions: {
    large: string;
    medium: string;
    small: string;
    micro: string;
  };
};
