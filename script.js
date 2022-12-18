sessionStorage.cookies = [0, 0];
let files = new Array();
let obj = new Object();

for (let i = 0; i < 20; i++) {
  files.push(`img_${i}.jpg`);
  obj[`img_${i}.jpg`] = 1200;
}
console.log(obj);
sessionStorage.ratings = JSON.stringify(obj);
let ratings = JSON.parse(sessionStorage.ratings);

function choosePic() {
  let arr = new Array();
    for (let i = 0; i < 2; i++) {
      const randomIndex = Math.floor(Math.random() * files.length);
      arr.push(randomIndex);
      const img = files[randomIndex];
      console.log(img);
      document.getElementById(`pic_${i+1}`).src = `imgs/${img}`;
    }
    // console.log("Array");
    // console.log(arr);
    sessionStorage.cookies = arr;
}

function changePic(winner) {
  ratings = JSON.parse(sessionStorage.ratings);
  const cookies =  sessionStorage.cookies
  console.log("Cookies")
  console.log(cookies)

  let winner_index = new Number();
  let loser_index = new Number();
  
  if (winner == 1) {
    winner_index = cookies[0];
    loser_index = cookies[1];
  }
  else if (winner == 2) {
    winner_index = cookies[1];
    loser_index = cookies[0];
  }

  const temp_new_ratings = elo([ratings[`img_${winner_index}.jpg`], ratings[`img_${loser_index}.jpg`]])

  ratings[`img_${winner_index}.jpg`] = temp_new_ratings[0];
  ratings[`img_${loser_index}.jpg`] = temp_new_ratings[1];

  delete ratings["img_,.jpg"];
  console.log(ratings);
  sessionStorage.ratings = JSON.stringify(ratings);
  choosePic();
}

function elo([...ratings], kFactor = 32, selfRating) {
  const [a, b] = ratings;
  const expectedScore = (self, opponent) => 1 / (1 + 10 ** ((opponent - self) / 400));
  const newRating = (rating, i) =>
    (selfRating || rating) + kFactor * (i - expectedScore(i ? a : b, i ? b : a));
  
  if (ratings.length === 2) {
    return [newRating(a, 1), newRating(b, 0)];
  } else {
    return false;
  }
};

const start = document.getElementById('start');
const stop = document.getElementById('stop');
const container = document.getElementById('container');
let tbody = document.getElementById('tbody');

start.addEventListener("click", () => {
  start.style.display = "none";
  container.style.visibility = "visible";
  stop.style.display = "inline-block";
  let _ = choosePic();
});

stop.addEventListener("click", () => {
  container.style.display = "none";
  stop.style.display = "none";
  tbody.style.display = "block";

  ratings = JSON.parse(sessionStorage.ratings);
  // console.log(ratings);
  for (let i = 0; i < Object.keys(ratings).length; i++) {
      let tr = "<tr>";
      tr += "<td>" + Object.keys(ratings)[i] + "</td>" + "<td>" + Object.values(ratings)[i] + "</td></tr>";
      tbody.innerHTML += tr;
  }
});