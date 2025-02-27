import { ReactComponent as AnnouncementLogo } from '../../img/announcement_logo.svg';
import { ReactComponent as CalendarLogo } from '../../img/calendar_logo.svg';
import { ReactComponent as DocRequestLogo } from '../../img/docrequest_logo.svg';
import { ReactComponent as HealthLogo } from '../../img/healthrequest_logo.svg';
import { ReactComponent as ReportLogo } from '../../img/report_logo.svg';
import { ReactComponent as FormsLogo } from '../../img/forms_logo.svg';
import { ReactComponent as TextLogoWhite } from '../../img/text_logo_white.svg';
import { useTranslation } from 'react-i18next';
import LanguageSwitcher from '../../LanguageSwitcher';

function Sidebar({ onViewChange, activeView, priveleges }) {
    const { t } = useTranslation();

    // Use a function to get translations dynamically
    const getMenuItems = () => [
        { name: t('menu.community_updates'), view: 'posts', Icon: AnnouncementLogo },
        { name: t('menu.upcoming_events'), view: 'events', Icon: CalendarLogo },
        { name: t('menu.document_requests'), view: 'document', Icon: DocRequestLogo },
        { name: t('menu.health_assistance'), view: 'health', Icon: HealthLogo },
        { name: t('menu.report_issue'), view: 'report', Icon: ReportLogo },
    ];

    return (
        <aside id="sidebar-ua" className="flex-col">
            <div className="img-con">
                <TextLogoWhite />
            </div>

            {getMenuItems().map(({ name, view, Icon }) => (
                <div key={view} className={`text-con flex ${activeView === view ? 'focused' : ''}`}>
                    <div className="img-con">
                        <Icon /> {/* Fixes incorrect usage of `<item.Icon />` */}
                    </div>
                    <a href="#" onClick={(e) => { 
                        e.preventDefault(); // Prevents page from jumping to the top
                        onViewChange(view); 
                    }}>
                        {name}
                    </a>
                </div>
            ))}

            <LanguageSwitcher />
        </aside>
    );
}

export default Sidebar;
