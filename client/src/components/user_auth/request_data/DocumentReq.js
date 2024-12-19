import Slider from 'react-slick';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import cert_brgy from "../../../img/cert_brgy.jpg";
import cedula from "../../../img/cedula.jpg";
import cert_indigency from "../../../img/cert_indigency.jpg";
import business_permit from "../../../img/business_permit.jpg";

function DocumentReq() {
    var sliderSettings = {
        centerMode: true,
        dots: true,
        speed: 500,
        slidesToShow: 3,
        slidesToScroll: 1,
        focusOnSelect: true
    };
    

    return (
        <div id="document-req-con">
            <div className='text-con flex head'>
                <h4>Choose Document Type</h4>
                <input type="text" className='search' placeholder='Search Anything' />
            </div>
            <Slider {...sliderSettings}> 
                <div className='document-slide'>
                    <div className='img-con'>
                        <img src={cert_brgy} alt="" />
                    </div>
                    <div className='text-con'>
                        <h4>
                            Barangay Certificate
                        </h4>
                    </div>
                </div>
                <div className='document-slide'>
                    <div className='img-con'>
                        <img src={cedula} alt="" />
                    </div>
                    <div className='text-con'>
                        <h4>
                            Cedula
                        </h4>
                    </div>
                </div>
                <div className='document-slide'>
                    <div className='img-con'>
                        <img src={cert_indigency} alt="" />
                    </div>
                    <div className='text-con'>
                        <h4>
                            Barangay Indigency
                        </h4>
                    </div>
                </div>
                <div className='document-slide'>
                    <div className='img-con'>
                        <img src={business_permit} alt="" />
                    </div>
                    <div className='text-con'>
                        <h4>
                            Business Permit
                        </h4>
                    </div>
                </div>
            </Slider>
        </div>
    );
}

export default DocumentReq;