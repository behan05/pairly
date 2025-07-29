import * as React from 'react';
import {
  Box,
  Divider,
  FormControl,
  FormHelperText,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  Typography,
  Slider,
  Switch,
  FormLabel,
  FormControlLabel,
} from '@/MUI/MuiComponents';

import { SendIcon } from '@/MUI/MuiIcons';
import NavigateWithArrow from '@/components/private/NavigateWithArrow';
import BlurWrapper from '@/components/common/BlurWrapper';
import StyledText from '@/components/common/StyledText';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import StyledActionButton from '@/components/common/StyledActionButton';
import { Country, State, City } from 'country-state-city';
import { updateMatchingPreferences } from '@/redux/slices/profile/profileAction';
import { useDispatch, useSelector } from 'react-redux';

function MatchingPreferences() {
  // Local state declarations
  const [preferredAgeRange, setPreferredAgeRange] = React.useState([18, 30]);
  const [stateOptions, setStateOptions] = React.useState([]);
  const [stateCity, setStateCity] = React.useState([]);
  const [isDisabled, setIsDisabled] = React.useState(false);

  const dispatch = useDispatch();
  const { profileData } = useSelector((state) => state.profile);

  const [formData, setFormData] = React.useState({
    lookingFor: '',
    preferredLanguage: '',
    preferredAgeRange: { min: '', max: '' },
    country: '',
    state: '',
    city: '',
    matchScope: 'global',
  });

  const [error, setError] = React.useState({
    lookingFor: '',
    preferredLanguage: '',
    country: '',
    state: '',
    city: '',
  });

  // Load profile data and populate form on mount
  React.useEffect(() => {
    if (profileData) {
      const selectedCountry = profileData?.country || '';
      const selectedState = profileData?.state || '';
      const selectedCity = profileData?.city || '';

      // Preload states and cities based on existing profile data
      const states = selectedCountry ? State.getStatesOfCountry(selectedCountry) : [];
      setStateOptions(states);

      const cities = (selectedCountry && selectedState)
        ? City.getCitiesOfState(selectedCountry, selectedState)
        : [];
      setStateCity(cities);

      // Set all form fields
      setFormData({
        lookingFor: profileData?.lookingFor || '',
        preferredLanguage: profileData?.preferredLanguage || '',
        preferredAgeRange: {
          min: profileData?.preferredAgeRange?.min || 18,
          max: profileData?.preferredAgeRange?.max || 30,
        },
        country: selectedCountry,
        state: selectedState,
        city: selectedCity,
        matchScope: profileData?.matchScope || '',
      });

      setPreferredAgeRange([
        profileData?.preferredAgeRange?.min || 18,
        profileData?.preferredAgeRange?.max || 30
      ]);
    }
  }, [profileData]);

  // Language options
  const preferredLanguages = [
    { value: 'english', label: 'English' },
    { value: 'hindi', label: 'Hindi' },
    { value: 'spanish', label: 'Spanish' },
    { value: 'french', label: 'French' },
    { value: 'german', label: 'German' },
    { value: 'chinese', label: 'Chinese (Mandarin)' },
    { value: 'japanese', label: 'Japanese' },
    { value: 'russian', label: 'Russian' },
    { value: 'arabic', label: 'Arabic' },
    { value: 'portuguese', label: 'Portuguese' },
    { value: 'bengali', label: 'Bengali' },
    { value: 'punjabi', label: 'Punjabi' },
    { value: 'telugu', label: 'Telugu' },
    { value: 'tamil', label: 'Tamil' },
    { value: 'marathi', label: 'Marathi' },
    { value: 'korean', label: 'Korean' },
    { value: 'turkish', label: 'Turkish' },
    { value: 'italian', label: 'Italian' },
    { value: 'vietnamese', label: 'Vietnamese' },
    { value: 'urdu', label: 'Urdu' }
  ];

  // All countries
  const countryOptions = Country.getAllCountries();

  // Handle form field changes
  const handleChange = (e) => {
    const { name, value } = e.target;

    // Update states and reset dependent fields
    if (name === 'country') {
      const states = State.getStatesOfCountry(value);
      setStateOptions(states);
      setStateCity([]);
      setFormData((prev) => ({
        ...prev,
        country: value,
        state: '',
        city: '',
      }));
    } else if (name === 'state') {
      const cities = City.getCitiesOfState(formData.country, value);
      setStateCity(cities);
      setFormData((prev) => ({
        ...prev,
        state: value,
        city: '',
      }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  // Toggle for global/nearby match
  const handleMatchScopeChange = (e) => {
    const { checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      matchScope: checked ? 'global' : 'nearby',
    }));
  };

  // Handle age slider
  const handleAgeRangeChange = (e, newRange) => {
    setPreferredAgeRange(newRange);
    setFormData((prev) => ({
      ...prev,
      preferredAgeRange: { min: newRange[0], max: newRange[1] },
    }));
  };

  // Submit handler with validation
  const handleSubmit = async (e) => {
    e.preventDefault();
    let hasError = false;
    const newErrors = {};

    // Basic validations
    if (!formData.lookingFor?.trim()) {
      hasError = true;
      newErrors.lookingFor = 'Please select who you are looking for.';
    }
    if (!formData.preferredLanguage?.trim()) {
      hasError = true;
      newErrors.preferredLanguage = 'Preferred language is required.';
    }
    if (!formData.country?.trim()) {
      hasError = true;
      newErrors.country = 'Please select your country.';
    }
    if (!formData.state?.trim()) {
      hasError = true;
      newErrors.state = 'Please select your state.';
    }
    if (!formData.city?.trim()) {
      hasError = true;
      newErrors.city = 'Please select your city.';
    }

    if (hasError) {
      setError(newErrors);
      return;
    }

    setIsDisabled(true);

    try {
      const response = await dispatch(updateMatchingPreferences(formData));
      if (response.success) {
        toast.success(response.message || 'Preferences updated successfully!');
        setError({});
      } else {
        toast.error(response?.error || 'Something went wrong.');
      }
    } catch (error) {
      toast.error('An error occurred while updating preferences.');
    } finally {
      setIsDisabled(false);
    }
  };

  return (
    <Box component={'section'}>
      <ToastContainer position="top-right" autoClose={1000} theme="colored" />

      {/* Header */}
      <Stack mb={2}>
        <NavigateWithArrow redirectTo={'/connect/profile'} text={'Matching Preferences'} />
      </Stack>

      {/* Form Wrapper */}
      <BlurWrapper component="form" onSubmit={handleSubmit}>
        {/* Title */}
        <Stack>
          <Typography textAlign="center" variant="h5" fontWeight={600} gutterBottom>
            Matching <StyledText text={'Preferences'} />
          </Typography>
          <Typography variant="body2" textAlign="center" color="text.secondary">
            Our algorithm personalizes your experience based on these preferences.
          </Typography>
        </Stack>

        {/* Form Fields */}
        <Stack direction={'column'} gap={2} mt={2}>
          {/* Looking For */}
          <FormControl fullWidth error={!!error.lookingFor}>
            <InputLabel id="lookingFor-label">Looking For</InputLabel>
            <Select
              labelId="lookingFor-label"
              id="lookingFor"
              name="lookingFor"
              value={formData.lookingFor || ''}
              label="Looking For"
              onChange={handleChange}
            >
              <MenuItem value="male">Male</MenuItem>
              <MenuItem value="female">Female</MenuItem>
              <MenuItem value="other">Other</MenuItem>
            </Select>
            {error.lookingFor && <FormHelperText>{error.lookingFor}</FormHelperText>}
          </FormControl>

          {/* Language */}
          <FormControl fullWidth error={!!error.preferredLanguage}>
            <InputLabel id="preferredLanguage-label">Preferred Language</InputLabel>
            <Select
              labelId="preferredLanguage-label"
              id="preferredLanguage"
              name="preferredLanguage"
              value={formData.preferredLanguage || ''}
              label="Preferred Language"
              onChange={handleChange}
            >
              {preferredLanguages.map((lang) => (
                <MenuItem key={lang.value} value={lang.value}>
                  {lang.label}
                </MenuItem>
              ))}
            </Select>
            {error.preferredLanguage && <FormHelperText>{error.preferredLanguage}</FormHelperText>}
          </FormControl>

          <Divider sx={{ my: 2 }} />

          {/* Age Range */}
          <Stack>
            <Typography gutterBottom>Preferred Age Range</Typography>
            <Slider
              value={preferredAgeRange}
              valueLabelDisplay="auto"
              onChange={handleAgeRangeChange}
              min={18}
              max={95}
              step={1}
              marks={[
                { value: 18, label: '18' },
                { value: 30, label: '30' },
                { value: 40, label: '40' },
                { value: 50, label: '50' },
                { value: 60, label: '60' },
                { value: 70, label: '70' },
                { value: 80, label: '80' },
                { value: 95, label: '95' },
              ]}
            />
            <Typography variant="body2" mt={2} color="text.secondary">
              Selected range: {preferredAgeRange[0]} - {preferredAgeRange[1]}
            </Typography>
          </Stack>

          <Divider sx={{ my: 2 }} />

          {/* Country */}
          <FormControl fullWidth error={!!error.country}>
            <InputLabel id="country-label">Country</InputLabel>
            <Select
              labelId="country-label"
              id="country"
              name="country"
              value={formData.country || ''}
              label="Country"
              onChange={handleChange}
            >
              {countryOptions.map((country) => (
                <MenuItem key={country.isoCode} value={country.isoCode}>
                  {country.name}
                </MenuItem>
              ))}
            </Select>
            {error.country && <FormHelperText>{error.country}</FormHelperText>}
          </FormControl>

          {/* State */}
          <FormControl fullWidth error={!!error.state} disabled={!formData.country}>
            <InputLabel id="state-label">State</InputLabel>
            <Select
              labelId="state-label"
              id="state"
              name="state"
              value={formData.state || ''}
              label="State"
              onChange={handleChange}
            >
              {stateOptions.map((state) => (
                <MenuItem key={state.isoCode} value={state.isoCode}>
                  {state.name}
                </MenuItem>
              ))}
            </Select>
            {error.state && <FormHelperText>{error.state}</FormHelperText>}
          </FormControl>

          {/* City */}
          <FormControl fullWidth error={!!error.city} disabled={!formData.state}>
            <InputLabel id="city-label">City</InputLabel>
            <Select
              labelId="city-label"
              id="city"
              name="city"
              value={formData.city || ''}
              label="City"
              onChange={handleChange}
            >
              {stateCity.map((city) => (
                <MenuItem key={city.name} value={city.name}>
                  {city.name}
                </MenuItem>
              ))}
            </Select>
            {error.city && <FormHelperText>{error.city}</FormHelperText>}
          </FormControl>

          <Divider sx={{ my: 2 }} />

          {/* Match Scope Toggle */}
          <FormControl>
            <FormLabel>Match Scope</FormLabel>
            <Typography variant="body2" color="text.secondary">
              Choose whether to find matches nearby or globally.
            </Typography>
            <FormControlLabel
              control={
                <Switch
                  checked={formData.matchScope === 'global'}
                  onChange={handleMatchScopeChange}
                />
              }
              label={formData.matchScope === 'global' ? 'Global Match' : 'Nearby Match'}
            />
          </FormControl>

          {/* Submit Button */}
          <StyledActionButton type="submit" endIcon={<SendIcon />} disabled={isDisabled}>
            {isDisabled ? 'Updating...' : 'Update Preferences'}
          </StyledActionButton>
        </Stack>
      </BlurWrapper>
    </Box>
  );
}

export default MatchingPreferences;
