import dayjs from "dayjs";
import {Box} from "@mui/material";
import {LocalizationProvider} from "@mui/x-date-pickers/LocalizationProvider";
import {AdapterDayjs} from "@mui/x-date-pickers/AdapterDayjs";
import {DateCalendar} from "@mui/x-date-pickers/DateCalendar";
import {TimePicker} from "@mui/x-date-pickers";
import { renderTimeViewClock } from '@mui/x-date-pickers/timeViewRenderers';
import React from "react";

interface DeadlineProps {
    deadline: dayjs.Dayjs,
    setDeadline: (value: (((prevState: dayjs.Dayjs) => dayjs.Dayjs) | dayjs.Dayjs)) => void,
    hasDeadline: boolean

}

function Deadline({deadline, setDeadline, hasDeadline}: DeadlineProps) {
    return (
        <LocalizationProvider dateAdapter={AdapterDayjs}>
            <Box
                display={"flex"}
                flexDirection={"column"}
                alignItems={"center"}
                justifyContent={"center"}
                width={"100%"}
            >
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
                    viewRenderers={{
                        hours: renderTimeViewClock,
                        minutes: renderTimeViewClock,
                    }}
                />
            </Box>
        </LocalizationProvider>
    );
}

export default Deadline;