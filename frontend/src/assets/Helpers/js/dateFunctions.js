export const formatDate = (timestamp, withTime, toUTC) => {
    if (timestamp === 'null') {
        return '';
    }
    else {
        var date = new Date(timestamp);

        if (toUTC) {
            date = new Date(offsetUTCToLocalTimeStamp(timestamp));
        }
        
        let formatedDate = `${date.getMonth() + 1}/${date.getDate()}/${date.getFullYear()}`;

        if (withTime) {
            const hour = (date.getHours() === 0 || date.getHours() === 12) ? 12 : date.getHours() % 12;
            const minute = (date.getMinutes() < 10) ? `0${date.getMinutes()}` : date.getMinutes();
            formatedDate = formatedDate + ` @ ${hour}:${minute} ${(date.getHours() >= 12) ? 'P.M.' : 'A.M.'}`;
        }

        return formatedDate;
    }
}

export const generateStartOfDayTimestamp = () => {
    const now = new Date();
    const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    return startOfDay.getTime();
}

export const offsetUTCToLocalTimeStamp = (timestamp, inverse) => {
    const now = new Date();
    const timeStr = now.toTimeString();
    const offsetStr = timeStr.substr(timeStr.indexOf('GMT') + 3, 5);
    
    const offsetSign = offsetStr.substr(0, 1);
    const hourOffset =  offsetSign + offsetStr.substr(1, 2);
    const minuteOffset = offsetSign + offsetStr.substr(3, 2);

    const inverseFactor = (inverse) ? 1 : -1;

    return timestamp + (inverseFactor * hourOffset * 60 * 60 * 1000) + (inverseFactor * minuteOffset * 60 * 1000);
}