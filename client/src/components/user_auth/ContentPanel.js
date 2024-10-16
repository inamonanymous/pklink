import ManageAccounts from "./manage_data/ManageAccounts";
import Posts from "./view_data/Posts";
import Events from "./view_data/Events";
import DocumentReq from "./view_data/DocumentReq";
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
            return <div>Health</div>;
          case 'report':
            return <div>Report</div>;
          case 'forms':
            return <div>Forms</div>;
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