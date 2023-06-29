window.onload = function () {
  var articleBody = document.querySelector(".post-header+.wysiwyg");

  if (!articleBody) {
    return;
  }

  articleBody = articleBody.innerHTML.replace(/(<([^>]+)>)/gi, "");

  const wpm = 375;
  const words = articleBody.trim().split(/\s+/).length;
  const millisecondsConversion = 60000;
  const time = Math.ceil(words / wpm) * millisecondsConversion;

  console.log(time / millisecondsConversion, "minute read time");

  const myTimeout = setTimeout(() => {
    Smile.createActivity({ token: "activity_52sJNGFxob6IvI7z070Tib0K" })
      .then(function (activity) {
        // Success
        console.log("Created activity " + activity.id);
      })
      .catch(function (err) {
        // Failure
        console.log("Something went wrong");
      });
  }, time);
};
