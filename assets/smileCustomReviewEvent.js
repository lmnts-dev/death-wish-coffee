var foundEventInstance = false;

document.addEventListener("click", function (e) {
  handleSmileCustomReviewEventChange(e);
});

document.addEventListener("keypress", function (e) {
  handleSmileCustomReviewEventChange(e);
});

function handleSmileCustomReviewEventChange(e) {
  const target = e.target.closest(
    'form[action="https://api.bazaarvoice.com/data/submitreview.json?"]'
  );

  if (target && foundEventInstance == false) {
    var button = target.querySelector(".bv-submit");
    foundEventInstance = true;
    button.addEventListener("click", () => {
      const myTimeout = setTimeout(() => {
        if (document.querySelector(".bv-submission-thankyou")) {
          smileCustomReviewSendEvent();
        } else {
          foundEventInstance = false;
        }
      }, 10000);
    });
    button.addEventListener("keypress", () => {
      const myTimeout = setTimeout(() => {
        if (document.querySelector(".bv-submission-thankyou")) {
          smileCustomReviewSendEvent();
        } else {
          foundEventInstance = false;
        }
      }, 10000);
    });
  }
}

function smileCustomReviewSendEvent() {
  Smile.createActivity({ token: "activity_M7UIqr84L48k4Yqh0Wyb5SzN" })
    .then(function (activity) {
      // Success
      console.log("Created activity " + activity.id);
    })
    .catch(function (err) {
      // Failure
      console.log("Something went wrong");
    });
}
