

/*

  Theoretical Question : 

  AJAX is Asynchronous Javascript And XML, it Is using for communicating
  between server side and client side, With Ajax can exchange data, sen it server.
  Best Part Of AJAX is, with it page can update without refres it.

*/


function sendRequest(url) {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open("GET", url, true);
    xhr.onload = function () {
      if (xhr.status === 200 && xhr.readyState === 4) {
        resolve(JSON.parse(xhr.responseText));
      } else {
        reject(new Error(`Request failed with status ${xhr.status}`));
      }
    };
    xhr.onerror = function () {
      reject(new Error("Request failed"));
    };
    xhr.send();
  });
}


function createHTMLElement(tag, text) {
  const element = document.createElement(tag);
  if (text) {
    element.textContent = text;
  }
  return element;
}


sendRequest("https://ajax.test-danit.com/api/swapi/films")
  .then((movies) => {
    const containerDiv = document.querySelector(".container");


    movies.forEach((movie) => {
      const movieTitle = movie.name;
      const episodeId = movie.episodeId;
      const openingCrawl = movie.openingCrawl;

      const movieDiv = document.createElement("div");

      const titleHeading = createHTMLElement("h2", movieTitle);
      const episodeIdParagraph = createHTMLElement("p", `Episode Number: ${episodeId}`);
      const openingCrawlParagraph = createHTMLElement("p", openingCrawl);

      movieDiv.appendChild(titleHeading);
      movieDiv.appendChild(episodeIdParagraph);
      movieDiv.appendChild(openingCrawlParagraph);

      containerDiv.appendChild(movieDiv);

  
        const characterLinks = movie.characters;
        const characterPromises = characterLinks.map((characterLink) => sendRequest(characterLink));

        Promise.all(characterPromises)
          .then((characters) => {
            const characterNames = characters.map((character) => character.name);

            const charactersParagraph = createHTMLElement("p", `Characters: ${characterNames.join(", ")}`);
            movieDiv.appendChild(charactersParagraph);
          })
          .catch((error) => {
            console.error(error);
          });
      });
    })
    .catch((error) => {
      console.error(error);
    });
