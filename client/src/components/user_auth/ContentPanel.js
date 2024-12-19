import Posts from "./request_data/Posts";
import Events from "./request_data/Events";
import DocumentReq from "./request_data/DocumentReq";
import HealthAssist from "./request_data/HealthAssist";
import ReportIncident from "./request_data/ReportIncident";
import ManageAccounts from "./manage_data/ManageAccounts";
import Forms from "./request_data/Forms";

function ContentPanel({ currentView }) {
    const renderContent = () => {
        switch (currentView) {
          case 'posts':
            return <Posts />;
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
            return <div>Manage Events View</div>;
          case 'manage_posts':
            return <div>Manage Posts View</div>;
          case 'manage_health':
            return <div>Manage Health Support Entries</div>;
          case 'manage_incidents':
            return <div>Manage Incidents</div>;
          case 'manage_forms':
            return <div>Create Form</div>;
          case 'manage_my_account':
            return <div>Manage my account</div>;
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