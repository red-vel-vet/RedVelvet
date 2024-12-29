import React from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import Modal from './Modal';
import dfStyles from '../styles/DateFilterModal.module.css';
import Button from './Button';

function DateFilterModal({ startDate, endDate, setStartDate, setEndDate, dateModalVisible, onCancel }) {
    if (!dateModalVisible) return null;

    const clearDateFilter = () => {
        setStartDate(null);
        setEndDate(null);
    };

    return (
        <Modal isOpen={dateModalVisible} onClose={onCancel} backgroundStyle="translucent">
            <div className={dfStyles.modalInner}>
                <p className={dfStyles.datepickerTitle}>Select Date Range</p>
                <a className={dfStyles.clearLink} onClick={clearDateFilter}>Clear Dates</a>
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
                <div className={dfStyles.dateButtonContainer}>
                    <Button className="button cancel" type="button" onClick={onCancel}>Cancel</Button>
                    <Button className="button submit" type="button" onClick={onCancel}>Apply</Button>
                </div>
            </div>
        </Modal>
    );
}

export default DateFilterModal;
