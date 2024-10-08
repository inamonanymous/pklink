import { ReactComponent as AnnouncementLogo } from '../../img/announcement_logo.svg';
import { ReactComponent as CalendarLogo } from '../../img/calendar_logo.svg';
import { ReactComponent as DocRequestLogo } from '../../img/docrequest_logo.svg';
import { ReactComponent as HealthLogo } from '../../img/healthrequest_logo.svg';
import { ReactComponent as ReportLogo } from '../../img/report_logo.svg';
import { ReactComponent as FormsLogo } from '../../img/forms_logo.svg';

import { ReactComponent as TextLogoWhite } from '../../img/text_logo_white.svg';


//onViewChange parameter for dashboard that will change content panel 
function Sidebar( { onViewChange, priveleges } ) {

    return(
            <aside id="sidebar-ua" className="flex-col">
                <div className="img-con">
                    <TextLogoWhite />
                </div>
                <div className="text-con flex">
                    <div className="img-con">
                        <AnnouncementLogo />
                    </div>
                    <a href="#" onClick={() => {onViewChange('posts');}}> 
                        Community Updates
                    </a>
                </div>
                <div className="text-con flex">
                    <div className="img-con">
                        <CalendarLogo />
                    </div>
                    <a href="#"> 
                        Upcoming Events
                    </a>
                </div>
                <div className="text-con flex">
                    <div className="img-con">
                        <DocRequestLogo />
                    </div>
                    <a href="#"> 
                        Document Requests
                    </a>
                </div>
                <div className="text-con flex">
                    <div className="img-con">
                        <HealthLogo />
                    </div>
                    <a href="#"> 
                        Health Assistance
                    </a>
                </div>
                <div className="text-con flex">
                    <div className="img-con">
                        <ReportLogo />
                    </div>
                    <a href="#"> 
                        Report an Issue
                    </a>
                </div>
                <div className="text-con flex">
                    <div className="img-con">
                        <FormsLogo />
                    </div>
                    <a href="#"> 
                        Fill out Forms
                    </a>
                </div>
                {priveleges?.view_accounts ? (
                    <div className="text-con flex">
                        <div className="img-con">
                            <img src="" alt="" />
                        </div>
                        <a href="#" onClick={() => {onViewChange('manage_accounts');}} >
                            Manage Accounts
                        </a>
                    </div>
                ) : null}
                {priveleges?.manage_event ? (
                    <div className="text-con flex">
                        <div className="img-con">
                            <img src="" alt="" />
                        </div>
                        <a href="#" onClick={() => {onViewChange('manage_event');}}>
                        Manage Events
                    </a>
                    </div>
                ) : null}
                {priveleges?.manage_post ? (
                    <div className="text-con flex">
                        <div className="img-con">
                            <img src="" alt="" />
                        </div>
                        <a href="#" onClick={() => {onViewChange('manage_posts');}}>
                        Manage Posts
                    </a>
                    </div>
                ): null}
                
                
                <div className="text-con flex">
                    <div className="img-con">
                        <img src="" alt="" />
                    </div>
                    <a href="#" onClick={() => {onViewChange('manage_my_account');}}>
                        Manage My Account
                    </a>
                </div>
            </aside>
    );
}

export default Sidebar;