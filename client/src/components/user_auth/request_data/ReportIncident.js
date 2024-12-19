function ReportIncident() {
    return (
        <>
            <div id="report-incident-con" className="flex-col">
                <div className='text-con head'>
                    <h4>Report Incident</h4>
                </div>
                <div className="form-con">
                    <form className="user-side-forms flex-col">
                        <div className="input-con flex-col">
                            <label>
                                Briefly Describe the Incident.
                            </label>
                            <input type="text" placeholder="Enter your answer here"/>
                        </div>
                        <div className="input-con flex-col">
                            <label>
                                Where did the incident Occur?
                            </label>
                            <input type="text" placeholder="Enter your answer here"/>
                        </div>
                        <div className="input-con flex-col">
                            <label>
                                Provide a Photo Related to the Incident.
                            </label>
                            <input type="file" name="" required="" />
                        </div>
                        <button type="submit" >Submit</button>
                    </form>
                </div>
            </div>
        </>
    );
}

export default ReportIncident;