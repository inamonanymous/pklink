import { useState, useEffect } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
function Events() {
    const [date, setDate] = useState(new Date());

    const [events, setEvents] = useState([]);
    
    const eventData = [
        {
            "event_id": "20b5a93577d34de8993fee6e500784dd",
            "event_title": "Volleyball League",
            "event_description": "A, B, C, D divisions line-up application is now ongoing",
            "event_location": "Puting Kahoy Barangay Hall",
            "event_date": "2025-01-30",
            "event_start_time": "14:53:00",
            "event_end_time": "17:00:00",
        },
        {
            "event_id": "865b3318e3f74bdfa657ee6b687798cc",
            "event_title": "Volleyball League1",
            "event_description": "A, B, C, D divisions line-up application is now ongoing",
            "event_location": "Puting Kahoy Barangay Hall",
            "event_date": "2025-01-30",
            "event_start_time": "14:53:00",
            "event_end_time": "17:00:00",
        },
        {
            "event_id": "asdasdasd",
            "event_title": "Basketball League",
            "event_description": "Mosquito, Midget, Junior, Senior, Legend Division line-up application is now ongoing",
            "event_location": "Puting Kahoy Barangay Hall",
            "event_date": "2025-01-29",
            "event_start_time": "14:53:25",
            "event_end_time": "17:00:00",
        }
    ];

    useEffect(() => {
        setEvents(eventData);
    }, []);

    // Convert a date to Philippine timezone (UTC+8)
    const toPhilippineTime = (date) => {
        const offset = 8 * 60; // Offset in minutes for UTC+8
        return new Date(date.getTime() + offset * 60 * 1000);
    };

    const getEventsForDate = (selectedDate) => {
        const selectedDateStr = toPhilippineTime(selectedDate).toISOString().split('T')[0]; // Format the date to YYYY-MM-DD
        return events.filter(event => event.event_date === selectedDateStr);
    };

    const tileClassName = ({ date, view }) => {
        if (view === 'month') {
            const hasEvent = events.some(event => {
                const eventDate = new Date(event.event_date);
                const philippineDate = toPhilippineTime(date).toISOString().split('T')[0];
                return eventDate.toISOString().split('T')[0] === philippineDate;
            });
            return hasEvent ? 'highlight-event' : '';
        }
        return '';
    };

    const onCalendarChange = (newDate) => {
        setDate(newDate);
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
                onChange={onCalendarChange}
                value={date}
                tileClassName={tileClassName}
            />
            <div className='event-details'>
                {eventsForSelectedDate.length > 0 ? (
                    eventsForSelectedDate.map((event, index) => (
                        <div key={event.event_id} className='text-con'>
                            <h4 className='event-title'>
                                {event.event_title}
                            </h4>
                            <h5 className='event-description'>
                                {event.event_description}
                            </h5>
                            <h6 className='event-date'>
                                Date: {formatDate(date)}
                            </h6>
                            <div className='text-con'>
                                <h6 className='event-location'>
                                    Location: {event.event_location}
                                </h6>
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