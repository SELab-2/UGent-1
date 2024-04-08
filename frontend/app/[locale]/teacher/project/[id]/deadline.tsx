import dayjs from "dayjs";
import {LocalizationProvider} from "@mui/x-date-pickers/LocalizationProvider";
import {AdapterDayjs} from "@mui/x-date-pickers/AdapterDayjs";
import {DateCalendar} from "@mui/x-date-pickers/DateCalendar";
import {TimePicker} from "@mui/x-date-pickers";
import React from "react";

function Deadline(deadline: dayjs.Dayjs, setDeadline: (value: (((prevState: dayjs.Dayjs) => dayjs.Dayjs) | dayjs.Dayjs)) => void) {
    return <LocalizationProvider dateAdapter={AdapterDayjs}>
        <DateCalendar
            value={deadline}
            onChange={(event) => setDeadline(event)}
            minDate={dayjs()}/>
        <TimePicker
            value={deadline}
            onChange={(event) => {
                if (event != null) setDeadline(event)
            }}
        />
    </LocalizationProvider>;
}

export default Deadline;