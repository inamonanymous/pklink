import ContentPanel from "../components/user_auth/ContentPanel";
import ProtectedComponent from "../components/user_auth/ProtectedComponent";
import Sidebar from "../components/user_auth/Sidebar";
import Header from "../components/user_auth/Header";
import '../css/UserAuth.css';
import { useState } from "react";

function Dashboard() {
  const [currentView, setCurrentView] = useState('');
  
  const handleViewChange = (view) => {
    setCurrentView(view);
  };

  return (
    <ProtectedComponent>
      {userPriveleges => (
        <>
          <Header priveleges={userPriveleges} />
          <Sidebar onViewChange={handleViewChange} />
          <ContentPanel currentView={currentView} />
        </>
      )}
    </ProtectedComponent>
  );
}

export default Dashboard;
