import { Navigate } from 'react-router-dom';
import { useUser } from '../hooks';

const Root = () => {
  const [loggedInUser] = useUser();
  const getRootUrl = () => {
    let url: string = 'home';

    return url;
  };

  const url = getRootUrl();

  return <Navigate to={`/${url}`} />;
};

export default Root;
