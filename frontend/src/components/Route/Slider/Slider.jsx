import { Carousel } from 'react-responsive-carousel';
import 'react-responsive-carousel/lib/styles/carousel.min.css';

const SmallCarousel = () => {
  return (
    <Carousel
      showArrows={true}
      showThumbs={false}
      showStatus={false}
      infiniteLoop={true}
      emulateTouch={true}
      stopOnHover={true}
      interval={5000} // Interval between slides in milliseconds (5 seconds in this case)
      swipeable={true}
      dynamicHeight={true}
      autoPlay={true} // Enables auto-sliding
      transitionTime={500} // Slide transition duration in milliseconds (0.5 seconds in this case)
      className="w-11/12 md:w-3/4 lg:w-1/3 mx-auto"
    >
      <div>
        <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTw50E4COH9s4Yrt87CmgqsmlTjo7KTW_2Shg&usqp=CAU" style={{height: '33vh'}}  alt="Slide 1"/>
      </div>
      <div>
        <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQeX920Hm2qoIbEp21ALL3ojCBmLEu4JqkPNQ&usqp=CAU" alt="Slide 2" />
      </div>
      <div>
        <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRFywIio62sfBJOXd8O5exrQJO3VDwxlt5IoA&usqp=CAU" alt="Slide 3" />
      </div>
    </Carousel>
  );
};

export default SmallCarousel;
