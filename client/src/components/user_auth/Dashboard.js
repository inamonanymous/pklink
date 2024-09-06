import ContentPanel from "./ContentPanel";
import ProtectedComponent from "./ProtectedComponent";
import Sidebar from "./Sidebar";
import { useState } from "react";

function Dashboard() {
  const [currentView, setCurrentView] = useState('');
  const handleViewChange = (view) => {
    setCurrentView(view);
  };
    return (
      <ProtectedComponent>
        <>
          <Sidebar onViewChange={handleViewChange} />
          <ContentPanel currentView={currentView}/>
        </>
      </ProtectedComponent>

      
    );
  }
  
  export default Dashboard;
  