import { createTheme } from "@mui/material/styles";
import { breakpoints } from "./breakpoints";
import { typography } from "./typography";
import { lightPalette, darkPalette } from "./palette";
import { shape } from "./shape";
import { components } from "./components";
import shadows from "./shadows";

const getTheme = (mode = "dark") => {
  return createTheme({
    typography,
    breakpoints,
    shadows,
    shape,
    palette: mode === "dark" ? darkPalette : lightPalette,
    components,
  });
};

export default getTheme;

