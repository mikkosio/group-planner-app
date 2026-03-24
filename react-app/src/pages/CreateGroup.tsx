import { useState } from "react";
import { Alert, Box, Button, Container, TextField, Typography } from "@mui/material";
import { createGroup } from "@/features/groups/api/create-group";

interface FormErrors {
    name?: string;
}

const CreateGroup = () => {
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [errors, setErrors] = useState<FormErrors>({});
    const [apiError, setApiError] = useState<string | null>(null);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    const validate = () => {
        const nextErrors: FormErrors = {};
        const trimmedName = name.trim();

        if (!trimmedName) nextErrors.name = "Group name is required.";
        else if (trimmedName.length < 3)
            nextErrors.name = "Group name must be at least 3 characters.";

        setErrors(nextErrors);
        return Object.keys(nextErrors).length === 0;
    };

    const handleSubmit = async (event: React.SubmitEvent<HTMLFormElement>) => {
        event.preventDefault();
        setSuccessMessage(null);
        setApiError(null);

        if (!validate()) return;

        try {
            setLoading(true);

            const response = await createGroup(name.trim(), description.trim() || undefined);

            setSuccessMessage(
                `Group created successfully. Invite code: ${response.data.group.inviteCode}`,
            );
            setName("");
            setDescription("");
            setErrors({});
        } catch (error: unknown) {
            const message =
                typeof error === "object" &&
                error !== null &&
                "response" in error &&
                typeof (error as { response?: { data?: { message?: unknown } } }).response?.data
                    ?.message === "string"
                    ? (error as { response?: { data?: { message?: string } } }).response?.data
                          ?.message
                    : "Failed to create group. Please try again.";

            setApiError(message ?? "Failed to create group. Please try again.");
        } finally {
            setLoading(false);
        }
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

                <Button type="submit" variant="contained" disabled={loading}>
                    {loading ? "Creating..." : "Create Group"}
                </Button>
            </Box>

            {apiError && <Alert severity="error">{apiError}</Alert>}

            {successMessage && (
                <Alert severity="success" sx={{ mt: 2 }}>
                    {successMessage}
                </Alert>
            )}
        </Container>
    );
};

export default CreateGroup;
