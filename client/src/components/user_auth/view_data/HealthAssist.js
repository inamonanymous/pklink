function HealthAssist() {
    return (
        <>
            <div id="health-assist-con" className="flex-col">
                <div className='text-con head'>
                    <h4>Request Health Assistance</h4>
                </div>
                <div className="form-con">
                    <form className="user-side-forms flex-col">
                        <div className="input-con flex-col">
                            <label>
                                How Can We Assist with Your Health Support?
                            </label>
                            <input type="text" placeholder="Enter your answer here"/>
                        </div>
                        <div className="input-con flex-col">
                            <label>
                                How Can We Assist with Your Health Support?
                            </label>
                            <input type="text" placeholder="Enter your answer here"/>
                        </div>
                        <div className="input-con flex-col">
                            <label>
                                How Can We Assist with Your Health Support?
                            </label>
                            <input type="text" placeholder="Enter your answer here"/>
                        </div>
                        <button type="submit" >Submit</button>
                    </form>
                </div>
            </div>
        </>
    );
}

export default HealthAssist