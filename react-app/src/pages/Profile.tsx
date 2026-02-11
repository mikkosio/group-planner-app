import { useRef, useState } from "react";
import {
  Container,
  Paper,
  Stack,
  Avatar,
  Typography,
  Button,
} from "@mui/material";

const ProfilePage = () => {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [avatarUrl, setAvatarUrl] = useState<string>("");

  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) {
      return;
    }
    const nextUrl = URL.createObjectURL(file);
    setAvatarUrl(nextUrl);
  };

  return (
    <Container maxWidth="sm">
      <Paper
        elevation={5}
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 2,
          mt: 8,
          p: 3,
          borderRadius: 2,
        }}
      >
        <Stack spacing={0.5} alignItems="center">
          <Avatar
            src={avatarUrl}
            sx={{
              width: 72,
              height: 72,
              cursor: "pointer",
              backgroundColor: "#35c2f1",
            }}
            onClick={handleAvatarClick}
          />
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleAvatarChange}
            style={{ display: "none" }}
          />
          <Typography variant="h6" sx={{ fontWeight: 600 }}>
            Name
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Email address
          </Typography>
        </Stack>

        <Stack spacing={1.5} sx={{ width: "100%" }}>
          <Button
            variant="outlined"
            fullWidth
            sx={{
              borderColor: "#000",
              color: "#000",
              borderWidth: 2,
              borderRadius: 1,
              textTransform: "none",
            }}
          >
            Preferences
          </Button>
          <Button
            variant="outlined"
            fullWidth
            sx={{
              borderColor: "#000",
              color: "#000",
              borderWidth: 2,
              borderRadius: 1,
              textTransform: "none",
            }}
          >
            Plan History
          </Button>
          <Button
            variant="outlined"
            fullWidth
            sx={{
              borderColor: "#000",
              color: "#000",
              borderWidth: 2,
              borderRadius: 1,
              textTransform: "none",
            }}
          >
            Notifications
          </Button>
        </Stack>

        <Button
          variant="contained"
          sx={{
            backgroundColor: "#35c2f1",
            color: "#000",
            textTransform: "none",
            px: 4,
            borderRadius: 1,
          }}
        >
          Edit Profile
        </Button>
      </Paper>
    </Container>
  );
};

export default ProfilePage;
