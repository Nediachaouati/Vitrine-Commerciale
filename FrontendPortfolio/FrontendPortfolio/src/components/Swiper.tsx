import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import { Navigation, Pagination, Autoplay } from 'swiper';

interface SwiperrProps {
  items: string[];
  rtlClass: string;
}

const Swiperr: React.FC<SwiperrProps> = ({ items, rtlClass }) => {
  return (
    <Swiper
      modules={[Navigation, Autoplay, Pagination]}
      navigation={{ nextEl: '.swiper-button-next-ex2', prevEl: '.swiper-button-prev-ex2' }}
      pagination={{ clickable: true }}
      autoplay={{ delay: 2000 }}
      className="swiper"
      id="slider2"
      dir={rtlClass}
      key={rtlClass === 'rtl' ? 'true' : 'false'}
      style={{ height: '100%', width: '100%' }}
    >
      {items.map((item, i) => (
        <SwiperSlide key={i} style={{ height: '100%', width: '100%' }}>
          <img src={`/assets/images/${item}`} style={{ width: '100%', height: '100%', objectFit: 'cover' }} alt={`carousel${i}`} />
        </SwiperSlide>
      ))}
    </Swiper>
  );
};

export default Swiperr;
