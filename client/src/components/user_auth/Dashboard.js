import ProtectedComponent from "./ProtectedComponent";
import Sidebar from "./Sidebar";

function Dashboard() {
    return (
      <ProtectedComponent>
        
        <Sidebar>
          
        </Sidebar>
      </ProtectedComponent>
    );
  }
  
  export default Dashboard;
  