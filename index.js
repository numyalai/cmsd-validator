document.addEventListener("DOMContentLoaded", function () {
const videoElement = document.getElementById("videoElement");
const dashPlayer = dashjs.MediaPlayer().create();
let errors_count = 0;
let valid_count = 0;
let validatedHeader = {}

dashPlayer.initialize(
  videoElement,
  "http://localhost:8080/cmsdValidator/media/vod/bbb_30fps_akamai/bbb_30fps.mpd",
  true
);
setInterval(() => {
  const parentElement = document.getElementById('result');

  // Function to remove the first X child elements
  function removeFirstChildElements(count) {
    for (let i = 0; i < count; i++) {
      if (parentElement.firstChild) {
        parentElement.removeChild(parentElement.firstChild);
      }
    }
  }

  if(parentElement.childElementCount >= 340){
    //removeFirstChildElements(200);
    parentElement.innerHTML="";

  }

  // Usage example: Remove the first 3 child elements
  removeFirstChildElements(3); 

    var metrics = dashPlayer.getDashMetrics();
    console.log(metrics.getHttpRequests("video"));

    const headers = metrics.getHttpRequests("video");
    let _responseHeadersArray = headers
      .filter((x) => x._responseHeaders != null && !validatedHeader[x._responseHeaders])
      .map((x) => x._responseHeaders);
    _responseHeadersArray.forEach(x => validatedHeader[x] = true) 
  for (var i = 0; i < _responseHeadersArray.length; i++) {
    results = CMSDValidator(_responseHeadersArray[i]);
    // Update the result div with the result
    for (var j = 0; j < results.length; j++) {
      if (results[j].valid == false) {
        errors_count++;
        let content = `<div class="p-3 text-white bg-danger mb-2"> Header ${results[j].key} with value ${results[j].value} is not valid</div>`;
        document.getElementById("result").innerHTML += content;
        document
          .getElementById("result")
          .scrollTo(0, document.body.scrollHeight);
      } else {
        valid_count++;
        let content = `<div class="p-3 text-white bg-success mb-2"> Header ${results[j].key} with value ${results[j].value} is valid</div>`;
        document.getElementById("result").innerHTML += content;
        // scroll to bottom
        document.getElementById("result").scrollIntoView(false);
      }
    }
    var resultDiv = document.getElementById("result");
    resultDiv.scrollTop = resultDiv.scrollHeight;
    document.getElementById("errors_count").innerHTML = errors_count;
    document.getElementById("valid_count").innerHTML = valid_count;
  }
}, 4000);
// after document is loaded
  // TODO: Allow user to enter a url for the video
  // document.getElementById("submit").addEventListener("click", function (event) {
  //   // prevent form from submitting
  //   event.preventDefault();
  //   let url = document.getElementById("video_url").value;
  //   dashPlayer.attachSource(url);
  //   document.getElementById("result").innerHTML = "";
  //   errors_count = 0;
  //   valid_count = 0;
  //   document.getElementById("errors_count").innerHTML = errors_count;
  //   document.getElementById("valid_count").innerHTML = valid_count;
  // });
});
