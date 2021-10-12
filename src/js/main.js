const getData = () => fetch('https://jsonplaceholder.typicode.com/posts')
    .then(res => res.json())
    .then(console.log)

getData();

const data = [1, 2, 3, 4, 5, 6, 7];

const [one, two, three] = data;

const data2 = [...data, ...[9, 8, 10]];