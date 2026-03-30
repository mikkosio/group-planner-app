import { Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField } from "@mui/material";
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { TimePicker } from "@mui/x-date-pickers";
import dayjs, { Dayjs } from "dayjs";
import { useState } from "react";

interface CreateActivityDialogProps {
    open: boolean;
    onClose: () => void;
}

const CreateActivityDialog = ({ open, onClose }: CreateActivityDialogProps) => {
    const [titleError, setTitleError] = useState("");
    const [dateError, setDateError] = useState("");
    const [timeError, setTimeError] = useState("");

    const validate = (title: string, date: Dayjs, time: Dayjs | null) => {
        let hasError = false;
        if (title.length < 3) {
            setTitleError("Title must be at least 3 characters");
            hasError = true;
        } else if (title.length > 60) {
            setTitleError("Title must be under 60 characters")
            hasError = true;
        }
        
        if (!date.isValid()) {
            setDateError("Proposed date is invalid");
            hasError = true;
        } else if (date.isBefore(dayjs(), "day")) {
            setDateError("Proposed date cannot be in the past");
            hasError = true;
        }
        
        if (time) {
            if (!time.isValid()) {
                setTimeError("Proposed time is invalid");
                hasError = true;
            } else if (date.isSame(dayjs(), "day") && time.isBefore(dayjs())) {
                setTimeError("Proposed time cannot be in the past");
                hasError = true;
            }
        }
        
        return hasError;
    };

    const handleSubmit = (e: React.SubmitEvent<HTMLFormElement>) => {
        e.preventDefault();
        setTitleError("");
        setDateError("");
        setTimeError("");

        const formData = new FormData(e.currentTarget);

        const title = formData.get("title")?.toString().trim() || "";
        const dateString = formData.get("date")?.toString() || "";
        const timeString = formData.get("time")?.toString() || "";
        const description = formData.get("description")?.toString() || "";

        const date = dayjs(dateString, "MM/DD/YYYY", true);
        const time = timeString ? dayjs(timeString, "hh:mm A", true) : null;
        
        if (validate(title, date, time)) return;
        
        let finalDatetime = date;
        if (time) {
            finalDatetime = date.hour(time.hour()).minute(time.minute())
        }
        const isoString = finalDatetime.toISOString();

        console.log(title, isoString, description);
    }

    return (
        <Dialog 
            open={open}
            onClose={onClose}
            fullWidth
            maxWidth="sm"
            slotProps={{
                paper: {
                    sx: {
                        borderRadius: 3,
                        p: 1,
                    },
                },
            }}
        >
            <DialogTitle>Suggest an Activity</DialogTitle>

            <Box
                component="form"
                onSubmit={handleSubmit}
            >
                <DialogContent>
                    <TextField
                        label="Title"
                        name="title"
                        fullWidth
                        margin="normal"
                        error={Boolean(titleError)}
                        helperText={titleError}
                        required
                        autoFocus
                    />
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <DatePicker
                            label="Date"
                            name="date"
                            minDate={dayjs()}
                            slotProps={{ 
                                textField: { 
                                    required: true,
                                    fullWidth: true, 
                                    margin: "normal",
                                    error: Boolean(dateError),
                                    helperText: dateError
                                } 
                            }}
                        />
                        <TimePicker
                            label="Time"
                            name="time"
                            slotProps={{ 
                                textField: { 
                                    fullWidth: true, 
                                    margin: "normal",
                                    error: Boolean(timeError),
                                    helperText: timeError
                                } 
                            }}
                        />
                    </LocalizationProvider>
                    <TextField
                        label="Description"
                        name="description"
                        fullWidth
                        multiline
                        rows={3}
                        margin="normal"
                    />
                </DialogContent>

                <DialogActions>
                    <Button onClick={onClose}>Cancel</Button>
                    <Button type="submit" variant="contained">
                        Submit
                    </Button>
                </DialogActions>
            </Box>
        </Dialog>
    );
};

export default CreateActivityDialog;
