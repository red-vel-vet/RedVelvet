import React from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import '../styles/DateFilterModal.css';
import Button from './Button';

function DateFilterModal({ startDate, endDate, setStartDate, setEndDate, dateModalVisible, onCancel }) {
    if (!dateModalVisible) return null;

    const clearDateFilter = () => {
        setStartDate(null);
        setEndDate(null);
    };

    return (
        <div className="date-modal-background">
            <div className="date-modal-content">
                <p className="datepicker-title">Select Date Range</p>
                <a className="clear-link" onClick={clearDateFilter}>Clear Dates</a>
                <DatePicker
                    selected={startDate}
                    onChange={(dates) => {
                        const [start, end] = dates;
                        setStartDate(start);
                        setEndDate(end);
                    }}
                    startDate={startDate}
                    endDate={endDate}
                    selectsRange
                    inline
                />
                <div className="date-button-container">
                    <Button className="button cancel" type="button" onClick={onCancel}>Cancel</Button>
                    <Button className="button submit" type="button" onClick={onCancel}>Apply</Button>
                </div>
            </div>
        </div>
    );
}

export default DateFilterModal;