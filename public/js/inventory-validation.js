// Client-side validation for add inventory form
const addInventoryForm = document.querySelector("#addInventoryForm");

if (addInventoryForm) {
  addInventoryForm.addEventListener("submit", function (event) {
    const invMake = document.getElementById("inv_make");
    const invModel = document.getElementById("inv_model");
    const invYear = document.getElementById("inv_year");
    const invDescription = document.getElementById("inv_description");
    const invImage = document.getElementById("inv_image");
    const invThumbnail = document.getElementById("inv_thumbnail");
    const invPrice = document.getElementById("inv_price");
    const invMiles = document.getElementById("inv_miles");
    const invColor = document.getElementById("inv_color");
    const classificationId = document.querySelector(
      'select[name="classification_id"]',
    );

    let isValid = true;
    let errorMessage = "";

    if (!classificationId.value) {
      isValid = false;
      errorMessage += "Please select a classification.\n";
    }
    if (invMake.value.trim().length < 3) {
      isValid = false;
      errorMessage += "Make must be at least 3 characters.\n";
    }

    if (invModel.value.trim().length < 3) {
      isValid = false;
      errorMessage += "Model must be at least 3 characters.\n";
    }

    const year = parseInt(invYear.value);
    if (isNaN(year) || year < 1900 || year > 2100) {
      isValid = false;
      errorMessage +=
        "Year must be a valid 4-digit year between 1900 and 2100.\n";
    }

    if (invDescription.value.trim().length < 1) {
      isValid = false;
      errorMessage += "Description is required.\n";
    }

    const imagePattern = /^\/images\/.*\.(png|jpg|jpeg|gif|webp)$/i;
    if (!imagePattern.test(invImage.value.trim())) {
      isValid = false;
      errorMessage +=
        "Image path must start with /images/ and end with a valid image extension.\n";
    }
    if (!imagePattern.test(invThumbnail.value.trim())) {
      isValid = false;
      errorMessage +=
        "Thumbnail path must start with /images/ and end with a valid image extension.\n";
    }

    const price = parseFloat(invPrice.value);
    if (isNaN(price) || price < 0) {
      isValid = false;
      errorMessage += "Price must be a positive number.\n";
    }

    const miles = parseInt(invMiles.value);
    if (isNaN(miles) || miles < 0) {
      isValid = false;
      errorMessage += "Miles must be a positive whole number.\n";
    }

    if (invColor.value.trim().length < 2) {
      isValid = false;
      errorMessage += "Color must be at least 2 characters.\n";
    }

    if (!isValid) {
      alert("Please fix the following errors:\n\n" + errorMessage);
      event.preventDefault();
      return false;
    }

    return true;
  });
}
