//onViewChange parameter for dashboard that will change content panel 
function Sidebar( { onViewChange, priveleges } ) {

    return(
            <aside id="login-sidebar">
                {priveleges?.view_accounts ? (
                    <button onClick={() => {onViewChange('manage_accounts');}} >
                        Manage Accounts
                    </button>
                ) : null}
                {priveleges?.manage_event ? (
                    <button onClick={() => {onViewChange('manage_event');}}>
                    Manage Events
                </button>
                ) : null}
                {priveleges?.manage_post ? (
                    <button onClick={() => {onViewChange('manage_posts');}}>
                    Manage Posts
                </button>
                ): null}
                
                
                <button onClick={() => {onViewChange('manage_my_account');}}>
                    Manage My Account
                </button>
            </aside>
    );
}

export default Sidebar;