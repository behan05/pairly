import React from 'react';
import { Stack, Typography } from '@/MUI/MuiComponents';

const SectionHeader = ({ icon, title, desciption }) => (
  <Stack direction="column" spacing={1}>
    <Stack direction={'row'} spacing={1}>
      {React.cloneElement(icon, { fontSize: 'small', sx: { color: 'text.secondary' } })}
      <Typography variant="h6">{title}</Typography>
    </Stack>

    <Typography variant="body2" gutterBottom color="text.secondary">
      {desciption}
    </Typography>
  </Stack>
);

export default SectionHeader;
