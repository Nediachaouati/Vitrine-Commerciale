import config from '../../config';

export const GetUrlFile = (url: string) => {
  let resultat = config.API_BK + url;
  return resultat;
};

export const GetUrlImage = (url: string) => {
  let resultat = config.API_BK + url;
  return resultat;
};
