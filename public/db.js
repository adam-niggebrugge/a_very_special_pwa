const indexedDB =
  window.indexedDB || window.mozIndexedDB || window.webkitIndexedDB || window.msIndexedDB || window.shimIndexedDB;

let db;
const request = indexedDB.open("budget", 1);

function async checkDatabase() {
try{
  const transaction = db.transaction(["pending"], "readwrite");
  const store = transaction.objectStore("pending");
  const getAll = store.getAll();

  getAll.onsuccess = function(response) {
    if (getAll.result.length > 0) {
      const bulkResult = await fetch("/api/transaction/bulk", {
        method: "POST",
        body: JSON.stringify(getAll.result),
        headers: {
          Accept: "application/json, text/plain, */*",
          "Content-Type": "application/json"
        }
      })
            
    const jsonWrapped = await bulkResult.json();
      
      if(jsonWrapped) {
        // delete records if successful
        const transaction = db.transaction(["pending"], "readwrite");
        const store = transaction.objectStore("pending");
        store.clear();
      };
      return jsonWrapped;
    }
  };
} catch (err){
    console.log(`$$$$ err ${err}`);
}

}

// listen for app coming back online
window.addEventListener("online", checkDatabase);