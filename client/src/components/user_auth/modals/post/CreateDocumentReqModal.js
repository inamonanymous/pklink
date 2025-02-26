import { useState, useEffect, useRef } from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Swal from "sweetalert2";
import httpClient from "../../../../httpClient";
import cert_brgy from "../../../../img/cert_brgy.jpg";
import cedula from "../../../../img/cedula.jpg";
import cert_indigency from "../../../../img/cert_indigency.jpg";
import business_permit from "../../../../img/business_permit.jpg";

const CreateDocumentReqModal = ({setRefreshRequests}) => {
    const [documentData, setDocumentData] = useState({
        req_document_type: "",
        req_additional_info: "",
        req_reason: "",
        req_description: "",
    });
    const [activeIndex, setActiveIndex] = useState(0);
    const [sliderRef, setSliderRef] = useState(null);
    const inputRef = useRef(null);
    const [searchTerm, setSearchTerm] = useState("");

    const allSlides = [
        { src: cert_brgy, label: "Barangay Certificate", value: "brgy_certificate" },
        { src: cedula, label: "Cedula", value: "cedula" },
        { src: cert_indigency, label: "Barangay Indigency", value: "brgy_indigency" },
        { src: business_permit, label: "Business Permit", value: "business_permit" },
    ];

    const sliderSettings = {
        centerMode: true,
        dots: true,
        speed: 500,
        slidesToShow: 3,
        slidesToScroll: 1,
        afterChange: (current) => setActiveIndex(current),
    };

    useEffect(() => {
        if (searchTerm && sliderRef) {
            const index = allSlides.findIndex(slide =>
                slide.label.toLowerCase().includes(searchTerm.toLowerCase())
            );
            if (index !== -1) {
                sliderRef.slickGoTo(index);
            }
        }
        if (inputRef.current) {
            inputRef.current.focus();
        }
    }, [searchTerm, sliderRef]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setDocumentData((prevInfo) => ({
            ...prevInfo,
            [name]: value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            document.body.style.cursor = "wait";
            const selectedDocument = allSlides[activeIndex]?.value;
            const dataToSend = { ...documentData, req_document_type: selectedDocument };
            const resp = await httpClient.post("/api/user/document_requests", dataToSend);

            if (resp.status === 201) {
                Swal.fire("Success!", "Your document request has been successfully submitted.", "success");
                setDocumentData({ req_document_type: "", req_additional_info: "", req_reason: "", req_description: "" });
                setRefreshRequests((prev) => !prev); // Toggle state to refresh
            }
        } catch (error) {
            console.error("Error submitting document request:", error);
            console.log(documentData);
            Swal.fire("Error!", `${error.response.data.message}`, "error");
        } finally {
            document.body.style.cursor = "default";
        }
    };


    return (
        <div className='document-req-create flex-col'>
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
                            name="req_description" 
                            value={documentData.req_description} 
                            onChange={handleInputChange} 
                            placeholder="Enter description"
                        />
                    </div>

                    <div className="input-con flex-col">
                        <label>Additional Info</label>
                        <input 
                            type="text" 
                            name="req_additional_info" 
                            value={documentData.req_additional_info} 
                            onChange={handleInputChange} 
                            placeholder="Enter additional info"
                        />
                    </div>

                    <div className="input-con flex-col">
                        <label>Reason</label>
                        <input 
                            type="text" 
                            name="req_reason" 
                            value={documentData.req_reason} 
                            onChange={handleInputChange} 
                            placeholder="Enter reason"
                        />
                    </div>
                </form>
            </div>

            <button className='large' onClick={handleSubmit}>
                Proceed
            </button>
        </div>
    );
};

export default CreateDocumentReqModal;
