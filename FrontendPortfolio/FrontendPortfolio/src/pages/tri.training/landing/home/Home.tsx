import React from 'react';
import { useRedux } from '../../../../hooks';
import { RoleEnum } from '../../../../helpers/model/enum/role.enum';

const Home = () => {
  const { appSelector } = useRedux();

  const { userConnected } = appSelector((state: any) => ({
    userConnected: state.Auth.user ?? null,
  }));

  const roles = userConnected?.roles || [];
  const isAdmin = roles.includes(RoleEnum.ADMIN);
  const isManager = roles.includes(RoleEnum.MANAGER);
  const isCollaborateur = roles.includes(RoleEnum.COLLABORATEUR);

  let welcomeMessage = "Bienvenue sur la plateforme Vitrine";
  let subMessage = "Connectez-vous pour accéder à votre espace.";

  if (isAdmin) {
    welcomeMessage = "Bienvenue Admin";
    subMessage = "Vous avez accès à la gestion complète de la plateforme.";
  } else if (isManager) {
    welcomeMessage = "Bienvenue Manager";
    subMessage = "Gérez vos équipes et suivez les performances.";
  } else if (isCollaborateur) {
    welcomeMessage = "Bienvenue Collaborateur";
    subMessage = "Accédez à vos formations et outils personnels.";
  }

  return (
    <div className="p-8">
      <div className="max-w-2xl mx-auto text-center">
        <h1 className="text-4xl font-bold dark:text-white mb-4">
          {welcomeMessage}
        </h1>
        <p className="text-gray-500 dark:text-gray-400 text-lg">
          {subMessage}
        </p>

        {isAdmin && (
          <div className="mt-8 p-6 bg-primary/10 dark:bg-primary/5 rounded-2xl">
            <p className="text-primary font-medium">
              En tant qu'administrateur, vous pouvez gérer les utilisateurs, les formations, etc.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;