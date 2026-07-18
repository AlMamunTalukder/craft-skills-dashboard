// lib/formatBDDate.ts
import moment from 'moment-timezone';

// Set default timezone to Bangladesh
moment.tz.setDefault('Asia/Dhaka');

export const formatBDDateTime = (isoString?: string | null) => {
    if (!isoString) return null;

    try {
        const date = moment.utc(isoString).tz('Asia/Dhaka');
        if (!date.isValid()) return "invalid";

        return {
            date: date.format('DD MMM YYYY'),
            dayName: date.format('dddd'),
            time: date.format('hh:mm A'),
            fullDateTime: date.format('DD MMM YYYY hh:mm A'),
        };
    } catch (error) {
        return "invalid";
    }
};

// Format just the date
export const formatBDDate = (isoString?: string | null) => {
    if (!isoString) return null;
    try {
        const date = moment.utc(isoString).tz('Asia/Dhaka');
        if (!date.isValid()) return null;
        return date.format('DD MMM YYYY');
    } catch {
        return null;
    }
};

// Format just the time
export const formatBDTime = (isoString?: string | null) => {
    if (!isoString) return null;
    try {
        const date = moment.utc(isoString).tz('Asia/Dhaka');
        if (!date.isValid()) return null;
        return date.format('hh:mm A');
    } catch {
        return null;
    }
};