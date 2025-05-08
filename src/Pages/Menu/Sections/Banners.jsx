import { Splide, SplideSlide } from '@splidejs/react-splide';
import React, { useEffect, useState } from 'react';
import '@splidejs/react-splide/css';
import { useDispatch, useSelector } from 'react-redux';

const Banners = () => {
  const dispatch = useDispatch();
  const banners = useSelector(state => state.banner?.data);
  const [bannerData, setBannerData] = useState([]);

  useEffect(() => {
    setBannerData(banners);
  }, [banners]);

  return (
    <div className="w-full max-w-full pt-0 pb-2 md:px-2 py-8 text-white flex flex-col items-center justify-start space-y-4">
      {/* Splide Carousel */}
      <Splide
        key={bannerData.length} // Forces re-initialization
        className="w-full" // Ensure Splide takes full width
        options={{
          type: bannerData.length > 1 ? 'loop' : 'slide',
          rewind: true,
          autoplay: bannerData.length > 1,
          padding: '0%', // Fixes width issue
          interval: 3000,
          perPage: 1,
          pauseOnHover: true,
          arrows: false,
          pagination: bannerData.length > 1,
          gap: '1rem',
          breakpoints: {
            1024: { padding: '0%' },
            768: { padding: '0%' },
            480: { padding: '1%' },
          },
        }}
      >
        {bannerData.map((banner, index) => (
          <SplideSlide key={index} className="w-full max-w-full rounded-3xl">
            <img
              src={banner.image_link}
              className="w-full h-auto max-h-80 md:max-h-96 object-fit rounded-3xl"
              alt={`Banner ${index + 1}`}
            />
          </SplideSlide>
        ))}
      </Splide>
    </div>
  );
};

export default Banners;
