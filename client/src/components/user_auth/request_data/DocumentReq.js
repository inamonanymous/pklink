import { useState, useEffect, useRef } from 'react';
import Slider from 'react-slick';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import cert_brgy from "../../../img/cert_brgy.jpg";
import cedula from "../../../img/cedula.jpg";
import cert_indigency from "../../../img/cert_indigency.jpg";
import business_permit from "../../../img/business_permit.jpg";
import httpClient from "../../../httpClient"; // Assuming you already have an httpClient set up
import Swal from 'sweetalert2'; // Import SweetAlert2

function DocumentReq() {
    const [activeIndex, setActiveIndex] = useState(0); // Track active slide index
    const [searchTerm, setSearchTerm] = useState("");
    const [sliderRef, setSliderRef] = useState(null);  // Store slider reference
    const inputRef = useRef(null); // Create a ref to track the input element
    const [formData, setFormData] = useState({
        description: "",
        additionalInfo: "",
        reason: ""
    });

    const sliderSettings = {
        centerMode: true,
        dots: true,
        speed: 500,
        slidesToShow: 3,
        slidesToScroll: 1,
        afterChange: (current) => setActiveIndex(current) // Update index on change
    };

    const allSlides = [
        { src: cert_brgy, label: "Barangay Certificate", value: "brgy_certificate" },
        { src: cedula, label: "Cedula", value: "cedula" },
        { src: cert_indigency, label: "Barangay Indigency", value: "brgy_indigency" },
        { src: business_permit, label: "Business Permit", value: "business_permit" }
    ];

    const handleProceed = async () => {
        const selectedDocument = allSlides[activeIndex]?.value;
        console.log("Selected Document:", selectedDocument);
        console.log("Form Data:", formData);

        // Prepare the data for the POST request
        const dataToSend = {
            req_document_type: selectedDocument,
            req_additional_info: formData.additionalInfo,
            req_reason: formData.reason,
            req_description: formData.description
        };

        try {
            document.body.style.cursor = 'wait';
            const response = await httpClient.post('/api/user/document_requests', dataToSend); // Assuming your backend endpoint is '/api/document-request'
            if (response.status === 201) {
                console.log('Document request successfully submitted:', response.data);
                setFormData({ description: "", additionalInfo: "", reason: "" });
                // Show confirmation modal using SweetAlert2
                Swal.fire({
                    title: 'Success!',
                    text: 'Your document request has been successfully submitted.',
                    icon: 'success',
                    confirmButtonText: 'OK'
                });
            }
        } catch (error) {
            console.error('Error submitting document request:', error);

            // Show error modal using SweetAlert2 in case of failure
            Swal.fire({
                title: 'Oops!',
                text: 'Something went wrong. Please try again.',
                icon: 'error',
                confirmButtonText: 'Try Again'
            });
        } finally {
            document.body.style.cursor = 'default';
        }
    };

    const handleInputChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    useEffect(() => {
        if (searchTerm && sliderRef) {
            const index = allSlides.findIndex(slide => 
                slide.label.toLowerCase().includes(searchTerm.toLowerCase())
            );
            if (index !== -1) {
                sliderRef.slickGoTo(index);  // Move to matched slide
            }
        }
        // Ensure focus is retained on input element after slider change
        if (inputRef.current) {
            inputRef.current.focus(); // Focus the input again after slider change
        }
    }, [searchTerm, sliderRef]);

    return (
        <div id="document-req-con" className='flex-col'>
            <div className='text-con flex head'>
                <h4>Choose Document Type</h4>
                <input 
                    ref={inputRef}
                    type="text" 
                    className='search' 
                    placeholder='Search Anything' 
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>

            <Slider ref={setSliderRef} {...sliderSettings}> 
                {allSlides.map((slide, index) => (
                    <div key={index} className='document-slide' data-value={slide.value}>
                        <div className='img-con'>
                            <img src={slide.src} alt={slide.label} />
                        </div>
                        <div className='text-con'>
                            <h4>{slide.label}</h4>
                        </div>
                    </div>
                ))}
            </Slider>

            <div className='form-con'>
                <form className="document-form user-side-forms flex-col">
                    <div className="input-con flex-col">
                        <label>Description</label>
                        <input 
                            type="text" 
                            name="description" 
                            value={formData.description} 
                            onChange={handleInputChange} 
                            placeholder="Enter description"
                        />
                    </div>

                    <div className="input-con flex-col">
                        <label>Additional Info</label>
                        <input 
                            type="text" 
                            name="additionalInfo" 
                            value={formData.additionalInfo} 
                            onChange={handleInputChange} 
                            placeholder="Enter additional info"
                        />
                    </div>

                    <div className="input-con flex-col">
                        <label>Reason</label>
                        <input 
                            type="text" 
                            name="reason" 
                            value={formData.reason} 
                            onChange={handleInputChange} 
                            placeholder="Enter reason"
                        />
                    </div>
                </form>
            </div>

            <button className='large' onClick={handleProceed}>
                Proceed
            </button>
        </div>
    );
}

export default DocumentReq;
