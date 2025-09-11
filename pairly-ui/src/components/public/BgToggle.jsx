import React from "react";
import { IconButton, Tooltip, useTheme } from "@/MUI/MuiComponents";
import { LightModeIcon, DarkModeIcon } from "@/MUI/MuiIcons";
import { useSelector, useDispatch } from "react-redux";
import { toggleTheme } from "@/redux/slices/theme/themeSlice";

function BgToggle() {
  const theme = useTheme();
  const dispatch = useDispatch();
  const themeMode = useSelector((state) => state.theme.themeMode);

  const handleToggle = () => {
    dispatch(toggleTheme());
  };

  return (
    <Tooltip
      title={themeMode === "dark" ? "Switch to light mode" : "Switch to dark mode"}
      componentsProps={{
        tooltip: {
          sx: {
            bgcolor: "transparent",
            boxShadow: `inset 0 0 2px ${theme.palette.secondary.dark}`,
            color: theme.palette.text.primary,
            px: 1.5,
            py: 0.8,
            fontSize: "0.85rem",
            backdropFilter: "blur(4px)",
          },
        },
        arrow: {
          sx: {
            color: theme.palette.secondary.main,
          },
        },
      }}
    >
      <IconButton onClick={handleToggle}>
        {themeMode === "dark" ? (
          <DarkModeIcon sx={{ color: "text.secondary" }} />
        ) : (
          <LightModeIcon sx={{ color: "text.primary" }} />
        )}
      </IconButton>
    </Tooltip>
  );
}

export default BgToggle;
