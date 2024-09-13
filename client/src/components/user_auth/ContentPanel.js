import ManageAccounts from "./manage_data/ManageAccounts";

function ContentPanel({ currentView }) {
    const renderContent = () => {
        switch (currentView) {
          case 'manage_accounts':
            return <ManageAccounts />;
          case 'manage_events':
            return <div>Manage Events View</div>;
          case 'manage_posts':
            return <div>Manage Posts View</div>;
          case 'manage_my_account':
            return <div>Manage my account</div>;
          default:
            return <div>Select</div>;
        }
      };
    return (
        renderContent()        
    );
}

export default ContentPanel;