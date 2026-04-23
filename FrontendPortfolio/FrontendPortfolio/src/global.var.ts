import { RoleEnum } from './helpers/model/enum/role.enum';

export type RoutesPropsMenu = {
  id: string;
  label: string;
  link: string;
  roles?: string[];
  items?: ItemsRoutesPropsMenu[];
  type: string;
};

export type ItemsRoutesPropsMenu = {
  id: string;
  label: string;
  link: string;
  roles?: string[];
};

export const ListeRoutePrived: RoutesPropsMenu[] = [
  {
    id: 'analytics',
    label: 'Tableau de bord',
    link: '/',
    roles: [RoleEnum.ADMIN],
    type: 'link',
  },
  {
    id: 'gestionusers',
    label: 'Gestions utilisateurs',
    link: '/gestionusers',
    roles: [RoleEnum.ADMIN],
    type: 'link',
  },
 

  // {
  //   id: 'mylearning',
  //   label: 'Mes cours',
  //   link: '/my-learning',
  //   roles: [RoleEnum.ADMIN, RoleEnum.FORMATEUR, RoleEnum.APPRENANT],
  //   type: 'link',
  // },
  
  
  
];
