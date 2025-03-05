import Posts from "./request_data/Posts";
import Events from "./request_data/Events";
import DocumentReq from "./request_data/DocumentReq";
import HealthAssist from "./request_data/HealthAssist";
import ReportIncident from "./request_data/ReportIncident";
import Forms from "./request_data/Forms";
import ManageAccounts from "./manage_data/ManageAccounts";
import ManagePosts from "./manage_data/ManagePosts";
import ManageEvents from "./manage_data/ManageEvents";
import ManageDocumentReq from "./manage_data/ManageDocumentReq";
import ManageHealthAssist from "./manage_data/ManageHealthAssist";
import ManageReportIncident from "./manage_data/ManageReportIncidents";
import ManageCurrentUserAccount from "./manage_data/ManageCurrentUserAccount";
import ManageStreetsAndVillage from "./manage_data/ManageStreetsAndVillage";
import ManageResidentType from "./manage_data/ManageResidentType";
import ChartDashboard from "./request_data/ChartDashboard";

function ContentPanel({ currentView, userInformation }) {
    const renderContent = () => {
        switch (currentView) {
          case 'posts':
            return <Posts  />;
            case 'events':
              return <Events />;
          case 'document':
            return <DocumentReq />;
          case 'health':
            return <HealthAssist />;
          case 'report':
            return <ReportIncident />;
          case 'forms':
            return <Forms />;
          case 'manage_accounts':
            return <ManageAccounts /> ;
          case 'manage_events':
            return <ManageEvents />;
          case 'manage_posts':
            return <ManagePosts />;
          case 'manage_document_req':
            return <ManageDocumentReq />;
          case 'manage_health':
            return <ManageHealthAssist />;
          case 'manage_incidents':
            return <ManageReportIncident />;
          case 'manage_streets_villages':
            return <ManageStreetsAndVillage />;
          case 'manage_resident_type':
            return <ManageResidentType />;
          case 'view_charts':
            return <ChartDashboard />;
          /* case 'manage_forms':
            return <div>Create Form</div>; */
          case 'manage_my_account':
            return <ManageCurrentUserAccount userInformation={userInformation} />;
          default:
            return <Posts />;
        }
      };
    return (
      <section id="content-panel-ua">
        <div>
          {renderContent()}
        </div>
      </section>
    );
}

export default ContentPanel;