// Philippine Driver's License number format validation
// Format: C09-10-XXXXXX (where X is a digit)
const isValidLicenseFormat = (licenseNumber) => {
  const licenseRegex = /^[A-Z]\d{2}-\d{2}-\d{6}$/;
  return licenseRegex.test(licenseNumber);
};

module.exports = {
  isValidLicenseFormat
}; 