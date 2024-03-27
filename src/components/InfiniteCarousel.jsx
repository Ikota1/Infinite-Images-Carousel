import { useEffect, useRef, useState } from 'react';
import { useInView } from 'react-intersection-observer';
import { images } from '../constants/constants';

import classes from './InfiniteCarousel.module.css';

const INITIAL_IMAGES_LOAD_COUNT = 10;
const LOAD_ON_SCROLL_AMOUNT = 5;

const InfiniteCarousel = () => {
  const [displayedImages, setDisplayedImages] = useState(
    images.slice(0, INITIAL_IMAGES_LOAD_COUNT)
  );
  const currentIndexRef = useRef(INITIAL_IMAGES_LOAD_COUNT);
  const { ref, inView } = useInView({
    threshold: 0.1,
    initialInView: false,
  });

  const containerRef = useRef(null);

  const loadMoreImages = () => {
    const nextImages = [];

    for (let i = 0; i < LOAD_ON_SCROLL_AMOUNT; i++) {
      nextImages.push(images[currentIndexRef.current % images.length]);

      currentIndexRef.current++;
    }

    setDisplayedImages((prevImages) => {
      let widthToDeduct = 0;

      prevImages.slice(0, 5).forEach((imgSrc) => {
        let image = document.querySelector(`img[src="${imgSrc}"]`);

        if (image) {
          widthToDeduct += image.width;
        }
      });

      containerRef.current.scrollLeft =
        containerRef.current.scrollLeft - widthToDeduct;

      return [...prevImages.slice(5), ...nextImages];
    });
  };

  useEffect(() => {
    if (inView) {
      loadMoreImages();
    }
  }, [inView]);

  return (
    <div ref={containerRef} className={classes.carouselContainer}>
      {displayedImages.map((imgSrc, index) => (
        <img key={index} src={imgSrc} className={classes.carouselImg} />
      ))}
      <div ref={ref} className={classes.infImgCarousel}></div>
    </div>
  );
};

export default InfiniteCarousel;
