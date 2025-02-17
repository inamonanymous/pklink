import { useState } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import FetchData from '../FetchFunction'; // Import the FetchData function

function Events() {
    const [date, setDate] = useState(new Date());

    const { data: allEventsData, error, loading } = FetchData('/api/user/events');

    if (loading) return <p>Loading Events...</p>;
    if (error) return <p>Error loading events</p>;

    const toPhilippineTime = (date) => {
        return new Date(date.getTime() + 8 * 60 * 60 * 1000); // Convert to UTC+8
    };

    const getEventsForDate = (selectedDate) => {
        const selectedDateStr = toPhilippineTime(selectedDate).toISOString().split('T')[0];
        return allEventsData?.filter(event => event.event_date === selectedDateStr) || [];
    };

    const tileClassName = ({ date, view }) => {
        if (view === 'month') {
            const selectedDateStr = toPhilippineTime(date).toISOString().split('T')[0];
            const hasEvent = allEventsData?.some(event => event.event_date === selectedDateStr);
            return hasEvent ? 'highlight-event' : '';
        }
        return '';
    };

    const formatDate = (date) => {
        return toPhilippineTime(date).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            timeZone: 'Asia/Manila'
        });
    };

    const eventsForSelectedDate = getEventsForDate(date);

    return (
        <div id='events-con' className='flex'>
            <Calendar
                onChange={setDate}
                value={date}
                tileClassName={tileClassName}
            />
            <div className='event-details'>
                {eventsForSelectedDate.length > 0 ? (
                    eventsForSelectedDate.map((event) => (
                        <div key={event.event_id} className='text-con'>
                            <h4 className='event-title'>{event.event_title}</h4>
                            <h5 className='event-description'>{event.event_description}</h5>
                            <h6 className='event-date'>Date: {formatDate(date)}</h6>
                            <div className='text-con'>
                                <h6 className='event-location'>Location: {event.event_location}</h6>
                                <h6 className='event-time'>
                                    Time: {event.event_start_time} - {event.event_end_time}
                                </h6>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className='text-con'>
                        <h4>No Events</h4>
                        <p>Please select a date with events.</p>
                    </div>
                )}
            </div>
        </div>
    );
}

export default Events;
