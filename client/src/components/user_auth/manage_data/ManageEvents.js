import { useState } from "react";
function ManageEvents() {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const handleModalToggle = () => {
        setIsModalOpen((prevState) => !prevState);
    };

    return (
        <div id="manage-events" className="flex">
            <div id="events-controls" >
                <button
                    onClick={handleModalToggle}
                    >
                    Create New Event
                    </button>
                {isModalOpen && (
                    <form>
                        <div className="flex-col">
                            <input type="text" placeholder="Title"/>
                            <input type="text" placeholder="Location"/>
                            <textarea cols="30" rows="10" placeholder="Description">

                            </textarea>
                            <input type="time" placeholder="Event date"/>
                            <input type="date" placeholder="Start time"/>
                            <input type="time" placeholder="Snd time"/>
                        </div>
                        <button type="submit">Submit</button>
                    </form>
                )}
            </div>
        </div>
    );
}

export default ManageEvents;