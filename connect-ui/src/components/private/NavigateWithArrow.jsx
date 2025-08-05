import { Stack } from '../../MUI/MuiComponents';
import { ArrowBackIcon } from '../../MUI/MuiIcons';

import StyledText from '../../components/common/StyledText';
import { Link } from 'react-router-dom';

{
  /* Header with arrow back icon */
}
function NavigateWithArrow({ redirectTo, text }) {
  return (
    <Stack
      direction={'row'}
      gap={2}
      sx={{
        position: 'relative'
      }}
    >
      <Stack component={Link} to={redirectTo} color="text.secondary">
        <ArrowBackIcon />
      </Stack>
      <StyledText text={text} />
    </Stack>
  );
}

export default NavigateWithArrow;
