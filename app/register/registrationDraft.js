// IndexedDB retains the draft, including uploads, across navigation to OTP.
// The registration API can consume and delete this draft when it is available.
export function saveRegistrationDraft(details) {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open("meditwin-registration", 1);
    request.onupgradeneeded = () => {
      request.result.createObjectStore("drafts");
    };
    request.onerror = () => reject(new Error("Unable to save your details. Please allow browser storage and try again."));
    request.onsuccess = () => {
      const database = request.result;
      const transaction = database.transaction("drafts", "readwrite");
      transaction.objectStore("drafts").put(details, "pending");
      transaction.oncomplete = () => { database.close(); resolve(); };
      transaction.onabort = () => { database.close(); reject(new Error("Unable to save your details. Please try again.")); };
    };
  });
}
