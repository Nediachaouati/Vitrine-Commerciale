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
    link: '/analytics',
    roles: [RoleEnum.ADMIN, RoleEnum.FORMATEUR],
    type: 'link',
  },
  {
    id: 'gestionformations',
    label: 'Gestions formations',
    link: '/gestionformations',
    roles: [RoleEnum.ADMIN, RoleEnum.FORMATEUR],
    type: 'link',
  },
  {
    id: 'gestioncours',
    label: 'Gestions cours',
    link: '/gestioncours',
    roles: [RoleEnum.ADMIN, RoleEnum.FORMATEUR],
    type: 'link',
  },

  // {
  //   id: 'mylearning',
  //   label: 'Mes cours',
  //   link: '/my-learning',
  //   roles: [RoleEnum.ADMIN, RoleEnum.FORMATEUR, RoleEnum.APPRENANT],
  //   type: 'link',
  // },
  {
    id: 'gestionsessions',
    label: 'Gestion sessions',
    link: '/gestionsessions',
    roles: [RoleEnum.ADMIN, RoleEnum.FORMATEUR, RoleEnum.APPRENANT],
    type: 'link',
  },
  {
    id: 'Gestioncertification',
    label: 'Gestion certification',
    link: '',
    roles: [RoleEnum.ADMIN, RoleEnum.FORMATEUR, RoleEnum.APPRENANT],
    type: 'menu',
    items: [
      {
        id: 'GestionResultat',
        label: 'Gestion Resultat',
        link: '/GestionResultat',
        roles: [RoleEnum.ADMIN, RoleEnum.FORMATEUR, RoleEnum.APPRENANT],
      },
      {
        id: 'PrintCertif',
        label: 'Print Certif',
        link: '/PrintCertif',
        roles: [RoleEnum.ADMIN, RoleEnum.FORMATEUR, RoleEnum.APPRENANT],
      },
    ],
  },
  {
    id: 'Configuration',
    label: 'Configuration',
    link: '',
    roles: [RoleEnum.ADMIN],
    type: 'menu',
    items: [
      {
        id: 'gestionutlilisateurs',
        label: 'Gestion utlilisateurs',
        link: '/gestionutlilisateurs',
        roles: [RoleEnum.ADMIN],
      },
      {
        id: 'GestionCategories',
        label: 'Gestion catégories',
        link: '/GestionCategories',
        roles: [RoleEnum.ADMIN],
      },
      {
        id: 'gestionlevels',
        label: 'Gestion niveaux',
        link: '/gestionlevels',
        roles: [RoleEnum.ADMIN],
      },

      {
        id: 'gestionteams',
        label: 'Gestion équipes',
        link: '/gestionteams',
        roles: [RoleEnum.ADMIN],
      },
    ],
  },
  {
    id: 'Chat',
    label: 'Chat',
    link: '/chat',
    roles: [RoleEnum.ADMIN, RoleEnum.FORMATEUR, RoleEnum.APPRENANT],
    type: 'link',
  },
];
