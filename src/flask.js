const url = 'https://api.themoviedb.org/3/discover/movie?include_adult=false&include_video=false&language=en-US&page=1&sort_by=popularity.desc';
const options = {
  method: 'GET',
  headers: {
    accept: 'application/json',
    Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJhOTA3YjUzMmQ2MjA1OWY0NGMwMjA5MjBjYzdlMWZiZSIsIm5iZiI6MTc1NjA3NzI2Ni44Miwic3ViIjoiNjhhYjljZDJmMjYzNzgwYzY4NTQ4MjUyIiwic2NvcGVzIjpbImFwaV9yZWFkIl0sInZlcnNpb24iOjF9._E9gkrA0OuDnyuC4lE6yX5W__YsJoNnKtBle0KmVDgo'
  }
};

fetch(url, options)
  .then(res => res.json())
  .then(json => console.log(json))
  .catch(err => console.error(err));