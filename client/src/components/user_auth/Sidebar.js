import { ReactComponent as AnnouncementLogo } from '../../img/announcement_logo.svg';
import { ReactComponent as CalendarLogo } from '../../img/calendar_logo.svg';
import { ReactComponent as DocRequestLogo } from '../../img/docrequest_logo.svg';
import { ReactComponent as HealthLogo } from '../../img/healthrequest_logo.svg';
import { ReactComponent as ReportLogo } from '../../img/report_logo.svg';
import { ReactComponent as FormsLogo } from '../../img/forms_logo.svg';

import { ReactComponent as TextLogoWhite } from '../../img/text_logo_white.svg';

const menuItems = [
    { name: 'Community Updates', view: 'posts', Icon: AnnouncementLogo },
    { name: 'Upcoming Events', view: 'events', Icon: CalendarLogo },
    { name: 'Document Requests', view: 'document', Icon: DocRequestLogo },
    { name: 'Health Assistance', view: 'health', Icon: HealthLogo },
    { name: 'Report an Issue', view: 'report', Icon: ReportLogo },
    /* { name: 'Fill out Forms', view: 'forms', Icon: FormsLogo }, */
];


function Sidebar({ onViewChange, activeView, priveleges }) {
    return (
        <aside id="sidebar-ua" className="flex-col" >
            <div className="img-con">
                <TextLogoWhite />
            </div>

            {menuItems.map((item) => (
                <div key={item.view} className={`text-con flex ${activeView === item.view ? 'focused' : ''}`}>
                    <div className="img-con">
                        <item.Icon />
                    </div>
                    <a href="#" onClick={() => { onViewChange(item.view); }}>
                        {item.name}
                    </a>
                </div>
            ))}
        </aside>
    );
}

export default Sidebar;
