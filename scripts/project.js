fetch("/scripts/projects.json")
  .then((response) => response.json())
  .then((data) => createCards(data))
  .catch((error) => console.error("Error fetching JSON:", error));

function createCards(data) {
  const container = document.querySelector(".card-container");

  let sorted = [];

  for (let i = 0; i < data.length; i++) {
    const item = data[i];

    const card = document.createElement("a");
    card.classList.add("card");
    card.href = item.link;
    card.target = "blank";

    const cardImg = document.createElement("div");
    cardImg.classList.add("card-img");

    const img = document.createElement("img");
    img.src = "/imgs/" + item.img;
    img.alt = "Photo of " + item.title;

    const cardInfo = document.createElement("div");
    cardInfo.classList.add("card-info");

    const cardDate = document.createElement("div");
    const strDate =
      item.date.month + "/" + item.date.day + "/" + item.date.year;
    cardDate.classList.add("card-date");
    cardDate.innerText = strDate;

    const cardTitle = document.createElement("div");
    cardTitle.classList.add("card-title");
    cardTitle.innerText = item.title;

    const cardOpen = document.createElement("button");
    cardOpen.classList.add("card-open");
    cardOpen.innerText = "Open";

    sorted.push({ element: card, date: new Date(strDate) });

    card.appendChild(cardImg);
    cardImg.appendChild(img);
    card.appendChild(cardInfo);
    cardInfo.appendChild(cardDate);
    cardInfo.appendChild(cardTitle);
    cardInfo.appendChild(cardOpen);
  }

  sorted.sort((a, b) => {
    return b.date - a.date;
  });

  sorted.forEach((item) => {
    container.appendChild(item.element);
  });
}
