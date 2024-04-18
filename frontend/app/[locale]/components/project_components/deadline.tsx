import dayjs from "dayjs";
import {LocalizationProvider} from "@mui/x-date-pickers/LocalizationProvider";
import {AdapterDayjs} from "@mui/x-date-pickers/AdapterDayjs";
import {DateCalendar} from "@mui/x-date-pickers/DateCalendar";
import {TimePicker} from "@mui/x-date-pickers";
import React from "react";

interface DeadlineProps {
    deadline: dayjs.Dayjs,
    setDeadline: (value: (((prevState: dayjs.Dayjs) => dayjs.Dayjs) | dayjs.Dayjs)) => void,
    hasDeadline: boolean

}

function Deadline({deadline, setDeadline, hasDeadline}: DeadlineProps) {
    return <LocalizationProvider dateAdapter={AdapterDayjs}>
        <DateCalendar
            value={deadline}
            onChange={(event) => setDeadline(event)}
            minDate={dayjs()}
            disabled={!hasDeadline}
        />
        <TimePicker
            value={deadline}
            onChange={(event) => {
                if (event != null) setDeadline(event)
            }}
            disabled={!hasDeadline}
        />

    </LocalizationProvider>;
}

export default Deadline;