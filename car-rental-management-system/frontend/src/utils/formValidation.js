export const isValidEmail = (email) => /^\S+@\S+\.\S+$/.test(email);

export const isValidPhone = (phone) => /^[0-9]{10}$/.test(phone);

export const validateBooking = (form) => {
  const errors = {};
  const today = new Date().toISOString().split("T")[0];

  if (!form.customerName.trim()) errors.customerName = "Name is required";
  if (!isValidEmail(form.email)) errors.email = "Enter a valid email";
  if (!isValidPhone(form.phone)) errors.phone = "Phone must be 10 digits";
  if (!form.carId) errors.carId = "Please select a car";

  if (!form.startDate) errors.startDate = "Pickup date is required";
  else if (form.startDate < today) errors.startDate = "Pickup date cannot be in the past";

  if (!form.endDate) errors.endDate = "Return date is required";
  else if (form.startDate && form.endDate <= form.startDate)
    errors.endDate = "Return date must be after pickup date";

  return errors;
};
