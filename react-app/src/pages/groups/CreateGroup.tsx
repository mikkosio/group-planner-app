import { useState } from "react";
import { Alert, Box, Button, Container, TextField, Typography } from "@mui/material";

const CreateGroup = () => {
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    // const [inviteCode] = useState(generateInviteCode);
    const [errors, setErrors] = useState<FormErrors>({});
    const [submitted, setSubmitted] = useState(false);

    interface FormErrors {
        name?: string;
        date?: string;
    }

    const validate = () => {
        const nextErrors: FormErrors = {};
        const trimmedName = name.trim();

        if (!trimmedName) nextErrors.name = "Group name is required ...";
        else if (trimmedName.length < 3)
            nextErrors.name = "Group name must be at least 3 characters ... ";

        setErrors(nextErrors);
        return Object.keys(nextErrors).length === 0;
    };

    // const generateInviteCode = () => Math.random().toString(36).slice(2, 8).toUpperCase();

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setSubmitted(false);
        if (!validate()) return;

        console.log("Create group", {
            name: name.trim(),
            description: description.trim() || undefined,
            status: "ACTIVE",
        });
        setSubmitted(true);
    };

    return (
        <Container maxWidth="sm" sx={{ py: 4 }}>
            <Typography variant="h4" sx={{ mb: 3 }}>
                Create Group
            </Typography>

            <Box
                component="form"
                onSubmit={handleSubmit}
                sx={{ display: "flex", flexDirection: "column", gap: 2 }}
            >
                <TextField
                    label="Group Name"
                    value={name}
                    onChange={(event) => setName(event.target.value)}
                    error={Boolean(errors.name)}
                    helperText={errors.name}
                    required
                    fullWidth
                />

                <TextField
                    label="Description"
                    value={description}
                    onChange={(event) => setDescription(event.target.value)}
                    multiline
                    minRows={3}
                    fullWidth
                />

                <Button type="submit" variant="contained">
                    Create Group
                </Button>
            </Box>

            {submitted && (
                <Alert severity="success" sx={{ mt: 2 }}>
                    Group form is valid and ready to submit ...
                </Alert>
            )}
        </Container>
    );
};

export default CreateGroup;
