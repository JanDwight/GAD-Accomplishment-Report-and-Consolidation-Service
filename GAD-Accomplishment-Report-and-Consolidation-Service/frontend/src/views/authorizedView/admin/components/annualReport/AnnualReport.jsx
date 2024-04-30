import React, { useEffect, useState } from 'react';
import axiosClient from '../../../../axios/axios';
import * as XLSX from 'xlsx';
import NeutralButton from '../../../../components/buttons/NeutralButton';
//#D8D8D8 ---> grey


export default function AnnualReport() {
    
    const [clientMandate, setClientMandate] = useState([]);
    const [organizationMandate, setOrganizationMandate] = useState([]);

    const [totalMale, setTotalMale] = useState('');
    const [totalFemale, setTotalFemale] = useState('');

    const [totalExpenses, setTotalExpenses] = useState('');
    //const [totalAttribution, setTotalAttribution] = useState('');


    useEffect(() => {
        fetchMandate();
    }, []);

    const fetchMandate = async () => {
        try {
            const response = await axiosClient.get('/showact_mandates');
            if (response.data) {
                console.log('Return Client: ', response.data.Client);
                console.log('Return Organization: ', response.data.Organization);
                if (response.data.Client !== undefined) {
                    setClientMandate(response.data.Client)
                }
                if (response.data.Organization !== undefined) {
                    setOrganizationMandate(response.data.Organization)
                }
            } else {
                console.error('Invalid response format:', response.data);
            }
        } catch (error) {
            console.error(error);
        }
    };

    //-----CSS
    const thStyles = {
        border: '1px solid black',
        padding: '10px',
        textAlign: 'center',
        backgroundColor: '#FFFF00',
        whiteSpace: 'pre-wrap',
        fontSize: '12px'
    };

    const trStyles = {
        border: '2px solid black',
        padding: '5px',
        backgroundColor: 'white',
        verticalAlign: 'top',
        whiteSpace: 'pre-wrap'
    };

    const tnStyles = {
        border: '1px solid black',
        padding: '5px',
        backgroundColor: 'white',
        textAlign: 'left',
        verticalAlign: 'top',
        whiteSpace: 'pre-wrap',
        fontSize: '12px'
    };

    const tvStyles = {
        border: '1px solid black',
        padding: '5px',
        backgroundColor: 'white',
        textAlign: 'center',
        verticalAlign: 'top',
        whiteSpace: 'pre-wrap',
        fontSize: '12px'
    };
    //-----CSS

    const exportToExcel = () => {
       // Get the worksheet from the table
       const ws = XLSX.utils.table_to_sheet(document.getElementById('report-table'));

       // Set column widths
       ws['!cols'] = [
            { width: 2 },
            { width: 20 }, // Column A GENDER ISSUE / GAD MANDATE
            { width: 20 }, // Column B CAUSE OF GENDER ISSUE
            { width: 20 }, // Column C GAD RESULT STATEMENT / GAD OBJECTIVE
            { width: 20 }, // Column D GAD ACTIVITY
            { width: 20 }, // Column E PERFORMANCE INDICATORS / TARGETS
            { width: 20 }, // Column F TARGET RESULT
            { width: 10 }, // Column G ATTENDANCE->Male
            { width: 10 }, // Column H ATTENDANCE->Female
            { width: 13 }, // Column I ACTUAL COST->(Blank) 
            { width: 13 }, // Column J ACTUAL COST->ACTUAL EXPENSES
            { width: 13 }, // Column K ACTUAL COST->ATTRIBUTION
       ];


    // Create a new workbook and append the modified worksheet
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Report');

    // Save the workbook as 'report.xlsx'
    XLSX.writeFile(wb, 'BSU-GAD-Annual-Report.xlsx');
    };

    function EditableTable() {
        useEffect(() => {
          // Ensure all table cells are editable when the component mounts
          const cells = document.querySelectorAll("#report-table td");
          cells.forEach(cell => {
            cell.setAttribute("contenteditable", true);
          });
        }, []); // Run this effect only once when the component mounts
    }

    return (
        <div className='bg-white h-full overflow-y-auto rounded-xl'>
            <div className='p-2 mx-auto w-[20%]' contenteditable>
                <NeutralButton label={'Export to Excel'} onClick={exportToExcel} />
            </div>
            <table id="report-table" 
                className='w-screen overflow-x-auto' 
                contentEditable={false}
                //set contentEditable to true for editing the table contents
            >
                <thead>
                    <tr>
                        <th style={tvStyles} colSpan="12">BENGUET STATE UNIVERSITY ANNUAL GENDER AND DEVELOPMENT (GAD) ACCOMPLISHMENT FY 20XX</th>
                    </tr>
                    <tr>
                        <th style={thStyles}></th>
                        <th style={{ ...thStyles, width: '10%' }}>GENDER ISSUE / GAD MANDATE</th>
                        <th style={{ ...thStyles, width: '10%' }}>CAUSE OF GENDER ISSUE</th>
                        <th style={{ ...thStyles, width: '10%' }}>GAD RESULT STATEMENT / GAD OBJECTIVE</th>
                        <th style={{ ...thStyles, width: '10%' }}>GAD ACTIVITY</th>
                        <th style={{ ...thStyles, width: '10%' }}>PERFORMANCE INDICATORS / TARGETS</th>
                        <th style={{ ...thStyles, width: '10%' }}>TARGET RESULT</th>
                        <th colSpan="2" style={thStyles}>ATTENDANCE</th>
                        <th colSpan="3" style={thStyles}>ACTUAL COST/ EXPENDITURE (ACTUAL + ATTRIBUTED AMOUNT)</th>
                    </tr>
                    <tr>
                        <th style={thStyles}></th>
                        <th colSpan="6" style={thStyles}></th>
                        <th style={{ ...thStyles, backgroundColor: '#00B0F0' }}>MALE</th>
                        <th style={{ ...thStyles, backgroundColor: '#FF66FF' }}>FEMALE</th>
                        <th style={{ ...thStyles, width: '10%' }}></th>
                        <th style={{ ...thStyles, width: '10%' }}>ACTUAL EXPENSES</th>
                        <th style={{ ...thStyles, width: '10%' }}>ATTRIBUTION</th>
                    </tr>
                </thead>
                <tbody>
                    <tr >
                        <td style={thStyles}></td>
                        <td style={thStyles}>1</td>
                        <td style={thStyles}>2</td>
                        <td style={thStyles}>3</td>
                        <td style={thStyles}>4</td>
                        <td style={thStyles}>5</td>
                        <td style={thStyles}>6</td>
                        <td colSpan="2" style={thStyles}>7</td>
                        <td colSpan="3" style={thStyles}>8</td>
                    </tr>
                    <tr>
                        <th style={{ ...thStyles, backgroundColor: 'white' }}></th>
                        <th colSpan="11" style={{ ...thStyles, backgroundColor: 'white' }}>Client-Focused Activities</th>
                    </tr>
                    {clientMandate.map((item, rowNum) => (
                        <React.Fragment key={item.id}>
                            <tr>
                                <td style={tvStyles}>{rowNum+=1}</td>
                                <td style={tvStyles}>{item.gender_issue}</td>
                                <td style={tvStyles}>{item.cause_of_gender_issue}</td>
                                <td style={tvStyles}>{item.gad_result_statement}</td>
                                <td style={tvStyles}>{item.gad_activity}</td>
                                <td style={tvStyles}>{item.performance_indicators}</td>
                                <td style={tvStyles}>{item.target_result}</td>
                                <td style={{ ...tvStyles, backgroundColor: '#00B0F0' }}>Total Males for Mandate</td>
                                <td style={{ ...tvStyles, backgroundColor: '#FF66FF' }}>Total Females for Mandate</td>
                                <td style={tnStyles}></td>
                                <td style={tnStyles}>Total Actual Expenses For Mandate</td>
                                <td style={tnStyles}>Total Attribution For Mandate</td>
                            </tr>
                            {item.acc_report && item.acc_report.map((report, reportIndex) => (
                                report.actual_expenditure.map((expenditure, expenditureIndex) => (
                                    <tr key={expenditureIndex}>
                                        {expenditureIndex === 0 && (
                                            <>
                                                <td rowspan={report.actual_expenditure.length} style={tnStyles}></td>
                                                <td rowspan={report.actual_expenditure.length} colSpan="6" style={tnStyles}>{reportIndex+=1}) {report.title}</td>
                                                <td rowspan={report.actual_expenditure.length} style={{ ...tvStyles, backgroundColor: '#00B0F0' }}>{report.male_participants}</td>
                                                <td rowspan={report.actual_expenditure.length} style={{ ...tvStyles, backgroundColor: '#FF66FF' }}>{report.female_participants}</td>
                                            </>
                                        )}
                                        <td style={tnStyles}>{expenditure.items}</td>
                                        <td style={tnStyles}>{expenditure.actual_expenditure}</td>
                                        <td style={tnStyles}>Pending</td>
                                    </tr>
                                ))
                            ))}
                        </React.Fragment>
                    ))}
                    <tr>
                        <td style={tnStyles}></td>
                        <td style={tnStyles} colSpan="6"></td>
                        <td style={tnStyles}></td>
                        <td style={tnStyles}></td>
                        <td style={tnStyles}></td>
                        <td style={{ ...tnStyles, backgroundColor: '#C5E0B3' }}>Total Actual Expenses For Mandate</td>
                        <td style={{ ...tnStyles, backgroundColor: '#C5E0B3' }}>Total Attribution For Mandate</td>
                    </tr>
                    <tr>
                        <td style={tnStyles}></td>
                        <td style={tnStyles} colSpan="6"></td>
                        <td style={tnStyles}></td>
                        <td style={tnStyles}></td>
                        <td style={tnStyles}></td>
                        <td style={tnStyles}></td>
                        <td style={tnStyles}></td>
                    </tr>
                    <tr>
                        <td style={{ ...tnStyles, backgroundColor: '#C5E0B3' }}></td>
                        <td style={{ ...tvStyles, backgroundColor: '#C5E0B3' }} colSpan="6">CLIENT-FOCUSED ACTIVITIES</td>
                        <td style={{ ...tnStyles, backgroundColor: '#C5E0B3' }}></td>
                        <td style={{ ...tnStyles, backgroundColor: '#C5E0B3' }}></td>
                        <td style={{ ...tnStyles, backgroundColor: '#C5E0B3' }}></td>
                        <td style={{ ...tnStyles, backgroundColor: '#C5E0B3' }}>EXPENSES SUB-TOTAL</td>
                        <td style={{ ...tnStyles, backgroundColor: '#C5E0B3' }}>ATTRIBUTION SUB-TOTAL</td>
                    </tr>
                    <tr>
                        <th style={{ ...thStyles, backgroundColor: 'white' }}></th>
                        <th colSpan="11" style={{ ...thStyles, backgroundColor: 'white', fontSize: '12px' }}>Organization-Focused Activities</th>
                    </tr>
                    {organizationMandate.map((item, rowNum) => (
                        <React.Fragment key={item.id}>
                            <tr>
                                <td style={tvStyles}>{rowNum+=1}</td>
                                <td style={tvStyles}>{item.gender_issue}</td>
                                <td style={tvStyles}>{item.cause_of_gender_issue}</td>
                                <td style={tvStyles}>{item.gad_result_statement}</td>
                                <td style={tvStyles}>{item.gad_activity}</td>
                                <td style={tvStyles}>{item.performance_indicators}</td>
                                <td style={tvStyles}>{item.target_result}</td>
                                <td style={{ ...tvStyles, backgroundColor: '#00B0F0' }}>Total Males for Mandate</td>
                                <td style={{ ...tvStyles, backgroundColor: '#FF66FF' }}>Total Females for Mandate</td>
                                <td style={tnStyles}></td>
                                <td style={tnStyles}>Total Actual Expenses For Mandate</td>
                                <td style={tnStyles}>Total Attribution For Mandate</td>
                            </tr>
                            {item.acc_report && item.acc_report.map((report, reportIndex) => (
                                report.actual_expenditure.map((expenditure, expenditureIndex) => (
                                    <tr key={expenditureIndex}>
                                        {expenditureIndex === 0 && (
                                            <>
                                                <td rowspan={report.actual_expenditure.length} style={tnStyles}></td>
                                                <td rowspan={report.actual_expenditure.length} colSpan="6" style={tnStyles}>{reportIndex+=1}) {report.title}</td>
                                                <td rowspan={report.actual_expenditure.length} style={{ ...tvStyles, backgroundColor: '#00B0F0' }}>{report.male_participants}</td>
                                                <td rowspan={report.actual_expenditure.length} style={{ ...tvStyles, backgroundColor: '#FF66FF' }}>{report.female_participants}</td>
                                            </>
                                        )}
                                        <td style={tnStyles}>{expenditure.items}</td>
                                        <td style={tnStyles}>{expenditure.actual_expenditure}</td>
                                        <td style={tnStyles}>Pending</td>
                                    </tr>
                                ))
                            ))}
                        </React.Fragment>
                    ))}
                    <tr>
                        <td style={tnStyles}></td>
                        <td style={tnStyles} colSpan="6"></td>
                        <td style={tnStyles}></td>
                        <td style={tnStyles}></td>
                        <td style={tnStyles}></td>
                        <td style={{ ...tnStyles, backgroundColor: '#FFFF00' }}>Total Actual Expenses For Mandate</td>
                        <td style={{ ...tnStyles, backgroundColor: '#FFFF00' }}>Total Attribution For Mandate</td>
                    </tr>
                    <tr>
                        <td style={tnStyles}></td>
                        <td style={tnStyles} colSpan="6"></td>
                        <td style={tnStyles}></td>
                        <td style={tnStyles}></td>
                        <td style={tnStyles}></td>
                        <td style={tnStyles}></td>
                        <td style={tnStyles}></td>
                    </tr>
                    <tr>
                        <td style={{ ...tnStyles, backgroundColor: '#FFFF00' }}></td>
                        <td style={{ ...tvStyles, backgroundColor: '#FFFF00' }} colSpan="6">ORGANIZATION-FOCUSED ACTIVITIES</td>
                        <td style={{ ...tnStyles, backgroundColor: '#FFFF00' }}></td>
                        <td style={{ ...tnStyles, backgroundColor: '#FFFF00' }}></td>
                        <td style={{ ...tnStyles, backgroundColor: '#FFFF00' }}></td>
                        <td style={{ ...tnStyles, backgroundColor: '#FFFF00' }}>EXPENSES SUB-TOTAL</td>
                        <td style={{ ...tnStyles, backgroundColor: '#FFFF00' }}>ATTRIBUTION SUB-TOTAL</td>
                    </tr>
                    <tr>
                        <td style={tnStyles}></td>
                        <td style={tnStyles} colSpan="6"></td>
                        <td style={tnStyles}></td>
                        <td style={tnStyles}></td>
                        <td style={tnStyles}></td>
                        <td style={tnStyles}></td>
                        <td style={tnStyles}></td>
                    </tr>
                    <tr>
                        <td style={{ ...tnStyles, backgroundColor: '#D8D8D8' }}></td>
                        <td style={{ ...tvStyles, backgroundColor: '#D8D8D8' }} colSpan="8">SUB-TOTAL CLIENT-FOCUSED ACTIVITIES + ORGANIZATION-FOCUSED ACTIVITIES (ACTUAL COST/ EXPENDITURE + ATTRIBUTED AMOUNT)</td>
                        <td style={{ ...tnStyles, backgroundColor: '#D8D8D8' }}></td>
                        <td style={{ ...tnStyles, backgroundColor: '#D8D8D8' }}>TOTAL ACTUAL COST/EXPENDITURE</td>
                        <td style={{ ...tnStyles, backgroundColor: '#D8D8D8' }}>TOTAL ATTRIBUTED AMOUNT</td>
                    </tr>
                </tbody>
            </table>
        </div>
    );
}