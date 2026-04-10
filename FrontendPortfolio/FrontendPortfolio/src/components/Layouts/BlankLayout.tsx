import { PropsWithChildren } from 'react';
import { Outlet } from 'react-router-dom';

const BlankLayout = ({ children }: PropsWithChildren) => {
    return (
        <>
            <div className="text-black dark:text-white-dark min-h-screen"><Outlet/> </div>
        </>
    );
};

export default BlankLayout;
