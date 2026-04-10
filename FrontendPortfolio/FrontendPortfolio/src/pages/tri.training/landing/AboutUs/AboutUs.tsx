import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setPageTitle } from '../../../../store/themeConfigSlice';

import { IRootState } from '../../../../Redux/store';
import Swiperr from '../../../../components/Swiper';

const AboutUs = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(setPageTitle('About Us'));

    document.body.classList.add('hide-footer');

    return () => {
      document.body.classList.remove('hide-footer');
    };
  }, [dispatch]);

  const items = ['33.jpg', '20.jpg', '1.jpg'];
  const themeConfig = useSelector((state: IRootState) => state.themeConfig);

  return (
    <div className={` animate__fadeIn animate__animated`}>
      <div className="h-[65vh] overflow-hidden m-0 p-0">
        <img src="assets/images/33.jpg  " className="w-full h-full object-cover" />
      </div>

      <div className=" text-center  my-[6rem]">
        <h3 className="text-xl font-bold md:text-center md:text-4xl text-primary">Tri-Vitrine</h3>
        <div className="mt-[3rem]">
          <h3 className=" text-base font-bold md:text-xl text-red-800">Ouvrez la porte à un univers infini d’apprentissage !</h3>
        </div>
        <div className="font-bold mt-[1rem]">
          Avec Tri-Training, découvrez de nouvelles approches pour réinventer la formation en ligne. <br />
          Grâce à des techniques innovantes, ce projet personnalise votre parcours et vous propose des recommandations de cours adaptées à vos besoins uniques.
        </div>
      </div>
      <div className="panel flex flex-wrap text-center justify-center items-center h-auto mb-[2rem]">
        <div className="w-full lg:w-1/2 pr-4 flex flex-col ">
          <h3 className="mb-6 text-xl font-bold md:text-3xl text-red-500">Triweb</h3>
          <h3 className="mb-6 text-base font-bold md:text-xl text-red-800">Agence de production web offshore</h3>
          <div className="font-bold">Triweb, une équipe jeune, dynamique et professionnelle, unie par la même vision</div>
          <div className="justify-start text-start flex mt-[1rem]">
            Depuis 2014, Triweb se distingue dans le domaine du marketing digital et de la conception de sites web clé en main. <br />
            Nous étudions attentivement votre cahier des charges afin de développer votre projet en accord avec vos objectifs et vos exigences en webmarketing. <br />
            À chaque étape du développement, nous accordons une attention particulière aux aspects techniques et esthétiques pour renforcer votre visibilité en ligne. <br />
            Professionnels et engagés, nous mettons notre expertise au service de vos ambitions afin de livrer une production à la hauteur de notre marque, dans les délais convenus.
          </div>
        </div>
        <div className="w-full lg:w-1/3 ml-5">
          <img src="/assets/images/ab.jpg" alt="Triweb" className="w-full h-auto" />
        </div>
      </div>
    </div>
  );
};

export default AboutUs;
