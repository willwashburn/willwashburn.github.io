var fs = require('fs');
var slugify = require('slugify')
var file = __dirname + '/_data/jokes.json';

fs.readFile(file, 'utf8', function (err, data) {
  if (err) {
    console.log('Error: ' + err);
    return;
  }

  data = JSON.parse(data)
    // shuffle the data so it's not always the same on each build
    .map((a) => ({sort: Math.random(), value: a}))
    .sort((a, b) => a.sort - b.sort)
    .map((a) => a.value)

  data.forEach(function (joke, index) {

    let sluggedJokeQuestion = slugify(joke.q, {
      remove: /[*+~.()'"!:@]/g,
      lower:  true,
      strict: true
    })

    let currentJokeDirectory = pathToJoke(sluggedJokeQuestion);

    if (!fs.existsSync(currentJokeDirectory)) {
      fs.mkdirSync(currentJokeDirectory);
    }

    let isLastJoke = data.length === index + 1;
    let nextJoke = isLastJoke ? data[0] : data[index + 1];

    let nextJokeSlug = slugify(nextJoke.q, {
      remove: /[*+~.()'"!:@]/g,
      lower:  true,
      strict: true
    });

    let filenameOfCurrentJoke = currentJokeDirectory + 'index.html'

    let template = jokeTemplate(joke.q, joke.a, nextJokeSlug);

    fs.writeFile(filenameOfCurrentJoke, template, function (err) {
      if (err) throw err;
      console.log(joke.q);
    });
  })

});

function pathToJoke(jokeSlug) {
  return __dirname + '/jokes/' + jokeSlug + '/'
}

function jokeTemplate(question, answer, nextJokeSlug) {
  return `---
title: ${question}
layout: default
type: joke
---
<body class="bg-gray-200">
<div class="bg-gray-100">
<div class="px-8 py-12 max-w-md mx-auto">
    <p class="mt-12 text-gray-900">${question}</p>
    <h1 class="mt-6 leading-2 text-4xl font-semibold leading-none text-white bg-blue-800 rounded px-8 py-4 break-words">
      ${answer}
    </h1>
     <div class="mt-8 joke-nav">
        <a href="/jokes/${nextJokeSlug}/" class="no-underline">
          <button
            class="w-full bg-white tracking-wide text-gray-800 font-bold rounded border-b-2 border-blue-500 hover:border-blue-600 hover:bg-blue-500 hover:text-white shadow-md py-2 px-6 inline-flex items-center">
            <span class="mx-auto">More jokes please!</span>
          </button>
        </a>
      </div>
</div>
</div>
{% include footer.html %}
</body>
    `;
}
