self.addEventListener('fetch', function(event) {
  event.respondWith(
    fetch(event.request).then(function(response) {
      if (event.request.url == "https://multiplayer-wordle-server-z8hi.onrender.com"){
        return response
      }
      return caches.open('wordle').then(function(cache) {
        cache.put(event.request, response.clone());
        return response;
      });
    }).catch(()=>{
      return caches.open('wordle').then(function(cache) {
        return cache.match(event.request);
      });
    })
  );
});


