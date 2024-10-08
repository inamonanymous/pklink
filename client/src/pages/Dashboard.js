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
          <main id="main-ua" className="user-auth">
            <div className="flex">
              <Sidebar onViewChange={handleViewChange} priveleges={userPriveleges} />
              <ContentPanel currentView={currentView} />
            </div>
          </main>
        </>
      )}
    </ProtectedComponent>
  );
}

export default Dashboard;
