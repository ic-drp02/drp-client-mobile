export default function mapErrorToReadableMessage(error) {
  switch (error.type) {
    case "InvalidEmail":
      errorMessage = "You must enter a valid email address.";
      break;

    case "Registered":
      errorMessage = "This email has already been registered.";
      break;

    case "UnauthorisedDomain":
      errorMessage =
        "You must register with an nhs.net or imperial.ac.uk email.";
      break;

    case "ShortPassword":
      errorMessage = "Password must contain at least 8 characters.";
      break;

    case "InvalidCredentials":
      errorMessage = "The email address or password is incorrect.";
      break;

    case "Unconfirmed":
      errorMessage =
        "Account has not been confirmed. Check your email for a confirmation link.";
      break;

    case "Unknown":
      errorMessage = error.message;
      break;
  }
}
