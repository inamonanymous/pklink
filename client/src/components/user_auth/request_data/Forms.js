function Forms() {
    return (
        <div id="forms-con" className="flex-col">
            <div className='text-con head'>
                <h4>Select Form</h4>
            </div>
            <div className='table-con'>
                <p className='title'>Available Forms</p>
                <table>
                    <thead>
                        <th>
                            <p>No.</p>
                        </th>
                        <th>
                            <p>No. of Submits</p>
                        </th>
                        <th>
                            <p>Form Title</p>
                        </th>
                        <th>
                            <p>Status</p>
                        </th>
                        <th></th>
                    </thead>
                    <tbody>
                        <tr key="">
                            <td>
                                <p>01</p>
                            </td>
                            <td className='form-submits'>
                                <p>150</p>
                            </td>
                            <td className='form-title'>
                                <p>Mobile Legends</p>
                            </td>
                            <td className='form-status'>
                                <p>Completed</p>
                            </td>
                            <td>
                                <button className='proceed-btn'>Proceed</button>
                            </td>
                        </tr>
                        <tr key="">
                            <td>
                                <p>02</p>
                            </td>
                            <td className='form-submits'>
                                <p>150</p>
                            </td>
                            <td className='form-title'>
                                Basketball League
                            </td>
                            <td className='form-status'>
                                <p>Completed</p>
                            </td>
                            <td>
                                <button className='proceed-btn'>Proceed</button>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default Forms;