"use strict";

// const body = document.querySelector("body");
// const test = document.createElement("section").classList.add("test");
// const question = document.createElement("div").classList.add(".question");


// const answer_a = document.createElement("div").classList.add(".answer_a");
// const answer_b = document.createElement("div").classList.add(".answer_b");
// const answer_c = document.createElement("div").classList.add(".answer_c");



// window.addEventListener("click", () => {
//   body.appendChild(test);
//   test.appendChild(answers);
//   answers.appendChild(answer_a);
//   answers.appendChild(answer_b);
//   answers.appendChild(answer_c);
// });

const quizStart = document.querySelector(".answer_start");
// const answers = document.querySelector(".answers");
// const animateOptions ={
//   duration:1400,
//   easing:"ease",
//   fill:"forwards",
// }

quizStart.addEventListener("click",()=>{
answers.animate({translate:["100vw",0]},animateOptions);
});
