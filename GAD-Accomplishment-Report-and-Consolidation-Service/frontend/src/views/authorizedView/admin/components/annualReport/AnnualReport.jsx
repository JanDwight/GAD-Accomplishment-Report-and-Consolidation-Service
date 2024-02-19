import React, { useEffect, useState } from 'react';
import axiosClient from '../../../../axios/axios';
import * as XLSX from 'xlsx';

export default function AnnualReport() {
    const [report, setReport] = useState([]);

    useEffect(() => {
        fetchCurriculum();
    }, []);

    const fetchCurriculum = async () => {
        try {
            const response = await axiosClient.get('/show_accomplishment_report');
            if (response.data) {
                setReport(response.data);
                console.log(response);
            } else {
                console.error('Invalid response format:', response.data);
            }
        } catch (error) {
            console.error(error);
        }
    };

    // Unified style for all th
    const thStyles = {
        border: '1px solid black',
        padding: '10px',
        textAlign: 'center',
        backgroundColor: 'lightgray',
    };

    const exportToExcel = () => {
        const ws = XLSX.utils.table_to_sheet(document.getElementById('report-table'));
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, 'Report');
        XLSX.writeFile(wb, 'report.xlsx');
    };

    return (
        <div>
            <button onClick={exportToExcel}>Export to Excel</button>
            <table id="report-table">
                <thead>
                    <tr>
                        <th style={{ ...thStyles, width: 'fit-content' }}>GENDER ISSUE / GAD MANDATE</th>
                        <th style={thStyles}>CAUSE OF GENDER ISSUE</th>
                        <th style={thStyles}>GAD RESULT STATEMENT / GAD OBJECTIVE</th>
                        <th style={{ ...thStyles, width: '10%' }}>GAD ACTIVITY</th>
                        <th style={thStyles}>PERFORMANCE INDICATORS / TARGETS</th>
                        <th style={{ ...thStyles, width: '3%' }}>TARGET RESULT</th>
                        <th colSpan="2" style={thStyles}>ATTENDANCE</th>
                        <th colSpan="3" style={thStyles}>ACTUAL COST/ EXPENDITURE (ACTUAL + ATTRIBUTED AMOUNT)</th>
                    </tr>
                    <tr>
                        <th colSpan="6" style={thStyles}></th> {/* Empty header for alignment */}
                        <th style={thStyles}>MALE</th> {/* Header for MALE under ATTENDANCE */}
                        <th style={thStyles}>FEMALE</th> {/* Header for FEMALE under ATTENDANCE */}
                        <th style={{ ...thStyles, width: '10%' }}></th> {/* Empty header for alignment */}
                        <th style={{ ...thStyles, width: '10%' }}>ACTUAL EXPENSES</th> {/* Empty header for alignment */}
                        <th style={{ ...thStyles, width: '10%' }}>ATTRIBUTION</th> {/* Empty header for alignment */}
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <th colSpan="11" style={thStyles}>Client-Focus Activities</th>
                    </tr>

                    {report.map((form, index) => (
                        <React.Fragment key={index}>
                            <tr>
                                <td colSpan="6" style={thStyles}>{form.forms.title}</td>
                                <td style={thStyles}>MALE PARTICIPANTS HERE</td>
                                <td style={thStyles}>FEMALE PARTICIPANTS HERE</td>
                                <td colSpan="3" style={thStyles}></td> {/* Empty cells for alignment */}
                            </tr>
                            {/* Displaying multiple actual expenses */}
                            {form.expenditures.map((expense, expenseIndex) => (
                                <tr key={expenseIndex}>
                                    <td colSpan="6"></td> {/* Empty cells for alignment */}
                                    <td colSpan="2"></td> {/* Empty cells for alignment */}
                                    <td style={thStyles}>{expense.type}</td>
                                    <td style={thStyles}>{expense.estimated_cost !== null ? expense.estimated_cost : 'no data'}</td>
                                </tr>
                            ))}
                        </React.Fragment>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
