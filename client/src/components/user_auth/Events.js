import { useState } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
function Events() {
    const [date, setDate] = useState(new Date());

    const onCalendarChange = (newDate) => {
        setDate(newDate);
        console.log(date)
    };

    // Function to format the date in a human-readable form, e.g., "September 19, 2024"
    const formatDate = (date) => {
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    return (
        <div id='events-con' className='flex'>
            <Calendar onChange={onCalendarChange} value={date} />
            <div className='event-details'>
                <div className='text-con'>
                    <h4 className='event-title'>
                        Barangay Assembly Meeting
                    </h4>
                    <h5 className='event-description'>
                        Waste Management and Cleanliness Drive
                    </h5>
                    
                    <h6 className='event-date'>
                        Date: {formatDate(date)}
                    </h6>
                </div>
                <div className='text-con'>
                    <h6 className='event-time'>
                        Time: 8:00 AM - 10:00 AM
                    </h6>
                    <h6 className='event-location'>
                        Location: Puting Kahoy Covered Court
                    </h6>
                    <h6 className='agenda'>
                        Agenda
                    </h6>
                    <ol>
                        <li>
                            Update on Barangay Waste Collection Schedule
                        </li>
                        <li>
                            Introduction of New Recycling Program
                        </li>
                    </ol>
                    <h6 className='reminders'>
                        Important Reminders
                    </h6>
                    <ul>
                        <li>
                            All residents are encouraged to attend.
                        </li>
                        <li>
                            Health protocols will be strictly followed.
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    );
}

export default Events;