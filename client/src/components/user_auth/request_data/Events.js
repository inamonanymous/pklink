import { useState } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import FetchData from '../FetchFunction'; // Import the FetchData function
import { useTranslation } from 'react-i18next';

function Events() {
    const { t } = useTranslation();
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
                            <h4 className='event-title'>
                                <strong>{t('content_panel.events.title')}:</strong> {event.event_title}
                            </h4>
                            <h5 className='event-description'>
                                <strong>{t('content_panel.events.description')}:</strong> {event.event_description}
                            </h5>
                            <h6 className='event-date'>
                                <strong>Date:</strong> {formatDate(date)}
                            </h6>
                            <div className='text-con'>
                                <h6 className='event-location'>
                                    <strong>{t('content_panel.events.location')}:</strong> {event.event_location}
                                </h6>
                                <h6 className='event-time'>
                                    <strong>{t('content_panel.events.time')}:</strong> {event.event_start_time} - {event.event_end_time}
                                </h6>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className='text-con'>
                        <h4>{t('content_panel.events.no_events')}</h4>
                        <p>{t('content_panel.events.instruction')}</p>
                    </div>
                )}
            </div>
        </div>
    );
}

export default Events;
