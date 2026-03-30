import { Alert, Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField } from "@mui/material";
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { TimePicker } from "@mui/x-date-pickers";
import dayjs, { Dayjs } from "dayjs";
import { useState } from "react";
import { createActivity } from "../api/create-activity";
import axios from "axios";

interface CreateActivityDialogProps {
    open: boolean;
    onClose: () => void;
    groupId: string;
}

const CreateActivityDialog = ({ open, onClose, groupId }: CreateActivityDialogProps) => {
    const [successMessage, setSuccessMessage] = useState("");
    const [error, setError] = useState("");
    const [titleError, setTitleError] = useState("");
    const [dateError, setDateError] = useState("");
    const [timeError, setTimeError] = useState("");

    const validate = (title: string, date: Dayjs, time: Dayjs) => {
        let valid = true;
        // title errors
        if (title.length < 3) {
            setTitleError("Title must be at least 3 characters");
            valid = false;
        } else if (title.length > 60) {
            setTitleError("Title must be under 60 characters")
            valid = false;
        }
        
        // date errors
        if (!date.isValid()) {
            setDateError("Proposed date is invalid");
            valid = false;
        } else if (date.isBefore(dayjs(), "day")) {
            setDateError("Proposed date cannot be in the past");
            valid = false;
        }
        
        // time errors
        if (!time.isValid()) {
            setTimeError("Proposed time is invalid");
            valid = false;
        } else if (date.isSame(dayjs(), "day") && time.isBefore(dayjs())) {
            setTimeError("Proposed time cannot be in the past");
            valid = false;
        }
        
        return valid;
    };

    const handleSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
        e.preventDefault();
        setError("");
        setTitleError("");
        setDateError("");
        setTimeError("");

        // Get form data
        const formData = new FormData(e.currentTarget);

        const title = formData.get("title")?.toString().trim() || "";
        const dateString = formData.get("date")?.toString() || "";
        const timeString = formData.get("time")?.toString() || "";
        const description = formData.get("description")?.toString() || "";

        // Convert date and time to dayjs objects
        const date = dayjs(dateString, "MM/DD/YYYY", true);
        const time = dayjs(timeString, "hh:mm A", true);
        
        // Validate
        if (!validate(title, date, time)) return;
        
        // Combine date and time to isostring
        const finalDatetime = date.hour(time.hour()).minute(time.minute());
        const isoString = finalDatetime.toISOString();

        // Create activity API call
        try {
            const res = await createActivity(groupId, title, isoString, description);
            if (!res.success) {
                const message = res.message || "Failed to join group.";
                setError(message);
                return;
            }
            setSuccessMessage("Activity proposal created successfully!")

            // Close dialog after brief delay
            setTimeout(() => onClose(), 1500);
        } catch (error) {
            let message = "Failed to create activity. Please try again.";
            
            if (axios.isAxiosError(error) && error.response?.data?.message) {
                message = error.response.data.message;
            }

            setError(message);
        }
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
                                    required: true,
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

                <DialogActions sx={{ justifyContent: "space-between", alignItems: "center" }}>
                    <Box>
                        {error && <Alert severity="error">{error}</Alert>}
                        {successMessage && <Alert severity="success">{successMessage}</Alert>}
                    </Box>

                    <Box>
                        <Button onClick={onClose}>Cancel</Button>
                        <Button type="submit" variant="contained">
                        Submit
                        </Button>
                    </Box>
                </DialogActions>
            </Box>

        </Dialog>
    );
};

export default CreateActivityDialog;
